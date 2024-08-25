export class CreateUserDto {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  role_id: number;
  email_verified_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
