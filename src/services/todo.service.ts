import { validateOrReject } from "class-validator";
import { Op } from "sequelize";
import {
  PAGING_CONFIG,
  ROOT_DIR,
  TODO_COL_NAME,
  UPLOAD_FOLDER_CONFIG,
} from "../configs/constants.config";
import { TodoDto } from "../dtos/todo.dto";
import Todo from "../models/todo.model";
import Excel from "exceljs";
import { parseIntQuery } from "../utils/parseIntQuery.util";
import path from "path";
import User from "../models/user.model";
import { ResourceConfig } from "../configs/enviroment.config";

export async function getAllTodos(
  page: any,
  search: any,
  todosPerPage: any,
  userId: string
) {
  page = parseIntQuery(page, 1);
  todosPerPage = parseIntQuery(todosPerPage, PAGING_CONFIG.LIMIT);

  const filterObj: any = {
    userId,
  };

  if (search) {
    filterObj.title = {
      [Op.like]: "%" + search + "%",
    };
  }

  const todoCount: number = await Todo.count({
    where: filterObj,
  });

  const totalPage = Math.ceil(todoCount / todosPerPage);

  const todos = await Todo.findAll({
    where: filterObj,
    limit: todosPerPage,
    offset: (page - 1) * todosPerPage,
  });

  return { data: todos, page, totalPage };
}

export async function getTodoById(userId: string, id: any) {
  const todo = await Todo.findOne({
    where: {
      userId,
      id,
    },
  });

  if (!todo) {
    throw new Error("Todo is not found");
  }

  return todo;
}

export async function createTodo(content: any) {
  const todoExist = await Todo.findOne({
    where: {
      title: content.title,
      userId: content.userId,
    },
  });

  if (todoExist) throw new Error("Todo has existed");

  let todoDto = new TodoDto(content.title, content.body);

  await validateOrReject(todoDto);

  if (!content.status) {
    content.status = "none";
  }

  const todo = await Todo.create(content);

  return todo;
}

export async function deleteTodo(userId: string, id: any) {
  const todo: any = await Todo.findOne({
    where: {
      userId,
      id,
    },
  });

  if (!todo) {
    throw new Error("Todo is not found");
  }

  await todo.destroy();

  return todo.id;
}

export async function updateTodo(content: any, id: number) {
  let todo: any = await Todo.findOne({
    where: {
      userId: content.userId,
      id,
    },
  });

  if (!todo) {
    throw new Error("Todo is not found");
  }

  let title = content.title || todo.title;
  let body = content.body || todo.body;
  let status = content.status || todo.status;

  let todoDto = new TodoDto(title, body);

  await validateOrReject(todoDto);

  todo.title = title;
  todo.body = body;
  todo.status = status;

  await todo.save();
}

export async function uploadTodoFromExcel(
  userId: string,
  file: any,
  workSheetNum: number
) {
  const workBook = new Excel.Workbook();
  await workBook.xlsx.readFile(
    path.join(ROOT_DIR, UPLOAD_FOLDER_CONFIG.DIRNAME, file.filename)
  );

  let titleColumNum: number;
  let bodyColumNum: number;
  let statusColumNum: number;

  let rowHeader = 1;

  let workSheet = workBook.getWorksheet(workSheetNum);

  workSheet.getRow(rowHeader).eachCell((cell, columNumber) => {
    if (cell.value == TODO_COL_NAME.TODO_TITLE_COL_NAME) {
      titleColumNum = columNumber;
    } else if (cell.value == TODO_COL_NAME.TODO_BODY_COL_NAME) {
      bodyColumNum = columNumber;
    } else if (cell.value == TODO_COL_NAME.TODO_STATUS_COL_NAME) {
      statusColumNum = columNumber;
    }
  });

  workSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    (async () => {
      if (rowNumber <= rowHeader) {
        return;
      } else if (rowNumber > 1) {
        let content: any = {
          title: row.getCell(titleColumNum).value,
          body: row.getCell(bodyColumNum).value,
          userId,
        };

        if (statusColumNum) content.status = row.getCell(statusColumNum).value;

        const todoExist = await Todo.findOne({
          where: {
            title: content.title,
            userId,
          },
        });

        if (!todoExist) {
          await createTodo(content);
        } else {
          await updateTodo(content, parseInt(todoExist.getDataValue("id")));
        }
      }
    })();
  });
}

export async function exportToExcel(userId: string) {
  let todos = await Todo.findAll({
    where: {
      userId,
    },
    order: [["id", "ASC"]],
    include: [User],
  });

  console.log(todos);

  const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ".xlsx";

  const workBook = new Excel.Workbook();

  const workSheet = workBook.addWorksheet("My sheet");

  let row = workSheet.addRow([
    "STT",
    "ID",
    "TITLE",
    "BODY",
    "STATUS",
    "USER ID",
    "USERNAME",
    "DATE CREATED",
  ]);

  row.font = {
    bold: true,
  };

  todos.forEach((todo, index) => {
    workSheet.addRow([
      index + 1,
      todo.getDataValue("id"),
      todo.getDataValue("title"),
      todo.getDataValue("body"),
      todo.getDataValue("status"),
      todo.getDataValue("userId"),
      todo.getDataValue("user").username,
      todo.getDataValue("createdAt").toString(),
    ]);
  });

  await workBook.xlsx.writeFile(
    path.join(
      ROOT_DIR,
      UPLOAD_FOLDER_CONFIG.DIRNAME,
      UPLOAD_FOLDER_CONFIG.EXPORTDIR,
      filename
    )
  );

  return `${ResourceConfig.baseUrl}/${UPLOAD_FOLDER_CONFIG.DIRNAME}/${UPLOAD_FOLDER_CONFIG.EXPORTDIR}/${filename}`;
}
