// src/app/types.ts
type Tenant = {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    gender: string;
    date_of_birth: string;
};

export interface Reservation {
    id: number;
    tenant: {
        id: number;
        name: string;
        surname: string;
        email: string;
        phone: string;
        gender: string;
        date_of_birth: string;
    };
    from: string;
    to: string;
    confirmed: boolean;
    bed?: Bed; // Make bed optional
    deleted?: boolean; // Make deleted optional
    room?: Room; // Add the room property
    room_name?: string; // Add the room_name property
}

export type Bed = {
    id: number;
    room: number;
    cost: number;
    occupied?: boolean;
    availability?: string;
    reservations?: {
        from: Date;
        to: Date;
        confirmed: boolean;
        gender: string;
    }[];
    dorm?: string; // Add the dorm property
};

export type Room = {
    image_urls: string;
    address: string;
    description: string;
    id: number;
    image: string;
    name: string;
    price_month: number;
    mini_description: string;
    area: number;
    floor: number;
    dorm: string;
};