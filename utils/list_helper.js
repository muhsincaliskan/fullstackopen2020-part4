// const _ = require('lodash')
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1
}
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}
    const likes = blogs.map((blog) => blog.likes)
    const highestLike = Math.max(...likes)
    const favoriteBlog = blogs.filter(blog => blog.likes === highestLike)
    return favoriteBlog
}
const totalLikes = (blogs) => {
    if (blogs.length === 0) return {}
    if (blogs.length === 1)
        return blogs[0].likes
    else
        return blogs.reduce((a, b) => a + b.likes, 0)
}

const mostBlogs = (blogs) => {
    if (blogs.length !== 0) {
        const authorBlogCounts = blogs.reduce((authorCount, blog) => {
            authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
            return authorCount
        }, {})
        const maxCount = Math.max(...Object.values(authorBlogCounts))
        const mostBlog = Object.keys(authorBlogCounts).filter(author => authorBlogCounts[author] === maxCount)
        return {
            author: mostBlog[0],
            blogs: maxCount
        }
    }
    else
        return{}
}

const mostLikes = (blogs) => {

    const resultArray = []
    const shortenedBlogs = blogs.map(blog => ({ author: blog.author, likes: blog.likes }))

    const authorWithMaxLikes = shortenedBlogs.reduce((result, blog) => {
        result[blog.author] = result[blog.author] || 0
        result[blog.author] = result[blog.author] + blog.likes
        return result
    }, {})

    for (const author in authorWithMaxLikes) {
        resultArray.push(authorWithMaxLikes[author])
    }

    const maxLikes = Math.max(...resultArray)

    for (const author in authorWithMaxLikes) {
        if (authorWithMaxLikes[author] === maxLikes) {
            return {
                author: author,
                likes: maxLikes
            }

        }
    }
}



module.exports = {
    dummy,
    favoriteBlog,
    totalLikes,
    mostBlogs,
    mostLikes
}