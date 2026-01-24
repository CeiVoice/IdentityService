import emailService from "../services/email.service";

const confirmEmail = async (payload: string) => {
    return await emailService.confirmEmail(payload);
};

export default { confirmEmail };