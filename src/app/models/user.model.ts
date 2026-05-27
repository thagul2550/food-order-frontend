/** ข้อมูล user ที่ decode มาจาก JWT token */
export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  role: 'User' | 'Admin';
}

/** Response ที่ได้จาก login/register */
export interface AuthResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  role: string;
}
