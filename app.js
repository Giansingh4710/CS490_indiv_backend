const express = require('express')
const app = express()
const connection = require('./assets/database.js')

const cors = require('cors')
const corsOptions = { origin: 'http://localhost:3000' }
app.use(cors(corsOptions))
app.use(express.json()) // needed to get body from POST request

app.get('/landing/top5movies', (req, res) => {
  // http://127.0.0.1:1313/landing/top5movies
  connection.query(
    'SELECT film.title,count(film.film_id) AS count from rental, inventory, film WHERE rental.inventory_id=inventory.inventory_id and film.film_id=inventory.film_id group by film.film_id order by count(film.film_id) DESC LIMIT 5;',
    (err, rows) => {
      if (err) throw err
      res.json(rows)
    }
  )
})

app.get('/landing/movieDetail', (req, res) => {
  // http://127.0.0.1:1313/landing/moiveDetail?movie=BUCKET BROTHERHOOD
  const movie = req.query.movie
  connection.query(`select * from film where title='${movie}'`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.get('/landing/top5actors', (req, res) => {
  // http://127.0.0.1:1313/landing/top5actors
  connection.query(
    'select actor.actor_id,first_name,last_name,count(actor.actor_id) as movies from actor,film_actor where actor.actor_id=film_actor.actor_id group by actor.actor_id order by count(actor.actor_id) DESC LIMIT 5;',
    (err, rows) => {
      if (err) throw err
      res.json(rows)
    }
  )
})

app.get('/landing/actorDetail', (req, res) => {
  // http://127.0.0.1:1313/landing/actorDetail?actor_id=42
  const actor_id = req.query.actor_id
  connection.query(
    `select count(film.film_id) as rented,film.title from film_actor,rental,inventory,film where rental.inventory_id=inventory.inventory_id and film.film_id=inventory.film_id and film_actor.film_id=film.film_id and film_actor.actor_id=${actor_id} group by film.film_id order by count(film.film_id) DESC LIMIT 5;`,
    (err, rows) => {
      if (err) throw err
      const data = {}
      const rented_movies = []
      for (let i = 0; i < rows.length; i++) {
        rented_movies.push(rows[i])
      }
      connection.query(
        `select * from actor where actor_id=${actor_id}`,
        (err, rows) => {
          if (err) throw err
          data['actor_detail'] = rows[0]
          data['rented_movies'] = rented_movies
          res.json(data)
        }
      )
    }
  )
})

app.get('/movies/search', (req, res) => {
  // http://127.0.0.1:1313/movies/search?type=film&search=BUCKET BROTHERHOOD
  const type = req.query.type // film,actor or genre
  const srch = req.query.search
  let queryStr
  if (type === 'film') {
    queryStr = `SELECT * FROM film WHERE title LIKE '%${srch}%'`
  } else if (type === 'actor') {
    queryStr = `SELECT DISTINCT film.* from film_actor, film, actor where (actor.first_name LIKE '%${srch}%' or actor.last_name LIKE '%${srch}%') and film_actor.actor_id=actor.actor_id and film_actor.film_id=film.film_id;`
  } else if (type === 'genre') {
    queryStr = `select film.* from film_category, category, film where film.film_id=film_category.film_id and category.category_id=film_category.category_id and category.name='${srch}'`
  }
  connection.query(queryStr, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.post('/movies/rent', (req, res) => {
  console.log(req.body)
  const { film_id, customer_id, store_id,staff_id } = req.body
  let query = `select rental.*,rental.inventory_id as c from inventory,rental where inventory.inventory_id=rental.inventory_id and rental.return_date IS NOT NULL and inventory.film_id=${film_id} and inventory.store_id=${store_id}`
  connection.query(query, (err, rows) => {
    if (err) throw err
    if (rows.length == 0) {
      res.json({ status: 'fail', message: 'This movie is not available' })
      return
    } // movie is not available
    const inventory_id = rows[0].inventory_id
    query = `INSERT INTO rental(rental_date, inventory_id, customer_id, staff_id) VALUES(NOW(), ${inventory_id}, ${customer_id}, ${staff_id})`
    res.json(rows)
    return 
  })
})

app.get('/customers/listAll', (req, res) => {
  // http://127.0.0.1:1313/customers/listAll
  connection.query('SELECT * from customer', (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.get('/customers/new', (req, res) => {
  // http://127.0.0.1:1313/customers/new?customer_id=1&store_id=1&first_name=Mary&last_name=Smith&email=mary.smith@sakila&address_id=1&active=1
  const i = req.query
  const queryStr = `INSERT into customer (customer_id, store_id, first_name, last_name, email,address_id,active) VALUES (${i.customer_id}, ${i.store_id}, '${i.first_name}', '${i.last_name}', '${i.email}','${i.address_id}',1)`
  connection.query(queryStr, (err, rows) => {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

app.get('/customers/update', (req, res) => {
  // http://127.0.0.1:1313/customers/update?customer_id=1&store_id=1&first_name=Mary&last_name=Smith&email=mary.smith@sakila&address_id=1&active=1
  const i = req.query
  const queryStr = `UPDATE customer set store_id =${i.store_id}, first_name= '${i.first_name}', last_name = '${i.last_name}',email='${i.email}',address_id=${i.address_id} where customer_id=${i.customer_id}`
  connection.query(queryStr, (err, rows) => {
    if (err) res.json(err)
    else res.json(rows)
  })
})

app.get('/customers/delete', (req, res) => {
  // http://127.0.0.1:1313/customers/delete?customer_id=602
  const i = req.query
  const queryStr = `UPDATE customer set active=0 where customer_id=${i.customer_id}`
  connection.query(queryStr, (err, rows) => {
    if (err) res.json(err)
    else res.json(rows)
  })
})

app.get('/customers/rented_movies', (req, res) => {
  // http://127.0.0.1:1313/customers/rented_movies?customer_id=1
  const i = req.query
  const queryStr = `select film.* from rental,inventory,film where customer_id=${i.customer_id} and rental.inventory_id=inventory.inventory_id and film.film_id=inventory.film_id;`
  connection.query(queryStr, (err, rows) => {
    if (err) res.json(err)
    else res.json(rows)
  })
})

app.get('/customers/movie_returned', (req, res) => {
  // http://127.0.0.1:1313/customers/movie_returned?customer_id=1&film_id=663
  const i = req.query
  const queryStr = `select return_date from inventory,rental where inventory.inventory_id=rental.inventory_id and rental.customer_id=${i.customer_id} and inventory.film_id=${i.film_id}`
  connection.query(queryStr, (err, rows) => {
    if (err) res.json(err)
    else res.json(rows)
  })
})

app.get('/pdfReport', (req, res) => {
  // http://127.0.0.1:1313/pdfReport?store_id=1
  const i = req.query
  const queryStr = `select * from customer where store_id=${i.store_id}`
  connection.query(queryStr, (err, rows) => {
    if (err) res.json(err)
    else res.json(rows)
  })
})

module.exports = app
