import Tasks from '../models/Task';

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find(req.query);

    if (!tasks.length) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Task not found.', status: 404,
      };
    }
    return res.status(200).json({
      message: tasks.length > 1 ? 'Tasks found' : 'Task found',
      data: tasks,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Tasks.findById(id);
    if (!task) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Task not found.', status: 404,
      };
    }
    return res.status(200).json({
      msg: 'Task found.',
      data: task,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const task = new Tasks({
      description: req.body.description,
    });
    const result = await task.save();
    if (!task) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Could not create a new task.', status: 400,
      };
    }
    return res.status(201).json({
      message: 'New task successfully created.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = req.body;
    const result = await Tasks.findByIdAndUpdate(id, {
      description: task.description,
    });
    if (!result) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Task not found.', status: 404,
      };
    }
    return res.status(200).json({
      message: 'Task updated.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await Tasks.findByIdAndDelete(req.params.id);
    if (!result) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Task not found.', status: 404,
      };
    }
    return res.status(204).json({
      message: 'Task deleted.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  editTask,
  deleteTask,
};
