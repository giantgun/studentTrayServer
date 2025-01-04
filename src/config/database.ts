import { Sequelize } from '@sequelize/core'
import { MySqlDialect } from '@sequelize/mysql'
import dotenv from "dotenv"
import { User } from "../models/user"
import { Lodge } from '../models/lodge'
import { Room } from '../models/room'
import { Item } from '../models/item'
import { Service } from '../models/service'
import { Business } from '../models/business'

dotenv.config()

const port = Number(process.env.DB_PORT)

const sequelize = new Sequelize({
    dialect: MySqlDialect,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: port,
    models: [
      User, 
      Lodge,
      Room,
      Item,
      Service,
      Business,
    ],
  });

export default sequelize

export async function testDbConnection(){
    try {
        await sequelize.authenticate();
        console.log('Connection to db has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

sequelize.sync({force: true})

// sequelize.sync()