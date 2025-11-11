export interface Pizza {
  id: number;
  nev: string;
  ar: number;
  kepURL: string;
  hozzavalok: string[];
  averageRating?: number;
  reviewCount?: number;
  videoURL?: string;
  isHovering?: boolean;
}
