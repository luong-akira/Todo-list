import { Request, Response } from "express";
import * as todoServices from "../services/todo.service";
import { ROOT_DIR, UPLOAD_FOLDER_CONFIG } from "../configs/constants.config";
import Excel from "exceljs";
import path from "path";
import fs from "fs";
import request from "request";
import Todo from "../models/todo.model";

// Desc      get all todos from a user
// Route     GET /todos
// Access    PRIVATE
export const getAllTodos = async (req: Request, res: Response) => {
  try {
    let page: any = req.query.page;
    let search: any = req.query.search;
    let todosPerPage: any = req.query.todosPerPage;
    let userId = req.user.id;

    let returnVal = await todoServices.getAllTodos(
      page,
      search,
      todosPerPage,
      userId
    );

    res.status(200).json(returnVal);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc      get single todo from a user
// Route     GET /todos
// Access    PRIVATE
export const getTodoById = async (req: Request, res: Response) => {
  try {
    let userId = req.user.id;
    let id = req.params.id;

    let todo = await todoServices.getTodoById(userId, id);

    res.status(200).json({ data: todo });
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc      Create a todo
// Route     POST /todos
// Access    PRIVATE
export const createTodo = async (req: Request, res: Response) => {
  try {
    let { title, body, status } = req.body;
    let userId = req.user.id;
    let content = { title, body, status, userId };

    let todo = await todoServices.createTodo(content);

    res.status(200).json(todo);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc      Delete a todo
// Route     DELETE /todos/:id
// Access    PRIVATE
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    let userId = req.user.id;
    let id = req.params.id;

    let todoId = await todoServices.deleteTodo(userId, id);

    res.status(200).json(todoId);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc      Update a todo
// Route     PUT /todos/:id
// Access    PRIVATE
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, body, status } = req.body;
    const userId = req.user.id;
    let id: any = req.params.id;

    id = parseInt(id);

    if (isNaN(id)) throw new Error("id is not a number");

    let content = { title, body, status, userId };

    let todo = await todoServices.updateTodo(content, id);

    res.status(200).json(todo);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc      Upload from a excel file
// Route     POST /todos/importFromExcel
// Access    PRIVATE
export const importFromExcelFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) throw new Error("File not found");
    let userId = req.user.id;
    let file = req.file;
    let sheetNum = req.body.sheetNum;

    if (isNaN(sheetNum)) throw new Error("Sheetnum is not a number");

    sheetNum = parseInt(sheetNum);

    await todoServices.uploadTodoFromExcel(userId, file, sheetNum);

    fs.unlinkSync(
      path.join(ROOT_DIR, UPLOAD_FOLDER_CONFIG.DIRNAME, file.filename)
    );

    res.status(201).json({ message: "Upload successfully" });
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc      Export to excel file
// Route     GET /todos/exportToExcel
// Access    PRIVATE
export const exportToExcel = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    let excelLink = await todoServices.exportToExcel(userId);

    res.status(201).json(excelLink);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};
