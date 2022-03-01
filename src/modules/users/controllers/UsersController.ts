import { Request, Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { container } from 'tsyringe';
import CreateUserService from '../services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const { locale } = response;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password }, locale);

    return response.json(instanceToPlain(user));
  }
}
