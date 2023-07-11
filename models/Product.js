const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            default: 0
        },
        details: {
            type: String
        },
        description: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        },
        image: {
            type: String
        },
        images: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
)

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});


productSchema.set('toJSON', {
    virtuals: true
});

exports.Product = mongoose.model('Product', productSchema)
exports.productSchema = productSchema