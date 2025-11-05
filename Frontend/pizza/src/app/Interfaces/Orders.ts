export interface Orders {
  id: number;
  userID: number;
  pizzaID: number;
  quantity: number;
  datum: string;
  status: 'folyamatban' | 'kész' | 'megszakítva';
  totalPrice?: number;
  userName?: string;
  pizzaName?: string;
}
