const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');

function generateRandomString() {
 let randomURL= Math.random().toString(36).replace('0.', '').slice(0,6);
 return randomURL;
};


const urlDatabase = {
 "b2xVn2": "http://www.lighthouselabs.ca",
 "9sm5xK": "http://www.google.com"
};

const users = {
 "userRandomID": {
   id: "userRandomID",
   email: "user@example.com",
   password: "purple-monkey-dinosaur"
 },
"user2RandomID": {
   id: "user2RandomID",
   email: "user2@example.com",
   password: "dishwasher-funk"
 }
}


app.post("/urls", (req, res) => {
 let shortURL = generateRandomString();
 urlDatabase[shortURL] = req.body.longURL;
 res.redirect("/urls/" + shortURL);
});

app.get("/u/:shortURL", (req, res) => {
 const longURL = urlDatabase[req.params.shortURL];
 res.redirect(longURL);
});


app.get("/urls_new", (req, res) => {
 res.render("urls_new");

});

app.get("/urls", (req, res) => {
 let templateVars = {
   urls: urlDatabase,
   users: users[req.cookies['user_id']]
 };
  console.log(req.cookies['user_id']);
 res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
 let templateVars = {
   shortURL: req.params.shortURL,
   longURL: urlDatabase[req.params.shortURL],
   users: users[req.cookies['user_id']]
 };
 res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
 delete urlDatabase[req.params.shortURL];
 res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
 urlDatabase[req.params.shortURL] = req.body.longURL;
 res.redirect("/urls/" + req.params.shortURL)
});

app.post("/login", (req, res) =>{
 let userFound;
 for (i in users){
   if (users[i].password === req.body.password && users[i].email === req.body.email ){
     userFound = users[i].id;
     res.cookie('user_id', userFound)
     res.redirect("/urls");
   }
 }
 if (!userFound) {
   console.log("Error 403");
   res.redirect("register")
 } else{
 res.redirect("/urls");
 }
});

app.post("/logout", (req,res) =>{
 res.clearCookie('user_id');
 res.redirect("/urls");
});

app.get("/register", (req,res) =>{
 let templateVars = {
   users: users[req.cookies['user_id']]
 };
 res.render("register", templateVars);
});

app.post("/register", (req,res) =>{
  for (i in users) {
    if (req.body.email !== users[i].email && req.body.password){
 let userID = generateRandomString();
 users[userID] = {'Id': userID, 'email': req.body.email, 'password': req.body.password};
 res.cookie('user_id', userID);
 }else{
   console.log("404 Error")
    }
  }
 res.redirect("/urls");
});


app.get("/login", (req,res) =>{
 let templateVars = {
   users: users[req.cookies['user_id']]
 };
 res.render("login", templateVars);
});



app.get("/urls.json", (req, res) => {
 res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
 res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
 console.log(`Example app listening on port ${PORT}!`);
});