const router = require("express").Router();
const {
  models: { Section, File },
} = require("../db");
module.exports = router;

const { requireToken, isYourSection, isYourProject } = require("../gatekeeper");

router.post("/", requireToken, isYourProject, async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const existingSections = await Section.findAll({
      where: { projectId },
    });
    let sectionNumber = 1;
    for (let section of existingSections) {
      if (section.sectionNumber >= sectionNumber) {
        sectionNumber = section.sectionNumber + 1;
      }
    }
    const section = await Section.create({ sectionNumber, projectId });
    res.send(section);
  } catch (err) {
    next(err);
  }
});

router.delete(
  "/:sectionId",
  requireToken,
  isYourSection,
  async (req, res, next) => {
    try {
      const sectionToDelete = await Section.findByPk(req.params.sectionId);
      const filesToDelete = await File.findAll({
        where: { sectionId: sectionToDelete.id },
      });
      for (let file of filesToDelete) {
        await file.destroy();
      }
      const deletedSection = await sectionToDelete.destroy();
      res.status(202).send(deletedSection);
    } catch (err) {
      next(err);
    }
  }
);
