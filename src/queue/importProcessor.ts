import { Job } from "bull";
import colors from "colors/safe";
import ImportExport from "../models/importExport.model";
import { importTodoFromExcelStream } from "../services/todo.service";

const sleepThread = async (sleepInMilis: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, sleepInMilis);
  });
};

export default async function (job: Job) {
  const { userId, file, sheetNum } = job.data;
  console.log(colors.yellow(`Process id is ${process.pid}`));

  await ImportExport.create({
    jobId: job.id,
    userId: job.data.userId,
    type: "import",
    status: "active",
    file: "",
  });

  await sleepThread(5000);

  return await importTodoFromExcelStream(userId, file, sheetNum);
}
