export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  isDeleted: boolean;
  profileImage: any;
  isEmailVerified: boolean;
  otp: string;
}

export interface IUpdateUserProfile {
  id: number;
  name?: string;
  phoneNumber?: string;
  profileImage?: any;
}
