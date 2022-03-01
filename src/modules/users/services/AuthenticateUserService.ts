import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';
import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '../../../shared/errors/AppError';
import IHashProvider from '../../../shared/providers/HashProvider/models/IHashProvider';
import authConfig from '../../../config/authConfig';
import translate from '../../../shared/utils/translate';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponseDTO {
  token: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(
    { email, password }: IRequestDTO,
    locale: string,
  ): Promise<IResponseDTO> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        translate('Incorrect email/password combination.', locale),
        'Unauthorized',
        401,
      );
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError(
        translate('Incorrect email/password combination.', locale),
        'Unauthorized',
        401,
      );
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(instanceToPlain(user), secret, {
      subject: user.id,
      expiresIn,
    });

    return { token };
  }
}
