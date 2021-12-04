import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connect = () => mongoose.connect(config.DB,{process.env.DATABASE_CONNECTION_STRING: true}, {
  autoIndex: true,
})
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error(err));

export default connect;