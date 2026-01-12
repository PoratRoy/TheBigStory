export interface Category {
  id: string;
  name: string;
  color: string | null;
  startYear: number | null;
  endYear: number | null;
  isUnique: boolean | null;
}
