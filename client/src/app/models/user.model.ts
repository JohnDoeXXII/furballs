export interface User {
  username: string;
  id?: string;
  email: string;
  firstName: string; // YYYY-MM-DD
  lastName: string;
  role?: string;
}

export interface UserRegistration extends User {
  password: string;
}