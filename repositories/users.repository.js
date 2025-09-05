import connection from "../config/db.config.js";
import Favoris_Repository from "./favoris.repository.js";

const findAll = async () => {
    const SELECT = "SELECT u.id, u.lastname, u.firstname, u.email, u.password, " +
        "COALESCE( " +
        "JSON_ARRAYAGG( " +
        "JSON_OBJECT( " +
        "'id', f.id," +
        "'title', f.title," +
        "'poster', f.poster," +
        "'releaseDate', f.releaseDate," +
        "'addedDate', f.addedDate," +
        "'genres', COALESCE(" +
        "JSON_ARRAYAGG(DISTINCT g.nom), JSON_ARRAY()" +
        "))), JSON_ARRAY()" +
        ") AS favoris, " +
        "u.role FROM Users AS u" +
        "LEFT JOIN Favorites fav ON fav.user_id = u.id " +
        "LEFT JOIN Films f ON f.id = fav.film_id " +
        "LEFT JOIN Film_Genre fg ON fg.film_id = f.id " +
        "LEFT JOIN Genres g ON g.id = fg.genre_id " +
        "GROUP BY u.id, f.id";
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
    const SELECT = "SELECT u.id, u.lastname, u.firstname, u.email, u.password, " +
        "COALESCE( " +
        "JSON_ARRAYAGG( " +
        "JSON_OBJECT( " +
        "'id', f.id," +
        "'title', f.title," +
        "'poster', f.poster," +
        "'releaseDate', f.releaseDate," +
        "'addedDate', f.addedDate," +
        "'genres', COALESCE(" +
        "JSON_ARRAYAGG(DISTINCT g.nom), JSON_ARRAY()" +
        "))), JSON_ARRAY()" +
        ") AS favoris, " +
        "u.role FROM Users AS u" +
        "LEFT JOIN Favorites fav ON fav.user_id = u.id " +
        "LEFT JOIN Films f ON f.id = fav.film_id " +
        "LEFT JOIN Film_Genre fg ON fg.film_id = f.id " +
        "LEFT JOIN Genres g ON g.id = fg.genre_id " +
        "WHERE u.id = ? " +
        "GROUP BY u.id, f.id";
    try {
        const resultat = await connection.query(SELECT, [id]);
        if (resultat[0].length > 0) {
            return {
                id: resultat[0][0].id,
                lastname: resultat[0][0].lastname,
                firstname: resultat[0][0].firstname,
                email: resultat[0][0].email,
                password: resultat[0][0].password,
                favoris: resultat[0][0].favoris,
                role: resultat[0][0].role
            };
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(error);
    }
}

const add = async (user) => {
    const INSERT = "INSERT INTO Users (lastname, firstname, email, password, role) VALUES (?, ?, ?, ?, 'ABONNE')";
    try {
        const resultat = await connection.query(INSERT, [user.lastname, user.firstname, user.email, user.password]);
        if (resultat[0].affectedRows > 0) {
            return resultat[0].affectedRows;
        } else {
            throw new Error("Le nouvel utilisateur n'a pas pu être poussé en base");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const updateById = async (id, user) => {
    const INSERT = "UPDATE Users SET lastname=? firstname=? email=? password=? WHERE id=?";
    try {
        const resultat = await connection.query(UPDATE, [user.lastname, user.firstname, user.email, user.password, id]);
        if (resultat[0].affectedRows > 0) {
            return resultat[0].affectedRows;
        } else {
            throw new Error("L'utilisateur n'a pas pu être mis à jour'");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const updateFavorisByUserId = async (id, favoris) => {
    try {
        const removeFavoris = await Favoris_Repository.removeByUserId(id);
        if (removeFavoris.affectedRows > 0) {
            const addNewFavoris = await Favoris_Repository.addMultiple(id, favoris);
            if (addNewFavoris.affectedRows > 0) {
                return resultat[0].affectedRows;
            } else {
                throw new Error("Problème lors de la modification des favoris");
            }
        } else {
            throw new Error("Problème lors de la modification des favoris");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const deleteById = async (id) => {
    const DELETE = `DELETE FROM Users WHERE id=?`;
    try {
        const deleted = await connection.query(DELETE, [id]);
        if (deleted[0].affectedRows > 0) {
            const deletedFavoris = await Favoris_Repository.removeByUserId(id);
            if (deletedFavoris[0].affectedRows > 0) {
                return deleted[0].affectedRows;
            } else {
                throw new Error("La suppression des favoris n'a pas pu être effectué");
            }
        } else {
            throw new Error("La suppression de l'utilisateur n'a pas pu être effectué");
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default { findAll, findById, add, updateById, updateFavorisByUserId, deleteById }