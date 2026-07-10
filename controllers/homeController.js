const pool = require("../database/db");

async function getHomePage(req, res) {

    try {

        const featuredBooks = await pool.query(`
            SELECT *
            FROM books
            ORDER BY rating DESC
            LIMIT 4
        `);

        const recentBooks = await pool.query(`
            SELECT *
            FROM books
            ORDER BY created_at DESC
            LIMIT 6
        `);

        const stats = await pool.query(`
            SELECT
                COUNT(*) AS total_books,
                ROUND(AVG(rating)::numeric,1) AS average_rating,
                COUNT(DISTINCT author) AS total_authors
            FROM books
        `);

        const completed = await pool.query(`
            SELECT COUNT(*) AS completed
            FROM books
            WHERE status='Completed'
        `);

        res.render("pages/home", {

            featuredBooks: featuredBooks.rows,

            recentBooks: recentBooks.rows,

            stats: stats.rows[0],

            completed:
            completed.rows[0].completed

        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Error");

    }

}

module.exports = {
    getHomePage
};