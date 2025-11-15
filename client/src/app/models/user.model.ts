export interface User {
  username: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

export interface UserRegistration extends User {
  password: string;
}