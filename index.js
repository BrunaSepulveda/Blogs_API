const express = require('express');

const app = express();
app.use(express.json());

const user = require('./routes/usersRoute');
const login = require('./routes/loginRoute');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.use(user);
app.use(login);

app.listen(3000, () => console.log('ouvindo porta 3000!'));