const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema(
    {user: String, comment: String, boardsId: String}
);
ReplySchema
    .virtual("userId")
    .get(function () {
        return this
            ._id
            .toHexString();
    });
ReplySchema.set("toJSON", {virtuals: true});
module.exports = mongoose.model("Reply", ReplySchema);