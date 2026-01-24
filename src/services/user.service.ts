import Users from "../models/user";
import Profiles from "../models/profile";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface SignupPayload {
    Fname: string;
    Lname: string;
    Email: string;
    Password: string;
}

const signupByEmail = async (payload: SignupPayload) => {
    const { Email, Password, Fname, Lname = null } = payload;

    if (!Email || !Password || !Fname || !Lname) {
        throw new Error("Missing required fields: Email, Password, Fname, Lname");
    }

    const email = Email.trim().toLowerCase();
    const fname = Fname.trim();
    const lname = Lname.trim();

    const exitedemail = await Users.findUserByEmail(email);

    if (exitedemail) {
        throw new Error("This Email already Sign up");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const EmailConfirmToken = jwt.sign(
        { email: email },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: '24h' }
    );

    const profile = await Profiles.createProfile({ Fname: fname, Lname: lname });

    const user = await Users.createUser({
        Email: email,
        Password: hashedPassword,
        EmailConfirm: false,
        IsSSO: false,
        MetaDataSSO: null,
        LastSignin: null,
        IsSuperAdmin: false,
        ProfileId: profile.id,
        IsBanned: false,
        EmailConfirmToken: EmailConfirmToken,
    });

    return { user, profile, EmailConfirmToken };
};

export default { signupByEmail };
