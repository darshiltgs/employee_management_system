import { DataTypes } from "sequelize";
import { sequelize } from "../../db/sequelize.js";
import User from "./user.model.js";
import Department from "./department.model.js";

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  phone: {
    type: DataTypes.BIGINT(11),
    unique: true,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Departments',
      key: 'id',
    },
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
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

// Employee-Department relationship
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

// Employee-User relationship
Employee.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Employee.belongsTo(User, { as: 'updater', foreignKey: 'updatedBy' });
Employee.belongsTo(User, { as: 'deleter', foreignKey: 'deletedBy' });

export default Employee;