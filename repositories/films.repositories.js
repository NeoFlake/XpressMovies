import connection from "../config/db.config.js";

const findAll = async () => {
    const SELECT = "SELECT f.id, f.title, f.poster, f.releaseDate," + 
    "f.addedDate, f.adminId, COALESCE(JSON_ARRAYAGG(g.nom), JSON_ARRAY()) AS genres FROM Films AS f " +
    "LEFT JOIN Film_Genre fg ON f.id = fg.film_id " + 
    "LEFT JOIN Genres g ON g.id = fg.genre_id " +
    "JOIN Users u ON f.adminId = u.id" +
    "GROUP BY f.id";
    try {
        const resultat = await connection.query(SELECT);
        if (resultat[0].length > 0) {
            return resultat[0];
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(error);
    }
}

const findById = async (id) => {
    const SELECT = "SELECT f.id, f.title, f.poster, f.releaseDate," + 
    "f.addedDate, u.name AS admin, COALESCE(JSON_ARRAYAGG(g.nom), JSON_ARRAY()) AS genres FROM Films AS f " +
    "LEFT JOIN Film_Genre fg ON f.id = fg.film_id " + 
    "LEFT JOIN Genres g ON g.id = fg.genre_id " +
    "JOIN Users u ON f.adminId = u.id " +
    "WHERE f.id=? " +
    "GROUP BY f.id";
    try {
        const resultat = await connection.query(SELECT, [id]);
        if (resultat[0].length > 0) {
            return {
                id: resultat[0][0].id,
                title: resultat[0][0].title,
                poster: resultat[0][0].poster,
                releaseDate: resultat[0][0].releaseDate,
                addedDate: resultat[0][0].addedDate,
                admin: resultat[0][0].admin,
                genres: resultat[0][0].genres
            };
        } else {
            throw new Error("Aucun film n'a été trouvé avec cet identifiant");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const add = async (film) => {
    const INSERT = "INSERT INTO Genres (name) VALUES (?)";
    try {
        const resultat = await connection.query(INSERT, [name]);
        if(resultat[0].affectedRows > 0){
            return resultat[0].affectedRows;
        } else {
            throw new Error("Le nouveau genre n'a pas été posté en base");
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default { findAll, findById, }