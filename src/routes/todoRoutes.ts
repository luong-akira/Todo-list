import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middlewares/isLoggedIn";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoControllers";

router.get("/", isLoggedIn, getAllTodos);
router.get("/:id", isLoggedIn, getTodoById);
router.post("/", isLoggedIn, createTodo);
router.put("/:id", isLoggedIn, updateTodo);
router.delete("/:id", isLoggedIn, deleteTodo);

export default router;
