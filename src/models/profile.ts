import supabase from "../config/supabase";

export interface Profile {
  id: number;
  Fname: string;
  Lname: string;
  DepartmentId?: string | null;
  CreateAt: string;
  UpdateAt: string;
}

type NewProfile = Omit<Profile, "id" | "CreateAt" | "UpdateAt">;
type UpdateProfile = Partial<Omit<Profile, "id" | "CreateAt" | "UpdateAt">>;

const createProfile = async (data: NewProfile) => {
  const { data: row, error } = await supabase
    .from("Profile")
    .insert(data)
    .select("*")
    .single();

  if (error) throw error;
  return row as Profile;
};

const updateProfileById = async (id: number, data: UpdateProfile) => {
  const { data: row, error } = await supabase
    .from("Profile")
    .update({ ...data, UpdateAt: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return row as Profile;
};

const findProfileById = async (id: number) => {
  const { data: row, error } = await supabase
    .from("Profile")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return row as Profile;
};

const deleteProfileById = async (id: number) => {
  const { error } = await supabase
    .from("Profile")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true as const };
};

export default { createProfile, updateProfileById, findProfileById, deleteProfileById };
