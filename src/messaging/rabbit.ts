import amqp, { ConfirmChannel } from 'amqplib'
import { EXCHANGES } from './event'

let channel: ConfirmChannel | undefined

const getRabbitChannel = async () => {
    if (channel) {
        return channel
    }

    const conn = await amqp.connect(process.env.RABBITMQ_URL || "")

    channel = await conn.createConfirmChannel();

    channel.on('return', (msg) => {
        try {
            const payload = msg.content?.toString() || ''
            console.error('[RabbitMQ] Unroutable message returned', {
                exchange: msg.fields.exchange,
                routingKey: msg.fields.routingKey,
                payload
            })
        } catch (e) {
            console.error('[RabbitMQ] Unroutable message (failed to parse)')
        }
    })

    await channel.assertExchange(
        EXCHANGES.IDENTITY,
        'topic',
        { durable: true }
    )
    return channel;
}

export default getRabbitChannel