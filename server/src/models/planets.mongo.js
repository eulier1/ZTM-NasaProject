const moongose = require('mongoose')

const planetsSchema = new moongose.Schema({
    keplerName: {
        type: String,
        required: true
    },
})

module.exports = moongose.model('Planet', planetsSchema)