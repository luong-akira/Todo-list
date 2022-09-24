import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  importFromExcelFile,
  exportToExcel,
  importFromExcelFileStream,
  exportToExcelStream,
  importFromExcelFileStreamQueue,
  exportToExcelStreamQueue
} from "../controllers/todo.controller";
import upload from "../configs/multer.config";

router.get("/", isAuthenticated, getAllTodos);
router.get("/exportToExcel", isAuthenticated, exportToExcel);
router.get("/exportToExcelStream", isAuthenticated, exportToExcelStream);
router.get("/exportToExcelStreamQueue", isAuthenticated, exportToExcelStreamQueue);
router.get("/:id", isAuthenticated, getTodoById);
router.post("/", isAuthenticated, createTodo);
router.put("/:id", isAuthenticated, updateTodo);
router.delete("/:id", isAuthenticated, deleteTodo);
router.post(
  "/importFromExcel",
  isAuthenticated,
  upload.single("excel"),
  importFromExcelFile
);
router.post(
  "/importFromExcelStream",
  isAuthenticated,
  upload.single("excel"),
  importFromExcelFileStream
);

router.post(
  "/importFromExcelStreamQueue",
  isAuthenticated,
  upload.single("excel"),
  importFromExcelFileStreamQueue
);

// import todo from excel (by user) - exceljs
// stt|title|body|status

export default router;
