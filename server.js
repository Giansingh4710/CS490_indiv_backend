// https://www.youtube.com/watch?v=SccSCuHhOw0&t=980s
const connection = require('./database')
const express = require('express')
const app = express()
app.listen(1313)

// https://sentry.io/answers/why-does-my-javascript-code-receive-a-no-access-control-allow-origin-header-error-while-postman-does-not/
const cors = require('cors')
const corsOptions = {
  origin: 'http://127.0.0.1:8080',
}
app.use(cors(corsOptions))

app.get('/test', (req, res) => {
  res.json({
    msg: 'Hello World!',
  })
  console.log('Hello World! Sent from server')
  // connection.query('select * from actor', (err, rows) => {
  //   if (err) throw err
  //   for (let i = 0; i < rows.length; i++) {
  //     console.log(rows[i].first_name, rows[i].last_name)
  //   }
  // })
})
