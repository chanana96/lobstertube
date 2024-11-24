import { Sequelize } from 'sequelize';
require('dotenv').config()

const uri= process.env.SEQUELIZE_URI

export const sequelize = new Sequelize(uri)

export const db = async () =>{
try {
	await sequelize.authenticate();
	
	console.log('Connection has been established successfully.');
	sequelize.models.user.sync()
  } catch (error) {
	console.error('Unable to connect to the database:', error);
  }
}