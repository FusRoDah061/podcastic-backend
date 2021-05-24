#

<p align="center">
  <img alt="banner" src="./.github/banner.png">
</p>

Backend API of the __Podcastic__ podcast player.

## Development

Prerequite: [Docker](https://www.docker.com/) (a rabbitmq and a mongodb containers will be created)

- Clone the repository
- Install dependencies with `yarn` command
- Start the app with `yarn dev`

You can access RabbitMQ management console at [http://localhost:15672](http://localhost:15672), with both username and password `guest`.

The frontend application can be found [here](https://github.com/FusRoDah061/podcastic-web).

## Deployment

Pushing to the `master` branch will trigger a new release at [Heroku](https://www.heroku.com/).
