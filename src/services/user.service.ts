import { validateOrReject } from "class-validator";
import { UpdateUserDto, UserLoginDTO, UserRegisterDTO } from "../dtos/user.dto";
import { Request } from "express";
import { comparePassword, generateHashedPassword } from "../utils/bcrypt.util";
import path from "path";
import fs from "fs";
import User from "../models/user.model";
import { Sequelize, Op } from "sequelize";
import Todo from "../models/todo.model";
import { sequelize } from "../configs/db.config";
import { ROOT_DIR, UPLOAD_FOLDER_CONFIG } from "../configs/constants.config";

export async function createUser(userRegisterDto: UserRegisterDTO) {
  await validateOrReject(userRegisterDto);

  const { name, username, password, role, file } = userRegisterDto;

  const existedUser = await User.findOne({
    where: {
      username: username,
    },
  });

  if (existedUser) {
    throw new Error("username has existed");
  }

  let userObj: any = {
    name,
    username,
    password,
    role,
  };

  if (file != undefined) {
    console.log(file);

    userObj.avatar = `/${UPLOAD_FOLDER_CONFIG.DIRNAME}/${file.filename}`;
  }

  const user: any = await User.create(userObj);

  const token = user.generateToken();

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    avatar: user.avatar || null,
    token,
  };
}

export async function authenticateUser(userLoginDto: UserLoginDTO) {
  await validateOrReject(userLoginDto);

  const { username, password } = userLoginDto;

  let user: any = await User.findOne({
    where: {
      username,
    },
  });

  if (!user) throw new Error("Invalid credentials");

  if (!comparePassword(password, user.password))
    throw new Error("Invalid credentials");

  const token = user.generateToken();

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    avatar: user.avatar,
    token,
  };
}

export async function updateUser(
  name: string,
  username: string,
  id: string,
  file: any
) {
  let user: any = await User.findOne({
    where: {
      id,
    },
  });
  if (!user) throw new Error("User does not exist");
  name = name || user.name;
  username = username || user.username;

  const updateUserDto = new UpdateUserDto(name, username);

  await validateOrReject(updateUserDto);

  user.set({
    name,
    username,
  });

  user.avatar = `/${UPLOAD_FOLDER_CONFIG.DIRNAME}/${file.filename}`;

  await user.save();
}

export async function updateAvatarForUser(file: any, id: string) {
  if (!file) throw new Error("Image does not exist");

  const user: any = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) throw new Error("User does not exist");

  user.avatar = `/${UPLOAD_FOLDER_CONFIG.DIRNAME}/${file.filename}`;

  await user.save();
}

export async function getUsers(
  userLimit: number,
  userPage: number,
  todoLimit: number
) {
  let users: any = await User.findAll({
    where: {
      role: "user",
    },

    attributes: ["id", "name", "avatar", "avatarFullUrl", "username"],

    include: [
      {
        model: Todo,
        limit: todoLimit,
      },
    ],
    limit: userLimit,
    offset: (userPage - 1) * userLimit,
  });

  let userArr = users.map((user: any) => user.getDataValue("id"));

  let todos: any = await Todo.findAll({
    where: {
      userId: {
        [Op.in]: userArr,
      },
    },

    attributes: [
      "user_id",
      [sequelize.fn("COUNT", sequelize.col("id")), "todoCount"],
    ],
    group: ["user_id"],
  });

  const todoArr: any[] = todos.map((todo: any) => todo.dataValues);

  const map = new Map(todoArr.map((todo) => [todo.user_id, todo.todoCount]));

  users.forEach((user: any) => {
    user.dataValues.todoCount = map.get(user.getDataValue("id")) || 0;
  });

  return users;
}
