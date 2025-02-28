const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
// const server = require('http').Server(app)
// const io = require('socket.io')(server)
// const { v4: uuidV4 } = require('uuid')


var fs = require('fs');
var path = require('path');
require('dotenv/config');

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
// boyparser.json nt added diff from upload image file

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});
var multer = require('multer');

  var storage = multer.diskStorage({
  	destination: (req, file, cb) => {
  		cb(null, 'uploads')
  	},
  	filename: (req, file, cb) => {
  		cb(null, file.fieldname + '-' + Date.now())
  	}
  });

  var upload = multer({ storage: storage });

var imgModel = require('./model');




const userSchema = ({
  email: String,
  password: String,
  CityLocation: String,
  ptdr: String,
  Hoursperday: Number ,
  Patientsperhr: Number,
  array: []

});
const User = new mongoose.model("User", userSchema);

const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);

const userSchema1 = ({
  emaildc: String,
  emailpt: String,
  datea: { type: Date },
  items: [itemsSchema],
  prescription: [itemsSchema],
  weight:Number,
  height:Number,
  bloodpressure:String,
  vidcall:String

});



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
app.get("/vid", function(req, res) {
  res.render("index");
});



app.get("/:postId", function(req, res){

const requestedPostId = req.params.postId;


  Coder.findOne({_id: requestedPostId}, function(err, postMain){
  if(postMain){  res.render("appntformal", {
      appnt_id:requestedPostId,
      newListItems2 : postMain.items,
      newListItems4 : postMain.prescription,


      weight : postMain.weight,
      height:postMain.height,
      bloodpressure:postMain.bloodpressure,
      vidcall:postMain.vidcall

    });}
  });

});
app.get("/:postId/dr", function(req, res){

const requestedPostId = req.params.postId;


  Coder.findOne({_id: requestedPostId}, function(err, postMain){
  if(postMain){  res.render("appntformaldoc", {
      appnt_id:requestedPostId,
      newListItems2 : postMain.items,
      newListItems4 : postMain.prescription,
      weight : postMain.weight,
      height:postMain.height,
      bloodpressure:postMain.bloodpressure,
      vidcall:postMain.vidcall
    });}
  });

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
          var a = foundUsera.array[Difference_In_Days];
          a--;
          foundUsera.array.set(Difference_In_Days,a);

foundUsera.save()
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
            datea: req.body.date,
            weight:0,
            height:0,
            bloodpressure: "Update it",
            vidcall:"No info till now"

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

app.post("/showappnt",function(req,res){
  Coder.find({ emailpt: usernm } ,function (err, docs1) {
      if (err){
          console.log(err);
      }
      else{
        res.render("appntlistpt",{listTitle: "My appointments ",newListItems:docs1});
      }
  });
});

app.post("/:postId",function(req,res){
  const requestedPostId = req.params.postId;
  const Itemname1 = req.body.newItem ;
  const item = new Item({
    name: Itemname1
  });

  Coder.findOne({_id: requestedPostId}, function(err, foundList){
    if(foundList){  foundList.items.push(item);
      foundList.save();
      res.redirect("/" + requestedPostId);
    }});
});
app.post("/:postId/weight",function(req,res){
  const requestedPostId = req.params.postId;
  const weightname = req.body.updateweight ;
Coder.findByIdAndUpdate(requestedPostId, { weight: weightname },  function(err,foundweight){
  res.redirect("/" + requestedPostId);
});


});
app.post("/:postId/weight/dr",function(req,res){
  const requestedPostId = req.params.postId;
  const weightname = req.body.updateweight ;
Coder.findByIdAndUpdate(requestedPostId, { weight: weightname },  function(err,foundweight){
  res.redirect("/" + requestedPostId + "/dr" );
});


});
app.post("/:postId/height",function(req,res){
  const requestedPostId = req.params.postId;
  const heightname = req.body.updateheight ;
Coder.findByIdAndUpdate(requestedPostId, { height: heightname },  function(err,foundheight){
  res.redirect("/" + requestedPostId);
});


});
app.post("/:postId/height/dr",function(req,res){
  const requestedPostId = req.params.postId;
  const heightname = req.body.updateheight ;
Coder.findByIdAndUpdate(requestedPostId, { height: heightname },  function(err,foundheight){
  res.redirect("/" + requestedPostId + "/dr");
});


});
app.post("/:postId/bloodpressure",function(req,res){
  const requestedPostId = req.params.postId;
  const bloodpressurename = req.body.updatebloodpressure ;
Coder.findByIdAndUpdate(requestedPostId, {bloodpressure:bloodpressurename  },  function(err,foundbloodpressure){
  res.redirect("/" + requestedPostId);
});
});
app.post("/:postId/bloodpressure/dr",function(req,res){
  const requestedPostId = req.params.postId;
  const bloodpressurename = req.body.updatebloodpressure ;
Coder.findByIdAndUpdate(requestedPostId, {bloodpressure:bloodpressurename  },  function(err,foundbloodpressure){
  res.redirect("/" + requestedPostId + "/dr");
});
});
// app.post("/:postId/vidcall",function(req,res){
//   const requestedPostId = req.params.postId;
//   const vidcallname = req.body.vidcall ;
// Coder.findByIdAndUpdate(requestedPostId, {vidcall:vidcallname  },  function(err,foundvidcall){
//   res.redirect("/" + requestedPostId );
// });


// });
app.post("/:postId/vidcall/dr",function(req,res){
  const requestedPostId = req.params.postId;
  const vidcallname = req.body.vidcall ;
Coder.findByIdAndUpdate(requestedPostId, {vidcall:vidcallname  },  function(err,foundvidcall){
  res.redirect("/" + requestedPostId + "/dr");
});


});
app.post('/:postId/reports', upload.single('image'), (req, res, next) => {
var apntid = req.params.postId;
  	var obj = {
      appointmentID: apntid ,
  		name: req.body.name,
  		// desc: req.body.desc,
  		img: {
  			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
  			contentType: 'image/png'
  		}
  	}
  	imgModel.create(obj, (err, item) => {
  		if (err) {
  			console.log(err);
  		}
  		else {
  			// item.save();
  			res.redirect('/'+apntid);
  		}
  	});
  });
  app.post("/:postId/renderimg",function(req,res){
    const requestedPostIdreport = req.params.postId;
    imgModel.find({appointmentID :requestedPostIdreport }, (err, items) => {
  		if (err) {
  			console.log(err);
  			res.status(500).send('An error occurred', err);
  		}
  		else {
  			res.render('onlyimg1', { items: items });
  		}
  	});
  });
  app.post("/:postId/dr/add", function(req, res){

    const requestedPostId = req.params.postId;

    const itemName = req.body.newItem;

    const item = new Item({
      name: itemName
    });


      Coder.findOne({_id: requestedPostId}, function(err, foundList){
        foundList.prescription.push(item);
        foundList.save();
        res.redirect("/" + requestedPostId + "/dr");
      });

  });
  app.post("/:postId/dr/delete", function(req, res){
    const requestedPostId = req.params.postId;
    const checkedItemId = req.body.checkbox;



      Coder.findOneAndUpdate({_id: requestedPostId}, {$pull: {prescription: {_id: checkedItemId}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + requestedPostId + "/dr");
        }
      });



  });



app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
