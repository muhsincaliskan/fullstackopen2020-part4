const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { title: 1, author: 1 })
    response.json(users.map(u => u.toJSON()))
})
usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const saltRounds = await bcrypt.genSalt(10)
        const password=await body.passwordHash
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (error) {
        console.log(error)
    }

})

module.exports = usersRouter