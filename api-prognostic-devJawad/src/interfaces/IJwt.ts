export interface IJwt {
  id: number; // User ID
  email: string; // User email
  scope: string[]; // Array of permissions or roles
}
