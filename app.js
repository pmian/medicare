const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = ({
  email: String,
  password: String,
  CityLocation: String,
  ptdr: String,
  Hoursperday: Number ,
  Patientsperhr: Number,
  array: []

});
const userSchema1 = ({
  emaildc: String,
  emailpt: String,
  datea: { type: Date }
});

const User = new mongoose.model("User", userSchema);
const Coder = new mongoose.model("Coder", userSchema1);


app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/logindoc", function(req, res) {
  res.render("logindoc");
});

app.get("/register", function(req, res) {
  res.render("register");
});
app.get("/registerdoc", function(req, res) {
  res.render("registerdoc");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
    CityLocation: req.body.CityLocation,
    ptdr: "patient" ,

  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("login");
    }
  });
});
app.post("/registerdoc", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
    CityLocation: req.body.CityLocation,
    ptdr:"doctor",
    Hoursperday: req.body.Hoursperday ,
    Patientsperhr: req.body.Patientsperhr,
    array: Array(62).fill(req.body.Hoursperday*req.body.Patientsperhr)

  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("logindoc");
    }
  });
});

var usernm = "default";
app.post("/login", function(req, res) {
  const username = req.body.username;
  usernm = username ;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.post("/logindoc", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password && foundUser.ptdr === 'doctor') {
          Coder.find({ emaildc: foundUser.email} ,function (err, docs1) {
              if (err){
                  console.log(err);
              }
              else{
                res.render("doctorpage",{newListItems1:docs1});
              }
          });
        }
        else{
          console.log("u r not doctor");
        }
      }
    }
  });
});
app.post("/secrets",function(req,res){
  const cityloc = req.body.cityloc;
  // var query = { CityLocation: "bbsr" };
  User.find({ CityLocation: cityloc,ptdr: "doctor"} ,function (err, docs) {
      if (err){
          console.log(err);
      }
      else{
        res.render("list1",{listTitle: "Doctors available near ",newListItems:docs});
      }
  });

 //   userDB.close();
 // });
});
app.post("/list1", function(req, res) {
  var date1 = new Date("2021-11-20");
  var date2 = new Date(req.body.date);
  console.log(req.body.date);
// var date2 = new Date("07/30/2019");

// To calculate the time difference of two dates
var Difference_In_Time = date2.getTime() - date1.getTime();
var Difference_In_Days =  Difference_In_Time / (1000 * 3600 * 24);
var usrnm = req.body.usernamedc
  User.findOne({
    email: usrnm
  }, function(err, foundUsera) {
    if (err) {
      console.log(err);
    }
    else {
      if (foundUsera) {
        console.log(foundUsera.array[Difference_In_Days]);
        if (foundUsera.array[Difference_In_Days] > 0) {
          // foundUsera.array[Difference_In_Days]-- ;
  //         companyModel.update(
  // { email : foundUsera},
  // { "$set": { foundUsera.array[Difference_In_Days]:foundUsera.array[Difference_In_Days] - 1  }},
  //                             )
// User.findOneAndUpdate({email:foundUsera.email},["array.${Difference_In_Days}:7"])
// User.findOneAndUpdate(
//     {email: foundUsera.email},
//     {$inc : {array[Difference_In_Days] : -1}},
//     function(err, document) {
//         console.log(err);
//     }
// );
console.log(foundUsera.array[Difference_In_Days]);

          const newCoder = new Coder({
            emaildc: req.body.usernamedc,
            emailpt: usernm,
            datea: req.body.date

          });
          newCoder.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              res.write("<h1>appointment taken successfully</h1>");
              res.send();
            }
          });

        }
        else
        {
          console.log("book any other day");

        }

      }
    }
}  );
});









app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
