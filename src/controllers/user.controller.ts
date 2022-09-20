import { Response, Request } from "express";
import User from "../models/user.model";
import * as dotenv from "dotenv";
dotenv.config();

import { validateOrReject, Length } from "class-validator";
import { comparePassword, generateHashedPassword } from "../utils/bcrypt.util";
import Todo from "../models/todo.model";
import { authenticateUser, createUser } from "../services/user.service";

// admin
// get /user - list user
// => bao nhieu todo

export class UserRegisterDTO {
  constructor(name: string, username: string, password: string, role: string) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.role = role;
  }

  @Length(6, 20)
  username: string;

  @Length(6, 20)
  name: string;

  @Length(6, 20)
  password: string;

  @Length(3, 10)
  role: string;
}

export class UserLoginDTO {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  @Length(6, 20)
  username: string;

  @Length(6, 20)
  password: string;
}

// Desc       register
// Route      POST /users
// Access     PUBLIC
export const register = async (req: Request, res: Response) => {
  try {
    console.log(req.file);

    let user = await createUser(req.body, req.file);

    res.status(200).json(user);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc       login
// Route      POST /users/login
// Access     PUBLIC
export const login = async (req: Request, res: Response) => {
  try {
    let user = await authenticateUser(req.body);

    res.status(200).json(user);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// controller => res.json()
// code => goi service
// service => handle business => createUser =>

// Desc       get users
// Route      POST /users/admin/getUsers
// Access     PRIVATE
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      where: {
        role: "user",
      },
      include: [
        {
          model: Todo,
          limit: 2,
        },
      ],
    });

    res.status(200).json(users);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
