const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Curriculo = new Schema({
    usuario:{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    role:{
        type: Schema.Types.ObjectId,
        ref: "roles"
    }
})

mongoose.model("curriculos", Curriculo)