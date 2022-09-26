import Bull from "bull";
import exportProcessor from "./exportProcessor";
import importProcessor from "./importProcessor";
export const excelQueue = new Bull("import-export-excel");

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
