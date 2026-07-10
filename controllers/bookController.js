const pool = require("../database/db");
const axios = require("axios");

function getCoverUrl(isbn){
    if(!isbn){
        return null;
    }
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

async function getBooks (req, res) {
    try {

        const search = req.query.search || "";
        const sort = req.query.sort || "newest";
        const status = req.query.status || "all";
        const tag = req.query.tag || "all";

        const tagResult = await pool.query(
            `
            SELECT id, name
            FROM tags
            ORDER BY name
            `
        );

        let orderBy = "created_at DESC";

        switch(sort){
            case "oldest":
                orderBy = "created_at ASC";
                break;

            case "title-asc":
                orderBy = "title ASC";
                break;
            
            case "title-desc":
                orderBy = "title DESC";
                break;

            case "rating-desc":
                orderBy = "rating DESC";
                break;
            
            case "rating-asc":
                orderBy = "rating ASC";
                break;
        }

        let query = `
                    SELECT
                        b.*,
                        STRING_AGG(t.name, ', ') AS tags
                    FROM books b
                    LEFT JOIN book_tags bt
                        ON b.id = bt.book_id
                    LEFT JOIN tags t
                        ON bt.tag_id = t.id
                    WHERE
                    (
                        b.title ILIKE $1
                        OR b.author ILIKE $1
                    )
                    `;

        const values = [`%${search}%`];

        let parameterIndex = values.length + 1;

        if(status !== "all"){

            query += `
                AND b.status = $${parameterIndex}
            `;

            values.push(status);

            parameterIndex++;
        }

        if(tag !== "all"){

            query += `
                AND bt.tag_id = $${parameterIndex}
            `;

            values.push(tag);

            parameterIndex++;
        }

        query += `
                    GROUP BY b.id
                  `;

        query += `
                    ORDER BY ${orderBy}
                  `;

        const result = await pool.query(
            query,
            values
        );

        res.render("pages/books",{
            books: result.rows,
            search,
            sort,
            status,
            tag,
            tags: tagResult.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Database Error");
    }
}

function getNewBookForm(req, res) {
    res.render("pages/new-book");
}

async function getBookById(req,res){
    
    try{
        const {id} = req.params;

        const result = await pool.query("SELECT * FROM BOOKS WHERE ID = $1",[id]);

        if(result.rows.length===0){
            return res.status(404).send("Books not found");
        }
        res.render("pages/book-details",
            {
            book:result.rows[0]
            }
        );
    }catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
}

async function createBook(req, res) {


    try {
            const {
                title,
                author,
                isbn,
                rating,
                review,
                status,
                tags
            } = req.body;

            const coverUrl = getCoverUrl(isbn);

            const tagArray =
                (tags || "")
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const newBook = await pool.query(
                `
                INSERT INTO books
                (
                    title,
                    author,
                    isbn,
                    cover_url,
                    rating,
                    review,
                    status
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                )
                RETURNING id
                `,
                [
                    title,
                    author,
                    isbn,
                    coverUrl,
                    rating || null,
                    review,
                    status
                ]
            );

            const bookId = newBook.rows[0].id;

            for(const tagName of tagArray){

                let tagResult = await pool.query(
                    `
                    SELECT *
                    FROM tags
                    WHERE name = $1
                    `,
                    [tagName]
                );

                let tagId;

                if(tagResult.rows.length === 0){

                    const newTag = await pool.query(
                        `
                        INSERT INTO tags(name)
                        VALUES($1)
                        RETURNING id
                        `,
                        [tagName]
                    );

                    tagId = newTag.rows[0].id;

                }else{

                    tagId = tagResult.rows[0].id;

                }

                await pool.query(
                    `
                    INSERT INTO book_tags
                    (
                        book_id,
                        tag_id
                    )
                    VALUES
                    (
                        $1,
                        $2
                    )
                    `,
                    [bookId, tagId]
                );
            }

            res.redirect("/books");

        } catch (error) {

            console.error(error);

            res.status(500).send("Error Saving Book");
        }
    
}

async function getEditBookForm(req,res){
    try{

        const {id} = req.params;

        const result = await pool.query(
            `
            SELECT
                b.*,
                STRING_AGG(t.name, ', ') AS tags
            FROM books b
            LEFT JOIN book_tags bt
                ON b.id = bt.book_id
            LEFT JOIN tags t
                ON bt.tag_id = t.id
            WHERE b.id = $1
            GROUP BY b.id
            `,
            [id]
        );

        if(result.rows.length===0){
            return res.status(404).send("Book not found");
        }

        const book = result.rows[0];

        res.render("pages/edit-book",{
            book,
            tagsString: book.tags || ""
        });

    }catch(error){

        console.error(error);

        res.status(500).send("Internal server error");
    }
}

async function updateBook(req,res){
    try{
        const {id} = req.params;

        const {
            title,
            author,
            isbn,
            rating,
            review,
            status,
            tags
        } = req.body;

        const coverUrl = getCoverUrl(isbn);

        const tagArray =
            (tags || "")
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        await pool.query(
            `UPDATE books
             SET title = $1,
                 author = $2,
                 isbn = $3,
                 cover_url = $4,
                 rating = $5,
                 review = $6,
                 status = $7,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $8`,
            [
                title,
                author,
                isbn,
                coverUrl,
                rating || null,
                review,
                status,
                id
            ]
        );

        await pool.query(
            `
            DELETE
            FROM book_tags
            WHERE book_id = $1
            `,
            [id]
        );

        for(const tagName of tagArray){

            let tagResult = await pool.query(
                `
                SELECT *
                FROM tags
                WHERE name = $1
                `,
                [tagName]
            );

            let tagId;

            if(tagResult.rows.length === 0){

                const newTag = await pool.query(
                    `
                    INSERT INTO tags(name)
                    VALUES($1)
                    RETURNING id
                    `,
                    [tagName]
                );

                tagId = newTag.rows[0].id;

            }else{

                tagId = tagResult.rows[0].id;

            }

            await pool.query(
                `
                INSERT INTO book_tags
                (
                    book_id,
                    tag_id
                )
                VALUES
                (
                    $1,
                    $2
                )
                `,
                [id, tagId]
            );
        }

        res.redirect(`/books/${id}`);

    }catch(error){
        console.error(error);
        res.status(500).send("Update failed");
    }
}

async function deleteBook(req,res){
    try{
        const {id} = req.params;
        await pool.query( `DELETE FROM books WHERE id = $1`,[id]);
        res.redirect("/books");

    }catch(error){
        console.error(error);
        res.status(500).send("Deletion failed");
    }
}

module.exports = {
    getBooks,
    getNewBookForm,
    createBook,
    getBookById,
    getEditBookForm,
    updateBook,
    deleteBook
};