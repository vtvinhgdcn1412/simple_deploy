const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let phonebook = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method);
//   console.log('Path:  ', request.path);
//   console.log('Body:  ', request.body);
//   console.log('---');
//   next();
// };

// app.use(requestLogger);

app.use(
  morgan(function (tokens, req, res) {
    return `Method: ${tokens.method(req, res)}\nPath: ${tokens.url(req, res)}\nBody: ${JSON.stringify(req.body)}\nContent-Type: ${tokens.req(req, res, 'content-type')}\n${tokens['response-time'](req, res)} ms`;
  }),
);

app.get('/infor', (req, res) => {
  const currentDate = new Date();
  return res
    .status(200)
    .send(
      `<p>Phone book has infor for ${phonebook.length} people<p> <p>${currentDate}<p>`,
    );
});

app.get('/api/persons', (req, res) => {
  return res.status(200).json(phonebook);
});

app.put('/api/persons/:id', (req, res) => {
  console.log('Hi');
  const id = req.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);

  return res.status(204).end();
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((person) => person.id === id);
  if (person) return res.status(200).json(person);
  else return res.status(404).end();
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  const checkUniqueName = (name, phonebook) => {
    const result = phonebook.filter((person) => person.name === name);
    if (result.length === 0) return true;
  };

  if (!name || !number)
    return res.status(400).json({ message: 'Missing data' });

  if (!checkUniqueName(name, phonebook))
    return res.status(400).json({ message: 'Name must be unique' });
  else {
    const newPerson = {
      id: crypto.randomUUID(5),
      name,
      number,
    };

    phonebook = phonebook.concat(newPerson);

    return res.status(200).json(newPerson);
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
