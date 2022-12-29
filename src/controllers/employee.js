import firebaseApp from '../helpers/firebase/index';
import Employee from '../models/Employee';
import { hashPassword } from '../helpers/bcrypt';

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(req.query).find({ isDeleted: false });

    if (!employees.length) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Employee not found.', status: 404,
      };
    }
    return res.status(200).json({
      message: employees.length > 1 ? 'Employees found' : 'Employee found',
      data: employees,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Employee not found.', status: 404,
      };
    } else if (employee.isDeleted) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Employee Deleted.', status: 404,
      };
    } else {
      return res.status(200).json({
        msg: 'Employee found.',
        data: employee,
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const newFirebaseUser = await firebaseApp.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });

    await firebaseApp.auth().setCustomUserClaims(newFirebaseUser.uid, { role: 'EMPLOYEE' });

    const hash = hashPassword(req.body.password);
    const newEmployee = new Employee({
      name: req.body.name,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: hash,
      firebaseUid: newFirebaseUser.uid,
    });
    await newEmployee.save();
    if (!newEmployee) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Could not create a new employee.', status: 400,
      };
    }
    res.status(201).json({
      message: 'New employee successfully created.',
      data: newEmployee,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const editEmployee = async (req, res) => {
  try {
    const { password } = req.body;
    if (password) {
      req.body.password = hashPassword(req.body.password);
    }
    const { id } = req.params;
    const result = await Employee.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true },
    );
    await firebaseApp.auth().updateUser(result.firebaseUid, {
      email: req.body.email,
      password,
    });
    if (!result) {
    // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Employee not found.', status: 404,
      };
    }
    return res.status(200).json({
      message: 'Employee updated.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const result = await Employee.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!result) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Employee not found.', status: 404,
      };
    }
    return res.status(204).json({
      message: 'Employee deleted.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  editEmployee,
  deleteEmployee,
};
