/* DEPRECIATE */
/* eslint-disable */
const express = require('express');
const passport = require('passport');
const User = require('./userModel.js');
const decodeToken = require('../api/auth/token');

// Creates router for specific API route for import in server.js
const router = express.Router();

// Get all users request
router.get('/', decodeToken, async (req, res) => {
  try {
    const users = await User.find().select('id', 'name');
    if (users.length) {
      res.status(200).json({
        message: 'The users were found in the database',
        users,
      });
    } else {
      res
        .status(404)
        .json({ message: 'The users could not be found in the database.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'There was an error retrieving the users from the database.',
      error,
    });
  }
});

// Get users by id request
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('id', 'name');
    if (user) {
      res.status(200).json({
        message: 'The user was retrieved successfully.',
        user,
      });
    } else {
      res
        .status(404)
        .json({ message: 'The user could not be found in the database.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'There was an error retrieving the users from the database.',
      error,
    });
  }
});

router.get('/auth/login', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
  // If this function gets called, authentication was successful
  // `req.user` contains authenticated user
});

router.get('/auth/callback/google', passport.authenticate('google'), (req, res) => {
  res.json(req.user);
});

// Create user request is a duplicate of register but is here in case it's needed
// router.post("/", async (req, res) => {
//   if (!req.body.name) {
//     return res
//       .status(404)
//       .json({ message: "Please include a name and try again." });
//   }
//   try {
//     const newUser = await User.insert(req.body);
//     if (newUser) {
//       res.status(200).json({
//         message: "The new user was created in the database",
//         newUser
//       });
//     } else {
//       res
//         .status(404)
//         .json({ message: "The user could not be created in the database." });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "There was an error creating the user in the database."
//     });
//   }
// });

// Update individual user request
// router.put('/:id', async (req, res) => {
//   if (!req.body.username || !req.body.password) {
//     res.status(404).json({ message: 'Please include a name and try again.' });
//   }
//   try {
//     const newUserInfo = req.body;
//     const hash = bcrypt.hashSync(newUserInfo.password, 14);
//     newUserInfo.password = hash;
//     const user = await User.update(req.params.id, newUserInfo);
//     if (user) {
//       const users = await User.find().where({
//         username: newUserInfo.username,
//       });
//       res.status(200).json({
//         message: 'The user was updated successfully.',
//         numUpdate: user,
//         users,
//       });
//     } else {
//       res
//         .status(404)
//         .json({ message: 'The user could not be updated in the databse.' });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: 'There was an error updating the user in the database.',
//       error,
//     });
//   }
// });

// Delete indiviudal user request
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.remove(req.params.id);
    if (deletedUser) {
      res.status(200).json({
        message: 'User was deleted successfully.',
        numDeleted: deletedUser,
      });
    } else {
      res
        .status(404)
        .json({ message: 'The user could not be deleted in the database.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'There was an error while deleting the user in the database.',
      error,
    });
  }
});

module.exports = router;
