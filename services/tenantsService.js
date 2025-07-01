import supabase from "@/utils/supabase/supabase";

export const getAllTenants = async () => {
  const { data, error } = await supabase.from("tenants").select("*");
  return { data, error };
};

export const insertTenant = async (tenantData) => {
  const { data, error } = await supabase.from("tenants").insert([tenantData]);
  return { data, error };
};

export const updateTenant = async (id, updates) => {
  const { data, error } = await supabase
    .from("tenants")
    .update(updates)
    .eq("id", id);
  return { data, error };
};

export const deleteTenant = async (id) => {
  const { data, error } = await supabase.from("tenants").delete().eq("id", id);
  return { data, error };
};


////////////////////////////////////////////////////////////////////////////////
// Fetch users based on a filter


export const getUsers = async (filter = '') => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(
      `name.ilike.*${filter}*,email.ilike.*${filter}*`,
      { foreignTable: undefined }
    );

  if (error) {
    console.error('Error fetching users:', error.message);
    return [];
  }

  return data;
};

export const getUserDetail = async (filter = '') => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', filter);  // <-- fixed from .is() to .eq()

  if (error) {
    console.error('Error fetching user details:', error.message);
    return [];
  }

  return data;
};

export const getAllProperties = async (filter = '') => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .or(
      `property_name.ilike.*${filter}*,property_type.ilike.*${filter}*`,
      { foreignTable: undefined }
    );

  if (error) {
    console.error('Error fetching properties:', error.message);
    return [];
  }

  return data;
};


