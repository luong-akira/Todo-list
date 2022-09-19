import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  let authorizationHeader = req.headers.authorization;

  let token;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
    token = authorizationHeader.split(" ")[1];
    console.log(token);

    try {
      const decoded: any = jwt.verify(token, process.env.secretKey as string);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(404).json({ message: "Token is not valid" });
    }
  } else {
    res.status(500).json({ message: "Token is not found" });
  }
};
