import mongoose from 'mongoose';

const connect = () => mongoose.connect(process.env.dbconeccion, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
})
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error(err));

export default connect;