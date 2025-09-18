import connection from "../config/db.config.js";
import { DB_ERROR } from "../constantes/errors.js";

const add = async (favori) => {
    const INSERT = "INSERT INTO Favoris (userId, filmId) VALUES (?, ?)";
    try {
        const resultat = await connection.query(INSERT, [favori.userId, favori.filmId]);
        if (resultat[0].affectedRows > 0) {
            return resultat[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.ADD_FAVORIS);
        }
    } catch (error) {
        throw new Error(error);
    }
}

const addMultiple = async (userId, filmIds) => {
    const values = filmIds.map(filmId => [userId, filmId]);
    const INSERT = "INSERT INTO Favoris (userId, filmId) VALUES ?";
    try {
        const resultat = await connection.query(INSERT, [values]);
        if (resultat.affectedRows > 0) {
            return resultat.affectedRows;
        } else {
            throw new Error(DB_ERROR.ADD_MULTIPLE_FAVORIS);
        }
    } catch (error) {
        throw new Error(error);
    }
}

const removeByUserAndFilmId = async (userId, filmId) => {
    const DELETE = `DELETE FROM Favoris WHERE userId=? AND filmId=?`;
    try {
        const deleted = await connection.query(DELETE, [userId, filmId]);
        if (deleted[0].affectedRows > 0) {
            return deleted[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.DELETE_FAVORIS);
        }
    } catch (error) {
        throw new Error(error);
    }
}

const removeByUserId = async (id) => {
    const DELETE = `DELETE FROM Favoris WHERE userId=?`;
    try {
        const deleted = await connection.query(DELETE, [id]);
        if (deleted[0].affectedRows > 0) {
            return deleted[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.DELETE_FAVORIS);
        }
    } catch (error) {
        throw new Error(error);
    }
}

const removeByFilmId = async (id) => {
    const DELETE = `DELETE FROM Favoris WHERE filmId=?`;
    try {
        const deleted = await connection.query(DELETE, [id]);
        if (deleted[0].affectedRows > 0) {
            return deleted[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.DELETE_FAVORIS);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default { add, addMultiple, removeByUserId, removeByFilmId, removeByUserAndFilmId }