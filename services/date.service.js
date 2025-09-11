import dayjs from "dayjs";
import "dayjs/locale/fr.js";

dayjs.locale("fr");

const formatterDateFilm = (films) => {
    let results = films;

    results.forEach(film => {
        film.releaseDate = dayjs(film.releaseDate).format("dddd D MMMM YYYY");
    });

    return results;
}

export default { formatterDateFilm }