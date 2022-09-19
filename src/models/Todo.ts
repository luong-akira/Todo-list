import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const Todo = sequelize.define("todo", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

(async () => {
  await sequelize.sync();
  console.log("Todo model was synchronized successfully.");
})();

export default Todo;
