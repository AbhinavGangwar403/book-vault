const pool = require("../database/db");

const bcrypt = require("bcrypt");

function showLogin(req,res){

    res.render("pages/login",{

        error:null

    });

}

async function login(req,res){

    try{

        const {

            username,

            password

        } = req.body;

        const result = await pool.query(

            `
            SELECT *
            FROM users
            WHERE username = $1
            `,
            [username]

        );

        if(result.rows.length===0){

            return res.render(

                "pages/login",

                {

                    error:"Invalid username or password."

                }

            );

        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(

            password,

            user.password

        );

        if(!validPassword){

            return res.render(

                "pages/login",

                {

                    error:"Invalid username or password."

                }

            );

        }

        req.session.user = {

            id:user.id,

            username:user.username

        };

        res.redirect("/");

    }catch(error){

        console.error(error);

        res.status(500).send("Login Failed");

    }

}

function logout(req,res){

    req.session.destroy(()=>{

        res.redirect("/");

    });

}

module.exports = {

    showLogin,

    login,

    logout

};