import {supabase} from '@/supabaseClient';
import {Reservation} from '@/app/types';
import {v4 as uuidv4} from 'uuid';

export const getFirstRoomPhoto = async (roomId: number) => {
    const {data, error} = await supabase
        .from('room')
        .select('image_urls')
        .eq('id', roomId)
        .single();

    if (error) {
        console.error('Error fetching room images:', error);
        return null;
    }

    const imageUrls = data.image_urls ? JSON.parse(data.image_urls) : [];
    return imageUrls.length > 0 ? imageUrls[0] : null;
};

export const uploadPhotoAndAddToRoom = async (roomId: number, file: File) => {
    // Generate a UUID for the file name
    const uniqueFileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    console.log(uniqueFileName);

    // Step 1: Upload the photo to Supabase storage
    const {data: uploadData, error: uploadError} = await supabase.storage
        .from('photos')
        .upload(`public/room_photos/${roomId}/${uniqueFileName}`, file);

    if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return null;
    }

    // Step 2: Get the public URL of the uploaded photo
    const {data} = supabase.storage
        .from('photos')
        .getPublicUrl(`public/room_photos/${roomId}/${uniqueFileName}`);

    const publicURL = data.publicUrl;

    // Step 3: Add the photo URL to the room's image_urls field
    const {data: roomData, error} = await supabase
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

    const {data: updateData, error: updateError} = await supabase
        .from('room')
        .update({image_urls: JSON.stringify(imageUrls)})
        .eq('id', roomId);

    if (updateError) {
        console.error('Error updating room image URLs:', updateError);
        return null;
    }

    return updateData;
};

export const deletePhotoFromRoom = async (roomId: number, photoUrl: string) => {
    const {data, error} = await supabase
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

    const {data: updateData, error: updateError} = await supabase
        .from('room')
        .update({image_urls: JSON.stringify(updatedImageUrls)})
        .eq('id', roomId);

    if (updateError) {
        console.error('Error updating room image URLs:', updateError);
        return null;
    }

    return updateData;
};

export const getRoomImages = async (roomId: number) => {
    const {data, error} = await supabase
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

const getBedsByRoomId = async (roomId: number, year?: number) => {
    const { data, error } = await supabase
        .from('bed')
        .select(`
            id,
            room,
            cost,
            reservations:reservation (
                from,
                to,
                confirmed,
                tenant:reserved_by (
                    gender
                )
            )
        `)
        .eq('room', roomId);

    if (error) {
        console.error('Error fetching beds:', error);
        return [];
    }

    if (year === undefined) {
        return data.map((bed) => ({
            id: bed.id,
            room: bed.room,
            cost: bed.cost,
            occupied: false,
            availability: undefined,
            reservations: [] // Ensure reservations property is always defined
        }));
    }

    const startDate = new Date(year, 8, 1);
    const endDate = new Date(year + 1, 7, 30);
    const period = { from: startDate, to: endDate };

    const beds = data.map((bed) => {
        const reservations = bed.reservations.map((reservation) => ({
            from: reservation.from,
            to: reservation.to,
            confirmed: reservation.confirmed,
            gender: reservation.tenant.length > 0 ? reservation.tenant[0].gender : null
        }));

        const freePeriod = calculateFreePeriod(reservations, period);
        const occupied = freePeriod.freeDays < 30;

        return {
            id: bed.id,
            room: bed.room,
            cost: bed.cost,
            occupied,
            availability: freePeriod.freeDays < 30 ? undefined :
                `${freePeriod.from.toDateString()} - ${freePeriod.to.toDateString()}`,
            reservations // Ensure reservations property is included
        };
    });

    return beds;
};

export const createReservation = async (
    tenantName: string,
    tenantSurname: string,
    tenantPhoneNumber: string,
    tenantGender: string,
    tenantEmail: string,
    tenantDateOfBirth: string,
    roomId: number,
    bedId: number,
    from?: Date,
    to?: Date
) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    let startDate = from ? from : new Date(currentYear, 8, 1); // September 1st of the current year
    const endDate = to ? to : new Date(nextYear, 7, 30); // August 30st of the next year

    const reservationFrom = startDate.toISOString().split('T')[0];
    const reservationTo = endDate.toISOString().split('T')[0];

    const {data, error} = await supabase.rpc('create_reservation', {
        tenant_name: tenantName,
        tenant_surname: tenantSurname,
        tenant_phone_number: tenantPhoneNumber,
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

// if at least one bed has confirmed reservation in that period by male, return 'male'
// if at least one bed has confirmed reservation in that period by female, return 'female'
// if there are no confirmed reservations in that period, return 'both'
export const getRoomType = async (roomId: number, year: number) => {
    const beds = await getBedsByRoomId(roomId, year);

    const startDate = new Date(year, 8, 1);
    const endDate = new Date(year + 1, 7, 30);
    const period = { from: startDate, to: endDate };

    const activeReservations = beds.flatMap(bed =>
        getActiveReservationsForPeriod(bed.reservations, period)
    );

    const hasMale = activeReservations.some(reservation => reservation.gender === 'male');
    const hasFemale = activeReservations.some(reservation => reservation.gender === 'female');

    if (hasMale) {
        return 'male';
    } else if (hasFemale) {
        return 'female';
    } else {
        return 'both';
    }
};

type ReservationCalc = {
    from: string;
    to: string;
    confirmed: boolean;
    gender: string;
};

type Period = {
    from: Date;
    to: Date;
};

const getActiveReservationsForPeriod = (reservations: ReservationCalc[], period: Period): ReservationCalc[] => {
    return reservations.filter(reservation => {
        const reservationFrom = new Date(reservation.from);
        const reservationTo = new Date(reservation.to);
        return (reservationFrom <= period.to && reservationTo >= period.from && reservation.confirmed);
    });
};

const calculateFreePeriod = (reservations: ReservationCalc[], period: Period): {
    from: Date,
    to: Date,
    freeDays: number
} => {
    const activeReservations = getActiveReservationsForPeriod(reservations, period);

    if (activeReservations.length === 0) {
        const freeDays = (period.to.getTime() - period.from.getTime()) / (1000 * 60 * 60 * 24);
        return {from: period.from, to: period.to, freeDays};
    }

    const latestToDate = activeReservations.reduce((latest, reservation) => {
        const reservationTo = new Date(reservation.to);
        return reservationTo > latest ? reservationTo : latest;
    }, period.from);

    const freePeriodFrom = latestToDate > period.from ? latestToDate : period.from;
    const freePeriodTo = period.to;
    const freeDays = (freePeriodTo.getTime() - freePeriodFrom.getTime()) / (1000 * 60 * 60 * 24);

    return {from: freePeriodFrom, to: freePeriodTo, freeDays};
};

export const getRoomAvailability = async (roomId: number, year: number) => {
    const beds = await getBedsByRoomId(roomId, year);

    return beds.some(bed => !bed.occupied);
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

    const {data, error} = await supabase
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
    }, {from: from, to: to});

    return freePeriod;
};

export const getReservations = async (): Promise<Reservation[]> => {
    const {data, error} = await supabase
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
    const {data, error} = await supabase
        .from('reservation')
        .update({from, to})
        .eq('id', reservationId);

    if (error) {
        console.error('Error updating reservation dates:', error);
        return null;
    }

    return data;
};

export const updateRoomDetails = async (roomId: number, details: Partial<Room>) => {
    const {data, error} = await supabase
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
    const {data, error} = await supabase
        .from('bed')
        .update({cost})
        .eq('id', bedId);

    if (error) {
        console.error('Error updating bed cost:', error);
        return null;
    }

    return data;
};

