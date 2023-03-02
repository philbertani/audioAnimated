const db = require("./db");

const User = require("./models/User");
const Project = require("./models/Project");
const Section = require("./models/Section");
const File = require("./models/File");

const user_projects = db.define("user_project", {});

User.belongsToMany(Project, { through: user_projects });
Project.belongsToMany(User, { through: user_projects });

Project.hasMany(Section);
Section.belongsTo(Project);

Section.hasMany(File);
File.belongsTo(Section);

User.hasMany(File);
File.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    Project,
    Section,
    File,
    user_projects,
  },
};
