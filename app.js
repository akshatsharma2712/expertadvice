var express= require("express");
var app= express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground= require("./models/campground");
var flash= require("connect-flash");
var seedDB = require("./seeds");
var Comment= require("./models/comment");
var passport= require("passport");
var LocalStrategy= require("passport-local");
var User= require("./models/user");
var methodOverride=require("method-override");
//requiring diffrent routes

var campgroundRoutes=require("./routes/campgrounds"),
    commentRoutes=require("./routes/comments"),
	indexRoutes=require("./routes/index");


//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});
mongoose.connect('mongodb://localhost:27017/expertadvice', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

app.use(methodOverride("_method"));

app.use(flash());


// Campground.create({name: "triund",
// 				   image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
// 				  description: "this is very beautiful place to trek aaround .animals could also join your way"}, function(err,campground){
// 	if(err)
// 	{
// 			console.log("error");
// 		}
// 	else{
// 		console.log("newly created");
// 		console.log(campground);
// 	}
//  });





//var campgrounds=[
//	{name: "triund",image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"},
//	{name: "granite hill",image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"},
//	{name: "mountain goat",image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"}
	
//];
//seedDB();// seed the database

//=======================|
//Passporrt configuration|
//=======================|

app.use(require("express-session")({
	secret:"anything that we want!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//for navbar corectness on every page
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);





app.listen(3000,function()
		  {
	console.log("Server expertadvice running!!!");
});