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
    beneficios:{
        type: String,
        required: true
    },
    finalizado:{
        type: Number,
        default: 0
    }
})
 mongoose.model("vagas", Vaga)