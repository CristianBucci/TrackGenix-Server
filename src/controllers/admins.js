import firebaseApp from '../helpers/firebase/index';
import Admins from '../models/Admin';
import { hashPassword } from '../helpers/bcrypt';

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admins.find(req.query).find({ isDeleted: false });

    if (!admins.length) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Admin not found.', status: 404,
      };
    }
    return res.status(200).json({
      message: admins.length > 1 ? 'Admins found' : 'Admin found',
      data: admins,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admins.findById(id);
    if (!admin) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Admin not found.', status: 404,
      };
    } else if (admin.isDeleted) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Admin Deleted.', status: 404,
      };
    } else {
      return res.status(200).json({
        msg: 'Admin found.',
        data: admin,
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const newFirebaseUser = await firebaseApp.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });

    await firebaseApp.auth().setCustomUserClaims(newFirebaseUser.uid, { role: 'ADMIN' });

    const hash = hashPassword(req.body.password);
    const newAdmin = new Admins({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      firebaseUid: newFirebaseUser.uid,
    });

    const result = await newAdmin.save();
    if (!result) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Could not create a new admin.', status: 400,
      };
    }
    return res.status(201).json({
      message: 'New admin successfully created.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const editAdmin = async (req, res) => {
  try {
    const { password } = req.body;
    if (password) {
      req.body.password = hashPassword(req.body.password);
    }
    const { id } = req.params;
    const result = await Admins.findByIdAndUpdate(
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
        message: 'Admin not found.', status: 404,
      };
    }
    return res.status(200).json({
      message: 'Admin updated.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const result = await Admins.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!result) {
    // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Admin not found.', status: 404,
      };
    }
    return res.status(204).json({
      message: 'Admin deleted.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

export default {
  getAllAdmins,
  getAdminById,
  createAdmin,
  editAdmin,
  deleteAdmin,
};
