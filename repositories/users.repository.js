import connection from "../config/db.config.js";
import { DB_ERROR } from "../constantes/errors.js";
import Favoris_Repository from "./favoris.repository.js";

const findAll = async () => {
    const SELECT = `SELECT u.id, u.lastname, u.firstname, u.email, u.password,  +
        COALESCE(  +
        JSON_ARRAYAGG(  +
        JSON_OBJECT(  +
        'id', f.id, +
        'title', f.title, +
        'poster', f.poster, +
        'releaseDate', f.releaseDate, +
        'addedDate', f.addedDate, +
        'genres', COALESCE( +
        JSON_ARRAYAGG(DISTINCT g.nom), JSON_ARRAY() +
        ))), JSON_ARRAY() +
        ) AS favoris,  +
        u.role FROM Users AS u +
        LEFT JOIN Favorites fav ON fav.user_id = u.id  +
        LEFT JOIN Films f ON f.id = fav.film_id  +
        LEFT JOIN Film_Genre fg ON fg.film_id = f.id "+
        LEFT JOIN Genres g ON g.id = fg.genre_id  +
        GROUP BY u.id, f.id`;
    try {
        const resultat = await connection.query(SELECT);
        if (resultat[0].length > 0) {
            return resultat[0];
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(DB_ERROR.FIND_USERS);
    }
}

const findByEmail = async (email) => {
    const SELECT = `SELECT * FROM Users WHERE email=?`;
    try {
        const resultat = await connection.query(SELECT, [email]);
        if (resultat[0].length > 0) {
            return {
                id: resultat[0][0].id,
                lastname: resultat[0][0].lastname,
                firstname: resultat[0][0].firstname,
                email: resultat[0][0].email,
                password: resultat[0][0].password,
                role: resultat[0][0].role
            };
        } else {
            return 0;
        }
    } catch (error) {
        throw new Error(DB_ERROR.FIND_USER);
    }
}

const findById = async (id) => {
    const SELECT = `SELECT 
                    u.id, u.lastname, u.firstname, u.email, u.password, 
                    COALESCE(
                        JSON_ARRAYAGG(
                            CASE 
                                WHEN f.id IS NOT NULL THEN JSON_OBJECT(
                                    'id', f.id, 
                                    'title', f.title, 
                                    'poster', f.poster, 
                                    'description', f.description,
                                    'releaseDate', f.releaseDate, 
                                    'addedDate', f.addedDate, 
                                    'genres', fg.genres
                                )
                            END
                        ),
                        JSON_ARRAY()
                    ) AS favoris,
                    u.role
                FROM Users AS u
                LEFT JOIN Favoris fav ON fav.userId = u.id
                LEFT JOIN Films f ON f.id = fav.filmId
                LEFT JOIN (
                    SELECT fg.filmId, JSON_ARRAYAGG(g.name) AS genres
                    FROM Film_Genre AS fg
                    JOIN Genres g ON g.id = fg.genreId
                    GROUP BY fg.filmId
                ) AS fg ON fg.filmId = f.id
                WHERE u.id = ?
                GROUP BY u.id`;
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
        throw new Error(DB_ERROR.FIND_USER);
    }
}

const add = async (user) => {
    const INSERT = "INSERT INTO Users (lastname, firstname, email, password, role) VALUES (?, ?, ?, ?, 'ABONNE')";
    try {
        const resultat = await connection.query(INSERT, [user.lastname, user.firstname, user.email, user.password]);
        if (resultat[0].affectedRows > 0) {
            return resultat[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.ADD_USER);
        }
    } catch (error) {
        throw new Error(DB_ERROR.ADD_USER);
    }
}

const updateById = async (id, user) => {
    const UPDATE = "UPDATE Users SET lastname=?, firstname=?, email=?, password=? WHERE id=?";
    try {
        const resultat = await connection.query(UPDATE, [user.lastname, user.firstname, user.email, user.password, id]);
        if (resultat[0].affectedRows > 0) {
            return resultat[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.UPDATE_USER);
        }
    } catch (error) {
        throw new Error(DB_ERROR.UPDATE_USER);
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
                throw new Error(DB_ERROR.UPDATE_GENRE);
            }
        } else {
            throw new Error(DB_ERROR.UPDATE_GENRE);
        }
    } catch (error) {
        throw new Error(DB_ERROR.UPDATE_GENRE);
    }
}

const deleteById = async (id) => {
    const DELETE = `DELETE FROM Users WHERE id=?`;
    try {
        const deleted = await connection.query(DELETE, [id]);
        await Favoris_Repository.removeByUserId(id);
        if (deleted[0].affectedRows > 0) {
                return deleted[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.DELETE_USER);
        }
    } catch (error) {
        throw new Error(DB_ERROR.DELETE_USER);
    }
}

export default { findAll, findById, findByEmail, add, updateById, updateFavorisByUserId, deleteById }