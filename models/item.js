const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    img: { type: String }
  }
);

ItemSchema
  .virtual('url')
  .get(function () {
    return `shoes/${this._id}`;
  });

module.exports = mongoose.model('Item', ItemSchema);
