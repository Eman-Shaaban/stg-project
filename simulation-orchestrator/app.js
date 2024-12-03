const express = require('express')
const errorHandler = require('./config')

const axios = require('axios')
const USERS_URI = process.env.USERS_URI || 3000

const app = express()

app.set('port', process.env.PORT || 4000)
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Simulation orchestrator is Running!')
})

app.post('/generate-users', (req, res) => {
    const { wave_height: height, wave_width: width } = req.body

    const f = width / height // frequency, How many cycle per sec
    const oneCycle = 2 * Math.PI
    let initialHeight = 1

    if (height && width) {
        setInterval(generate, 10000) // generates users every 10 seconds

        res.send(`Generating users...`)
    } else {
        res.send(`Please set the wave_width and the wave height!`)
    }



    function generate() {
        if (initialHeight <= height) {
            const numOfUsers = parseInt(Math.abs(height * Math.sin(oneCycle * f * initialHeight)))  // number of users to be generated
            console.log(`💡 Generating ${numOfUsers} users!`)

            const payload = {
                num_of_users: numOfUsers
            }

            // calling users api to generate users
            axios.post(`${USERS_URI}/add-users`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            initialHeight++
        } else {
            initialHeight = 1
        }
    }
})

app.use(errorHandler)

app.listen(app.get('port'), () => {
    console.info(`Simulation orchestrator started at port: ${app.get('port')}`)
})
