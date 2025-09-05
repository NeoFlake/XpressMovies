import express from 'express';
import 'dotenv/config';
import session from "express-session";
import authentification from "./routes/authentification.route.js";

const app = express();

// Configurer la session
app.use(session({
    secret: "express-ejs", 
    resave: false,
    saveUnitialized: false 
}));

// Utiliser le middleware body-parser
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 5555;

// Mapping entre routes et le routeur

app.use("/authentification", authentification);

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