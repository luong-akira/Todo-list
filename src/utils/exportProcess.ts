import { Job } from "bull";
import {  exportToExcelStream } from "../services/todo.service";

export default async function (job:Job){
    const  {userId,requestPage,limit} = job.data;
    console.log(`Process id is ${process.pid}`);
    return await exportToExcelStream(userId,requestPage,limit);
}