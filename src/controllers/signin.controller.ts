import authService from "../services/auth.service";

interface SigninPayload {
    Email: string;
    Password: string;
}

const SigninByEmail = async (payload: SigninPayload) => {
    return await authService.signinByEmail(payload);
};

export default { SigninByEmail };