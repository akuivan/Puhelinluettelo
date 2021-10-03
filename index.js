const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms -:body'))

const cors = require('cors')
app.use(cors())

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send('Phonebook has info for ' + persons.length + ' people' + '<br></br>'
    + new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(new Date()))
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  min = Math.ceil(1);
  max = Math.floor(1000);
  id = Math.floor(Math.random() * (max - min + 1) + min)

  const person = request.body
  person.id = id

  if (person.name === undefined) {
    response.status(404).send({ error: 'enter name' })
  } else if (person.number === undefined) {
    response.status(404).send({ error: 'enter number' })
  } else if (persons.some(p => p.name === person.name)) {
    response.status(404).send({ error: 'name must be unique' })
  } else {
    persons.concat(person)
    response.json(person)
  }

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})