// const fs = require('fs');
const Tour = require('./../models/toursModels');

exports.aliasTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.querySting = queryString;
  }

  filter() {
    const queryObj = { ...this.querySting };
    console.log('queryObj: ', queryObj);
    const excludedField = ['page', 'limit', 'fields', 'sort'];
    excludedField.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    console.log('this.query: ', this.query);
    return this;
  }

  sort() {
    if (this.querySting.sort) {
      const sortField = this.querySting.sort.split(',').join(' ');
      this.query = this.query.sort(sortField);
    } else this.query = this.query.sort('-createdAt');
    return this;
  }

  fields() {
    if (this.querySting.fields) {
      const fields = this.querySting.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else this.query = this.query.select('-__v');
    return this;
  }

  paginate() {
    const page = this.querySting.page * 1 || 1;
    const limit = this.querySting.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    // const queryObj = { ...req.query };
    // const excludedField = ['page', 'limit', 'fields', 'sort'];
    // excludedField.forEach(el => delete queryObj[el]);
    // let querySting = JSON.stringify(queryObj);
    // querySting = querySting.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   match => `$${match}`
    // );
    // let query = Tour.find(JSON.parse(querySting));

    // if (req.query.sort) {
    //   const sortField = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortField);
    // } else query = query.sort('-createdAt');

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else query = query.select('-__v');

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTour = await Tour.countDocuments();
    //   console.log('numTour: ', numTour);
    //   console.log('skip: ', skip);
    //   if (skip > numTour) {
    //     throw new Error('this page not exist');
    //   }
    // }
    const features = new APIFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    console.log('err: ', err);
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    console.log('1111111111');
    const tour = await Tour.findById(req.params.id);
    console.log('tour: ', tour);
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: '<Updated tour here...>'
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
