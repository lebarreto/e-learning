import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Expose } from 'class-transformer';

@Entity('courses')
class Courses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Expose({ name: 'image_url' })
  getAvatarUrl(): string | null {
    if (!this.image) {
      return null;
    }

    return `${process.env.BACKEND_URL}/files/${this.image}`;
  }
}

export default Courses;
