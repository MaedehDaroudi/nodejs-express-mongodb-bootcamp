const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

console.log('local ==>', process.env.DATABASE_LOCAL);

mongoose
  // .connect(db, {
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('connection successful.'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'tour must have a price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);
console.log('Tour: ', Tour);

const testTour = new Tour({
  name: 'reza1',
  rating: 4.7
  // price: 0
});

testTour
  .save()
  .then(doc => {
    console.log(`document => ${doc}`);
  })
  .catch(err => {
    console.log(`err => ${err}`);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
