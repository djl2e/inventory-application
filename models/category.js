const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    img: { type: String }
  }
)

CategorySchema
  .virtual('url')
  .get(function() {
    return 'brand/' + this._id;
  });

module.exports = mongoose.model('Category', CategorySchema);
