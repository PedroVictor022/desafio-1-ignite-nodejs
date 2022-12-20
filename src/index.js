const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({
      message: 'User not found'
    });
  };
  req.user = user;
  return next();
};

app.post('/users', (req, res) => {
  const { name, username } = req.body;
  const userAlreadyExist = users.some((user) => user.username === username);

  if (userAlreadyExist) {
    res.status(400).send(`Error - user already exists!`);
  }
  else {
    const userAlreadyExists = users.some((user) => user.username === username);
    if (userAlreadyExists) {
      res.status(400).send('User already exists!');
    }
    users.push({
      id: uuidv4(),
      name,
      username,
      todos: [],
    });
    console.log(users);
    res.status(200).send('Create account!');
  }

  console.log(users);
  res.status(200).send('Account created!');

});

app.get('/users/list', (req, res) => {
  res.status(200).send(users);
})

app.get('/todos', checksExistsUserAccount, (req, res) => {
  // Complete here
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  // Complete here
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete here
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete here
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete here
});

module.exports = app;