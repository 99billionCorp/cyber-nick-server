const express = require("express");
const path = require("path");
const app = express();
const cors = require('cors');
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const coursesRoute = require("./routes/courses.js");
const authRoute = require("./routes/auth.js");
const filmsRoute = require("./routes/films.js");

const MONGO_URI = 'mongodb+srv://artem:12345@cluster0.6bskz.mongodb.net/CyberIz?retryWrites=true&w=majority';

const userMiddleware = require("./middleware/user.js");

app.use(cors());

const store = new MongoStore({
    uri: MONGO_URI,
    collection: "sessions",
    databaseName: 'CyberIz'
}, (e) => {
    console.log('Cant connect session err: ', e);
});

const PORT = 80;

// app.set("view engine", "hbs");
// app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views", "img")));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(
    session({
        secret: "hgydl dsjg,da17",
        resave: true,
        saveUninitialized: true,
        store,
    })
);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(userMiddleware);

app.use("/courses", coursesRoute);
app.use("/auth", authRoute);
app.use("/films", filmsRoute);

// if (process.env.NODE_ENV === "production") {
//     app.use("/", express.static(path.join(__dirname, "client", "build")));
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//     });
// }

// const User = require("./models/user");
// const bcrypt = require("bcrypt");

const start = async () => {
    try {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        // const admin = await User.findOne({ login: "admin" });
        // if (!admin) {
        //     const user = new User({
        //         login: "admin",
        //         password: await bcrypt.hash("admin", 12),
        //         isAdmin: true,
        //     });
        //     await user.save();
        // }
        app.listen(PORT, () => {
            console.log(`Server has been started on ${PORT}.`);
        });
    } catch (e) {
        if (e) {
            console.log(e);
            process.exit(1);
        }
    }
};
start()