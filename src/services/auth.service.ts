import Users from "../models/user";
import Profiles from "../models/profile";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface SigninPayload {
    Email: string;
    Password: string;
}

const signinByEmail = async (payload: SigninPayload) => {
    const { Email, Password } = payload;

    if (!Email || !Password) {
        throw new Error("Invalid Email or Password");
    }

    const account = await Users.findUserByEmail(Email);

    if (!account) {
        throw new Error("Wrong Email or Password");
    }

    if (!await bcrypt.compare(Password, account.Password)) {
        throw new Error("Wrong Email or Password");
    }

    if (!account.EmailConfirm) {
        throw new Error("Please verify your Email");
    }

    const profileData = await Profiles.findProfileById(account.ProfileId);

    const sessionToken = jwt.sign(
        { id: account.id, email: account.Email, Fname: profileData.Fname, Lname: profileData.Lname, Dept: profileData.DepartmentId },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: '24h' }
    );

    return {
        token: sessionToken,
        cookieOptions: {
            httpOnly: true,
            sameSite: 'strict' as const,
            maxAge: 24 * 60 * 60 * 1000
        }
    };
};

const signinByGoogle = async (idToken: string) => {
    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
        throw new Error("Invalid Google token");
    }

    const { email, given_name = "", family_name = "", sub: googleId } = payload;

    let account = await Users.findUserByEmail(email);

    if (account) {
        // Link Google SSO to existing account if not already linked
        if (!account.IsSSO) {
            await Users.updateUserById(account.id, {
                IsSSO: true,
                MetaDataSSO: { provider: "google", googleId },
            });
        }
    } else {
        // Create new profile + user
        const profile = await Profiles.createProfile({
            Fname: given_name,
            Lname: family_name,
        });

        account = await Users.createUser({
            Email: email,
            Password: "",
            EmailConfirm: true,
            IsSSO: true,
            MetaDataSSO: { provider: "google", googleId },
            IsSuperAdmin: false,
            ProfileId: profile.id,
            IsBanned: false,
            EmailConfirmToken: "",
        });
    }

    const profileData = await Profiles.findProfileById(account.ProfileId);

    const sessionToken = jwt.sign(
        { id: account.id, email: account.Email, Fname: profileData.Fname, Lname: profileData.Lname, Dept: profileData.DepartmentId },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
    );

    return {
        token: sessionToken,
        cookieOptions: {
            httpOnly: true,
            sameSite: "strict" as const,
            maxAge: 24 * 60 * 60 * 1000,
        },
    };
};

export default { signinByEmail, signinByGoogle };
