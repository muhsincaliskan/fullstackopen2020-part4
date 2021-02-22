const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const { SECRET } = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs.map(blog => blog.toJSON()))
})
blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})
blogsRouter.post('/', async (request, response, next) => {
    try {
        const body = await request.body
        const token = await request.token

        const decodedToken = jwt.verify(token, SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            ...body,
            user: { username: user.username, name: user.name, id: user._id }
        })
        const savedBlog = await (await blog.save()).populate('user').execPopulate()
        logger.info(`blog saved ${savedBlog.title}`)
        user.blogs = user.blogs.concat(savedBlog._id)
        logger.info(`blog belongs to user ${user.username}`)
        await user.save()

        response.json(savedBlog.toJSON())
    } catch (error) {
        next(error)
    }

})
blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const body = request.body
        const token = request.token

        const decodedToken = jwt.verify(token, SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const targetBlog = await Blog.findById(request.params.id)
        const user = await User.findById(decodedToken.id)
      
        if (user._id.toString() === targetBlog.user.id.toString()) {
            const blog = {
                title: body.title||targetBlog.title,
                author: body.author||targetBlog.author,
                url: body.url||targetBlog.url,
                likes: body.likes||targetBlog.likes
            }

            const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
            response.json(updatedBlog.toJSON())
        }
        else{
            response.status(401).send({error:'Unauthorized'})
        }

    } catch (error) {
        next(error)
    }


})

blogsRouter.delete('/:id', async (request, response, next) => {
    const token = request.token

    const decodedToken = jwt.verify(token, SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const targetBlog = await Blog.findById(request.params.id)
    const user = await User.findById(decodedToken.id)

    if (user._id.toString() === targetBlog.user.id.toString()) {
        Blog.findByIdAndRemove(request.params.id)
            .then(() => {
                response.status(204).end()
            })
            .catch(error => next(error))
    }
    else{
        response.status(401).send({error:'Unauthorized'})
    }

})

module.exports = blogsRouter