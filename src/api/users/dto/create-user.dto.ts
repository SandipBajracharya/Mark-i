export class CreateUserDto {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
