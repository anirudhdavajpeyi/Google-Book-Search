const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-aniruddha:Test123@cluster0.vbdcu.mongodb.net/searchActivity", {useNewUrlParser: true});

const listSchema = {
    name: String,
    email: String,
    searchHistory: [String]
  };
  
const List = mongoose.model("List", listSchema);