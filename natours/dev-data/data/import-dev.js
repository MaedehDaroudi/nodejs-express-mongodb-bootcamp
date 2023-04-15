const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../models/toursModels');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(db, {
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('connection successful.'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importDev = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfuly loaded!');
  } catch (err) {
    console.log(`err => ${err}`);
  }
  process.exit();
};

const deleteDev = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfuly deleted!');
  } catch (err) {
    console.log(`err => ${err}`);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importDev();
} else if (process.argv[2] === '--delete') {
  deleteDev();
}
