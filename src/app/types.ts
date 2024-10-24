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
    };
    from: string;
    to: string;
    confirmed: boolean;
    bed?: Bed; // Make bed optional
    canceled_at: string | null;
}

export type Bed = {
    cost: number;
    id: number;
    room: number;
    availableFrom: string;
    availableTo: string;
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