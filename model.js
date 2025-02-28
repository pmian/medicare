// Step 3 - this is the code for ./models.js

var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  appointmentID : String ,
	name: String,
	// desc: String,
	img:
	{
		data: Buffer,
		contentType: String
	}
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Image', imageSchema);
// Step 5 - set up multer for storing uploaded files
