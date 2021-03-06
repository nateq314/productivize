import { Model } from "objection";
import Knex from "knex";
const connections = require("../../knexfile");

const knex = Knex(connections[process.env.NODE_ENV]);
Model.knex(knex);

export default class User extends Model {
  static get tableName() {
    return "users";
  }
}
