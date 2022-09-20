import express from "express";
import { User } from "../../interfaces/User";

declare global {
  namespace Express {
    interface Request {
      user:User
    }
  }
}