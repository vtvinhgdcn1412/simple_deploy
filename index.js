const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()

const { dbConnect } = require('./db/db')
const Person = require('./db/personSchema')
const errorHandler = require('./middlewares/errorHandler')
const app = express()

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// let phonebook = [
//   {
//     id: '1',
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: '2',
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: '3',
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: '4',
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ];

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
    return `Method: ${tokens.method(req, res)}\nPath: ${tokens.url(req, res)}\nBody: ${JSON.stringify(req.body)}\nContent-Type: ${tokens.req(req, res, 'content-type')}\n${tokens['response-time'](req, res)} ms`
  }),
)

dbConnect()

app.get('/infor', (req, res, next) => {
  const currentDate = new Date()
  Person.find({})
    .then((phonebook) => {
      res
        .status(200)
        .send(
          `<p>Phone book has infor for ${phonebook.length} people<p> <p>${currentDate}<p>`,
        )
    })
    .catch((err) => next(err))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => res.status(200).json(persons))
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body
  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person
        .save()
        .then((savedPerson) => res.status(200).json(savedPerson))
        .catch((err) => next(err))
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      let message = 'Deleted successfully'
      if (result === null) {
        message = 'Resource no longer exists'
      }
      res.status(200).json({ message })
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      if (person) res.status(200).json(person)
      else res.status(404).end()
    })
    .catch((err) => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ message: 'Missing data' })

  Person.findOne({ name })
    .then((result) => {
      if (result)
        res.status(400).json({ message: 'Person name is already existed' })
      else {
        const newPerson = {
          name,
          number,
        }

        Person.create(newPerson)
          .then((result) => res.status(200).json(result))
          .catch((err) => next(err))
      }
    })
    .catch((err) => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
