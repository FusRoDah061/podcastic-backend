module.exports = {
  apps: [{
    name: "podcastic",
    script: "./dist/server.js",
    instances: 1,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
