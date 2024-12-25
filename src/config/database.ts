import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';
import dotenv from "dotenv";
import { User } from "../models/user"

dotenv.config()

const port = Number(process.env.DB_PORT)

const sequelize = new Sequelize({
    dialect: MySqlDialect,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: port,
    models: [User],
  });

export default sequelize

async function testConnection(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

testConnection()