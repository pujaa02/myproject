const express = require("express");
const multer = require("multer");
const { getAllAuthors, getSingleAuthor, updateAuthor, createAuthor, uploadImag, getAllLanuage } = require("../controllers/author");
const { createAuthorValidationRules, handleValidatorerrors } = require("../middlewares/validationaauthor");
const { fileValidateMiddleware } = require("../middlewares/imagevalidation");
const { addAuthor } = require("../controllers/adminController/admin");
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
router.get("/admin/createAuthor",addAuthor);
router.get("/admin/getAllAuthors", getAllAuthors);
router.post("/admin/createAuthor", upload.single('image'),createAuthorValidationRules,  handleValidatorerrors, createAuthor)

router.get("/getAllAuthors", getAllAuthors);
router.post("/admin/createAuthor", upload.single('image'), createAuthorValidationRules, handleValidatorerrors, createAuthor)
router.get("/admin/getSingleAuthor/:id", getSingleAuthor);
router.post("/admin/updateAuthor", upload.single('image'), createAuthorValidationRules, handleValidatorerrors, updateAuthor)
router.post("/upload", upload.single('file'), fileValidateMiddleware, handleValidatorerrors, uploadImag)
router.get("/admin/getBooksByAuthor",)
module.exports = router;
