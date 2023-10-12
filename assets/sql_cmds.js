module.exports = {
  top5movies: `SELECT film.title,count(film.film_id) AS count from rental, inventory, film 
    WHERE rental.inventory_id=inventory.inventory_id and film.film_id=inventory.film_id group 
    by film.film_id order by count(film.film_id) DESC LIMIT 5;`,
  movieDetail: (movie) => `select * from film where title='${movie}'`,
}
