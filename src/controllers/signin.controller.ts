import Users from "../models/user";
import Profiles from "../models/profile";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
interface SigninPayload {
    Email: string;
    Password: string;
}

const SigninByEmail = async (payload:SigninPayload) =>{
    const {Email,Password} = payload

    if(!Email || !Password){
        throw new Error("Invalid Email or Password")
    }

    const account = await Users.findUserByEmail(Email)

    if(!account){
        throw new Error("Wrong Email or Password")
    }

    if(!await bcrypt.compare(Password, account.Password)) {
        throw new Error("Wrong Email or Password")
    }

    if(!account.EmailConfirm){
        throw new Error("Please verify your Email")
    }

    const profileData = await Profiles.findProfileById(account.ProfileId)

    const sessionToken = jwt.sign(
        { id: account.id, email: account.Email , Fname: profileData.Fname, Lname: profileData.Lname, Dept:profileData.DepartmentId}, 
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: '24h' }
    )

    return {
        token: sessionToken,
        cookieOptions: {
            httpOnly: true,
            sameSite: 'strict' as const,
            maxAge: 24 * 60 * 60 * 1000
        }
    }
}

export default {SigninByEmail};