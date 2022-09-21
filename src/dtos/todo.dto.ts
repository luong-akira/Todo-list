import { Length } from "class-validator";

export class TodoDto {
  constructor(title: string, body: string) {
    this.title = title;
    this.body = body;
  }

  @Length(3, 20)
  title: string;

  @Length(3, 20)
  body: string;
}
