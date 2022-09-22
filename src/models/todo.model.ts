import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../configs/db.config";

const Todo = sequelize.define("todo", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["done", "none"],
    defaultValue: "none",
  },
});

(async () => {
  await sequelize.sync();
  console.log("Todo model was synchronized successfully.");
})();

export default Todo;
