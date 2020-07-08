let express = require("express");
let router = express.Router();

let db = require("../data/db");

router.get("/", (req, res) => {
    db.find()
    .then(posts => {
        if (!posts) {
            res.status(404).json({ message: "No posts found" })
        } else {
            res.status(200).json(posts);
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.get("/:id", (req, res) => {
    let { id } = req.params;
    db.findById(id)
    .then(post => {
        if (post){
            if(post) {
                res.status(200).json(post);
            }
            else {
                res.status(404).json({ message: "The post with the specified ID does not exist"});
            }
        }
    })
    .catch(err => res.status(500).json({error: "The post information could not be retrieved."}))

})

router.get("/:id/comments", (req, res) => {
    let postID = req.params.id;
    db.findPostComments(postID)
    .then(comments => {
        if(!comments) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(comments)
        }
    })
    .catch(err => res.status(500).json({ error: "The comments information could not be retrieved." }))
})

router.post("/", (req, res) => {
    let { title, contents } = req.body;

    if(!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db.insert(req.body)
        .then(postID => {
            res.status(201).json( {title, contents})
        })
        .catch(err => res.status({ error: "There was an error while saving the post to the database" }))
    }
})

router.post('/:id/comments', (req, res) => {
    let postID = req.params.id
    let newComment = req.body;

    if(newComment) {
        if(!newComment.text) {
            res.status(400).json({errorMessage: "Please provide text for the comment"})
        } else {
            db.insertComment({...newComment, post_id: postID}) // ... to keep everything the same in the object, and change its post_id with the id from url/params
            .then(comment => {
                res.status(201).json(newComment )
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
        }
    
    } else {
        res.status(404).json({ error: "The post with the specified ID does not exist."})
    }

})

router.delete("/:id", (req, res) => {
    let postID = req.params.id;
    
    db.findById(postID)
    .then( post => {
        // res.status(200).json(post)
        db.remove(postID)
        .then(removedIDs => {
            if(removedIDs > 0) {
                res.status(200).json(post)
            } else {
                res.status(500).json({ error: "The comments information could not be retrieved." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post could not be removed" })
        })
    }
    ).catch(err => {
        res.status(500).json({ err })
    });


    // db.findById(postID)
    // .then(post => {
    //     if(post) {
    //         db.remove(postID)
    //         .then(removedIDs => {
    //             if(removedIDs > 0) {
    //                 res.status(200).json(post)
    //             } else {
    //                 res.status(500).json({ error: "The post could not be removed" })
    //             }
    //         })
    //         .catch(err => {
    //             res.status(500).json({ error: "The post could not be removed" })
    //         })
    //     } else {
    //         res.status(404).json({ message: "The post with the specified ID does not exist." })
    //     }
    // })
    // .catch(err => {
    //     res.status(500).json({ error: "The post could not be removed" })
    // })
})

router.put('/:id', (req, res) => {
    let change = req.body;

    if(!change.title || !change.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post"});
    } else {
        db.update(req.params.id, change)
        .then(updated => {
            if(updated === 1) {
                res.status(200).json(change)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist"})
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
    }
})

module.exports = router;