import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../configs/db.config";
import Todo from "./todo.model";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { userInfo } from "os";
import { generateHashedPassword } from "../utils/bcrypt.util";
import { ROOT_DIR } from "../configs/constants.config";
import ImportExport from "./importExport.model";

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

  avatarFullUrl: {
    type: DataTypes.VIRTUAL,
    get() {
      const avatar = this.getDataValue("avatar");
      if (avatar) {
        return process.env.BASE_RESOURCE_URL + this.getDataValue("avatar");
      }
    },
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

User.hasMany(Todo, { onDelete: "CASCADE", hooks: true });
Todo.belongsTo(User);

User.hasMany(ImportExport);
ImportExport.belongsTo(User);

User.prototype.generateToken = function (): string {
  let token = jwt.sign(
    { id: this.id, role: this.role },
    process.env.secretKey as string
  );
  return token;
};

// Delete old avatar after save
User.afterUpdate((user: any) => {
  if (user.changed("avatar")) {
    if (user._previousDataValues.avatar) {
      fs.unlinkSync(path.join(ROOT_DIR, user._previousDataValues.avatar));
    }
  }
});

// Hash password before save
User.beforeSave((user: any) => {
  user.password = generateHashedPassword(user.password);
});

(async () => {
  await sequelize.sync();
  console.log("User model was synchronized successfully.");
})();

export default User;
