import connection from "../config/db.config.js";
import { DB_ERROR } from "../constantes/errors.js";

const findAll = async () => {
    const SELECT = "SELECT * FROM Genres";
    try {
        const resultat = await connection.query(SELECT);
        if (resultat[0].length > 0) {
            return resultat[0];
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(DB_ERROR.FIND_GENRES);
    }
}

const findById = async (id) => {
    const SELECT = "SELECT * FROM Genres WHERE id=?"; 
    try {
        const resultat = await connection.query(SELECT, [id]);
        if (resultat[0].length > 0) {
            return {
                id: resultat[0][0].id,
                name: resultat[0][0].name
            };
        } else {
            throw new Error(DB_ERROR.FIND_GENRE);
        }
    } catch (error) {
        throw new Error(DB_ERROR.FIND_GENRE);
    }
}

const nameAlreadyKnown = async (name) => {
    const SELECT = "SELECT * FROM Genres WHERE name=?";
    let result = false;
    try {
        const resultat = await connection.query(SELECT, [name]);
        if (resultat[0].length > 0) {
            result = true;
        } 
    } catch (error) {
        throw new Error(DB_ERROR.FIND_GENRE);
    }
    return result;
}

const add = async (name) => {
    const INSERT = "INSERT INTO Genres (name) VALUES (?)";
    try {
        const resultat = await connection.query(INSERT, [name]);
        if(resultat[0].affectedRows > 0){
            return resultat[0].affectedRows;
        } else {
            throw new Error(DB_ERROR.ADD_GENRE);
        }
    } catch (error) {
        throw new Error(DB_ERROR.ADD_GENRE);
    }
}

const updateById = async (id, genre) => {
    const UPDATE = `UPDATE Genres SET name=? WHERE id=?`;
    try {
        const update = await connection.query(UPDATE, [genre.name, id]);
        if(update[0].affectedRows > 0){
            return true;
        } else {
            throw new Error(DB_ERROR.UPDATE_GENRE);
        }
    } catch (error) {
        throw new Error(DB_ERROR.UPDATE_GENRE);
    }
}

const deleteById = async (id) => {
    const DELETE = `DELETE FROM Genres WHERE id=?`;
    try {
        const deleted = await connection.query(DELETE, id);
        if (deleted[0].affectedRows > 0) {
            return true;
        } else {
            throw new Error(DB_ERROR.DELETE_GENRE);
        }
    } catch (error) {
        throw new Error(DB_ERROR.DELETE_GENRE);
    }
}

export default { findAll, findById, nameAlreadyKnown, add, updateById, deleteById }