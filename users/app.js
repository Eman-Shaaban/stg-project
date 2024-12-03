// Define "require"
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import randomActions from './action.js'


const express = require('express')
const cluster = require('cluster')

if (cluster.isMaster) {
  const app = express()
  app.set('port', process.env.PORT || 3000)
  app.use(express.json())

  app.get('/', (req, res) => {
    res.send('Master is Running!')
  })

  app.post('/add-users', (req, res) => {
    const { num_of_users: numOfUsers } = req.body
    if (numOfUsers) {
      for (let i = 0; i < numOfUsers; i++) {
        cluster.fork()
      }
    } else {
      cluster.fork()
      res.send('Adding new user!')
    }
  })

  app.listen(app.get('port'), () => {
    console.info(`Users service Started at port: ${app.get('port')}`)
  })

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker with Process ID : ${worker.process.pid} died`)
  })
} else {
  const userId = cluster.worker.id
  console.log(`🟢 User ${userId} is connected!`)

  randomActions(cluster)
}
