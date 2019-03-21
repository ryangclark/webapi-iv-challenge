// library imports
const express = require('express');

// router imports
const postsRoutes = require('./posts/postsRoutes.js');
const usersRoutes = require('./users/usersRoutes.js');

const server = express();

// middleware
server.use(express.json());
// uppercase middleware
// function uppercaseName(req, res, next) {
//   if (req.body.hasOwnProperty('name')) {
//     req.body.name = req.body.name.toUpperCase();
//   }
//   next();
// }
// server.use(uppercaseName);

// routing
server.use('/api/posts', postsRoutes);
server.use('/api/users', usersRoutes);

module.exports = server;
