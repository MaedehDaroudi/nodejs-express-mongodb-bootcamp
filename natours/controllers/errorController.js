const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = ` Invalid ${err.path} ${err.value}`;
  return AppError(message, 404);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  console.log('err.isOperational: ', err.isOperational);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('Error...', err);

    res.status('500').json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'err';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
    console.log('===========');
    console.log('err: ', err);
    let error = { ...err };
    console.log('error: ', error);
    console.log('error.name: ', error.name);
    if (error.name === 'CastError') {
      console.log('55555555555555555555555555555555555555');
      error = handleCastErrorDB(error);
    }
    sendErrorProd(err, res);
  }
};
