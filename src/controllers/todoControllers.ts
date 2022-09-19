import Todo from "../models/Todo";
import { Request, Response } from "express";
import { User } from "../interfaces/User";
import { Model } from "sequelize";

// Desc      get all todos from a user
// Route     GET /todos
// Access    PRIVATE
export const getAllTodos = async (req: Request, res: Response) => {
  console.log(req.user.id);
  try {
    const todos = await Todo.findAll({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json(todos);
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

    res.status(200).json(todo);
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

    res.status(200).json({ message: "Delete successfully" });
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
