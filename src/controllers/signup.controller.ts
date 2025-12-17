import Users from "../models/user";
import Profiles from "../models/profile";
import bcrypt from "bcrypt";
import publishUserCreated from "../messaging/publishers/userCreated.publisher"; 

interface SignupPayload {
    Fname: string;
    Lname: string;
    Email: string;
    Password: string;
    DepartmentId?: string | null;
}

const SignupByEmail = async (payload: SignupPayload) => {
    const { Email, Password, Fname, Lname, DepartmentId = null } = payload;

    if (!Email || !Password || !Fname || !Lname) {
        throw new Error("Missing required fields: Email, Password, Fname, Lname");
    }


    const email = Email.trim().toLowerCase();
    const fname = Fname.trim();
    const lname = Lname.trim();


    const exitedemail = await Users.findUserByEmail(email)

    if (exitedemail){
        throw new Error("This Email already Sign up")
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const profile = await Profiles.createProfile({ Fname: fname, Lname: lname, DepartmentId });

    const user = await Users.createUser({
        Email: email,
        Password: hashedPassword,
        EmailConfirm: false,
        EmailConfirmAt: null,
        IsSSO: false,
        MetaDataSSO: null,
        LastSignin: null,
        IsSuperAdmin: false,
        ProfileId: profile.id,
        IsBanned: false,
    });
    publishUserCreated(user.id.toString(), user.Email).catch(err =>{
        console.error("Failed to publish user.create",err)
    })
    return { user, profile };
};

export default { SignupByEmail };