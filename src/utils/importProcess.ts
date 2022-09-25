import { Job } from "bull";
import {  importTodoFromExcelStream } from "../services/todo.service";

export default async function (job:Job){
    const {userId,file,sheetNum} = job.data;
    console.log(`Process id is ${process.pid}`);
    return await importTodoFromExcelStream(userId,file,sheetNum);
}