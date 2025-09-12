import express from 'express';
import 'dotenv/config';
import session from "express-session";
import authentification from "./routes/authentification.route.js";
import homepage from "./routes/homepage.route.js";
import administration from "./routes/administration.route.js";
import favoris from "./routes/favoris.route.js";
import profile from "./routes/profile.route.js";
import logout from "./routes/logout.route.js";
import flash from "connect-flash";

const app = express();

// Configurer la session
app.use(session({
    secret: "express-ejs", 
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}));

// Utiliser le middleware body-parser
app.use(express.urlencoded({extended: true}));

app.use(flash());

app.use(express.static("public"));

const PORT = process.env.PORT || 5555;

// Mapping entre routes et le routeur

app.use("/authentification", authentification);
app.use("/homepage", homepage);
app.use("/administration", administration);
app.use("/favoris", favoris);
app.use("/profile", profile);
app.use("/logout", logout);

// Configuration du moteur de template
app.set("view engine", "ejs");
app.set("views", import.meta.dirname + "/templates");

app.all("/*splat", (req, res) => {
    res
    .status(404)
    .end("Page Introuvable");
});

app.listen(PORT, () => {
    console.log(`Addresse serveur : http://localhost:${PORT}`);
});