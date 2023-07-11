const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "client"
        },
        active: {
            type: Boolean,
            default: true
        },
        phone: {
            type: String
        },
        address: {
            type: String
        },
        image: {
            type: String
        },
        cords: {
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

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

userSchema.set('toJSON', {
    virtuals: true
});

exports.User = mongoose.model('User', userSchema)
exports.userSchema = userSchema
