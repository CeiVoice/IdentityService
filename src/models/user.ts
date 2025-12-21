import supabase from "../config/supabase";

export interface User {
    id: number;
    Email: string;
    Password: string;
    EmailConfirm: boolean;
    EmailConfirmAt: string | null;
    IsSSO: boolean;
    MetaDataSSO: Record<string, unknown> | null;
    LastSignin?: string | null;
    IsSuperAdmin: boolean;
    ProfileId: number;
    CreateAt: string;
    UpdateAt: string;
    IsBanned: boolean;
    EmailConfirmToken: string;
}


type NewUser = Omit<User, "id" | "CreateAt" | "UpdateAt">;
type UpdateUser = Partial<Omit<User, "id" | "CreateAt" | "UpdateAt">>;

const createUser = async (data: NewUser) => {
    const { data: row, error } = await supabase
        .from("User")
        .insert(data)
        .select("*")
        .single();

    if (error) throw error;
    return row as User;
};

const updateUserById = async (id: number, data: UpdateUser) => {
    const { data: row, error } = await supabase
        .from("User")
        .update({ ...data, UpdateAt: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .single();

    if (error) throw error;
    return row as User;
};

const findUserById = async (id: number) => {
    const { data: row, error } = await supabase
        .from("User")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return row as User;
};

const findUserByEmail = async (email: string) => {
    const { data: row, error } = await supabase
        .from("User")
        .select("*")
        .eq("Email", email)
        .maybeSingle();

    if (error) throw error;
    return row as User | null;
};

const deleteUserById = async (id: number) => {
    const { error } = await supabase
        .from("User")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return { success: true as const };
};

export default { createUser, updateUserById, findUserById,findUserByEmail, deleteUserById };
