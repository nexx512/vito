const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const locale = require('./middleware/locale')

const app = express()

app.set('views', './views')
app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, 'views');

app.use(express.static('assets'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(locale())

require('./controller/home')(app)
require('./controller/heating')(app)
require('./controller/warmwater')(app)

app.listen(3001)
