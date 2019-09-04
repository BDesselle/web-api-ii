const express = require("express");
const db = require("../data/db");
const router = express.Router();

// GET ALL POSTS
router.get("/posts", (req, res) => {
  try {
    db.find().then(posts => {
      res.status(200).json(posts);
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "The posts information could not be retrieved." });
  }
});

// GET POST BY ID
router.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.findById(id).then(post => {
      post.length > 0
        ? res.status(200).json(post)
        : res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

// GET COMMENTS BY POST ID
router.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  try {
    db.findPostComments(id).then(comments => {
      comments.length
        ? res.status(200).json(comments)
        : res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

// POST A POST
router.post("/posts", (req, res) => {
  const { title, contents } = req.body;
  try {
    !title || !contents
      ? res.status(400).json({
          errorMessage:
            "Please provide both a title and contents for your post."
        })
      : db
          .insert(req.body)
          .then(post => {
            res.status(201).json(post);
          })
          .catch(() => {
            res.status(500).json({
              error: "There was an error while saving the post to the database"
            });
          });
  } catch (err) {
    res.status(500).json({
      error: "There was an error while saving the post to the database"
    });
  }
});

// POST A COMMENT TO A POST BY ID
router.post("/posts/:id/comments", (req, res) => {
  const comment = { ...req.body, post_id: req.params.id };
  try {
    db.findById(req.params.id).then(post => {
      post.length === 0
        ? res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        : !comment.text
        ? res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." })
        : db
            .insertComment(comment)
            .then(() => {
              res.status(201).json(comment);
            })
            .catch(() => {
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database"
              });
            });
    });
  } catch (err) {
    //
  }
});

// DELETE A POST BY ID
router.delete("/posts/:id", (req, res) => {
  try {
    db.findById(req.params.id).then(post => {
      post.length
        ? db
            .remove(req.params.id)
            .then(() => {
              res.status(200).json(post);
            })
            .catch(() => {
              res.status(500).json({ error: "The post could not be removed" });
            })
        : res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
    });
  } catch (err) {
    //
  }
});

// UPDATE POST BY ID
router.put("/posts/:id", (req, res) => {
  const { title, contents } = req.body;
  try {
    db.findById(req.params.id).then(post => {
      post.length === 0
        ? res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        : !title || !contents
        ? res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
          })
        : db
            .update(req.params.id, req.body)
            .then(() => {
              db.findById(req.params.id).then(newPost => {
                res.status(200).json(newPost);
              });
            })
            .catch(() => {
              res
                .status(500)
                .json({ error: "The post information could not be modified." });
            });
    });
  } catch (err) {
    //
  }
});

module.exports = router;
