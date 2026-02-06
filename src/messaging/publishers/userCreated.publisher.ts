import getRabbitChannel from "../rabbit"
import { EXCHANGES, ROUNTING_KEYS } from '../event'
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path"

const privateKey = fs.readFileSync(
  path.join(process.cwd(), "secrets", "identity_private_key.pem"),
  "utf8"
)

const publishUserCreated = async (userId: string,email: string,emailConfirmToken: string) => {
    try {
        const channel = await getRabbitChannel()

        const event = {
        service: "identity_service",
        event: ROUNTING_KEYS.USER_CREATED,
        version: 1,
        data: { userId, email, emailConfirmToken },
        ts: Date.now()
        }

        const token = jwt.sign(event, privateKey, {
        algorithm: "RS256",
        expiresIn: "30m",
        keyid: "identity-v1"
        })

        channel.publish(EXCHANGES.IDENTITY,ROUNTING_KEYS.USER_CREATED,Buffer.from(JSON.stringify({ token })),
        { persistent: true, mandatory: true }
        )

        await channel.waitForConfirms()

        console.log('User created event published (confirmed):',{ userId, email })
    } catch (err) {
        console.error('Failed to publish user created event:',err)
        throw err
    }
}

export default publishUserCreated
