require('dotenv').config ()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const Note = require('./models/note')


const app = express()

 morgan.token('reqBody', (request, response) => {
     return JSON.stringify(request.body)
 })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('dist'))


let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
    .then(note => {
      if(note){
        response.json(note)
      }else{
        response.status(404).end()
      }      
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }

app.post('/api/notes', (request, response, next) => {
    const body = request.body
    
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }


    const note = new Note({
        content: body.content,
        important: body.important || false, 
    })

    note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
    
})

app.put('/api/notes/:id', (request, response, next) => {
    const{content, important} = request.body


    Note.findByIdAndUpdate(request.params.id, {content, important}, { new: true, runValidators: true, context:'query'})
    .then(updatedNote => {
      response.json(updatedNote)
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