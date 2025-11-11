export interface Review {
  id?: number;
  userId: number;
  userName: string;
  pizzaId: number;
  pizzaName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}
