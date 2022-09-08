const mongoose = require('mongoose');

const { Schema } = mongoose;
const s3Remove = require('../aws-image/s3-remove');

const Item = require('./item');

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    img: { type: String }
  }
);

CategorySchema
  .pre('findOneAndRemove', async function (next) {
    const id = this._conditions._id;
    const items = await Item.find({ category: id });

    Promise.all([
      items.map((item) => s3Remove.delete_image(item.img)),
      Item.deleteMany({ category: id })
    ]).then(next);
  });

CategorySchema
  .virtual('url')
  .get(function () {
    return `brand/${this._id}`;
  });

module.exports = mongoose.model('Category', CategorySchema);
