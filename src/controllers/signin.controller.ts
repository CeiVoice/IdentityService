import authService from "../services/auth.service";

interface SigninPayload {
    Email: string;
    Password: string;
}

const SigninByEmail = async (payload: SigninPayload) => {
    return await authService.signinByEmail(payload);
};

const SigninByGoogle = async (idToken: string) => {
    return await authService.signinByGoogle(idToken);
};

export default { SigninByEmail, SigninByGoogle };