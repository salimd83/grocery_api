const multer = require("multer");
const sharp = require("sharp");

// setting up the middleware
const upload = multer({
  limits: {
    filesize: 2 * 1024 * 1024,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|jpg|png|gif)$/)) {
        return cb(new Error("The uploaded file is not an image"));
      }
      cb(null, true);
    },
  },
});

async function resize(req, width, path) {
  const filename = `${req.params.id}.${mimeExt(req.file.mimetype)}`;
  return await sharp(req.file.buffer)
    .resize({ width })
    .toFile(`${path}/${filename}`);
}

function mimeExt(mime) {
  return mime.substr(mime.lastIndexOf("/") + 1);
}

module.exports = {
  upload,
  resize,
};
