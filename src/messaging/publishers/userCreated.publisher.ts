import getRabbitChannel from "../rabbit"
import { EXCHANGES, ROUNTING_KEYS } from '../event'

const publishUserCreated = async (userId: string, email: string, emailConfirmToken: string) => {
    try {
        const channel = await getRabbitChannel()

        const payload = { userId, email, emailConfirmToken }

        channel.publish(
            EXCHANGES.IDENTITY,
            ROUNTING_KEYS.USER_CREATED,
            Buffer.from(JSON.stringify(payload)),
            { persistent: true, mandatory: true }
        )

        await channel.waitForConfirms()

        console.log('User created event published (confirmed):', { userId, email })
    } catch (err) {
        console.error('Failed to publish user created event:', err)
        throw err
    }
}

export default publishUserCreated
