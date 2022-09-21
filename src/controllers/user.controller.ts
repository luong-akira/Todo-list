import * as userService from "../services/user.service";
import { Response, Request } from "express";
import * as dotenv from "dotenv";
import { GET_USER_CONFIG } from "../configs/constants.config";
import { parseIntQuery } from "../utils/parseIntQuery.util";
import {
  UpdateUserDto,
  UserDto,
  UserLoginDTO,
  UserRegisterDTO,
} from "../dtos/user.dto";
dotenv.config();

// Desc       register
// Route      POST /users
// Access     PUBLIC
export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, password, role } = req.body;
    const file = req.file;
    const userRegisterDto = new UserRegisterDTO(
      name,
      username,
      password,
      role,
      file
    );

    let user = await userService.createUser(userRegisterDto);

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
    const { username, password } = req.body;
    let userLoginDto = new UserLoginDTO(username, password);

    let user = await userService.authenticateUser(userLoginDto);

    res.status(200).json(user);
  } catch (errors: Error | any) {
    if (errors instanceof Error) {
      res.status(500).json({ error: errors.message });
    } else {
      res.status(500).json(errors);
    }
  }
};

// Desc       get users
// Route      POST /users/admin/getUsers
// Access     PRIVATE
export const getUsers = async (req: Request, res: Response) => {
  try {
    let { todoLimit, userLimit, userPage }: any = req.query;

    todoLimit = parseIntQuery(todoLimit, GET_USER_CONFIG.TODO_LIMIT);
    userPage = parseIntQuery(userPage, GET_USER_CONFIG.USER_PAGE);
    userLimit = parseIntQuery(userLimit, GET_USER_CONFIG.USER_LIMIT);

    let records = await userService.getUsers(userLimit, userPage, todoLimit);

    res.status(200).json(records);
  } catch (error: Error | any) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json(error);
    }
  }
};

// Desc       update avatar for user
// Route      POST /users/admin/user/:id
// Access     PRIVATE,
export const updateAvatarForUser = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { id } = req.params;

    await userService.updateAvatarForUser(file, id);

    res.status(200).json({ message: "Update user's avatar successfully" });
  } catch (error: Error | any) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json(error);
    }
  }
};

// Desc       update user
// Route      POST /users/edit
// Access     PRIVATE
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, username } = req.body;
    const { id } = req.user;
    const file = req.file;

    await userService.updateUser(name, username, id, file);

    res.status(200).json({ message: "Update successfully" });
  } catch (error: Error | any) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json(error);
    }
  }
};
