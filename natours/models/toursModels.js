const mongoose = require('mongoose');
const slugify = require('slugify');

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
    slug: String,
    ratingsAverage: {
      type: Number,
      defualt: 4.5
    },
    secretTour: {
      type: Boolean,
      defualt: false
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

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
