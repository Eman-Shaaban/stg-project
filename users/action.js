// Define "require"
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import kafkaMessage from './kafka.js'

const Chance = require('chance')
const chance = new Chance()

const axios = require('axios')
const STREAMING_SERVER_URI = process.env.STREAMING_SERVER_URI || 5000

const randomActions = (cluster) => {
  const actions = [
    {
      action: 'play',
      video_id: chance.string({ length: 8, alpha: true, numeric: true }),
      duration: 5000
    },
    {
      action: 'stop',
      video_id: chance.string({ length: 8, alpha: true, numeric: true })
    },
    {
      action: 'exit'
    }
  ]

  const userId = cluster.worker.id
  setInterval(chooseAction, 10000) // runs every 10 sec

  async function chooseAction() {
    const choice = chance.pickone(actions)
    if (choice.action === 'exit') {
      cluster.worker.kill(userId) // it will stop the worker and also the interval
      console.log(`🛑 User ${userId} disconnected!`)
    } else {
      // Send action to the server
      const { data } = await axios.post(`${STREAMING_SERVER_URI}/action`, choice, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(`💡 User ${userId} is sending ${choice.action} event to streaming servers!`)
      console.log(`📩 Server: ${data}`)

      // Send events to kafka
      kafkaMessage(choice)
    }
  }
}

export default randomActions
