import * as Yup from 'yup';
import { Request, Response } from 'express';
import { getConnection } from "typeorm";
import { uuid } from 'uuidv4';
import bcrypt from 'bcryptjs';

import Users from '../models/Users';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    const schema = Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string()
				.required()
				.min(6)
    });

    if (!(await schema.isValid(request.body))) {
			return response.status(400).json({ error: 'Validation fails.' });
    }

    const userExists = await getConnection()
      .createQueryBuilder()
      .select("users.username")
      .from(Users, 'users')
      .where("users.username = :username", { username })
      .getOne();

    if (userExists) {
      return response.status(400).json({ error: 'User already exists.' });
    }

    const hashedPass = await bcrypt.hash(password, 8);

    const user = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values([
          {
            id: uuid(),
            username,
            password: (await hashedPass).toString(),
          },
      ])
      .execute();

    return response.json(user)
  }

}
