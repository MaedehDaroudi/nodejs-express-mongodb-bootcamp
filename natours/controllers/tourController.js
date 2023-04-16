// const fs = require('fs');
const Tour = require('./../models/toursModels');

exports.aliasTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedField = ['page', 'limit', 'fields', 'sort'];
    excludedField.forEach(el => delete queryObj[el]);
    let querySting = JSON.stringify(queryObj);
    querySting = querySting.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    let query = Tour.find(JSON.parse(querySting));

    if (req.query.sort) {
      const sortField = req.query.sort.split(',').join(' ');
      query = query.sort(sortField);
    } else query = query.sort('-createdAt');

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else query = query.select('-__v');

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTour = await Tour.countDocuments();
      console.log('numTour: ', numTour);
      console.log('skip: ', skip);
      if (skip > numTour) {
        throw new Error('this page not exist');
      }
    }

    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
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
