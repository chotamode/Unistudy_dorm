import {supabase} from '@/supabaseClient';

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

export const getBedsByRoomId = async (roomId: number) => {
  const { data, error } = await supabase
      .from('bed')
      .select(`
      id,
      room,
      reservations:reservation (
        from,
        to,
        confirmed
      )
    `)
      .eq('room', roomId);

  if (error) {
    console.error('Error fetching beds:', error);
    return [];
  }

  return data.map(bed => {
    const isOccupied = bed.reservations.some(reservation => {
      const fromDate = new Date(reservation.from);
      const toDate = new Date(reservation.to);
      const now = new Date();
      return reservation.confirmed && now >= fromDate && now <= toDate;
    });

    return {
      id: bed.id,
      room: bed.room,
      occupied: isOccupied
    };
  });
};

export const createReservation = async (
    tenantName: string,
    tenantSurname: string,
    tenantGender: string,
    tenantEmail: string,
    tenantDateOfBirth: string,
    roomId: number,
    bedId: number,
    reservationFrom: string,
    reservationTo: string
) => {
  const { data, error } = await supabase.rpc('create_reservation', {
    tenant_name: tenantName,
    tenant_surname: tenantSurname,
    tenant_gender: tenantGender,
    tenant_email: tenantEmail,
    tenant_date_of_birth: tenantDateOfBirth,
    room_id: roomId,
    bed_id: bedId,
    reservation_from: reservationFrom,
    reservation_to: reservationTo
  });

  if (error) {
    console.error('Error creating reservation:', error);
    return null;
  }

  return data;
};

export const getRoomDetailsByRoomId = async (roomId: number) => {
    const { data, error } = await supabase
        .from('room_details')
        .select('*')
        .eq('room_id', roomId);

    if (error) {
        console.error('Error fetching room details:', error);
        return [];
    }

    return data;
}

export const getRoomType = async (roomId: number) => {
  const { data, error } = await supabase.rpc('get_room_type', { room_id: roomId });

  if (error) {
    console.error('Error fetching room type:', error);
    return 'both';
  }

  return data;
};
