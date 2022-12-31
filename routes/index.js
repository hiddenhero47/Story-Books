const { json } = require('express')
const express = require('express')
const router = express.Router()
const path = require ('path')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/story')

// Template Engines Helpers
const {FormatDate} = require('../helpers/html')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render(path.join (__dirname, '..', 'public', 'login.html'))
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({user: req.user.id}).lean();
        stories.forEach(stories => {
            stories.createdAt =  FormatDate(stories.createdAt, 'MMMM Do YYYY, h:mm:ss a')
        })
        res.render(path.join (__dirname, '..', 'public', 'dashboard.html'), {
            displayName: req.user.displayName,
            stories: JSON.stringify(stories)
        })

    } catch (err) {
       console.error(err) 
       return res.render(path.join (__dirname, '..', 'public', 'error/500'))
    }

    
})

module.exports = router;