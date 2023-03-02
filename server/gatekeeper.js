const {
  models: { User, File, Section, Project },
} = require("./db");

const requireTokenOrShareable = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    req.user = await User.findByToken(token);
    next();
  } else {
    let { projectId } = req.params;
    if (!projectId) projectId = req.query.projectId;
    const project = await Project.findByPk(projectId);
    const shareable = project.dataValues.shareable;
    if (shareable) next();
    else
      return res
        .status(403)
        .send("You do not have permission to view this content");
  }
};

const requireToken = async (req, res, next) => {
  const token = req.headers.authorization;
  req.user = await User.findByToken(token);
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send("You must be an admin to access this route");
  } else {
    next();
  }
};

const isYourFile = async (req, res, next) => {
  const { deleteParam, type } = req.query;
  let userIds;
  if (type === "byId") {
    const fileId = deleteParam;
    const file = await File.findByPk(fileId, {
      include: {
        model: Section,
        include: {
          model: Project,
          include: User,
        },
      },
    });
    userIds = file.section.project.users.map((x) => x.id);
  } else if (type === "byName") {
    const name = deleteParam;
    const files = await File.findAll({
      where: { name },
      include: {
        model: Section,
        include: {
          model: Project,
          include: User,
        },
      },
    });

    // using Set to dedup list on each pass thru of reduce
    userIds = Array.from(
      files.reduce((accumSet, f) => {
        uIds = f.section.project.users.map((x) => x.id);
        uIds.forEach((id) => accumSet.add(id));
        return accumSet;
      }, new Set())
    );
  }

  const userInProject = userIds.some((x) => x === req.user.id);
  if (userInProject) {
    next();
  } else {
    return res.status(403).send("You cannot access other users files");
  }
};

const isYourSection = async (req, res, next) => {
  let sectionId = req.params.sectionId;
  const section = await Section.findByPk(sectionId, {
    include: {
      model: Project,
      include: User,
    },
  });
  const userIds = section.project.users.map((x) => x.id);
  const userInProject = userIds.some((x) => x === req.user.id);
  if (userInProject) {
    next();
  } else {
    return res.status(403).send("You cannot access other users sections");
  }
};

const isYourProjectOrShareable = async (req, res, next) => {
  let projectId = req.params.projectId;
  if (!projectId) projectId = req.query.projectId;
  const project = await Project.findByPk(projectId, {
    include: User,
  });
  if (!project) return res.status(404).send("Project does not exist");
  if (project.shareable) next();
  else {
    const userIds = project.users.map((x) => x.id);
    const userInProject = userIds.some((x) => x === req.user.id);
    if (userInProject) {
      next();
    } else {
      return res.status(403).send("You cannot access other users projects");
    }
  }
};

const isYourProject = async (req, res, next) => {
  let projectId = req.params.projectId;
  if (!projectId) projectId = req.query.projectId;
  if (!projectId) projectId = req.body.projectId;
  const project = await Project.findByPk(projectId, {
    include: User,
  });
  const userIds = project.users.map((x) => x.id);
  const userInProject = userIds.some((x) => x === req.user.id);
  if (userInProject) {
    next();
  } else {
    return res.status(403).send("You cannot access other users projects");
  }
};

const isSelf = (req, res, next) => {
  let userId = req.params.userId;
  if (!userId) {
    userId = req.body.userId;
  }
  if (!userId) {
    userId = req.query.userId;
  }
  const isSelf = req.user.id === Number(userId);
  if (isSelf) {
    next();
  } else {
    return res.status(403).send("You cannot access other users data");
  }
};

const sharableOrIsSelf = (req, res, next) => {
  let userId = req.params.userId;
  if (!userId) {
    let { userId } = req.body;
  }
  const isSelf = req.user.id === Number(req.params.userId);
  if (isSelf) {
    next();
  } else {
    return res.status(403).send("You cannot access other users data");
  }
};
const isAdminOrSelf = (req, res, next) => {
  const isSelf = req.user.id === Number(req.params.userId);
  const isAdmin = req.user.isAdmin;
  if (isSelf | isAdmin) {
    next();
  } else {
    return res.status(403).send("You must be an admin to access this route");
  }
};

module.exports = {
  requireTokenOrShareable,
  requireToken,
  isSelf,
  sharableOrIsSelf,
  isYourFile,
  isYourSection,
  isYourProject,
  isYourProjectOrShareable,
  isAdmin,
  isAdminOrSelf,
};
