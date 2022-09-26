import Bull, { Job } from "bull";
import path from "path";
import colors from "colors/safe";
import { ROOT_DIR } from "../configs/constants.config";
import {
  exportToExcelStream,
  importTodoFromExcelStream,
} from "../services/todo.service";
import ImportExport from "../models/importExport.model";
import exportProcessor from "./exportProcessor";
import importProcessor from "./importProcessor";
export const excelQueue = new Bull(
  "import-export-excel",
  "redis://127.0.0.1:6379"
);

excelQueue.process("export", exportProcessor);
excelQueue.process("import", importProcessor);

// QUEUE
// excelQueue.process("import", async function (job: Job) {
//   const { userId, file, sheetNum } = job.data;
//   console.log(colors.yellow(`Process id is ${process.pid}`));

//   await ImportExport.create({
//     jobId: job.id,
//     userId: userId,
//     type: "import",
//     status: "active",
//     file: file.filename,
//   });

//   return await importTodoFromExcelStream(userId, file, sheetNum);
// });

// excelQueue.process("export", async function (job: Job) {
//   const { userId, requestPage, limit } = job.data;
//   console.log(colors.yellow(`Process id is ${process.pid}`));

//   await ImportExport.create({
//     jobId: job.id,
//     userId: userId,
//     type: "export",
//     status: "active",
//     file: "",
//   });

//   return await exportToExcelStream(userId, requestPage, limit);
// });
