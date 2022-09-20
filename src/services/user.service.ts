import { validateOrReject } from "class-validator";
import { stringify } from "querystring";
import { UserLoginDTO, UserRegisterDTO } from "../controllers/user.controller";
import User from "../models/user.model";
import { comparePassword, generateHashedPassword } from "../utils/bcrypt.util";

export async function createUser(body: any, file: undefined | any) {
  const { name, username, password, role } = body;
  const userRegisterDto = new UserRegisterDTO(name, username, password, role);

  await validateOrReject(userRegisterDto);

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
    password: generateHashedPassword(password),
    role,
  };

  if (file != undefined) {
    userObj.avatar = `/${file.path.replace("\\", "/")}`;
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

export async function authenticateUser(body: any) {
  const { username, password } = body;

  console.log(username, password);

  const userLoginDto = new UserLoginDTO(username, password);

  await validateOrReject(userLoginDto);

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
