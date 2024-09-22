import { supabase } from '@/supabaseClient';

// Function to get all rooms
export const getRooms = async () => {
  const { data, error } = await supabase.from('room').select('*');
  if (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
  return data;
};

// Function to get full information of a room by ID
export const getRoomById = async (roomId: number) => {
  const { data, error } = await supabase
    .from('room')
    .select('*')
    .eq('id', roomId)
    .single();
  if (error) {
    console.error('Error fetching room:', error);
    return null;
  }
  return data;
};

// Function to reserve a room
export const reserveRoom = async (roomId: number, tenantId: number) => {
  const { data, error } = await supabase
    .from('bed')
    .update({ reserved_by: tenantId })
    .eq('room', roomId)
    .is('reserved_by', null); // Ensure the bed is not already reserved
  if (error) {
    console.error('Error reserving room:', error);
    return null;
  }
  return data;
};

// Function to get all reservations
export const getReservations = async () => {
  const { data, error } = await supabase.from('reservation').select('*');
  if (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
  return data;
};

// Function to get all tenants
export const getTenants = async () => {
  const { data, error } = await supabase.from('tenant').select('*');
  if (error) {
    console.error('Error fetching tenants:', error);
    return [];
  }
  return data;
};