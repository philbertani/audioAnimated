const fs = require("fs");
const router = require("express").Router();

const {
  requireToken,
  requireTokenOrShareable,
  isYourProject,
  isYourProjectOrShareable,
} = require("../gatekeeper");

module.exports = router;
require("dotenv").config();

const multer = require("multer");
const upload = multer();

router.get(
  "/",
  requireTokenOrShareable,
  isYourProjectOrShareable,
  (req, res, next) => {
    const { projectId, filePath } = req.query;
    const fullFilepath =
      process.env.AUDIO_DATA_DIR + "/" + projectId + "/" + filePath;
    fs.readFile(fullFilepath, { encoding: "base64" }, (err, data) => {
      if (err) {
        next(err);
        res.status(500).send("problem");
      } else {
        console.log("read file in");
        res.status(200).send(data);
      }
    });
  }
);

router.post(
  "/",
  requireToken,
  isYourProject,
  upload.single("audiofile"),
  (req, res, next) => {
    const { projectId, filePath } = req.query;
    const file = req.file;

    const fullFilepath =
      process.env.AUDIO_DATA_DIR + "/" + projectId + "/" + filePath;

    const folder = process.env.AUDIO_DATA_DIR + "/" + projectId;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    try {
      fs.open(fullFilepath, "w+", (err, fd) => {
        fs.writeFile(fd, file.buffer, (err) => {
          fs.close(fd, (err) => {
            res.status(201).send(`${filePath}`);
          });
        });
      });
    } catch (err) {
      next(err);
    }
  }
);
