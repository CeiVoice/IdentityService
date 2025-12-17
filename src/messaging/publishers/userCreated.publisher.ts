import getRabbitChannel from "../rabbit"
import { EXCHANGES, ROUNTING_KEYS } from '../event';
import router from "../../routes";
import { version } from "typescript";

const publishUserCreated= async (userId: string,email: string) =>{
    const channel = await getRabbitChannel()
    const event = {
        event: ROUNTING_KEYS.USER_CREATED,
        version:1,
        data: {userId, email}
    }
    channel.publish(EXCHANGES.IDENTITY,ROUNTING_KEYS.USER_CREATED,Buffer.from(JSON.stringify(event)),{persistent:true})
}

export default publishUserCreated