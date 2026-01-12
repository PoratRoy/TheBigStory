export interface EventCategory {
  id: string;
  name: string;
  color: string | null;
}

export interface Event {
  id: string;
  text: string;
  position: number | null;
  isCollapse: boolean | null;
  categories: EventCategory[];
}
