// https://www.youtube.com/watch?v=SccSCuHhOw0&t=980s
const express = require('express')
const app = express()

// https://sentry.io/answers/why-does-my-javascript-code-receive-a-no-access-control-allow-origin-header-error-while-postman-does-not/
const cors = require('cors')
const corsOptions = {
  origin: 'http://127.0.0.1:8080',
}
app.use(cors(corsOptions))

app.listen(1313)
app.get('/', (req, res) => {
  res.json({
    msg: 'Hello World!',
  })
})
