export interface User {
  id: string;
  googleId: string | null;
  name: string;
  role: 'user' | 'admin' | null;
  googleImage: string | null;
}
