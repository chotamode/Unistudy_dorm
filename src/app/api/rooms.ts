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

type Tenant = {
  id: number;
  name: string;
  surname: string;
  email: string;
};

type Reservation = {
  id: number;
  from: string;
  to: string;
  confirmed: boolean;
  roomId: number;
  tenant: Tenant;
};

export const getReservations = async (): Promise<Reservation[]> => {
  const { data, error } = await supabase
      .from('reservation')
      .select(`
      id,
      from,
      to,
      confirmed,
      bed,
      room_id,
      tenant:reserved_by (
        id,
        name,
        surname,
        email
      )
    `);

  if (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }

  return data.map(reservation => ({
    id: reservation.id,
    from: reservation.from,
    to: reservation.to,
    confirmed: reservation.confirmed,
    roomId: reservation.room_id,
    bedId: reservation.bed,
    tenant: {
      id: reservation.tenant.id,
      name: reservation.tenant.name,
      surname: reservation.tenant.surname,
      email: reservation.tenant.email
    }
  }));
};

export const updateReservationStatus = async (reservationId: number, confirmed: boolean) => {
  const { data, error } = await supabase
    .from('reservation')
    .update({ confirmed })
    .eq('id', reservationId);

  if (error) {
    console.error('Error updating reservation status:', error);
    return null;
  }

  return data;
};
