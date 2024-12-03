const express = require('express')
const kafkaMessage = require('./kafka')

const app = express()
app.set('port', process.env.PORT || 5000)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Streaming Server is Running!')
})

app.post('/action', (req, res) => {
  const payload = req.body
  const action = payload.action
  let serverAction

  if (action === "play") {
    serverAction = {
      "action": "Playing video",
      "video_id": payload.video_id
    }

    kafkaMessage(serverAction)
  } else if (action === "stop") {
    serverAction = {
      "action": "Stopping video",
      "video_id": payload.video_id
    }
    
    kafkaMessage(serverAction)
  } else {
    console.log("I got unknown action!")
  }
  res.send(`I got the action: ${action}`)
})

app.listen(app.get('port'), () => {
  console.info(`Streaming Server Started at port: ${app.get('port')}`)
})