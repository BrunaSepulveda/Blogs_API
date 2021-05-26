const express = require('express');

const app = express();
app.use(express.json());

const user = require('./routes/usersRoute');
const login = require('./routes/loginRoute');
const category = require('./routes/categoryRoute');
const post = require('./routes/postRoute');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.use(user);
app.use(login);
app.use(category);
app.use(post);

app.listen(3000, () => console.log('ouvindo porta 3000!'));