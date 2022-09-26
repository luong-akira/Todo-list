import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../configs/db.config";
import User from "./user.model";

const ImportExport = sequelize.define("import_export", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  jobId: {
    type: DataTypes.BIGINT,
  },

  file: {
    type: DataTypes.STRING,
    defaultValue: "",
  },

  status: {
    type: DataTypes.ENUM,
    values: ["waiting", "active", "completed", "failed"],
    defaultValue: "waiting",
  },
});

(async () => {
  await sequelize.sync();
  console.log("Import export model was synchronized successfully.");
})();

export default ImportExport;
