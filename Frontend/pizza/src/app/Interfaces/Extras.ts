export interface Extra {
  id: number;
  nev: string;
  ar: number;
  kategoriaId: number;
  tipus: 'pizza' | 'hamburger';
}

export interface SelectedExtra {
  extra: Extra;
  mennyiseg: number;
}

export interface Hozzavalo {
  nev: string;
  selected: boolean;
}

export interface KosarItem {
  id?: string;
  termekId: number;
  termekNev: string;
  termekKepURL: string;
  kategoriaId: number;
  kategoriaNev: string;
  alapAr: number;
  mennyiseg: number;
  hozzavalok: Hozzavalo[];
  extras: SelectedExtra[];
  megjegyzes: string;
  vegosszeg: number;
}

