const ngrok = require('ngrok')
const dotenv = require('dotenv')
const nodemon = require('nodemon')

const props = dotenv.config()

if (props.error) {
    console.log("Error parsing .env file")
}

//console.log(props.parsed)
const port = process.env.PORT || 8080

let url = null
let smsScript = 'model/vaccineModel.js'

nodemon({
    //script: voiceScript,
    script: smsScript,
    ext: 'js'
})

nodemon.on('start', async () => {
    if (!url) {
        url = await ngrok.connect({ port: port })
        console.log(`Application server started and publicly available on : ${url}`)
    }
}).on('quit', async () => {
    await ngrok.kill()
})