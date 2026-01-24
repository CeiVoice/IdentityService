import userService from "../services/user.service";
import publishUserCreated from "../messaging/publishers/userCreated.publisher";

interface SignupPayload {
    Fname: string;
    Lname: string;
    Email: string;
    Password: string;
}

const SignupByEmail = async (payload: SignupPayload) => {
    const result = await userService.signupByEmail(payload);
    
    publishUserCreated(result.user.id.toString(), result.user.Email, result.EmailConfirmToken).catch(err => {
        console.error("Failed to publish user.create", err);
    });
    
    return result;
};

export default { SignupByEmail };