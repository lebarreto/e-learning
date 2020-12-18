import * as Yup from 'yup';
import { Request, Response } from 'express';
import { getConnection, getRepository } from "typeorm";
import { uuid } from 'uuidv4';

import Lessons from '../models/Lessons';
import Courses from '../models/Courses';

export default class LessonsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, duration, course_id, description, video_id } = request.body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      duration: Yup.number().required(),
      course_id: Yup.string().required(),
      description: Yup.string().required(),
      video_id: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
			return response.status(400).json({ error: 'Validation fails.' });
    }

    const lessonExists = await getConnection()
      .createQueryBuilder()
      .select("lessons.video_id")
      .from(Lessons, 'lessons')
      .where("lessons.video_id = :video_id", { video_id })
      .getOne();

    if (lessonExists) {
      return response.status(400).json({ error: 'Lesson already exists.' });
    }

    const courseExists = await getConnection()
      .createQueryBuilder()
      .select("courses.id")
      .from(Courses, 'courses')
      .where("courses.id = :course_id", { course_id })
      .getOne();

    if (!courseExists) {
      return response.status(400).json({ error: 'Course does not exists.' });
    }

    const lesson = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Lessons)
      .values([
          {
            id: uuid(),
            name: name,
            duration: duration,
            course_id: course_id,
            description: description,
            video_id: video_id
          },
      ])
      .execute();

    return response.json(lesson)
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, duration, course_id, description, video_id } = request.body;
    const { id } = request.params;

    const lessonExists = await getConnection()
      .createQueryBuilder()
      .select("lessons.id")
      .from(Lessons, 'lessons')
      .where("lessons.id = :id", { id })
      .getOne();

    if (!lessonExists) {
      return response.status(400).json({ error: 'Lesson does not exists.' });
    }

    let lesson = await getConnection()
      .createQueryBuilder()
      .update(Lessons)
      .set({ name, duration, course_id, description, video_id })
      .where("id = :id", { id })
      .execute();

    return response.json(lesson)
  }

  public async listAllByCourse(request: Request, response: Response): Promise<Response> {
    const { course_id } = request.params;

    const lessons = await getRepository(Lessons)
      .createQueryBuilder("lessons")
      .where("course_id = :course_id", { course_id })
      .getMany().then(e => e.map(img => {
        return {
          id: img.id,
          name: img.name,
          duration: img.duration,
          course_id: img.course_id,
          description: img.description,
          video_id: img.getVideoUrl()
        }
      }));

    if (!lessons) {
      return response.status(400).json({ error: 'Does not have any lessons for this course' });
    }

    return response.json(lessons)
  }

  public async listById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const lesson = await getRepository(Lessons)
      .createQueryBuilder("lessons")
      .where("id = :id", { id })
      .getMany().then(e => e.map(img => {
        return {
          id: img.id,
          name: img.name,
          duration: img.duration,
          course_id: img.course_id,
          description: img.description,
          video_id: img.getVideoUrl()
        }
      }));

    if (!lesson) {
      return response.status(400).json({ error: 'This lesson does not exist' });
    }

    return response.json(lesson)
  }
}
