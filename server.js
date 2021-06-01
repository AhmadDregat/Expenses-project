const express = require('express')
const app = express()
const api = require('./server/routes/api')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expensesDB', { useNewUrlParser: true })
const bodyParser = require('body-parser')
const path = require('path')


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', api)
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))




const port = 8000
app.listen(port, function() {
    console.log(`Running on port ${port}`)
})