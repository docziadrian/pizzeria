interface Kategoria {
  id: number;
  nev: string;
}

interface Termek {
  id: number;
  nev: string;
  leiras: string;
  ar: number;
  kategoria: Kategoria;
  kepURL: string;
  hozzavalok: string[];
  averageRating?: number;
  reviewCount?: number;
  videoURL?: string;
  isHovering?: boolean;
}

interface EtlapKategoria {
  id: number;
  nev: string;
}

export interface Etlap {
  kategoria: EtlapKategoria;
  termekek: Termek[];
}
