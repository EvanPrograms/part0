require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "person", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "person2", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "person3", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "person4", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    ${date}`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    return response.json(person)
  } else {
    return response.status(404).end("This entry does not exist!")
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end(`Entry ${id} has been deleted`)
})

const generateId = () => {
  return Math.floor(Math.random() * 1000)
}

const nameCheck = (name) => {
  return persons.some(person => person.name === name)
}
app.use(morgan(':method :url :body'))
app.post('/api/persons', (request, response) => {
  const person = request.body
  person.id = generateId()
  
// note  

  morgan.token('body', request => JSON.stringify(request.body))
  if (!person.name) {
    return response.status(400).json({
      error: "name missing"
    })
  }

  if (!person.number) {
    return response.status(400).json({
      error: "number mising"
    })
  }

  if (nameCheck(person.name)) {
    return response.status(400).json({
      error: "Name must be unique"
    })
  }
  persons = persons.concat(person)
  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})