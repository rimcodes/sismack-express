const {User} = require('../models/User')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

/**
 * @desc Get all users
 * @route Get /users
 * @access Private
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password')
    if(!users?.length ) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})

/**
 * @desc Get all workers
 * @route Get /users/workers
 * @access Private
 */
const getClients = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'client'}).select('-password')
    if(!users?.length ) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})


/**
 * @desc Get user
 * @route Get /users/:id
 * @access Private
 */
const getUser = asyncHandler( async (req, res) => {

    const { id } = req.params

    const user = await User.findById(id).select('-password')
    if(!user ) {
        return res.status(400).json({ message: 'No user found'})
    }
    res.json(user)
})

/**
 * @desc Create a new user
 * @route Post /users
 * @access Private
 */
const createNewUser = asyncHandler( async (req, res) => {
    const { phone, password, role, name, address } = req.body
    // console.log(phone, password, role);

    // confirm data
    if (!phone || !password ) {
        return res.status(400).json({ message: 'These fields phone and password are required'})
    }

    // check for duplicates
    const duplicate = await User.findOne({ phone }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate phone, phone taken'})
    }

    const file = req.file;
    let imagePath;

    let fileName = 'user.png';
    let basePath = process.env.BASE_PATH || 'http://localhost:3500/'
    if(file) {
        fileName = req.file.key;
        basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
        imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = `${basePath}${fileName}`;
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10)

    const userObject = { phone, "password": hashPassword, role, image: imagePath, name, address }

    // Create and store user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${user.phone} created`})
    } else {
        res.status(400).json({ message: 'Invalid user data received'})
    }
})

/**
 * @desc Update a user
 * @route PATCH /users
 * @access Private
 */
const updateUser = asyncHandler(async (req, res) => {
    const { id, phone, role, active, password, name, cords } = req.body

    // confirm data
    if ( !id ) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ phone }).lean().exec()
    // Allow update to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(400).json({ message: 'Duplicate phone'})
    }

    const file = req.file;
    let imagePath;

    let basePath = process.env.BASE_PATH;
    if(file) {
        fileName = req.file.key;
        basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
        imagePath = `${basePath}${fileName}`;
        user.image = imagePath
    }

    user.phone = phone
    user.role = role
    user.name = name
    user.active = active,
    user.cords = cords
    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10)
    }

    const updateUser = await user.save()

    res.json(updateUser)
})

/**
 * @desc Delete a new user
 * @route Delete /users
 * @access Private
 */
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body
    // avoid searching using invalid id (Cast error)
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({ message: 'Invalid user id'});
    }

    if (!id) {
        return res.status(400).json({ message: 'User ID required '})
    }

    
    const user = await User.findById(id).exec()

    if (user.role === "admin") {
        return res.status(400).json({ message: 'Can not delete admin'})
    }
    
    if (!user) {
        return res.status(400).json({ message: 'User not found '})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.phone} with ID ${result._id} deleted`

    res.json(reply)

})

module.exports = {
    getAllUsers,
    getUser,
    createNewUser,
    updateUser,
    deleteUser,
    getClients
}
