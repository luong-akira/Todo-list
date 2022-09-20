import bcrypt, { hash } from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

export const generateHashedPassword = (password: string) => {
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
