const { json } = require('express')
const express = require('express')
const router = express.Router()
const path = require ('path')
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/story')

// Template Engines Helpers
const {FormatDate, truncate, stripTags, editIcon} = require('../helpers/html')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render(path.join (__dirname, '..', 'public', 'stories/add.html'))
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err) 
        return res.render(path.join (__dirname, '..', 'public', 'error/500'))
    }
})

// @desc    Show all stories
// @route   GET /stories
router.get('/stories', ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({status: 'public'})
        .populate('user')
        .sort({createdAt:'desc'})
        .lean();
        stories.forEach(stories => {
            stories.body =  stripTags(truncate(stories.body, 90))
        });
        stories = stories.map((value, key) => {
            return {
                ...value,
                storIcon: editIcon(value.user._id, req.user._id, value._id)
            }
        });
        res.render(path.join (__dirname, '..', 'public', 'stories/index.html'), {
            stories: JSON.stringify(stories),
        })
    } catch (err) {
       console.error(err) 
       return res.render(path.join (__dirname, '..', 'public', 'error/500'))
    } 
})

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()

        story.body =  stripTags(story.body)

        story.createdAt =  FormatDate(story.createdAt, 'MMMM Do YYYY, h:mm:ss a')

        story = {
                ...story,
                storIcon: editIcon(story.user._id, req.user._id, story._id)
        }

        if (!story) {
            return res.render(path.join (__dirname, '..', 'public', 'error/404'))
        }

        res.render(path.join (__dirname, '..', 'public', 'stories/show.html'), {
            story: JSON.stringify(story),
            id: story._id,
            title: story.title,
            body: story.body,
            createdAt: story.createdAt,
            storIcon: story.storIcon,
            displayName: story.user.displayName,
            image: story.user.image,
            userId: story.user._id,
            firstName: story.user.firstName
        })
    } catch (err) {
        console.error(err) 
        return res.render(path.join (__dirname, '..', 'public', 'error/404')) 
    }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findOne({
            _id: req.params.id
        }).lean()
    
        story.body =  stripTags(story.body)
    
        if (!story) {
            return res.render(path.join (__dirname, '..', 'public', 'error/404'))
        }
    
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render(path.join (__dirname, '..', 'public', 'stories/edit.html'), {
                id: story._id,
                title: story.title,
                body: story.body,
                status: JSON.stringify(story.status),
                user: story.user,
                createdAt: story.createdAt
            })
        }
    } catch (err) {
        console.error(err) 
        return res.render(path.join (__dirname, '..', 'public', 'error/500'))  
    }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

    if (!story) {
        return res.render(path.join (__dirname, '..', 'public', 'error/404'))
    }

    if (story.user != req.user.id) {
        res.redirect('/stories')
    } else {
        story = await Story.findOneAndUpdate({_id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })

        res.redirect('/dashboard')
    }
    } catch (err) {
        console.error(err) 
        return res.render(path.join (__dirname, '..', 'public', 'error/500')) 
    }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err) 
        return res.render(path.join (__dirname, '..', 'public', 'error/500')) 
    }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .sort({createdAt:'desc'})
        .lean();
        stories.forEach(stories => {
            stories.body =  stripTags(truncate(stories.body, 90))
        });
        stories = stories.map((value, key) => {
            return {
                ...value,
                storIcon: editIcon(value.user._id, req.user._id, value._id)
            }
        });
        res.render(path.join (__dirname, '..', 'public', 'stories/more.html'), {
            stories: JSON.stringify(stories),
        })
    } catch (err) {
       console.error(err) 
       return res.render(path.join (__dirname, '..', 'public', 'error/500'))
    } 
})

module.exports = router;