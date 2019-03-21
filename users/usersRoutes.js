const express = require('express');

const db = require('../data/helpers/userDb');

const router = express.Router();

function uppercaseName(req, res, next) {
  if (req.body.hasOwnProperty('name')) {
    req.body.name = req.body.name.toUpperCase();
  }
  next();
}
router.use(uppercaseName);

router.get('/', async (req, res) => {
  try {
    const users = await db.get();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The operation could not be completed.', error: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await db.getById(req.params.id);
    if (!user) {
      res.status(404).json({
        message: `A user with ID ${req.params.id} could not be found.`
      });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The operation could not be completed.', error: error });
  }
});

router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await db.getUserPosts(req.params.id);
    if (!posts.length) {
      // If `posts` is an empty list,
      // check if `req.params.id` is actually a user
      const user = await db.getById(req.params.id);
      if (!user) {
        res
          .status(404)
          .json({ message: `User with ID ${req.params.id} not found.` });
      } else {
        res.status(200).json(posts);
      }
    } else {
      res.status(200).json(posts);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The operation could not be completed.', error: error });
  }
});

router.post('/', async (req, res) => {
  if (!req.body.hasOwnProperty('name')) {
    return res
      .status(400)
      .json({ message: 'Please provide a `name` property.' });
  }
  try {
    const newUser = await db.insert(req.body);
    if (newUser) {
      res.status(201).json(newUser);
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
        .json({ message: `User with ID ${req.params.id} not found.` });
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
  if (!req.body.hasOwnProperty('name')) {
    return res
      .status(400)
      .json({ message: 'Please provide a `name` property.' });
  }
  try {
    const user = await db.update(req.params.id, req.body);
    if (!user) {
      res
        .status(404)
        .json({ message: `User with ID ${req.params.id} not found.` });
    } else {
      const updatedUser = await db.getById(req.params.id);
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The operation could not be completed.', error: error });
  }
});

module.exports = router;
