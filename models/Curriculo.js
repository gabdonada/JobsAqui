const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Curriculo = new Schema({
    usuario:{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    nome:{
        type: String,
        required: true
    },
    sobre:{
        type: String,
        required: true
    },
    experiencia:{
        type: String
    },
    educacao:{
        type: String,
        required: true
    },
    certificacao:{
        type: String
    },
    idioma:{
        type: String,
        required: true
    },
    habilidades:{
        type: String
    },
    outros:{
        type: String
    }
})

mongoose.model("curriculos", Curriculo)