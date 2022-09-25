import { Request, Response } from "express";
import * as todoServices from "../services/todo.service";
import {
  DATA_IMPORT_EXPORT_LIMIT_DEFAULT,
  DATA_PAGE_DEFAULT,
  PAGING_CONFIG,
  ROOT_DIR,
  UPLOAD_FOLDER_CONFIG,
} from "../configs/constants.config";
import path from "path";
import fs from "fs";
import { parseIntQuery } from "../utils/parseIntQuery.util";

// Desc      get all todos from a user
// Route     GET /todos
// Access    PRIVATE
export const getAllTodos = async (req: Request, res: Response) => {
  try {
    let page: any = req.query.page;
    let search: any = req.query.search;
    let perPage: any = req.query.perPage;
    let userId = req.user.id;

    page = parseIntQuery(page, 1);
    perPage = parseIntQuery(perPage, PAGING_CONFIG.LIMIT);

    let returnVal = await todoServices.getAllTodos(
      page,
      search,
      perPage,
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

// Desc      Import data from a excel file
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

    console.log(userId)

    await todoServices.importTodoFromExcel(userId, file, sheetNum);

    res.status(201).json({ message: "Upload successfully" });
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc      Export data to excel file
// Route     GET /todos/exportToExcel
// Access    PRIVATE
export const exportToExcel = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    let { limit, page }: any = req.query;

    limit = parseIntQuery(limit, DATA_IMPORT_EXPORT_LIMIT_DEFAULT);
    page = parseIntQuery(page, DATA_PAGE_DEFAULT);

    let excelLink = await todoServices.exportToExcel(userId, page, limit);

    res.status(201).json(excelLink);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// import - file 5000 -

// export - nhieu du lieu

// tim hieu va xu ly import / export qua ExcelJs.stream

// Desc      Import data from a excel file
// Route     POST /todos/importFromExcel
// Access    PRIVATE
export const importFromExcelFileStream = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) throw new Error("File not found");
    let userId = req.user.id;
    let file = req.file;
    let sheetNum = req.body.sheetNum;

    if (isNaN(sheetNum)) throw new Error("Sheetnum is not a number");

    sheetNum = parseInt(sheetNum);

    await todoServices.importTodoFromExcelStream(userId, file, sheetNum);

    res.status(201).json({ message: "Upload successfully" });
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc      Export data to excel file
// Route     GET /todos/exportToExcel
// Access    PRIVATE
export const exportToExcelStream = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    let { limit, page }: any = req.query;

    limit = parseIntQuery(limit, DATA_IMPORT_EXPORT_LIMIT_DEFAULT);
    page = parseIntQuery(page, DATA_PAGE_DEFAULT);

    let excelLink = await todoServices.exportToExcelStream(userId, page, limit);

    res.status(201).json(excelLink);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// tim hieu task queue (Bull nodejs) -- (xu ly background job, xu ly task theo queue, xu ly dong bo nhieu task )

// refactor import/export xu ly qua task queue

// Desc      Import data from a excel file
// Route     POST /todos/importFromExcelStreamQueue
// Access    PRIVATE
export const importFromExcelFileStreamQueue = async (req:Request,res:Response)=>{
  try {
    if (!req.file) throw new Error("File not found");
    let userId = req.user.id;
    let file = req.file;
    let sheetNum = req.body.sheetNum;

    if (isNaN(sheetNum)) throw new Error("Sheetnum is not a number");

    sheetNum = parseInt(sheetNum);

    await todoServices.importFromExcelFileStreamQueue(userId,file,sheetNum);

    res.status(200).json("Upload successfully");
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
}

// Desc      Export data to excel file
// Route     GET /todos/exportToExcelStreamQueue
// Access    PRIVATE
export const exportToExcelStreamQueue = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    let { limit, page }: any = req.query;

    limit = parseIntQuery(limit, DATA_IMPORT_EXPORT_LIMIT_DEFAULT);
    page = parseIntQuery(page, DATA_PAGE_DEFAULT);

    await todoServices.exportToExcelFileStreamQueue(userId, page, limit);

    todoServices.excelQueue.on("completed",(job,result)=>{
      res.status(201).json({excelLink:result});
    })

  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};