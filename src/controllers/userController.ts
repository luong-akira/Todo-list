import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Response, Request } from "express";
import User from "../models/User";
import * as dotenv from "dotenv";
dotenv.config();

// Desc       register
// Route      POST /users
// Access     PUBLIC
export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, password } = req.body;

    if (!name || name == "") {
      res.status(400).json({ message: "Please fill in the name field" });
    }

    if (!username || username == "") {
      res.status(400).json({ message: "Please fill in the username field" });
    }

    if (!password || password == "") {
      res.status(400).json({ message: "Please fill in the password field" });
    }

    const existedUser = await User.findOne({
      where: {
        username,
      },
    });

    if (existedUser) {
      return res.status(400).json({ message: "User has been existed" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: any = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    console.log(user);

    const token = jwt.sign(
      { id: user.getDataValue("id") },
      process.env.secretKey as string
    );

    res
      .status(201)
      .json({ id: user.id, name: user.name, username: user.username, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Desc       login
// Route      POST /users/login
// Access     PUBLIC
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || username == "") {
      res.status(400).json({ message: "Please fill in the username field" });
    }

    if (!password || password == "") {
      res.status(400).json({ message: "Please fill in the password field" });
    }

    let user: any = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    if (!(await bcrypt.compare(password, user.getDataValue("password")))) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.getDataValue("id") },
      process.env.secretKey as string
    );

    res
      .status(200)
      .json({ id: user.id, name: user.name, username: user.username, token });
  } catch (error) {
    res.status(500).json(error);
  }
};
