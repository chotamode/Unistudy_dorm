// src/app/types.ts
export type Tenant = {
    id: number;
    name: string;
    surname: string;
    email: string;
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
}

export type Bed = {
    cost: number;
    id: number;
    room: number;
};

export type Room = {
    address: string;
    description: string;
    id: number;
    image: string;
    name: string;
    price_month: number;
    mini_description: string;
    area: number;
    floor: number;
};