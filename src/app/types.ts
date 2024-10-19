// src/app/types.ts
export type Tenant = {
  id: number;
  name: string;
  surname: string;
  email: string;
};

export type Reservation = {
  bed: {
    id: number;
    room: number;
  };
  id: number;
  from: string;
  to: string;
  confirmed: boolean;
  room: number;
  tenant: Tenant;
};

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
};