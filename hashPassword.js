const bcrypt = require("bcrypt");
const pool = require("./database/db");

async function createUser(){

    try{

        const username = "admin";

        const password = "admin123";

        const hashedPassword = await bcrypt.hash(password,10);

        await pool.query(
            `
            INSERT INTO users
            (
                username,
                password
            )
            VALUES
            (
                $1,
                $2
            )
            `,
            [
                username,
                hashedPassword
            ]
        );

        console.log("User created successfully.");

        process.exit();

    }catch(error){

        console.error(error);

        process.exit();

    }

}

createUser();