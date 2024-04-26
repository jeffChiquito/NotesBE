const mongoose = require('mongoose')


const password = process.argv[2]

const url = 
`mongodb+srv://jeffrychiquito:${password}@cluster0.hycd9cz.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: Number
})

const Phone = mongoose.model('Phone', phonebookSchema)


if (process.argv.length == 3) {
    Phone.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}else if(process.argv.length == 5){
    const phone = new Phone({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    phone.save().then(result => {
        console.log(`Added ${phone.name} number ${phone.number} to phonebook`)
        mongoose.connection.close()
    })



    const name = process.argv.slice(2)

   

    console.log(`nombre: ${name[1]}  numero: ${name[2]}`)
    process.exit()

    // const phone = new Phone({
    //     name: process.argv[3],
    //     number: process.argv[4],
    // })
    
    // phone.save().then(result => {
    //     console.log(`Added ${phone.name} number ${phone.number} to phonebook`)
    //     mongoose.connection.close()
    // })
}else{
    console.log('parameters for action are required');
    process.exit()
}

