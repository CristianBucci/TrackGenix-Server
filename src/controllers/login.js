import Employee from '../models/Employee';
import Admin from '../models/Admin';
import SuperAdmin from '../models/SuperAdmin';
import { compareHashPassword } from '../helpers/bcrypt';

const loginFirebase = (email, password) => async () => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_APP_KEY}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error.message;
  }
};

const testLogin = async (req, res) => {
  try {
    let loginSuccess = null;
    let customToken = null;

    const employee = await Employee.find({ email: req.headers.email }).find({
      isDeleted: false,
    });
    if (employee.length) {
      loginSuccess = compareHashPassword(
        req.headers.password,
        employee[0].password,
      );
      if (loginSuccess) {
        const data = loginFirebase(req.headers.email, req.headers.password);
        customToken = await data();
      } else {
        return res.status(400).json({
          message: 'Password invalid!',
        });
      }
      return res.status(200).json({
        message: 'Successfully logged as employee',
        token: customToken.idToken,
      });
    }

    const admin = await Admin.find({ email: req.headers.email }).find({
      isDeleted: false,
    });
    if (admin.length) {
      loginSuccess = compareHashPassword(
        req.headers.password,
        admin[0].password,
      );
      if (loginSuccess) {
        const data = loginFirebase(req.headers.email, req.headers.password);
        customToken = await data();
      } else {
        return res.status(400).json({
          message: 'Password invalid!',
        });
      }
      return res.status(200).json({
        message: 'Successfully logged as admin',
        token: customToken.idToken,
      });
    }

    const superAdmin = await SuperAdmin.find({ email: req.headers.email }).find(
      {
        isDeleted: false,
      },
    );
    if (superAdmin.length) {
      loginSuccess = compareHashPassword(
        req.headers.password,
        superAdmin[0].password,
      );
      if (loginSuccess) {
        const data = loginFirebase(req.headers.email, req.headers.password);
        customToken = await data();
      } else {
        return res.status(400).json({
          message: 'Password invalid!',
        });
      }
      return res.status(200).json({
        message: 'Successfully logged as super admin',
        token: customToken.idToken,
      });
    }

    return res.status(400).json({
      message: 'Email invalid!',
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

export default testLogin;
