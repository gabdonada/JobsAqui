const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Sugestao = new Schema({
    nome:{
        type: String
    },
    telefone:{
        type: String,
    },
    email:{
        type: String,
    },
    linkedin:{
        type: String,
    },
    descricao:{
        type: String,
        required: true
    }
})

mongoose.model("sugestoes", Sugestao)