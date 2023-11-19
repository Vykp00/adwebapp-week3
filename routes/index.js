var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My todos' });
});

//List to store name
const users = [];

/* POST todo data */
router.post('/todo', function (req, res, next) {
  const { name, task } = req.body;
  //check through users list to see if name exist
  const userExists = users.find(user => user.name === name);

  if (userExists) {
    // if user exists, append the task to their todos
    userExists.todos.push(task);
    //res.send("Todo added");
    // send message to the screen
    res.send({ response: 'Todo added' });
    console.log('Todo added');
  } else {
    // if user doesn't exist, create a new json object
    const newUser = {
      name: name,
      todos: [task]
    };
    users.push(newUser);
    //res.send("User added");
    // send message to the screen
    res.send({ response: 'User added' });
    console.log('User added');
  }

});

// Handle GET requests to the "/user/:id" route
router.get('/user/:id', function (req, res, next) {
  const userName = req.params.id;
  const user = users.find(user => user.name === userName);

  if (user) {
    // User found, send name and todos
    res.send({ name: user.name, todos: user.todos });
  } else {
    // User not found, send an error message
    res.status(404).send('User not found');
  }
});

router.delete('/user/:id', function (req, res, next) {
  const userName = req.params.id;
  const userIndex = users.findIndex(user => user.name === userName);
  console.log(userIndex)
  // from userIndex, delete one item the users array
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.send('User deleted');
  } else {
    res.status(404).send('User not found');
  }
});
//Since I used `this`in the the put script, function (req, res, next)  need to be used to bind the v
router.put('/user', function (req, res, next) {
  const { name, taskIndex } = req.body;
  const user = users.find(user => user.name === name);

  if (user) {
    // Check if the taskIndex is valid
    if (taskIndex >= 0 && taskIndex < user.todos.length) {
      // Remove the task at the specified index
      user.todos.splice(taskIndex, 1);
      res.send('Task deleted');
    } else {
      res.status(400).send('Invalid task index');
    }
  } else {
    res.status(404).send('User not found');
  }
});
module.exports = router;
