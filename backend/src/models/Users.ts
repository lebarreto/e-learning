import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity('users')
class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;
}

export default Users;
