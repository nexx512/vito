const express = require('express')
const path = require('path')
const app = express()

app.set('views', './views')
app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, 'views');

app.use(express.static('assets'))

require('./controller/home')(app)
require('./controller/heating')(app)
require('./controller/warmwater')(app)

app.listen(3001)
