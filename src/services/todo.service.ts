import { validateOrReject } from "class-validator";
import { Op } from "sequelize";
import { PAGING_CONFIG } from "../configs/constants.config";
import { TodoDto } from "../dtos/todo.dto";
import Todo from "../models/todo.model";
import { parseIntQuery } from "../utils/parseIntQuery.util";

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

export async function createTodo(
  title: string,
  body: string,
  status: string,
  userId: string
) {
  let todoDto = new TodoDto(title, body);

  await validateOrReject(todoDto);

  if (!status) {
    status = "none";
  }

  const todo = await Todo.create({
    title,
    body,
    status: status,
    userId,
  });

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

export async function updateTodo(
  title: string,
  body: string,
  status: string,
  userId: string,
  id: any
) {
  let todo: any = await Todo.findOne({
    where: {
      userId,
      id,
    },
  });

  if (!todo) {
    throw new Error("Todo is not found");
  }

  title = title || todo.title;
  body = body || todo.body;
  status = status || todo.status;

  let todoDto = new TodoDto(title, body);

  await validateOrReject(todoDto);

  await todo.save();
}
