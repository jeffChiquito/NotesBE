require('dotenv').config ()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const Person = require('./models/phone')

const app = express()

morgan.token('reqBody', (request, response) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('dist'))

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

//mongoDB working
app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(persons => {
        response.json(persons)
    }) 
    .catch(error => next(error))
})

//mongoDB working
app.get('/info', (request, response, next) => {
    
    Person.find({})
    .then(persons => {
        const time = new Date()
        response.send(`<p>phonebook has info for ${persons.length} people </br></br>
        ${time.toDateString()}</p>`)
    })
    .catch(error => next(error))
    
    
})

//mongoDB working
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const newId = Math.floor(Math.random() *500) + 1;


    if (!body) {
        return response.status(400).json({
            error: 'content is missing'
        })
    }

    if (!body.name) {
        return response.status(400).json({
            error: "Name is required"
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: "Number is required"
        })
    }

    // if(persons.some(val => val.name == body.name)){
    //     return response.status(409).send('Name is already existing')
    // }
    
    const person = new Person({
        name: body.name,
        number: body.number,
        id: newId
    })

    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))    
    
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


//middleware controller handling error 
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  // este debe ser el último middleware cargado
  app.use(errorHandler)