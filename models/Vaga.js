const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Vaga = new Schema({
    nome:{
        type: String,
        required: true
    },
    criador:{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    candidatos:{
        type: Schema.Types.ObjectId,
        ref: "curriculos"
    },
    descricao:{
        type: String,
        required: true
    },
    area:{ //educacao....
        type: String,
        required: true
    },
    especialista:{
        type: String,
        required: true
    }
})
 mongoose.model("vagas", Vaga)