const asyncHandler = require('express-async-handler')

// const {User} = require('../models/User')
const {Product} = require('../models/Product')
// const {Category} = require('../models/Category')

/**
 * @desc Get all products
 * @route Get /products
 * @access Private
 */
const getAllProducts = asyncHandler(async (req, res) => {
    // get all the products
    let products

    if(req.query.categories) {
        products = await Product.find({ category: req.query.categories }).populate('category')
    } else {
        products = await Product.find().populate('category')
    }

    if(!products?.length) {
        return res.status(400).json({ message: 'No products found'})
    }

    res.json(products)
})

/**
 * @desc Get all products
 * @route Get /products
 * @access Private
 */
const getProduct = asyncHandler(async (req, res) => {
    // get single product

    const { id } = req.params

    const product = await Product.findById(id).populate('category')
    // const product = await Product.findById(id)
    if(!product) {
        return res.status(400).json({ message: 'No Product found with given id'})
    }

    res.json(product)
})

/**
 * @desc Create a new Product
 * @route Post /products
 * @access Private
 */
const createNewProduct = asyncHandler(async (req, res) => {
    // Create a new Product
    const { price, category, title, details } = req.body

    if (!title || !category ) {
        return res.status(400).json({ message: 'All this fields ( title and category) are required'})
    }

    const file = req.file;
    let imagePath;

    let fileName = 'public/images/product.png';
    let basePath = process.env.BASE_PATH || 'http://localhost:3500/'
    if(file) {
        fileName = req.file.key;
        basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
        imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = `${basePath}${fileName}`;
    }
    // Create and store product
    const productObject = { price, category, title, details, image: imagePath }
    const product = await Product.create(productObject)

    if (product) {
        res.status(201).json(product)
    } else {
        res.status(400).json({ message: 'Invalid product data recieved' })
    }

})

/**
 * @desc Update a Product
 * @route PATCH /products
 * @access Private
 */
const updateProduct = asyncHandler(async (req, res) => {
    // Update a Product
    const { id, price, category, title, details, active } = req.body

    if ( !id || !title || !category || !active ) {
        return res.status(400).json({ message: 'All fields( title, details, active or category) are required'})
    }

    // Confirm product exists to update
    const product = await Product.findById(id).exec()
    if (!product) {
        return res.status(400).json({ message: 'Product not found'})
    }

    const file = req.file;
    let imagePath;

    let basePath = process.env.BASE_PATH;
    if(file) {
        fileName = req.file.key;
        basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
        imagePath = `${basePath}${fileName}`;
        product.image = imagePath
    }

    product.title = title
    product.details = details
    product.price = price
    product.category = category
    product.active = active

    const updatedProduct = await product.save()

    res.json(updatedProduct)
})

/**
 * @desc Delete a product
 * @route Delete /products
 * @access Private
 */
const deleteProduct = asyncHandler(async (req, res) => {
    // Delete Product
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Product ID required' })
    }

    // Confirm product exists to delete
    const product = await Product.findById(id).exec()
    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    const result = await product.deleteOne()

    const reply = `Product ${result.title} with ID ${result._id} deleted`
    res.json({message: reply})
})

module.exports = {
    getAllProducts,
    getProduct,
    createNewProduct,
    updateProduct,
    deleteProduct
}
