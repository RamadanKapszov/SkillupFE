import { UserDto } from './user.dto';

export interface AuthResponse {
  token: string;
  expiresInSeconds: number;
  user: UserDto;
}
