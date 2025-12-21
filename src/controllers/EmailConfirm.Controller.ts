import Users from "../models/user";
import jwt from "jsonwebtoken";

interface TokenPayload {
    email: string;
    iat?: number;
    exp?: number;
}

const confirmEmail = async (payload: string) => {
    try {

        const decoded = jwt.verify(
            payload, 
            process.env.JWT_SECRET || "your-secret-key"
        ) as TokenPayload;

        if (!decoded || !decoded.email) {
            throw new Error("Invalid token payload");
        }

        const userdata = await Users.findUserByEmail(decoded.email);
        if (!userdata) {
            throw new Error("User not found");
        }

        if (userdata.EmailConfirm === true) {
            throw new Error("Email already confirmed");
        }

        const updated = await Users.updateUserById(userdata.id, { 
            EmailConfirm: true,EmailConfirmAt: new Date().toISOString() 
        });

        if (!updated) {
            throw new Error("Failed to update user");
        }

        return {
            success: true,
            message: "Email confirmed successfully",
            email: decoded.email
        };
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error(`Invalid token: ${error.message}`);
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Token has expired");
        }
        throw error;
    }
};

export default { confirmEmail };