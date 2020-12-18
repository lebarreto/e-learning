import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Courses from './Courses';

import { Expose } from 'class-transformer';

@Entity('lessons')
class Lessons {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column()
  description: string;

  @Column()
  video_id: string;

  @Column()
  course_id: string;

  @ManyToOne(() => Courses)
  @JoinColumn({ name: 'course_id' })
  course: Courses;

  @Expose({ name: 'video_url' })
  getVideoUrl(): string | null {
    if (!this.video_id) {
      return null;
    }

    return `https://www.youtube.com/watch?v=${this.video_id}`;
  }
}

export default Lessons;
