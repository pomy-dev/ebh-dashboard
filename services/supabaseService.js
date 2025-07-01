import supabase from "@/utils/supabase/supabase";

export async function insertProperty(data) {
  const response = await supabase.from("properties").insert([data]).select();

  return response; // returns full object with `data` and `error`
}
export async function getAllProperties() {
  const { data, error } = await supabase.from("properties").select("*");
  return { data, error };
}

export async function getPropertyById(id) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
}

export async function updateProperty(id, updates) {
  const { data, error } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", id);
  return { data, error };
}

export async function deleteProperty(id) {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  return { error };
}
