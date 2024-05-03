const express = require("express");
const { body, validationResult } = require("express-validator");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


const senFormVal = [
    body("senTitle").trim().notEmpty().withMessage("event title is required"),
    body("senDesc").trim().notEmpty().withMessage("description is required"),
    body('eventImgs').custom((value, { req }) => {
        if (!req.files) {
            throw new Error("file must be uploaded")
        }
        const filTypes = /jpeg|jpg|png|gif/;
        req.files.forEach(element => {
            if (element.size > 200000) {
                throw new Error("maximum size of file must be less than 200 kb");
            }
            const mimeType = filTypes.test(element.mimetype)
            if (!mimeType) {
                throw new Error("Invalid file type");
            }
        });
        return true;
    })
]

const handleValerrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), isError: true });
    }
    next();
}

module.exports = { senFormVal, handleValerrors };


