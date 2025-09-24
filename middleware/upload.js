const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/proposals/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('proposal'); // 'proposal' is the name of the form field

// Check file type
function checkFileType(file, cb){
  // Allowed extensions
  const filetypes = /pdf|ppt|pptx/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: PDFs and PowerPoints Only!');
  }
}

module.exports = upload;