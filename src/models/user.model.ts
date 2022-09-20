import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../configs/db.config";
import Todo from "./todo.model";
import jwt from "jsonwebtoken";

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  avatar: {
    type: DataTypes.STRING,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM,
    values: ["admin", "user"],
    defaultValue: "user",
  },
});

User.hasMany(Todo, { foreignKey: "user_id", onDelete: "CASCADE", hooks: true });
Todo.belongsTo(User);

User.prototype.generateToken = function (): string {
  let token = jwt.sign(
    { id: this.id, role: this.role },
    process.env.secretKey as string
  );
  return token;
};

(async () => {
  await sequelize.sync();
  console.log("User model was synchronized successfully.");
})();

export default User;
