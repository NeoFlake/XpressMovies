import connection from "../config/db.config.js";

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
        throw new Error(error);
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
            throw new Error("Aucun genre n'a été trouvé avec cet identifiant");
        }
    } catch (error) {
        throw new Error(error);
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
        throw new Error(error);
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
            throw new Error("Le nouveau genre n'a pas été posté en base");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const updateById = async (id, genre) => {
    const UPDATE = `UPDATE Genres SET name=? WHERE id=?`;
    try {
        const update = await connection.query(UPDATE, [genre.name, id]);
        if(update[0].affectedRows > 0){
            return true;
        } else {
            throw new Error("Le genre n'a pas été modifié en base");
        }
    } catch (error) {
        throw new Error(error);
    }
}

const deleteById = async (id) => {
    const DELETE = `DELETE FROM Genres WHERE id=?`;
    try {
        const deleted = await connection.query(DELETE, id);
        if (deleted[0].affectedRows > 0) {
            return true;
        } else {
            throw new Error("La suppression du genre n'a pas pu être effectué");
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default { findAll, findById, nameAlreadyKnown, add, updateById, deleteById }