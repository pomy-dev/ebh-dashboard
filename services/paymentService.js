import supabase from '@/utils/supabase/supabase';

export const getPayments = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching paymentse:', error.message);
    return [];
  }

  return data;
};
