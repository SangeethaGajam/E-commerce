const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();


router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({})
        res.send(categories)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/categories/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const category = await Category.findById(_id)

        if (!category) {
            return res.status(404).send()
        }

        res.send(category)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/categories', async (req, res) => {
    const category = new Category(req.body)

    try {
        await category.save()
        res.status(201).send(category)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/categories/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!category) {
            return res.status(404).send()
        }

        res.send(category)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)

        if (!category) {
            res.status(404).send()
        }

        res.send(category)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports =router;