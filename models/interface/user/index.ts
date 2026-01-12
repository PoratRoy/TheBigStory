export interface User {
  id: string;
  auth0Id: string | null;
  name: string;
  role: 'user' | 'admin' | null;
  googleImage: string | null;
}
