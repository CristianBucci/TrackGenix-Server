import Timesheet from '../models/TimeSheet';

const getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find(req.query)
      .populate('task')
      .populate('employee')
      .populate('project');
    if (!timesheets.length) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Timesheet not found.', status: 404,
      };
    }
    return res.status(200).json({
      message: timesheets.length > 1 ? 'Timesheets found' : 'Timesheet found',
      data: timesheets,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const getTimesheetById = async (req, res) => {
  try {
    const { id } = req.params;
    const timeSheet = await Timesheet.findById(id);
    if (!timeSheet) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Timesheet not found.',
        status: 404,
      };
    }
    return res.status(200).json({
      message: 'Timesheet found.',
      data: timeSheet,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const createTimesheet = async (req, res) => {
  try {
    const newTimesheet = new Timesheet({
      description: req.body.description,
      date: req.body.date,
      task: req.body.task,
      employee: req.body.employee,
      project: req.body.project,
      hours: req.body.hours,
    });
    const result = await newTimesheet.save();
    if (!result) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Could not create a new timesheet.', status: 400,
      };
    }
    return res.status(201).json({
      message: 'New timesheet successfully created.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const editTimesheet = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Timesheet.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true },
    );
    if (!result) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Timesheet not found.',
        status: 404,
      };
    }
    return res.status(200).json({
      message: 'Timesheet updated.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const deleteTimesheet = async (req, res) => {
  try {
    const result = await Timesheet.findByIdAndDelete(req.params.id);
    if (!result) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Timesheet not found.',
        status: 404,
      };
    }
    return res.status(204).json({
      message: 'Timesheet deleted.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

export default {
  getAllTimesheets,
  getTimesheetById,
  createTimesheet,
  editTimesheet,
  deleteTimesheet,
};
