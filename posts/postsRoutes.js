const express = require('express');

const db = require('../data/helpers/postDb');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await db.get();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The operation could not be completed.', error: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await db.getById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({
          message: `A post with ID ${req.params.id} could not be found.`
        });
    } else {
      res.status(200).json(post);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The operation could not be completed.', error: error });
  }
});

router.post('/', async (req, res) => {
  if (!req.body.hasOwnProperty('text') || !req.body.hasOwnProperty('user_id')) {
    return res
      .status(400)
      .json({ message: 'Please provide a `user_id` and `text` property.' });
  }
  try {
    // NOT checking if `user_id` is a valid user
    const newPost = await db.insert(req.body);
    if (!newPost) {
      res.status(404).json({ message: `User ${req.body[user_id]} not found.` });
    } else {
      res.status(201).json(newPost);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The operation could not be completed.', error: error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const adios = await db.remove(req.params.id);
    if (!adios) {
      res
        .status(404)
        .json({ message: `Post with ID ${req.params.id} not found.` });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The operation could not be completed.', error: error });
  }
});

router.put('/:id', async (req, res) => {
  if (!req.body.hasOwnProperty('text')) {
    return res
      .status(400)
      .json({ message: 'Please provide a `text` property.' });
  }
  try {
    const post = await db.update(req.params.id, req.body);
    if (!post) {
      res.status(404).json({ message: `Post ${req.params.id} not found.` });
    } else {
      const updatedPost = await db.getById(req.params.id);
      res.status(200).json(updatedPost);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The operation could not be completed.', error: error });
  }
});

module.exports = router;
