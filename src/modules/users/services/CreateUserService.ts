import { injectable, inject } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import IHashProvider from '../../../shared/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../schemas/User';
import translate from '../../../shared/utils/translate';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(
    { name, email, password }: IRequestDTO,
    locale: string,
  ): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError(translate('Email address already in use.', locale));
    }

    const passwordHash = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}
