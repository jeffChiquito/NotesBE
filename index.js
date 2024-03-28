const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

morgan.token('reqBody', (request, response) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const count = persons.length
    const time = new Date()
    response.send(`<p>phonebook has info for ${count} people </br></br>
    ${time.toDateString()}</p>`)
    
})

app.get('/api/persons/:id', (request, response) => {
    const personID = Number(request.params.id)
    const person = persons.find( val => val.id === personID)

    if(!person){
        response.status(404).end()
    }else{
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id)
    persons = persons.filter(person => person.id !== personId)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
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

    if(persons.some(val => val.name == body.name)){
        return response.status(409).send('Name is already existing')
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: newId
    }

    persons = persons.concat(person)

    response.json(persons)
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})