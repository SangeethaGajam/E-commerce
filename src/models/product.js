const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    price : {
        type: Number,
        required: true
    },
    color : {
        type: String,
        required: true
    },
    size : {
        type: Number,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    publish : {
        type: String,
        required: true,
        default: "Publish"
    },

}
, {timestamps: true})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


exports.Product = mongoose.model('Product', productSchema);
