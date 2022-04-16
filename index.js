const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
// require("./databaseConnect");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport-setup");
const books = require("google-books-search");

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-aniruddha:Test123@cluster0.vbdcu.mongodb.net/searchActivity", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const listSchema = {
    name: String,
    email: String,
    searchHistory: [itemsSchema]
  };
  
const SearchActivity = mongoose.model("SearchActivity", listSchema);

app.use(cookieSession({
  name: "webapp-session",
  keys: ['key1', 'key2']
}));

const isLoggedIn = (req, res, next) => {
  if (req.user){
    next();
  } else {
    res.sendStatus(401);
  }
}

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("login");
  // res.send("You are not logged in!!")
});

app.get("/failed", (req, res) => {
  res.send("You are failed to log in!!!");
});

app.get("/success", isLoggedIn, (req, res) => {

  const email = req.user._json.email;
  const name = req.user.displayName;

  SearchActivity.findOne({email: email}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new SearchActivity({
          name: name,
          email: email
        });
        list.save();
        console.log("User created");
        // res.redirect("/" + customListName);
      } else {
        //Show an existing list
        console.log("User already exists");
        // res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });

  console.log(req.user);
  // res.send(`Welcome Mr. ${req.user.displayName}!!<br> ${req.user._json.email}`);
  res.render("homepage", {name: req.user.displayName, email: req.user._json.email});
});


app.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
  });

app.post("/", function(req, res){
  console.log(req.body.email);
  console.log(req.body.password);
});

app.post("/search", (req, res) => {

  const searchItem = req.body.searchItem;
  const email = req.body.email;

  console.log("Search Item: " + searchItem);
  console.log("Email: "+ email);

  item = new Item({
    name: searchItem
  });

  SearchActivity.findOne({email: email}, function(err, foundList){
    SearchActivity.findOne({email: email}, {searchHistory: {$in: {name: searchItem}}}, function(err, foundList1){
      if (!foundList1){
        console.log("Item pushed");
        foundList.searchHistory.push(item);
        foundList.save();
      } else {
        console.log("Item not pushed");
      }
    });
    books.search(searchItem, function(error, results) {
      if ( ! error ) {
        // console.log(results);
        res.render("books", { books: results })
      } else {
        console.log(error);
        res.send("No book found");
  }
});
  //   foundList.searchHistory.push(item);
  //   foundList.save();
  //   books.search(searchItem, function(error, results) {
  //     if ( ! error ) {
  //         console.log(results);
  //         res.render("books", { books: results })
  //     } else {
  //         console.log(error);
  //         res.send("No book found");
  //     }
  // });
      // res.redirect("/success");
    // res.render("/books", )
  });
});

app.get("/search", (req, res) => {

})

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
})

app.listen(5000, function(){
  console.log("Server is up and running on port 5000");
});
