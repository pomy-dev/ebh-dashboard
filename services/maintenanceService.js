import supabase from '@/utils/supabase/supabase';

export const getAllFaults = async () => {
  const { data, error } = await supabase
    .from('maintenance')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching maintenance faults:', error.message);
    return [];
  }

  return data;
};

export const updateFaultReply = async (faultId, { status, message }) => {
  const { data, error } = await supabase
    .from('maintenance')
    .update({ status, reply_message: message })
    .eq('id', faultId);

  if (error) {
    console.error('Error updating fault:', error.message);
    return null;
  }

  return data;
};
