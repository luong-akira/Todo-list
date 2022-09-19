import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Todo from "./Todo";

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

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Todo, { onDelete: "CASCADE", hooks: true });
Todo.belongsTo(User);

(async () => {
  await sequelize.sync();
  console.log("User model was synchronized successfully.");
})();

export default User;
