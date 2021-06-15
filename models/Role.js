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
        type: String
    },
    slug:{
        type: String,
        required: true
    },
    usuario:{
        type: String,
        required: true
    },
    deletada:{
        type: Number,
        default: 0
    }
})
 mongoose.model("roles", Role)