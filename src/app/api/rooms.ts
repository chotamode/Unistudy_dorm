import {supabase} from '@/supabaseClient';
import { Reservation } from '@/app/types';

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
export const cancelReservation = async (reservationId: number) => {
    const { data, error } = await supabase
        .from('reservation')
        .update({
            confirmed: false,
            canceled_at: new Date().toISOString(),
        })
        .eq('id', reservationId);

    if (error) {
        console.error('Error canceling reservation:', error);
        throw new Error(error.message || 'Error canceling reservation');
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
        confirmed,
        canceled_at
      )
    `)
        .eq('room', roomId);

    if (error) {
        console.error('Error fetching beds:', error);
        return [];
    }


    const today = new Date();
    const currentYear = today.getFullYear();

    // Фиксированные даты бронирования
    const defaultStartDate = new Date(currentYear + 1, 8, 2); // 2 сентября текущего года
    const defaultEndDate = new Date(currentYear + 2, 7, 31); // 30 августа следующего года




    const availableBeds = data.map(bed => {
        let isOccupied = false;
        let availableFrom = defaultStartDate;

        // Проверяем все бронирования для кровати
        bed.reservations.forEach(reservation => {
            const fromDate = new Date(reservation.from);
            const toDate = new Date(reservation.to);

            if (reservation.confirmed) {
                // Если есть подтверждённое бронирование, кровать занята
                isOccupied = true;
            } else if (reservation.canceled_at) {
                const canceledAt = new Date(reservation.canceled_at);
                if (canceledAt > availableFrom) {
                    // Обновляем дату доступности на дату отмены бронирования
                    availableFrom = canceledAt;
                }
            }
        });

        if (isOccupied) {
            // Если кровать занята, не включаем её в список доступных кроватей
            return null;
        } else {
            // Форматируем даты в строковый формат 'YYYY-MM-DD'
            const availableFromStr = availableFrom.toISOString().split('T')[0];
            const availableToStr = defaultEndDate.toISOString().split('T')[0];

            return {
                id: bed.id,
                room: bed.room,
                cost: bed.cost,
                availableFrom: availableFromStr,
                availableTo: availableToStr,
            };
        }
    }).filter(bed => bed !== null); // Убираем занятые кровати

    return availableBeds;
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

    let startDate = new Date(currentYear, 8, 2);

    if (today > startDate) {
        startDate = new Date(nextYear, 8, 2);
    }

    const endDate = new Date(nextYear, 7, 31);

    const reservationFrom = startDate.toISOString().split('T')[0];
    const reservationTo = endDate.toISOString().split('T')[0];

    const { data: bedData, error: bedError } = await supabase
        .from('bed')
        .select(`
            id,
            reservations:reservation (
                from,
                to,
                confirmed,
                canceled_at
            )
        `)
        .eq('id', bedId)
        .single();

    if (bedError || !bedData) {
        console.error('Error fetching bed:', bedError);
        throw new Error('Error fetching bed data');
    }

    const isOccupied = bedData.reservations.some((reservation: any) => {
        const fromDate = new Date(reservation.from);
        const toDate = new Date(reservation.to);
        const reservationCanceled = reservation.canceled_at !== null;
        const reservationConfirmed = reservation.confirmed;

        return (
            reservationConfirmed &&
            !reservationCanceled &&
            fromDate <= new Date(reservationTo) &&
            toDate >= new Date(reservationFrom)
        );
    });

    if (isOccupied) {
        // Кровать уже занята
        throw new Error('This bed has already been booked.');
    }


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

//If at least one bed has free period until 30 august of year
export const getRoomAvailability = async (roomId: number, year: number) => {
    const {data, error} = await supabase.rpc('get_room_availability', {room_id: roomId, year});

    if (error) {
        console.error('Error fetching room availability:', error);
        return false;
    }

    return data;
}

type Tenant = {
    id: number;
    name: string;
    surname: string;
    email: string;
};

type Bed = {
    id: number;
    room: number;
    cost: number;
};

type Room = {
    id: number;
    name: string;
    address: string;
    description: string;
    price_month: number;
    image: string;
};

export const getReservations = async (): Promise<Reservation[]> => {
    const { data, error } = await supabase
        .from('reservation')
        .select(`
            id,
            from,
            to,
            confirmed,
            canceled_at,
            bed (
                id,
                room
            ),
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

    return data.map((reservation: any) => {
        const bed = reservation.bed ? {
            id: reservation.bed.id,
            room: reservation.bed.room,
            cost: reservation.bed.cost
        } : undefined

        return {
            id: reservation.id,
            from: reservation.from,
            to: reservation.to,
            confirmed: reservation.confirmed,
            canceled_at: reservation.canceled_at,
            room: reservation.bed ? reservation.bed.room : null,
            bed,
            tenant: {
                id: reservation.tenant.id,
                name: reservation.tenant.name,
                surname: reservation.tenant.surname,
                email: reservation.tenant.email
            }
        };
    });
};

export const updateReservationStatus = async (reservationId: number, confirmed: boolean) => {


    const updates: any = { confirmed };

    if (confirmed) {
        // Если резервация подтверждается, очищаем canceled_at
        updates.canceled_at = null;
    } else {
        // Если резервация отменяется, устанавливаем canceled_at
        updates.canceled_at = new Date().toISOString();
    }

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

