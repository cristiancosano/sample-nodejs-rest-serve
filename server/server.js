const express = require('express')
const app = express()
const colors = require('colors')
const mongoose = require('mongoose')
const path = require('path')
const routes = require('./routes')
const config = require('./config/config')


app.use(express.json()) // support json encoded bodies
app.use(express.urlencoded({ extended: true })); 


app.use(express.static(path.resolve(__dirname,'../public')))

app.use('/', routes)


mongoose.connect(process.env.URL_DB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}, (err) => {
    console.log('[mongodb] MongoDB connection successfull'.green)
});

app.listen(process.env.PORT, () => console.log(`[server] Server listen on port ${ colors.yellow(process.env.PORT) }`))