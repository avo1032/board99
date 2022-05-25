const mongoose = require("mongoose");

const boardsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    date : {

    }
})

module.exports = mongoose.model("Boards", boardsSchema);
