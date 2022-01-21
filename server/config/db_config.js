const promise = require("bluebird");

const initOptions = {
  promiseLib: promise,
};

const connect_string = {
  user: "postgres",
  password: "123456",
  host: "localhost",
  port: 5432,
  database: "payment",

  allowExitOnIdle: true,
};

const schema = "public";

module.exports = {
  initOptions,
  connect_string,
  schema,
};
