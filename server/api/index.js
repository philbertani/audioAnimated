const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/projects", require("./projects"));
router.use("/sections", require("./sections"));
router.use("/audiofiles", require("./audiofiles"));
router.use("/files", require("./files"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
