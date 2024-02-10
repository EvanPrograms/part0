require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(requestLogger)
morgan.token('body', request => JSON.stringify(request.body))
app.use(morgan(':method :url :body'))

// let persons = [
//     { 
//       "id": 1,
//       "name": "person", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "person2", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "person3", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "person4", 
//       "number": "39-23-6423122"
//     }
// ]

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  date = new Date()
  Person.find({})
    .then(persons => {
      response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        ${date}`
      )
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  console.log('Request.params.id is: ', typeof request.params.id)
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end('Entry does not exist')
      }
    })
    .catch(error => next(error))

  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)
  // if (person) {
  //   return response.json(person)
  // } else {
  //   return response.status(404).end("This entry does not exist!")
  // }
})

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(person => person.id !== id)

//   response.status(204).end(`Entry ${id} has been deleted`)
// })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  return Math.floor(Math.random() * 1000)
}

const nameCheck = (name) => {
  return persons.some(person => person.name === name)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(typeof body.name)
  if (!body.name) {
    console.log('BODY.NAME WAS EMPTY!')
    return response.status(400).json({ error: 'content missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
    console.log('adfaf')
  })
})
// app.post('/api/persons', (request, response) => {
//   const person = request.body
//   person.id = generateId()
  
// // note  

//   morgan.token('body', request => JSON.stringify(request.body))
//   if (!person.name) {
//     return response.status(400).json({
//       error: "name missing"
//     })
//   }

//   if (!person.number) {
//     return response.status(400).json({
//       error: "number mising"
//     })
//   }

//   if (nameCheck(person.name)) {
//     return response.status(400).json({
//       error: "Name must be unique"
//     })
//   }
//   persons = persons.concat(person)
//   response.json(person)
// })

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})