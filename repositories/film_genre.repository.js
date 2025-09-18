import connection from "../config/db.config.js";
import { DB_ERROR } from "../constantes/errors.js";

const add = async (filmGenre) => {
    const INSERT = "INSERT INTO Film_Genre (genreId, filmId) VALUES (?, ?)";
    try {
        const resultat = await connection.query(INSERT, [filmGenre.genreId, filmGenre.filmId]);
        if(resultat[0].affectedRows > 0){
            return resultat[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.ADD_GENRE);
        }
    } catch (error) {
        throw new Error(error);
    }
}

const addMultiple = async (filmId, genreIds) => {
    const values = genreIds.map(genreId => [genreId, filmId]);
    
    const INSERT = "INSERT INTO Film_Genre (genreId, filmId) VALUES ?";
    try {
        const [resultat] = await connection.query(INSERT, [values]);
        if([resultat][0].affectedRows > 0){
            return true;
        } else {
            throw new Error(DB_ERROR.ADD_MULTIPLE_GENRES);
        }
    } catch (error) {
        throw new Error(error);
    }
}

const removeByFilmId = async (id) => {
    const DELETE = `DELETE FROM Film_Genre WHERE filmId=?`;
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

const removeByGenreId = async (id) => {
    const DELETE = `DELETE FROM Film_Genre WHERE filmId=?`;
    try {
        const deleted = await connection.query(DELETE, id);
        if (deleted[0].affectedRows > 0) {
            return deleted[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.DELETE_FAVORIS);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default { add, addMultiple, removeByFilmId, removeByGenreId }