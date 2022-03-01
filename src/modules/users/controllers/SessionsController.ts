import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '../services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const { locale } = response;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { token } = await authenticateUser.execute(
      { email, password },
      locale,
    );

    return response.json({ token });
  }
}
