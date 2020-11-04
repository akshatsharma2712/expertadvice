//========================
// comments Routes
//========================
var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");
router.get("/new",middleware.isLoggedIn,function(req,res){
	//find campground by id
	Campground.findById(req.params.id,function(err,campground){
		if(err)
			{
				console.log(err);
			}
		else{
				res.render("comments/new",{campground: campground});

		}
		
	})
})

router.post("/",middleware.isLoggedIn,function(req,res){
	//look campground using ID
	Campground.findById(req.params.id,function(err,campground){
		if(err)
			{
				console.log(err);
				res.redirect("/campgrounds")
			}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
					{
						req.flash("error","Something went wrong!!");
						console.log(err);
					}
				else{
					//add username and id to comment
					comment.author.id= req.user._id;
					comment.author.username= req.user.username;
					comment.save();
				  campground.comments.push(comment);	
					campground.save();
					req.flash("success","Comment added!!");
					res.redirect('/campgrounds/'+ campground._id);
				}
			})
		}
	})
	//create a new comments
	//connect new comment to the campground
	//redirect to the campground show page
})
//middleware

//edit************

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err)
			{
               res.redirect("back");
			}

		else{
				res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});

		}
	})
	

})

//update comments***************

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
if(err)
	{
		ress.redirect("back");
    }
	else{

	res.redirect("/campgrounds/"+req.params.id);
	}
})
})

//delete comment route**********
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	//findbyid and remove
	
	Comment.findByIdAndRemove(req.params.comment_id,function(err)
							 {
		if(err)
			{
              res.direct("back");
			}
		else{
                res.redirect("/campgrounds/"+req.params.id);
		}
	})
	
})





module.exports=router;