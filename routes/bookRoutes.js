const express = require("express");

const {

    requireLogin

} = require("../middleware/authMiddleware");

const router = express.Router();

const {
    getBooks,
    getNewBookForm,
    createBook,
    getBookById,
    getEditBookForm,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

router.get("/", getBooks);

router.get("/new",requireLogin, getNewBookForm);

router.get("/edit/:id",requireLogin, getEditBookForm);

router.get("/:id",getBookById);

router.post("/",requireLogin, createBook);

router.post("/update/:id",requireLogin, updateBook);

router.post("/delete/:id",requireLogin, deleteBook);

module.exports = router;