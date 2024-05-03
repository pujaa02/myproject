const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, './public/comuploads');
  },
  filename: (req, file, cb) => {
    return cb(null, Date.now() + '-' + file.originalname);
  }
});

module.exports = storage;
