import { Length } from "class-validator";

export class UserRegisterDTO {
  constructor(
    name: string,
    username: string,
    password: string,
    role: string,
    file: any
  ) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.role = role;
    this.file = file;
  }

  @Length(3, 20)
  username: string;

  @Length(3, 20)
  name: string;

  @Length(3, 20)
  password: string;

  @Length(3, 10)
  role: string;

  file: any;
}

export class UserDto {
  constructor(
    name: string,
    username: string,
    password: string,
    role: string,
    file: any
  ) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.role = role;
    this.file = file;
  }

  username: string;

  name: string;

  password: string;

  role: string;

  file: any;
}

export class UserLoginDTO {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  @Length(3, 20)
  username: string;

  @Length(3, 20)
  password: string;
}

export class UpdateUserDto {
  constructor(name: string, username: string) {
    this.name = name;
    this.username = username;
  }

  @Length(3, 20)
  name: string;

  @Length(3, 20)
  username: string;
}
