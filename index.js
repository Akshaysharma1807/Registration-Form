// Require necessary modules
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Create an Express app
const app = express();

// Middleware to parse JSON and URL encoded request bodies
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Database');
var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Define route for sign up form submission
app.post("/sign_up", (req, res) => {
    // Form validation
    if (!validate(req.body)) {
        return res.status(400).send('Validation failed. Please check your inputs.');
    }

    var name = req.body.name;
    var age = req.body.age;
    var email = req.body.email;
    var phno = req.body.phno;
    var gender = req.body.gender;
    var password = req.body.password;

    var data = {
        "name": name,
        "age": age,
        "email": email,
        "phno": phno,
        "gender": gender,
        "password": password
    };

    // Insert data into MongoDB
    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            return res.status(500).send('Error inserting data into database.');
        }
        console.log("Record Inserted Successfully");
        return res.redirect('signup_successful.html');
    });
});

// Route to serve the home page
app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

// Start the server
const server = app.listen(3000, () => {
    console.log("Listening on port 3000");
});

// Function to validate form inputs
function validate(formData) {
    var fname = formData.name;
    var lname = formData.age;
    var email = formData.email;
    var pswd = formData.password;
    var telph = formData.phno;
    var addr = formData.address;

    if (fname.length < 6 && fname.length > 0) {
        return false;
    }
    if (lname.length == 0) {
        return false;
    }
    var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (!(email.match(mailformat))) {
        return false;
    }
    if (pswd.length < 8) {
        return false;
    }
    var numformat = /[0-9]/;
    if (telph.match(numformat)) {
        if (telph.length != 10) {
            return false;
        }
    }
    if (addr.length == 0) {
        return false;
    }
    return true;
}