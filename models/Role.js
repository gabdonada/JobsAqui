const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Role = new Schema({
    nome:{
        type: String,
        required: true
    },
    sobre:{
        type: String,
        required: true
    },
    identificacao:{ //educacao....
        type: String,
        required: true
    },
    inicio:{
        type: Date,
        required: true
    },
    fim:{
        type: String,
        required: true
    }
})
 mongoose.model("roles", Role)