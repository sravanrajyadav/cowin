run the application with following command

'npm start' which inturn triggers 'nodemon app.js' respective(sms/voice) js file

in app.js the default application is set trigger model/voice.js

nodemon({
    script: voiceScript,
    ext: 'js'
})

app.js Change to script: smsScript to trigger model/sms.js