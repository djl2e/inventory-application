const path = require('path');
const multer = require('multer');

const { MulterError } = multer;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  if (!file.mimetype.includes('image/')) {
    return cb(new MulterError('file type not accepted'), false);
  }
  cb(null, true);
}

const upload = multer({storage, fileFilter});

module.exports = {
  upload,
};
