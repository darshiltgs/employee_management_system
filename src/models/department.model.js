import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import User from "./user.model.js";

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  deletedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  }
}, { timestamps: true });

Department.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Department.belongsTo(User, { as: 'updater', foreignKey: 'updatedBy' });
Department.belongsTo(User, { as: 'deleter', foreignKey: 'deletedBy' });

export default Department;