const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')

const router = new express.Router()

// Create new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        createdBy: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Read all tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const sortParams = req.query.sortBy.split(':')

        sort[sortParams[0]] = sortParams[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch {
        res.status(500).send()
    }
})

// Read one task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, createdBy: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const updateFields = Object.keys(req.body)
    const isValidUpdate = updateFields.every((field) => allowedUpdates.includes(field))

    if (!isValidUpdate) {
        return res.status(500).send({ error: 'invalid updates' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updateFields.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router