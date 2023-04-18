const mongoose = require('mongoose');
const { getSupportInfo } = require('prettier');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour must have a name'],
      unique: true
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a  group size']
    },
    difficulty: {
      type: String,
      require: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
      type: Number,
      defualt: 4.5
    },
    ratingQuantity: {
      type: Number,
      defualt: 0
    },
    rating: {
      type: Number,
      default: 4.5
    },
    price: {
      type: Number,
      required: [true, 'tour must have a price']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      requires: [true, 'A tour must have summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      require: [true, 'A tour must have imageCover']
    },
    images: [String],
    creatAt: {
      type: Date,
      defualt: Date.now()
    },
    startDates: [Date]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeek').get(function() {
  return this.duration / 7;
});

tourSchema.pre('save',function(){

})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

