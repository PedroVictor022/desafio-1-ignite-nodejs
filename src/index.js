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
  console.log(userAlreadyExist);
  if (userAlreadyExist) {
    res.status(400).send('User already exists ');
  } else {
    users.push({
      id: uuidv4(),
      name,
      username,
      todos: []
    });
  }
  res.status(201).json({
    message: 'User created',
    data: users
  });
});

app.get('/users/list', (req, res) => {
  res.status(200).send(users);
})

app.get('/todos', checksExistsUserAccount, (req, res) => {
  const { username } = req.headers;
  return res.json(username.todos);
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  const { title, deadline } = req.body;
  const { username } = req;

  const addNewTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }
  username.todos.push(addNewTodo);
  res.status(201).send('Todo is add');
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