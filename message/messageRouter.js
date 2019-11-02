const express = require('express');
const db = require('../data/db.js')
const router = express.Router();



router.post('/', async (req, res) => {
    const messageInfo = req.body

    if(!messageInfo.title || !messageInfo.contents || messageInfo.title === '' || messageInfo.contents === ''){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else { 
        try{
            const message = await db.insert(messageInfo);
            res.status(201).json(message)
        } catch(err) {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the post to the database"})
    }}
    

})

router.post('/:id/comments', async (req, res) => {
    const id = req.params.id
    const commentInfo = req.body
    try {
        const post = await db.findById(id)
        if(post.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            if(!commentInfo.text || commentInfo.text === ''){
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            } else {
                const comment = await db.insertComment({...commentInfo, post_id: id})
                res.status(201).json(commentInfo)
            }
        }
    } catch(err) {
        res.status(500).json({ error: "There was an error while saving the comment to the database", err })
    }
})



router.get('/', async (req, res) => {
    try {
        const messages = await db.find()
        res.status(200).json(messages)
    } catch(err) {
        res.status(500).json({ error: "The posts information could not be retrieved.", err })
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const message = await db.findById(id)
        if(message.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(message)
        }
    } catch(err) {
        res.status(500).json({ error: "The post information could not be retrieved.", err })
    }
})

router.get('/:id/comments', async (req, res) => {
    const id = req.params.id
    try {
        const post = await db.findById(id)
        if(post.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            const messages = await db.findPostComments(id)
            if(messages.length === 0){
                res.status(200).json('There are no comments, be the first to comment')
            } else {
                res.status(200).json(messages)
            }
        }
    } catch(err) {
        res.status(500).json({ error: "The comments information could not be retrieved.", err })
    }
})

router.delete('/:id', async(req, res) => {
    const id = req.params.id
    try {
        const post = await db.findById(id)
        if(post.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            const delPost = await db.remove(id)
            res.status(200).json({post, delPost})
        }
    } catch(err) {
        res.status(500).json({ error: "The post could not be removed" })
    }
})

router.put('/:id', async (req, res) =>{
    const id = req.params.id
    const postInfo = req.body
    try {
        const post = await db.findById(id)
        if(post.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else if (!postInfo.title || !postInfo.contents || postInfo.title === '' || postInfo.contents === '') {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else {
            const updPost = await db.update(id, postInfo)
            res.status(200).json(updPost)
        }
    } catch(err) {
        res.status(500).json({ error: "The post information could not be modified." })
    }
})

module.exports = router