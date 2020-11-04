
var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");//automatically requires index.js


var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dcejv6x3d', 
  api_key: '841356472966823', 
  api_secret: 'nZOJntR88hQy6Nv1uueggme-2zI'
});

//INDEX route- show all campgrounds
router.get("/",function(req,res){

//get campgrounds from mongodb
	Campground.find({},function(err, allCampground){
		if(err)
			{
				console.log(err);
			}
		else{
			res.render("campgrounds/campgrounds2",{campgrounds:allCampground,currentUser: req.user});
		}
		
	})
//res.render("campgrounds2",{campgrounds:campgrounds});
});
//CREATE- add new campground to DB
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      // add image's public_id to campground object
      req.body.campground.imageId = result.public_id;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
    });
});
//NEW- displays from to mame a new entry to DB
router.get("/new",middleware.isLoggedIn,function(req,res){
	// show a form
	res.render("campgrounds/new");
});
//SHOW- show information about a particular campground
router.get("/:id",function(req,res){
	//find the campground about a particular id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err)
			{
				console.log(err);
			}
		//render show template with that campground
		else
			{
				res.render("campgrounds/show",{campground: foundCampground});
			}
		
	});
		
})
//*******************
//EDIT CAMPGROUND
//*******************
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res)
    {
	Campground.findById(req.params.id,function(err,foundCampground)
	{
		res.render("campgrounds/edit",{campground:foundCampground});
		
	});		
	});
	
//UPDATE CAMPGROUND

router.put("/:id", upload.single('image'), function(req, res){
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            campground.name = req.body.campground.name;
            campground.description = req.body.campground.description;
            campground.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});

//DESTROY campgrounds
router.delete('/:id', function(req, res) {
  Campground.findById(req.params.id, async function(err, campground) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(campground.imageId);
        campground.remove();
        req.flash('success', 'Campground deleted successfully!');
        res.redirect('/campgrounds');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});


//middleware



module.exports=router;