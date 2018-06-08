var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true
    },
    // `link` is required, must be unique, and of type String
    link: {
        type: String,
        unique: true,
        required: true
    },
    // `imageLink` is required and of type String
    imageLink: {
        type: String,
        required: true
    },
    // `summary` is required and of type String
    summary: {
        type: String,
        required: true
    },
    // `notes` is an array of ObjectIds that reference the Note model. It's not required, as articles will not always have notes
    notes: [
        {
            // Store ObjectIds in the array
            type: Schema.Types.ObjectId,
            // The ObjectIds will refer to the ids in the Note model
            ref: "Note"
        }
    ],
    // `saved` is a boolean flag to sort articles between the home page and the saved page
    saved: Boolean
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
