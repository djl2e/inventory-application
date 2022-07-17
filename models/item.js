const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    price: { type: Number, required: true },
    stock: { type: Boolean, required: true, default: true },
    img: { type: String }
  }
)

ItemSchema
  .virtual('url')
  .get(function() {
    return 'item' + this._id;
  });

module.exports = mongoose.model('Item', ItemSchema);
