import {supabase} from '@/supabaseClient';
import {Reservation} from '@/app/types';
import { v4 as uuidv4 } from 'uuid';

export const uploadPhotoAndAddToRoom = async (roomId: number, file: File) => {
    // Generate a UUID for the file name
    const uniqueFileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    console.log(uniqueFileName);

    // Step 1: Upload the photo to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(`public/room_photos/${roomId}/${uniqueFileName}`, file);

    if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return null;
    }

    // Step 2: Get the public URL of the uploaded photo
    const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(`public/room_photos/${roomId}/${uniqueFileName}`);

    const publicURL = data.publicUrl;

    // Step 3: Add the photo URL to the room's image_urls field
    const { data: roomData, error } = await supabase
        .from('room')
        .select('image_urls')
        .eq('id', roomId)
        .single();

    if (error) {
        console.error('Error fetching room image URLs:', error);
        return null;
    }

    const imageUrls = roomData.image_urls ? JSON.parse(roomData.image_urls) : [];
    imageUrls.push(publicURL);

    const { data: updateData, error: updateError } = await supabase
        .from('room')
        .update({ image_urls: JSON.stringify(imageUrls) })
        .eq('id', roomId);

    if (updateError) {
        console.error('Error updating room image URLs:', updateError);
        return null;
    }

    return updateData;
};

export const deletePhotoFromRoom = async (roomId: number, photoUrl: string) => {
    const { data, error } = await supabase
        .from('room')
        .select('image_urls')
        .eq('id', roomId)
        .single();

    if (error) {
        console.error('Error fetching room image URLs:', error);
        return null;
    }

    const imageUrls = data.image_urls ? JSON.parse(data.image_urls) : [];
    const updatedImageUrls = imageUrls.filter((url: string) => url !== photoUrl);

    const { data: updateData, error: updateError } = await supabase
        .from('room')
        .update({ image_urls: JSON.stringify(updatedImageUrls) })
        .eq('id', roomId);

    if (updateError) {
        console.error('Error updating room image URLs:', updateError);
        return null;
    }

    return updateData;
};

export const getRoomImages = async (roomId: number) => {
    const { data, error } = await supabase
        .from('room')
        .select('image_urls')
        .eq('id', roomId)
        .single();

    if (error) {
        console.error('Error fetching room images:', error);
        return [];
    }

    return data.image_urls ? JSON.parse(data.image_urls) : [];
};

// Function to get all rooms
export const getRooms = async () => {
    const {data, error} = await supabase.from('room').select('*');
    if (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
    return data;
};

// Function to get full information of a room by ID
export const getRoomById = async (roomId: number) => {
    const {data, error} = await supabase
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
    const {data, error} = await supabase
        .from('bed')
        .select(`
      id,
      room,
      cost,
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
    // git pls work
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
            occupied: isOccupied,
            cost: bed.cost
        };
    });
};

export const createDefaultReservation = async (
    tenantName: string,
    tenantSurname: string,
    tenantGender: string,
    tenantEmail: string,
    tenantDateOfBirth: string,
    roomId: number,
    bedId: number,

) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    let startDate = new Date(currentYear, 8, 2); // September 1st of the current year

    if (today > startDate) {
        startDate = new Date(nextYear, 7, 31); // August 30st of the next year
    }

    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + 1);

    const reservationFrom = startDate.toISOString().split('T')[0];
    const reservationTo = endDate.toISOString().split('T')[0];

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
    const {data, error} = await supabase
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
    const {data, error} = await supabase.rpc('get_room_type', {room_id: roomId});

    if (error) {
        console.error('Error fetching room type:', error);
        return 'both';
    }

    return data;
};

//If at least one bed has free period
// from 1 september of year - 1
// until 30 august of year
export const getRoomAvailability = async (roomId: number, year: number) => {
    const {data, error} = await supabase.rpc('get_room_availability', {room_id: roomId, year});

    if (error) {
        console.error('Error fetching room availability:', error);
        return false;
    }

    return data;
}

type Room = {
    id: number;
    name: string;
    address: string;
    description: string;
    price_month: number;
    image: string;
};

// find free period until to date argument. returns free period or null
export const checkBedAvailability = async (bedId: number, from: Date, to: Date) => {
    console.log(from, to);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        console.error('Invalid date provided');
        return null;
    }

    const { data, error } = await supabase
        .from('reservation')
        .select('from, to')
        .eq('bed', bedId)
        .lte('from', from.toISOString())
        .gte('to', to.toISOString());
    console.log(data);

    if (error) {
        console.error('Error fetching bed availability:', error);
        return null;
    }

    const freePeriod = data.reduce((acc: { from: Date, to: Date }, reservation: { from: string, to: string }) => {
        const reservationFrom = new Date(reservation.from);
        const reservationTo = new Date(reservation.to);

        console.log(reservationFrom, reservationTo);

        if (reservationFrom > acc.from) {
            acc.from = reservationTo;
        }

        return acc;
    }, { from: from, to: to });

    return freePeriod;
};

export const getReservations = async (): Promise<Reservation[]> => {
    const { data, error } = await supabase
        .from('reservation')
        .select(`
            id,
            from,
            to,
            confirmed,
            bed:bed (
                id,
                room,
                cost
            ),
            tenant:reserved_by (
                id,
                name,
                surname,
                email,
                phone,
                gender,
                date_of_birth
            )
        `);

    if (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }

    return data.map((reservation: any) => {
        const bed = reservation.bed ? {
            id: reservation.bed.id,
            room: reservation.bed.room,
            cost: reservation.bed.cost
        } : undefined;

        return {
            id: reservation.id,
            from: reservation.from,
            to: reservation.to,
            confirmed: reservation.confirmed,
            room: reservation.bed ? reservation.bed.room : null,
            bed,
            tenant: {
                id: reservation.tenant.id,
                name: reservation.tenant.name,
                surname: reservation.tenant.surname,
                email: reservation.tenant.email,
                phone: reservation.tenant.phone,
                gender: reservation.tenant.gender,
                date_of_birth: reservation.tenant.date_of_birth
            }
        };
    });
};

export const updateReservationStatus = async (reservationId: number, confirmed: boolean) => {
    const {data, error} = await supabase
        .from('reservation')
        .update({confirmed})
        .eq('id', reservationId);

    if (error) {
        console.error('Error updating reservation status:', error);
        return null;
    }

    return data;
};

export const updateReservationDates = async (reservationId: number, from: string, to: string) => {
    const { data, error } = await supabase
        .from('reservation')
        .update({ from, to })
        .eq('id', reservationId);

    if (error) {
        console.error('Error updating reservation dates:', error);
        return null;
    }

    return data;
};

export const updateRoomDetails = async (roomId: number, details: Partial<Room>) => {
    const { data, error } = await supabase
        .from('room')
        .update(details)
        .eq('id', roomId);

    if (error) {
        console.error('Error updating room details:', error);
        return null;
    }

    return data;
};

export const updateBedCost = async (bedId: number, cost: number) => {
    const { data, error } = await supabase
        .from('bed')
        .update({ cost })
        .eq('id', bedId);

    if (error) {
        console.error('Error updating bed cost:', error);
        return null;
    }

    return data;
};

