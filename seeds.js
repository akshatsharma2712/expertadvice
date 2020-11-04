var mongoose = require("mongoose");
var Campground= require("./models/campground");
var Comment= require("./models/comment");

var data=[
	{
		name:"campground1",
		image:"https://a0.muscache.com/im/pictures/da2f74f3-e484-4b78-8abb-5caa2fd85901.jpg?aki_policy=large",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name:"campground2",
		image:"https://a0.muscache.com/im/pictures/da2f74f3-e484-4b78-8abb-5caa2fd85901.jpg?aki_policy=large",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name:"campground3",
		image:"https://a0.muscache.com/im/pictures/da2f74f3-e484-4b78-8abb-5caa2fd85901.jpg?aki_policy=large",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
];
function seedDB()
{
	//remove all campground
	Campground.remove({},function(err){
	if(err)
		{
			console.log(err);
		}
	console.log("removed campgrounds");
		//add a few campgrounds
	data.forEach(function(seed){
		Campground.create(seed,function(err,campground){
			if(err)
				{
					console.log(err);
				}
			else
				{
					console.log("camppground Added");
					//create a comment
					Comment.create({
						text:"this is good but i wish there was in in internet",
						author:"akshat"
					},function(err,comment){
						if(err)
							{
								console.log(err)
							}
						else
							{
						campground.comments.push(comment);
						campground.save();
								console.log("created new comment");
							}
						
					});
				}
		});
	});
	
});	
	
}
module.exports= seedDB;

