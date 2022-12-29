import Project from '../models/Projects';

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find(req.query).find({ isDeleted: false }).populate({
      path: 'employees',
      populate: {
        path: 'employeeId',
      },
    });

    if (!projects.length) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Project not found.', status: 404,
      };
    }
    return res.status(200).json({
      message: projects.length > 1 ? 'Projects found' : 'Project found',
      data: projects,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Project not found.', status: 404,
      };
    } else if (project.isDeleted) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Project Deleted.', status: 404,
      };
    } else {
      return res.status(200).json({
        msg: 'Project found.',
        data: project,
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const createProject = async (req, res) => {
  try {
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      clientName: req.body.clientName,
      employees: req.body.employees,
    });

    const result = await newProject.save();
    if (!result) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Could not create a new project.', status: 400,
      };
    }
    return res.status(201).json({
      message: 'New project successfully created.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Project.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true },
    );
    if (!result) {
    // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Project not found.', status: 404,
      };
    }
    return res.status(200).json({
      message: 'Project updated.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

const deleteById = async (req, res) => {
  try {
    const result = await Project.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!result) {
    // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Project not found.', status: 404,
      };
    }
    return res.status(204).json({
      message: 'Project deleted.',
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

export default {
  getAllProjects,
  getProjectById,
  createProject,
  editProject,
  deleteById,
};
