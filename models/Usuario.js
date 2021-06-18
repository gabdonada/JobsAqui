const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    },
    accessType:{
        type: String,
        required: true
    },
    telefone:{
        type: String,
        required: true
    },
    sobre:{
        type: String
    },
    linkedin:{
        type: String
    }
})

mongoose.model("usuarios", Usuario)