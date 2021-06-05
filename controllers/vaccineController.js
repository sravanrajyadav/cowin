const fs = require('fs')
const http = require("http")
const axios = require('axios')
const dotenv = require('dotenv')
const twilio = require('twilio')
const moment = require('moment')
const HashMap = require('hashmap')
const express = require('express')
const bodyParser = require('body-parser')
const MessagingResponse = twilio.twiml.MessagingResponse

let date = moment(Date.now()).format('DD-MM-YYYY')

let districts = [247]

const app = express()
const props = dotenv.config()

var map = new HashMap()
map.set(247, "East Singhbhum")

if (props.error) {
    console.log("Error parsing .env file")
}

//console.log(props.parsed);
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

let twilioSID = accountSid.substring(0, 5) + accountSid.substring(5, accountSid.length - 5).replace(/./g, "*") + accountSid.substring(accountSid.length - 5)
let twilioToken = authToken.substring(0, 5) + authToken.substring(5, authToken.length - 5).replace(/./g, "*") + authToken.substring(authToken.length - 5)

const client = new twilio(accountSid, authToken)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//POST @sendSMS //Send SMS
exports.checkD1Slots = (req, res) => {
    req.setTimeout(30000, () => {
        console.log('Timeout')
    });
    
    const bookingURL = 'https://selfregistration.cowin.gov.in/'
    for (let d = 0; d < districts.length; d++) {
        
        let config = {
            method: 'get',
            url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' + districts[d] + '&date=' + date,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
            }
        }

        axios(config)
            .then(function (response) {
                let jsonData = response.data
                let vaccineDetails = ''
                let vaccine = ''
                let fee = 'NA'
                console.log('Vaccine search is on for dose 1 in '+map.get(districts[d])+' district')
                for (let i = 0; i < jsonData.centers.length; i++) {
                    let centers = jsonData.centers[i]
                    let center_name = centers.name
                    let pincode = centers.pincode
                    for (let j = 0; j < centers.sessions.length; j++) {
                        let dose_1 = centers.sessions[j]["available_capacity_dose1"]
                        let dose_2 = centers.sessions[j]["available_capacity_dose2"]
                        let session_id = centers.sessions[j]["session_id"]
                        let age = centers.sessions[j]["min_age_limit"]
                        let dates = centers.sessions[j]["date"]
                        let slots = centers.sessions[j]["slots"].length
                        let slot = JSON.stringify(centers.sessions[j]["slots"][slots - 1])

                        if (centers.vaccine_fees != null) {
                            for (let k = 0; k < centers.vaccine_fees.length; k++) {
                                vaccine = centers.vaccine_fees[k]["vaccine"]
                                fee = centers.vaccine_fees[k]["fee"]
                            }
                        }

                        if (dose_1 > 10 && age === 18) {
                            vaccineDetails += "Dose 1: " + dose_1 + "(Dose available), Age:" + age + "+, Vaccine:" + vaccine + ", Fee:" + fee + ", Center:" + center_name + ", Pincode:" + pincode + ", Slot:" + slot + ", Date:" + dates + ", Booking Link: " + bookingURL + "\n"
                            console.log('Vaccines available for Dose 1 of 18+ at '+map.get(districts[d]) +" : "+ vaccineDetails)
                        }
                        // else if(dose_2 > 0 && age === 18){
                        //     vaccineDetails += "Dose 2: " +dose_2+ "(Dose available), Age:" + age + "+, Vaccine:" + vaccine + ", Fee:" + fee + ", Center:" + center_name +", Pincode:" + pincode +", Slot:"+slot+", Date:" + dates + ", Booking Link: " + bookingURL + "\n"
                        //     console.log('Vaccines available for Dose 2 of 18+ at '+map.get(districts[d]) +" : "+ vaccineDetails)
                        // }
                    }
                }
                /////////////////////////////Send SMS using Twilio SMS API/////////////////////////////////
                client.messages.create({
                    body: vaccineDetails,
                    to: '+16094394334',
                    from: '+17242020299'
                }).then((message) => {
                    console.log("Message : " + message.status)
                    res.status(201).json(message)
                })

            })
            .catch(function (error) {
                console.log(error)
            });
    }
}

exports.checkD2Slots = (req, res) => {
    req.setTimeout(30000, () => {
        console.log('Timeout')
    });
    console.log('Requested @ ' + moment().format('YYYY-MM-DDTHH:mm') + ', Checking for Covid-19 Vaccine availability for Dose 2.')
    for (let d = 0; d < districts.length; d++) {
        const bookingURL = 'https://selfregistration.cowin.gov.in/'
        let config = {
            method: 'get',
            url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' + districts[d] + '&date=' + date,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
            }
        }

        axios(config).then(function (response) {
            let jsonData = response.data
            let vaccineDetails = ''
            let vaccine = ''
            let fee = 'NA'
            console.log('Vaccine search is on for dose 1 in '+map.get(districts[d])+' district')
            for (let i = 0; i < jsonData.centers.length; i++) {
                let centers = jsonData.centers[i]
                let center_name = centers.name
                let pincode = centers.pincode

                for (let j = 0; j < centers.sessions.length; j++) {
                    let dose_2 = centers.sessions[j]["available_capacity_dose2"]
                    let age = centers.sessions[j]["min_age_limit"]
                    let dates = centers.sessions[j]["date"]
                    let slots = centers.sessions[j]["slots"].length
                    let slot = JSON.stringify(centers.sessions[j]["slots"][slots - 1])

                    if (centers.vaccine_fees != null) {
                        for (let k = 0; k < centers.vaccine_fees.length; k++) {
                            vaccine = centers.vaccine_fees[k]["vaccine"]
                            fee = centers.vaccine_fees[k]["fee"]
                        }
                    }

                    if (dose_2 > 0 && age === 45) {
                        vaccineDetails += "Dose 2: " + dose_2 + "(Dose available), Age:" + age + "+, Vaccine:" + vaccine + ", Fee:" + fee + ", Center:" + center_name + ", Pincode:" + pincode + ", Slot:" + slot + ", Date:" + dates + ", Booking Link: " + bookingURL + "\n"
                        console.log('Vaccine available for Dose 2 of 45+ at '+map.get(districts[d])+' : ' + vaccineDetails)
                    }
                }
            }
            /////////////////////////////Send SMS using Twilio SMS API/////////////////////////////////
            client.messages.create({
                body: vaccineDetails,
                to: '+16094394334',
                from: '+17242020299'
            }).then((message) => {
                console.log("Message : " + message.status)
                res.status(201).json(message)
            })

        }).catch(function (error) {
            console.log(error)
        });
    }
}