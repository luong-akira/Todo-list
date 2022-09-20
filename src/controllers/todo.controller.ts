import Todo from "../models/todo.model";
import { Request, Response } from "express";
import { User } from "../interfaces/User";
import { Op } from "sequelize";
import { PAGING_CONFIG } from "../configs/constants.config";

// Desc      get all todos from a user
// Route     GET /todos
// Access    PRIVATE
export const getAllTodos = async (req: Request, res: Response) => {
  let page: any = req.query.page;
  let search: any = req.query.search;
  let todosPerPage: any = req.query.todosPerPage;

  if (!page) {
    page = 1;
  } else {
    if (parseInt(page)) {
      page = parseInt(page);
    } else {
      page = 1;
    }
  }

  if (!todosPerPage) {
    todosPerPage = PAGING_CONFIG.LIMIT;
  } else {
    if (parseInt(todosPerPage)) {
      page = parseInt(todosPerPage);
    } else {
      todosPerPage = PAGING_CONFIG.LIMIT;
    }
  }

  try {
    const filterObj: any = {
      userId: req.user.id,
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
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPage;

    const todos = await Todo.findAll({
      where: filterObj,
      limit: todosPerPage,
      offset: (page - 1) * todosPerPage,
    });

    res.status(200).json({
      data: todos,
      currentPage: page,
      totalPage,
      hasNextPage,
      hasPrevPage,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Desc      get single todo from a user
// Route     GET /todos
// Access    PRIVATE
export const getTodoById = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findOne({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo is not found" });
    }

    res.status(200).json({ data: todo });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Desc      Create a todo
// Route     POST /todos
// Access    PRIVATE
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, body } = req.body;

    const todo = await Todo.create({
      title,
      body,
      userId: req.user.id,
    });

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Desc      Delete a todo
// Route     DELETE /todos/:id
// Access    PRIVATE
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findOne({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo is not found" });
    }

    await todo.destroy();

    const todos = await Todo.findAll({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Desc      Update a todo
// Route     PUT /todos/:id
// Access    PRIVATE
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, body } = req.body;

    let todo: any = await Todo.findOne({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (title && title != "") {
      todo.title = title;
    }

    if (body && body != "") {
      todo.body = body;
    }

    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json(error);
  }
};
