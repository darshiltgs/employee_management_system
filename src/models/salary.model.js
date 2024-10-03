import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import Employee from "./employee.model.js";
import User from "./user.model.js";

const Salary = sequelize.define('Salary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employeeId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Employees',
      key: 'id',
    },
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0,
    },
  },
  date: {
    type: DataTypes.DATEONLY,
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
});

Salary.belongsTo(Employee, { foreignKey: 'employeeId' });

// Salary-User relationship
Salary.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Salary.belongsTo(User, { as: 'updater', foreignKey: 'updatedBy' });
Salary.belongsTo(User, { as: 'deleter', foreignKey: 'deletedBy' });

export default Salary;