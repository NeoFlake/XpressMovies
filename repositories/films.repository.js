import connection from "../config/db.config.js";
import Film_Genre_Repository from "./film_genre.repository.js";

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
    const INSERT = "INSERT INTO Films (title, poster, releaseDate, addedDate, adminId) VALUES (?, ?, ?, NOW(), ?)";
    try {
        const resultat = await connection.query(INSERT, [film.title, film.poster, film.releaseDate, film.adminId]);
        if (resultat[0].affectedRows > 0) {
            const genres = await Film_Genre_Repository.addMultiple(resultat[0].insertId, film.genres);
            if (genres[0].affectedRows > 0) {
                return resultat[0].affectedRows;
            } else {
                throw new Error("Problème lors de l'insertion des genres du film");
            }
        } else {
            throw new Error("Le nouveau film n'a pas pu être posté en base");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const updateById = async (id, film) => {
    const INSERT = "UPDATE Films SET title=? poster=? releaseDate=? WHERE id=?";
    try {
        const resultat = await connection.query(UPDATE, [film.title, film.poster, film.releaseDate, id]);
        if (resultat[0].affectedRows > 0) {
            const removeGenres = await Film_Genre_Repository.removeByFilmId(film.id);
            if (removeGenres.affectedRows > 0) {
                const addNewGenres = await Film_Genre_Repository.addMultiple(film.id, film.genres);
                if (addNewGenres.affectedRows > 0) {
                    return resultat[0].affectedRows;
                } else {
                    throw new Error("Les nouveaux genres du film n'ont pas pu être insérés");
                }
            } else {
                throw new Error("Problème lors de l'insertion des genres du film");
            }
        } else {
            throw new Error("Le nouveau film n'a pas pu être posté en base");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const deleteById = async (id) => {
    const DELETE = `DELETE FROM Films WHERE id=?`;
    try {
        const deleted = await connection.query(DELETE, id);
        if (deleted[0].affectedRows > 0) {
            const deletedFilmGenres = await Film_Genre_Repository.removeByFilmId(id);
            if (deletedFilmGenres[0].affectedRows > 0) {
                return deleted[0].affectedRows;
            } else {
                throw new Error("La suppression des genres du film n'a pas pu être effectué");
            }
        } else {
            throw new Error("La suppression du film n'a pas pu être effectué");
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default { findAll, findById, add, updateById, deleteById }