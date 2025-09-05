import connection from "../config/db.config.js";

const add = async (filmGenre) => {
    const INSERT = "INSERT INTO Film_Genre (genreId, filmId) VALUES (?, ?)";
    try {
        const resultat = await connection.query(INSERT, [filmGenre.genreId, filmGenre.filmId]);
        if(resultat[0].affectedRows > 0){
            return resultat[0].affectedRows;
        } else {
            throw new Error("Le nouveau genre n'a pas été posté en base");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const addMultiple = async (filmId, genreIds) => {
    const values = genreIds.map(genreId => [genreId, filmId]);
    const INSERT = "INSERT INTO Film_Genre (genreId, filmId) VALUES ?";
    try {
        const resultat = await connection.query(INSERT, [values]);
        if(resultat.affectedRows > 0){
            return resultat.affectedRows;
        } else {
            throw new Error("Les nouveaux genres n'ont pas étés postés en base");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const removeByFilmId = async (idFilm) => {
    const DELETE = `DELETE FROM Film_Genre WHERE filmId=?`;
    try {
        const deleted = await connection.query(DELETE, idFilm);
        if (deleted[0].affectedRows > 0) {
            return deleted[0].affectedRows;
        } else {
            throw new Error("La suppression n'a pas pu être effectué");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const removeByGenreId = async (idGenre) => {
    const DELETE = `DELETE FROM Film_Genre WHERE filmId=?`;
    try {
        const deleted = await connection.query(DELETE, idGenre);
        if (deleted[0].affectedRows > 0) {
            return deleted[0].affectedRows;
        } else {
            throw new Error("La suppression n'a pas pu être effectué");
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default { add, addMultiple, removeByFilmId, removeByGenreId }