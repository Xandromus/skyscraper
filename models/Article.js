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
    // `link` is required and of type String
    link: {
        type: String,
        unique: true,
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    notes: [
        {
            // Store ObjectIds in the array
            type: Schema.Types.ObjectId,
            // The ObjectIds will refer to the ids in the Note model
            ref: "Note"
        }
    ],
    saved: Boolean
});

// // Custom Instance Methods

// // Custom method `setFullName`
// ArticleSchema.methods.setSaved = function () {
//     // Set the current user's `fullName` to their `firstName` and their `lastName` together
//     this.saved === false ? this.saved = true : this.saved = false;
//     // Return the new `fullName`
//     return this.saved;
// };

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
