if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://gabrieldonada:Batata@123@cluster0.onmcb.mongodb.net/findJobs?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/findJobs"}
}