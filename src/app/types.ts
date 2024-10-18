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