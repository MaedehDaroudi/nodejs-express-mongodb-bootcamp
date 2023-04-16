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

module.exports = APIFeature;
