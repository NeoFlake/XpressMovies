import connection from "../config/db.config.js";
import { DB_ERROR } from "../constantes/errors.js";
import Film_Genre_Repository from "./film_genre.repository.js";

const findAll = async () => {
    const SELECT = `SELECT f.id, f.title, f.poster, f.releaseDate, f.description,
        f.addedDate, f.adminId, COALESCE(JSON_ARRAYAGG(g.name), JSON_ARRAY()) AS genres FROM Films AS f  
        LEFT JOIN Film_Genre fg ON f.id = fg.filmId  
        LEFT JOIN Genres g ON g.id = fg.genreId
        GROUP BY f.id`;
    try {
        const resultat = await connection.query(SELECT);
        if (resultat[0].length > 0) {
            return resultat[0];
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(DB_ERROR.FIND_FILMS);
    }
}

const existByTitle = async (title) => {
    const SELECT = "SELECT * FROM Films WHERE title=?";
    let result = false;
    try {
        const finded = await connection.query(SELECT, [title]);
        if (finded[0].length > 0) {
            result = true;
        }
        return result;
    } catch (error) {
        throw new Error(DB_ERROR.FIND_FILM);
    }
}

const findById = async (id) => {
    const SELECT = `SELECT f.id, f.title, f.poster, f.releaseDate, f.description,
        f.addedDate, u.lastname AS admin, COALESCE(JSON_ARRAYAGG(g.name), JSON_ARRAY()) AS genres FROM Films AS f  
        LEFT JOIN Film_Genre fg ON f.id = fg.filmId  
        LEFT JOIN Genres g ON g.id = fg.genreId  
        JOIN Users u ON f.adminId = u.id  
        WHERE f.id=?  
        GROUP BY f.id`;
    try {
        const resultat = await connection.query(SELECT, [id]);
        if (resultat[0].length > 0) {
            return {
                id: resultat[0][0].id,
                title: resultat[0][0].title,
                poster: resultat[0][0].poster,
                releaseDate: resultat[0][0].releaseDate.toISOString().split("T")[0],
                addedDate: resultat[0][0].addedDate,
                admin: resultat[0][0].admin,
                genres: resultat[0][0].genres,
                description: resultat[0][0].description
            };
        } else {
            throw new Error(DB_ERROR.NO_FILM_BY_ID);
        }
    } catch (error) {
        if (error.message !== DB_ERROR.NO_FILM_BY_ID) {
            throw new Error(DB_ERROR.FIND_FILM);
        } else {
            throw new Error(error.message);
        }
    }
}

const findLikeByTitle = async (title) => {
    const SELECT = `SELECT f.id, f.title, f.poster, f.releaseDate, f.description,
        f.addedDate, u.lastname AS admin, COALESCE(JSON_ARRAYAGG(g.name), JSON_ARRAY()) AS genres FROM Films AS f  
        LEFT JOIN Film_Genre fg ON f.id = fg.filmId  
        LEFT JOIN Genres g ON g.id = fg.genreId  
        JOIN Users u ON f.adminId = u.id  
        WHERE f.title LIKE ?  
        GROUP BY f.id`;
    try {
        const resultat = await connection.query(SELECT, [`%${title}%`]);
        if (resultat[0].length > 0) {
            return resultat[0];
        } else {
            throw new Error(DB_ERROR.NO_FILM_BY_ID);
        }
    } catch (error) {
        if (error.message !== DB_ERROR.NO_FILM_BY_ID) {
            throw new Error(DB_ERROR.FIND_FILM);
        } else {
            throw new Error(error.message);
        }
    }
}

const add = async (film) => {
    const INSERT = "INSERT INTO Films (title, poster, releaseDate, description, addedDate, adminId) VALUES (?, ?, ?, ?, NOW(), ?)";
    try {

        const resultat = await connection.query(INSERT, [film.title, film.poster, film.releaseDate, film.description, film.adminId]);
        if (resultat[0].affectedRows > 0) {
            const genres = await Film_Genre_Repository.addMultiple(resultat[0].insertId, film.genres);
            if (genres) {
                return true;
            } else {
                throw new Error(DB_ERROR.ADD_FILM);
            }
        } else {
            throw new Error(DB_ERROR.ADD_FILM);
        }
    } catch (error) {
        throw new Error(DB_ERROR.ADD_FILM);
    }
}

const updateById = async (id, film) => {
    const UPDATE = "UPDATE Films SET title=?, poster=?, releaseDate=?, description=?, addedDate=?, adminId=? WHERE id=?";
    try {
        const resultat = await connection.query(UPDATE, [film.title, film.poster, film.releaseDate, film.description, film.addedDate, film.adminId, id]);
        if (resultat[0].affectedRows > 0) {
            const removeGenres = await Film_Genre_Repository.removeByFilmId(film.id);
            if (removeGenres > 0) {
                const addNewGenres = await Film_Genre_Repository.addMultiple(film.id, film.genres);
                if (addNewGenres > 0) {
                    return resultat[0].affectedRows;
                } else {
                    throw new Error(DB_ERROR.UPDATE_FILM);
                }
            } else {
                throw new Error(DB_ERROR.UPDATE_FILM);
            }
        } else {
            throw new Error(DB_ERROR.UPDATE_FILM);
        }
    } catch (error) {
        throw new Error(DB_ERROR.UPDATE_FILM);
    }
}

const deleteById = async (id) => {
    const DELETE = `DELETE FROM Films WHERE id=?`;
    try {
        const deleted = await connection.query(DELETE, [id]);
        if (deleted[0].affectedRows > 0) {
            const deletedFilmGenres = await Film_Genre_Repository.removeByFilmId(id);
            if (deletedFilmGenres[0].affectedRows > 0) {
                return deleted[0].affectedRows;
            } else {
                throw new Error(DB_ERROR.DELETE_FILM);
            }
        } else {
            throw new Error(DB_ERROR.DELETE_FILM);
        }
    } catch (error) {
        throw new Error(DB_ERROR.DELETE_FILM);
    }
}

export default { findAll, findById, existByTitle, findLikeByTitle, add, updateById, deleteById }