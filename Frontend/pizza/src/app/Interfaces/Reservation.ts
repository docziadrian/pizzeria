export interface Reservation {
  id?: number;
  tableId: number;
  tableNumber: number;
  userId: number;
  userName: string;
  userEmail: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  status: 'folyamatban' | 'sikeres' | 'megszakitott';
  createdAt?: string;
}
