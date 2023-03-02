const router = require("express").Router();
const {
  models: { File, Section },
} = require("../db");
module.exports = router;

const { requireToken, isYourFile, isYourProject } = require("../gatekeeper");

router.post("/", requireToken, isYourProject, async (req, res, next) => {
  try {
    let { projectId, sectionNumber, filePath, name, type, userId } = req.body;
    if (typeof sectionNumber === "undefined") {
      sectionNumber = 0;
    }
    let section = await Section.findOne({
      where: { projectId, sectionNumber },
    });
    if (!section) section = await Section.create({ projectId, sectionNumber });

    const newFile = await File.create({
      name,
      filePath,
      type,
      sectionId: section.id,
      userId,
    });
    res.status(201).send(newFile);
  } catch (err) {
    next(err);
  }
});

router.delete("/", requireToken, isYourFile, async (req, res, next) => {
  try {
    const { deleteParam, type } = req.query;
    if (type === "byName") {
      const name = deleteParam;
      const filesToDelete = await File.findAll({
        where: { name },
      });
      for (let file of filesToDelete) {
        await file.destroy();
      }
    } else if (type === "byId") {
      const fileId = deleteParam;
      const fileToDelete = await File.findByPk(fileId);
      await fileToDelete.destroy();
    }

    res.status(202).send("deleted");
  } catch (err) {
    next(err);
  }
});
