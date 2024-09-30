// src/app/types.ts
export type Tenant = {
  id: number;
  name: string;
  surname: string;
  email: string;
};

export type Reservation = {
  id: number;
  from: string;
  to: string;
  confirmed: boolean;
  roomId: number;
  tenant: Tenant;
};