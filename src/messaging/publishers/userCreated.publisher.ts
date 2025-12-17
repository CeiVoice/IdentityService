import getRabbitChannel from "../rabbit"
import { EXCHANGES, ROUNTING_KEYS } from '../event';

const publishUserCreated = async (userId: string, email: string) => {
    try {
        const channel = await getRabbitChannel()
        const event = {
            event: ROUNTING_KEYS.USER_CREATED,
            version: 1,
            data: { userId, email }
        }
        
        channel.publish(
            EXCHANGES.IDENTITY,
            ROUNTING_KEYS.USER_CREATED,
            Buffer.from(JSON.stringify(event)),
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