const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      cb(null, fileName + '-' + Date.now())
  }
})
 
const uploadOptions = multer({ storage: storage })


router.get('/products', async (req, res) =>{
    try{
    let filter = {};
    let sort = {}

    if(req.query.categories)
    {
        filter = {category: req.query.categories.split(':')}
    }

    if(req.query.soryBy)
    {
        const parts = req.query.sortBy.split(',')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    const productList = await Product.find(filter).populate(
        {
            path: 'products',
            filter,
            options: {
                limit: parseInt(req.query.limit),
                sort
            }
        }
    );

    res.send(productList);
    } catch (e) {
        res.status(500).send()
    }
})



router.get('/products/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const product = await Product.findById(_id)

        if (!product) {
            return res.status(404).send()
        }

        res.send(product)
    } catch (e) {
        res.status(500).send()
    }
})



router.post('/products', uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new Product({
        name: req.body.name,
        category: req.body.category,
        image: `${basePath}${fileName}`, 
        price: req.body.price,
        color: req.body.color,
        size: req.body.size,
        status: req.body.status,
        publish: req.body.publish,
    });

    product = await product.save();

    if (!product) return res.status(500).send('The product cannot be created');

    res.send(product);
});


router.patch('/products/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'image', 'price', 'status', 'publish']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!product) {
            return res.status(404).send()
        }

        res.send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            res.status(404).send()
        }

        res.send(product)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports =router;