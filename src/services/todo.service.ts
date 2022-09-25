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
import Bull from "bull";
import fs from "fs";

export async function getAllTodos(
  page: number,
  search: any,
  perPage: number,
  userId: string
) {
  page = parseIntQuery(page, 1);
  perPage = parseIntQuery(perPage, PAGING_CONFIG.LIMIT);

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

  const totalPage = Math.ceil(todoCount / perPage);

  const todos = await Todo.findAll({
    where: filterObj,
    include: [User],
    limit: perPage,
    offset: (page - 1) * perPage,
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

export async function importTodoFromExcel(
  userId: string,
  file: any,
  workSheetNum: number = 1
) {
  // khac biet stream | hien tai
  // Excel.stream.xlsx
  console.log(userId);
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

  fs.unlinkSync(
    path.join(ROOT_DIR, UPLOAD_FOLDER_CONFIG.DIRNAME, file.filename)
  );
}

export async function exportToExcel(
  userId: string,
  requestPage: number,
  limit: number
) {
  let todos = await Todo.findAll({
    where: {
      userId,
    },
    order: [["id", "ASC"]],
    include: [User],
  });

  const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ".xlsx";

  const workBook = new Excel.Workbook();

  const workSheet = workBook.addWorksheet("My sheet");

  let headingRow = workSheet.addRow([
    "STT",
    "ID",
    "TITLE",
    "BODY",
    "STATUS",
    "USER ID",
    "USERNAME",
    "DATE CREATED",
  ]);

  headingRow.font = {
    bold: true,
  };

  let index = 1;
  let page = requestPage;

  let hasMoreData = true;

  do {
    const todos = await getAllTodos(page, null, limit, userId);
    todos.data.forEach((todo) => {
      index += 1;
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

    hasMoreData = page < todos.totalPage;
    page++;
  } while (hasMoreData);

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

export async function importTodoFromExcelStream(
  userId: string,
  file: any,
  workSheetNum: number = 1
) {
  const options: any = {
    sharedStrings: "cache",
    hyperlinks: "cache",
    worksheets: "emit",
    styles: "cache",
  };

  const workBookReader = new Excel.stream.xlsx.WorkbookReader(
    path.join(ROOT_DIR, UPLOAD_FOLDER_CONFIG.DIRNAME, file.filename),
    options
  );

  for await (const workSheetReader of workBookReader) {
    for await (const row of workSheetReader) {
      if (row.number <= 1) {
      } else {
        let content: any = {
          title: row.getCell(2).value,
          body: row.getCell(3).value,
          userId,
        };

        if (row.getCell(4).value) content.status = row.getCell(4).value;

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
    }
  }

  fs.unlinkSync(
    path.join(ROOT_DIR, UPLOAD_FOLDER_CONFIG.DIRNAME, file.filename)
  );
}

export async function exportToExcelStream(
  userId: string,
  requestPage: number,
  limit: number
) {
  // request paging - 1000
  // forEachPage(limit=5000)
  //  items =requestDbByPage(1)
  //  eachItem:
  //    - addToFile
  const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ".xlsx";

  const options = {
    filename: path.join(
      ROOT_DIR,
      UPLOAD_FOLDER_CONFIG.DIRNAME,
      UPLOAD_FOLDER_CONFIG.EXPORTDIR,
      filename
    ),
    useStyles: true,
  };

  const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
  const workSheet = workbook.addWorksheet("My sheet");
  let headingRow = workSheet.addRow([
    "STT",
    "ID",
    "TITLE",
    "BODY",
    "STATUS",
    "USER ID",
    "USERNAME",
    "DATE CREATED",
  ]);

  headingRow.font = {
    bold: true,
  };

  let hasMoreData = true;

  let page = requestPage;

  let index = 1;

  do {
    const todos = await getAllTodos(page, null, limit, userId);
    todos.data.forEach((todo) => {
      index += 1;

      workSheet
        .addRow([
          index,
          todo.getDataValue("id"),
          todo.getDataValue("title"),
          todo.getDataValue("body"),
          todo.getDataValue("status"),
          todo.getDataValue("userId"),
          todo.getDataValue("user").username,
          todo.getDataValue("createdAt").toString(),
        ])
        .commit();
    });

    hasMoreData = page < todos.totalPage;
    page++;
  } while (hasMoreData);

  await workbook.commit();

  return `${ResourceConfig.baseUrl}/${UPLOAD_FOLDER_CONFIG.DIRNAME}/${UPLOAD_FOLDER_CONFIG.EXPORTDIR}/${filename}`;
}


export const excelQueue = new Bull("import-export-excel");
let concurrency = 5;


excelQueue.process("import",concurrency,path.join(ROOT_DIR,"src","utils","importProcess.ts"));

excelQueue.process("export",concurrency,path.join(ROOT_DIR,"src","utils","exportProcess.ts"));


export async function importFromExcelFileStreamQueue(userId:string, file:any, sheetNum:number){
  await excelQueue.add("import",{
    userId,
    file,
    sheetNum
  });
}


export async function exportToExcelFileStreamQueue(userId:string, requestPage:number, limit:number){
  await excelQueue.add("export",{
    userId,
    requestPage,
    limit
  });
}
