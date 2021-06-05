const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')

const props = dotenv.config()

const smsEngine = require('../engine/vaccineEngine')

const port = process.env.PORT || 8080
const version = process.env.VERSION || v1

const path = `/${version}`

const sms = express()

sms.use(bodyParser.urlencoded({extended:true}))
sms.use(bodyParser.json())

sms.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

sms.use(path, smsEngine)

sms.use('/', (req, res, next) => {
    res.send('<h3>CloudPro-Twilio SMS PoC landing page</h3>');
});

sms.listen(port)
