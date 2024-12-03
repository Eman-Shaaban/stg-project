// Define "require"
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const Kafka = require('node-rdkafka')
const avro = require('avsc')

const type = avro.Type.forSchema({
    type: 'record',
    fields: [
        { name: 'action', type: 'string' },
        { name: 'video_id', type: 'string' }
    ]
})

const stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': process.env.KAFKA_URI
}, {}, {
    topic: process.env.KAFKA_USERS_TOPIC
})

stream.on('error', (err) => {
    console.error('Error in our kafka stream');
    console.error(err);
})


const kafkaMessage = (action) => {
    const success = stream.write(type.toString(action))
    if (success) {
        console.log(`message queued (${JSON.stringify(action)})`)
    } else {
        console.log('Too many messages in the queue already..')
    }
}

export default kafkaMessage