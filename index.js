const express = require("express");
const path = require("path");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const homeRoutes = require("./routes/homeRoutes");


const app = express();
const port = 3000;

//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(
    session({
        secret: "bookvault-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

app.use((req,res,next)=>{

    res.locals.user = req.session.user;

    next();

});

//static files
app.use(express.static("public"));

//EJS
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use("/", authRoutes);

//Home Route
app.use("/", homeRoutes);

app.use("/books",bookRoutes);

app.use("/dashboard",dashboardRoutes);

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
});