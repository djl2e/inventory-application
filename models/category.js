const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
  }
)

CategorySchema
  .virtual('url')
  .get(function() {
    return 'category/' + this._id;
  });

module.exports = mongoose.model('Category', CategorySchema);
