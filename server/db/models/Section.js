const Sequelize = require("sequelize");
const db = require("../db");

const Section = db.define("section", {
  sectionNumber: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Section;
