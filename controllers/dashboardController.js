const pool = require("../database/db");

async function getDashboard(req,res){
    try{
        const totalBooksQuery = 
        await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM books
            `
        );

        const avgRatingQuery = 
        await pool.query(
            `
            SELECT 
            ROUND(AVG(rating)::numeric,2)
            AS avg_rating
            FROM books
            `
        );

        const completedQuery = 
        await pool.query(
            `
            SELECT COUNT(*) AS completed
            FROM books
            WHERE status = 'Completed'
            `
        );

        const readingQuery = 
        await pool.query(
            `
            SELECT COUNT(*) AS reading
            FROM books
            WHERE status = 'Reading'
            `
        );

        const wantToReadQuery = 
        await pool.query(
            `
            SELECT COUNT(*) AS want_to_read
            FROM books
            WHERE status = 'Want To Read'
            `
        );

        const highestRatedQuery = 
        await pool.query(
            `
            SELECT *
            FROM books
            ORDER BY rating DESC
            LIMIT 1
            `
        );

        const statusDataQuery = 
        await pool.query(
            `
            SELECT 
            status,COUNT(*) AS count
            FROM books
            GROUP BY status
            `
        );

        const ratingDataQuery = 
        await pool.query(
            `
            SELECT 
            rating,COUNT(*) AS count
            FROM books
            GROUP BY rating
            ORDER BY rating
            `
        );

        res.render("pages/dashboard",
            {
                totalBooks:
                totalBooksQuery.rows[0].total,

                avgRating:
                avgRatingQuery.rows[0].avg_rating,

                completed:
                completedQuery.rows[0].completed,

                reading:
                readingQuery.rows[0].reading,

                wantToRead:
                wantToReadQuery.rows[0].want_to_read,

                highestRated:
                highestRatedQuery.rows[0],

                statusData:
                statusDataQuery.rows,

                ratingData:
                ratingDataQuery.rows
            }
        );

    }catch(error){

        console.error(error);
        res.status(500).send("Error in Dashboard");
    }
}

module.exports = {
    getDashboard
}