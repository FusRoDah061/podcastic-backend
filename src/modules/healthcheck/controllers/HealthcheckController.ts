import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HealthcheckService from '../services/HealthcheckService';

export default class HealthcheckController {
  public async index(request: Request, response: Response): Promise<Response> {
    const healthcheckService = container.resolve(HealthcheckService);

    const health = await healthcheckService.execute();

    return response.status(health.status === 'ok' ? 200 : 503).json(health);
  }
}
