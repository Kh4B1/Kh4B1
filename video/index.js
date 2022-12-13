const router = require("express").Router(),
  video = require("./video.controller"),
  jwt = require("../../middlewares/jwt"),
  { uploadVideo } = require("../../middlewares/multer")

router.post("/:id", uploadVideo.single("video"), jwt.check, video.upload)
//혁주형 작업
router.get("/:id", video.stream)

module.exports = router
