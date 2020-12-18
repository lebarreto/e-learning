import * as Yup from 'yup';
import { Request, Response } from 'express';
import { getConnection, getRepository } from "typeorm";
import { uuid } from 'uuidv4';

import Courses from '../models/Courses';

export default class CoursesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.query;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(request.query))) {
			return response.status(400).json({ error: 'Validation fails.' });
    }

    const courseExists = await getConnection()
      .createQueryBuilder()
      .select("courses.name")
      .from(Courses, 'courses')
      .where("courses.name = :name", { name })
      .getOne();

    if (courseExists) {
      return response.status(400).json({ error: 'Course already exists.' });
    }

    const course = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Courses)
      .values([
          {
            id: uuid(),
            name: name?.toString(),
            image: request.file.originalname,
          },
      ])
      .execute();

    return response.json(course)
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name } = request.query;
    const { id } = request.params;

    const courseExists = await getConnection()
      .createQueryBuilder()
      .select("courses.id")
      .from(Courses, 'courses')
      .where("courses.id = :id", { id })
      .getOne();

    if (!courseExists) {
      return response.status(400).json({ error: 'Course does not exists.' });
    }

    let course;

    if (request.file) {
      course = await getConnection()
      .createQueryBuilder()
      .update(Courses)
      .set({ name: name?.toString(), image: request.file.originalname })
      .where("id = :id", { id })
      .execute();
    } else {
      course = await getConnection()
      .createQueryBuilder()
      .update(Courses)
      .set({ name: name?.toString() })
      .where("id = :id", { id })
      .execute();
    }

    return response.json(course)
  }

  public async listAll(request: Request, response: Response): Promise<Response> {
    const courses = await getRepository(Courses)
    .createQueryBuilder("courses")
    .getMany().then(e => e.map(img => {
      return {
        id: img.id,
        name: img.name,
        image_url: img.getAvatarUrl()
      }
    }));

    if (!courses) {
      return response.status(400).json({ error: 'Course does not exists.' });
    }

    return response.json(courses)
  }
}
