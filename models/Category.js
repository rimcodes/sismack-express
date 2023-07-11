const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        details: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        },
        color: {
            type: String
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

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});


categorySchema.set('toJSON', {
    virtuals: true
});

exports.Category = mongoose.model('Category', categorySchema)
exports.categorySchema = categorySchema;
