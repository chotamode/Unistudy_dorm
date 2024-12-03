import {supabase} from '@/supabaseClient';
import {Reservation} from '@/app/types';
import {v4 as uuidv4} from 'uuid';
import {createTask, updateTask} from "@/services/clickupService";

export const changePassword = async (userId: string, oldPassword: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
        return { error: 'New password and confirmation do not match' };
    }

    // First, verify the old password
    const { data: user, error: loginError } = await supabase.auth.signInWithPassword({
        email: userId,
        password: oldPassword,
    });

    if (loginError) {
        console.error('Error verifying old password:', loginError);
        return { error: 'Invalid old password' };
    }

    // If old password is correct, update to the new password
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (updateError) {
        console.error('Error updating password:', updateError);
        return { error: 'Error updating password' };
    }

    return { success: true };
};

//TODO: Make auth even more secure by using JWT tokens
export const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Error logging in:', error);
        return null;
    }

    return data;
};

export const isAdmin = async (userId: string): Promise<boolean> => {
    try {
        // console.log('Checking if user is admin:', userId);
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user role:', error);
            return false;
        }
        // console.log('User role:', data.role);
        return data.role === 'admin';
    } catch (error) {
        console.error('Unexpected error:', error);
        return false;
    }
};

export const updateRoomDetails = async (
    // userId: string,
    roomId: number, details: Partial<Room>) => {
    // if (!await isAdmin(userId)) {
    //     throw new Error('Unauthorized');
    // }

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

export const deleteReservation = async (reservationId: number) => {
    const { data, error } = await supabase
        .from('reservation')
        .update({ deleted: true,
            confirmed: false
        })
        .eq('id', reservationId);

    // set deleted field in clickup task
    // const { data: reservationData, error: reservationError } = await supabase
    //     .from('reservation')
    //     .select('task_id')
    //     .eq('id', reservationId)
    //     .single();
    //
    // if (reservationError) {
    //     console.error('Error fetching reservation:', reservationError);
    //     return null;
    // }

    // try{
    //     await updateTask(reservationData.task_id, '9325aca3-2a7f-4f60-aaec-c0e2126ce312', true);
    // } catch (error) {
    //     console.error('Error updating ClickUp task', error);
    // }

    if (error) {
        console.error('Error deleting reservation:', error);
        return null;
    }

    return data;
};

export const updateReservationStatus = async (
    // userId: string,
                                              reservationId: number, confirmed: boolean) => {
    // if (!await isAdmin(userId)) {
    //     throw new Error('Unauthorized');
    // }

    const { data: reservationData, error: reservationError } = await supabase
        .from('reservation')
        .select('task_id')
        .eq('id', reservationId)
        .single();

    if (reservationError) {
        console.error('Error fetching reservation:', reservationError);
        return null;
    }

    const taskId = reservationData.task_id;

    const { data, error } = await supabase
        .from('reservation')
        .update({ confirmed })
        .eq('id', reservationId);

    if (error) {
        console.error('Error updating reservation status:', error);
        return null;
    }

    // try {
    //     await updateTask(taskId, '503ed757-3941-4624-8667-d8943b3567e1', confirmed ? 'Confirmed' : 'Pending');
    // } catch (error) {
    //     console.error('Error updating ClickUp task:', error);
    // }

    // send reservation to Make
    const reservation = await supabase
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
        `)
        .eq('id', reservationId)
        .single();


    if (confirmed) {
        await sendDataToMake(makeWebHooks.approved, reservation);
    }else{
        await sendDataToMake(makeWebHooks.rejected, reservation);
    }

    return data;
};

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

export const getTenantById = async (tenantId: number) => {
    const { data, error } = await supabase
        .from('tenant')
        .select('gender')
        .eq('id', tenantId)
        .single();

    if (error) {
        console.error('Error fetching tenant details:', error);
        return null;
    }

    return data;
};

export const getBedsByRoomId = async (roomId: number, year?: number) => {
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
                reserved_by
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

    const beds = await Promise.all(data.map(async (bed) => {
        const reservations = await Promise.all(bed.reservations.map(async (reservation) => {
            const tenant = await getTenantById(reservation.reserved_by);
            return {
                from: reservation.from,
                to: reservation.to,
                confirmed: reservation.confirmed,
                gender: tenant ? tenant.gender : null
            };
        }));

        const freePeriod = calculateFreePeriod(reservations, period);
        const occupied = freePeriod.freeDays < 30;

        return {
            id: bed.id,
            room: bed.room,
            cost: bed.cost,
            occupied,
            availability: freePeriod.freeDays < 30 ? undefined :
                `${freePeriod.from.toLocaleDateString('en-GB')} - ${freePeriod.to.toLocaleDateString('en-GB')}`,
            reservations // Ensure reservations property is included
        };
    }));

    return beds;
};

const formatDateForClickUp = (date: Date): number => {
    return date.getTime();
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
    console.log('Getting room type for room:', roomId, 'year:', year);
    const beds = await getBedsByRoomId(roomId, year);

    const startDate = new Date(year, 8, 1);
    const endDate = new Date(year + 1, 7, 30);
    const period = { from: startDate, to: endDate };

    const activeReservations = beds.flatMap(bed =>
        getActiveReservationsForPeriod(bed.reservations, period)
    );
    console.log('active reservations:', activeReservations);

    const hasMale = activeReservations.some(reservation => reservation.gender === 'male');
    const hasFemale = activeReservations.some(reservation => reservation.gender === 'female');

    // console.log('room active reservations:', activeReservations);
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
            ),
            deleted
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
            },
            deleted: reservation.deleted
        };
    });
};

export const updateReservationDates = async (reservationId: number, from: string, to: string) => {
    const { data: reservationData, error: reservationError } = await supabase
        .from('reservation')
        .select('task_id')
        .eq('id', reservationId)
        .single();

    if (reservationError) {
        console.error('Error fetching reservation:', reservationError);
        return null;
    }

    const taskId = reservationData.task_id;

    const { data, error } = await supabase
        .from('reservation')
        .update({ from, to })
        .eq('id', reservationId);

    if (error) {
        console.error('Error updating reservation dates:', error);
        return null;
    }

    // try {
    //     await updateTask(taskId, '86ecdc0f-c56f-4b5b-b222-094e18643189', formatDateForClickUp(new Date(from)));
    //     await updateTask(taskId, '9fddb2a2-dec8-44f2-9505-147dfb5f5cce', formatDateForClickUp(new Date(to)));
    // } catch (error) {
    //     console.error('Error updating ClickUp task:', error);
    // }

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
    console.log('Creating reservation from:', from, 'to:', to);

    if (!from || !to) {
        console.error('Error: Please provide both from and to dates.');
        return { error: 'Please provide both from and to dates.' };
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    let startDate = from ? from : new Date(currentYear, 8, 1);
    const endDate = to ? to : new Date(nextYear, 7, 30);

    console.log('Start date:', startDate, 'End date:', endDate);

    const reservationFrom = startDate.toDateString();
    const reservationTo = endDate.toDateString();

    // get room address and name
    const room = await getRoomById(roomId);
    const roomAddress = room.address;
    const roomName = room.name;

    console.log('Reservation from:', reservationFrom, 'to:', reservationTo);

    console.log('room id:', roomId, 'bed id:', bedId);
    const roomType = await getRoomType(roomId, currentYear);
    console.log('Room type:', roomType);

    if (roomType !== 'both' && roomType !== tenantGender) {
        console.error('Error: This room is reserved for a different gender during the specified period.');
        return { error: 'This room is reserved for a different gender during the specified period.' };
    }

    const { data, error } = await supabase.rpc('create_reservation2', {
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

    console.log('Reservation data:', data);

    if (error) {
        console.error('Error creating reservation:', error);
        return null;
    }

    // Create ClickUp task
    // const clickUpTaskData = {
    //     // name is id of reservation
    //     name: `${data}`,
    //     custom_fields: [
    //         { id: 'aa36ae54-fbcd-46be-8755-00eea78c0453', value: tenantName },
    //         { id: '9d9c2929-0935-44ef-b300-ce026881c972', value: tenantSurname },
    //         { id: 'e43a8341-3f34-420e-bb1b-d88d378cfd4c', value: tenantPhoneNumber },
    //         { id: '0f119312-255f-4aa9-a067-264fc64ce888', value: tenantGender },
    //         { id: '38ae1a4a-2274-4fa5-b7ac-cf01031596ff', value: tenantEmail },
    //         {
    //             id: 'c06ef56d-c695-4953-9940-e5a8ffa2ed1d',
    //             value: formatDateForClickUp(new Date(tenantDateOfBirth)),
    //             value_options: { time: false }
    //         },
    //         {
    //             id: '86ecdc0f-c56f-4b5b-b222-094e18643189',
    //             value: formatDateForClickUp(startDate),
    //             value_options: { time: false }
    //         },
    //         {
    //             id: '9fddb2a2-dec8-44f2-9505-147dfb5f5cce',
    //             value: formatDateForClickUp(endDate),
    //             value_options: { time: false }
    //         },
    //         {
    //             id: '503ed757-3941-4624-8667-d8943b3567e1', value: 'Pending'
    //         },
    //         {
    //             id: '6a125369-d189-4f10-a886-a9f3cf23a4d4', value: roomAddress
    //         },
    //         {
    //             id: '520a5802-2944-4acf-887d-49fd83452876', value: roomName
    //         },
    //         {
    //             id: '9325aca3-2a7f-4f60-aaec-c0e2126ce312', value: false
    //         }
    //     ]
    // };
    // console.log('ClickUp task data:', clickUpTaskData);
    // try {
    //     const clickUpResponse = await createTask('901507270320', clickUpTaskData);
    //     const taskId = clickUpResponse.id;
    //
    //     // Update reservation with task_id
    //     const { data: updateData, error: updateError } = await supabase
    //         .from('reservation')
    //         .update({ task_id: taskId })
    //         .eq('id', data);
    //
    //     if (updateError) {
    //         console.error('Error updating reservation with task_id:', updateError);
    //         return null;
    //     }
    // } catch (error) {
    //     console.error('Error creating ClickUp task:', error);
    // }

    // send reservation to Make
    // also contain information about tenant
    // and room name
    const reservation = await supabase
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
        `)
        .eq('id', data)
        .single();

    console.log('Sending reservation to Make:', reservation);

    await sendDataToMake(makeWebHooks.new, reservation);

    console.log('Reservation created successfully');
    return data;
};

const makeWebHooks = {
    new: process.env.MAKE_WEBHOOK_NEW || '',
    approved: process.env.MAKE_WEBHOOK_APPROVED || '',
    rejected: process.env.MAKE_WEBHOOK_REJECTED || ''
};

const sendDataToMake = async (url: string, data: any) => {

    if (!makeWebHooks.new || !makeWebHooks.approved || !makeWebHooks.rejected) {
        throw new Error('One or more Make webhook URLs are not defined in the environment variables.');
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*',
                'Access-Control-Allow-Actions': 'POST, OPTIONS, GET'
            },
            body: JSON.stringify(data)
        });
        console.log('Data sent to Make:', data);
        console.log('Response:', response);
        return response;
    } catch (error) {
        console.error('Error sending data to Make:', error);
        return null;
    }
}
