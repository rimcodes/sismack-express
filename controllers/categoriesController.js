const asyncHandler = require('express-async-handler')

// const {User} = require('../models/User')
// const {Service} = require('../models/Service')
const {Category} = require('../models/Category')

/**
 * @desc Get all Categories
 * @route Get /categories
 * @access Private
 */
const getAllCategories = asyncHandler(async (req, res) => {
    // get all the categories
    const categories = await Category.find()
    if(!categories?.length) {
        return res.status(400).json({ message: 'No Categoriess found'})
    }

    res.json(categories)
})

/**
 * @desc Get single Category
 * @route Get /categories/:id
 * @access Public
 */
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const category = await Category.findById(id)

    if (!category) {
        res.status(400).json({ message: 'No category with the given id!'})
    }

    res.send(category)

})

/**
 * @desc Create a new category
 * @route Post /categories
 * @access Private
 */
const createNewCategory = asyncHandler(async (req, res) => {
    // Create a new Category
    const { title, details } = req.body

    if ( !title || !details  ) {
        return res.status(400).json({ message: 'All fields(title, details) are required'})
    }

    
    const file = req.file;
    let imagePath;

    let fileName = 'public/images/service.png';
    let basePath = process.env.BASE_PATH || 'http://localhost:3500/'
    if(file) {
        fileName = req.file.key;
        basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
        imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = `${basePath}${fileName}`;
    }

    let categoryObject = {}

    categoryObject = { title, details,  image: imagePath }

    // Create and store service
    const createdCategory = await Category.create(categoryObject)

    // createdCategory = await createdCategory.save()

    if (createdCategory) {
        res.status(201).json({ message: `New category created`, createdCategory})
    } else {
        res.status(400).json({ message: 'Invalid category data recieved' })
    }
})

/**
 * @desc Update a category
 * @route PATCH /categories
 * @access Private
 */
const updateCategory = asyncHandler(async (req, res) => {
    // Update a Category
    const { id, title, details, active } = req.body

    if ( !id ) {
        return res.status(400).json({ message: 'id is required'})
    }

    // Confirm service exists to update
    const editedCategory = await Category.findById(id)
    if (!editedCategory) {
        return res.status(400).json({ message: 'Category not found'})
    }

    const file = req.file;
    let imagePath;

    let basePath = process.env.BASE_PATH;
    if(file) {
        fileName = req.file.key;
        basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
        imagePath = `${basePath}${fileName}`;
        editedCategory.image = imagePath
    }

    editedCategory.title = title
    editedCategory.details = details
    editedCategory.active = active

    const updatedCategory = await editedCategory.save()

    res.json({ message: `${updatedCategory.title} updated`, editedCategory})
})

/**
 * @desc Delete a category
 * @route Delete /categories
 * @access Private
 */
const deleteCategory = asyncHandler(async (req, res) => {
    // Delete Category
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Category ID required' })
    }

    // Need further work for implementing this feature
    // const service = await Service.findOne({ category: id }).lean().exec()
    // if(service) {
    //     return res.status(400).json({ message: 'Category has services assigned to it'})
    // }

    // Confirm service exists to delete
    const category = await Category.findById(id).exec()
    if (!category) {
        return res.status(400).json({ message: 'Category not found' })
    }

    const result = await category.deleteOne()

    const reply = `Category ${result.title} with ID ${result._id} deleted`
    res.json(reply)
})

module.exports = {
    getAllCategories,
    getCategory,
    createNewCategory,
    updateCategory,
    deleteCategory
}
