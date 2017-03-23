
// STEP ONE
// 	grab the data from keys.js. 
var keys = require('./keys');

// STEP TWO
// 	Then store the keys in a variable.
var temp_twitterKeys = keys.twitterKeys;
// console.log(temp_twitterKeys.consumer_key);


// STEP THREE
// 	Make it so liri.js can take in one of the following commands:
// 	my-tweets, spotify-this-song, movie-this, do-what-it-says
var inputString = process.argv;
var command = inputString[2];
//take the FUll process argumnet...
//...slice it at the third item (after the command call)...
//...then join the resulting array into a string
var command_detail = process.argv.slice(3).join(" ");




function executeCommands(whatToDo, detail) {

	if(whatToDo == "do-what-it-says" || whatToDo == "d"){
		var fs = require('fs');
		fs.readFile('random.txt', function(err, data) {
		    if(err) throw err;
		    var array = data.toString().split(",");
		    var newCommand = array[0];
		    var newDetail = array[1].replace(/\"/g, "");

		    var outputText = "-----------------------"+"\n"
				+"----TEXT FILE COMMAND START----\n"
				+newCommand +"\n"+ newDetail+"\n"
				+"-----TEXT FILE COMMAND END-----\n"
				+"-----------------------";

		    console.log(outputText);
			logText(outputText);
		    executeCommands(newCommand, newDetail)
		});
	}

	if(whatToDo == "my-tweets" || whatToDo == "t"){

		var Twitter = require('twitter');
		 
		var client = new Twitter({
		  consumer_key: temp_twitterKeys.consumer_key,
		  consumer_secret: temp_twitterKeys.consumer_secret,
		  access_token_key: temp_twitterKeys.access_token_key,
		  access_token_secret: temp_twitterKeys.access_token_secret
		});
		 
		var params = {screen_name: 'eyeofbri'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
		    logTweets(tweets);
		  }
		});

	}else if(whatToDo == "spotify-this-song" || whatToDo == "s"){
		//take the FUll process argumnet...
		//...slice it at the third item (after the command call)...
		//...then join the resulting array into a string
		var songName = detail;
		if(!songName){ songName = "The Sign"; }

		var spotify = require('spotify');
	 
		spotify.search({ type: 'track', query: songName }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    } 	
			logMusic(data.tracks.items, songName);
		});

	}else if(whatToDo == "movie-this" || whatToDo == "m"){
		var movieName = detail;
		if(!movieName){ movieName = "Mr. Nobody"; }

		var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&r=json";
		var request = require('request');
		request(queryURL, function (error, response, body) {
		  // console.log('error:', error); // Print the error if one occurred 
		  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
		  // console.log('body:', body); // Print the HTML for the Google homepage.
		  logMovies(body);
		});

	}else{

	}
}

executeCommands(command, command_detail);







function logTweets(tweets) {
	var outputText_1 ="-----------------------\n----START OF TWEETS---";
	console.log(outputText_1);
	logText(outputText_1);

	for (var i = 0; i < tweets.length; i++) {
		var id = tweets[i].id;
		var text = tweets[i].text;

		var outputText_2 = 
			"----------------\n"
			+"--tweet:-"+i+"----\n"
			+id + "\n"+ text +"\n"
			+"----------------"
		;
		console.log(outputText_2);
		logText(outputText_2);
	}

	var outputText_3 ="----END OF TWEETS---\n-----------------------";
	console.log(outputText_3);
	logText(outputText_3);
}


function logMusic(trackItems, songName) {

    var songInfo = trackItems[0];

	if(songName == "The Sign"){
		for (var i = 0; i < trackItems.length; i++) {
			if(trackItems[i].artists[0].name == "Ace of Base"){
				songInfo = trackItems[i];
				break;
			}
		}
	}

	var artist = "Artist: "+songInfo.artists[0].name; //there may be more than one artist, just grab the first
	var name = "Track Name: "+songInfo.name;
	var preview = "Preview URL: "+songInfo.preview_url;
	var album = "Album Title: "+songInfo.album.name;

	var outputText =
		"-----------------------"+"\n"
		+"----START OF SPOTIFY----\n"
		+artist+"\n"+name+"\n"+preview+"\n"+album+"\n"
		+"-----END OF SPOTIFY-----\n"
		+"-----------------------"
	;

	console.log(outputText);
	logText(outputText);
}



function logMovies(body) {

	// // * Title of the movie.
	var mTitle = body.split("Title")[1].split("Year")[0];
	mTitle = "Movie Title: "+mTitle.substring(3,mTitle.length - 3);

	// // * Year the movie came out.
	var mYear = body.split("Year")[1].split("Rated")[0];
	mYear = "Year: "+mYear.substring(3,mYear.length - 3);

	// // * IMDB Rating of the movie.
	var mRating = body.split("Rated")[1].split("Released")[0];
	mRating = "Rated: "+mRating.substring(3,mRating.length - 3);

	// // * Country where the movie was produced.
	var mCountry = body.split("Country")[1].split("Awards")[0];
	mCountry = "Produced In: "+mCountry.substring(3,mCountry.length - 3);

	// // * Language of the movie.
	var mLanguage = body.split("Language")[1].split("Country")[0];
	mLanguage = "Language: "+mLanguage.substring(3,mLanguage.length - 3);

	// // * Plot of the movie.
	var mPlot = body.split("Plot")[1].split("Language")[0];
	mPlot = "Plot: "+mPlot.substring(3,mPlot.length - 3);

	// // * Actors in the movie.
	var mActors = body.split("Actors")[1].split("Plot")[0];
	mActors = "Actors: "+mActors.substring(3,mActors.length - 3);

	// // * Rotten Tomatoes Rating.
	var mRotten_Rating = body.split("tomatoRating")[1].split("tomatoReviews")[0];
	mRotten_Rating = mRotten_Rating.substring(3,mRotten_Rating.length - 3);

	//if there are no rotten tomato ratings...
	//...show that... and show imdb ratings istead
	if(mRotten_Rating != "N/A"){
		mRotten_Rating = mRotten_Rating.substring(3,mRotten_Rating.length - 3);
		mRotten_Rating = "Rotten Tomatoes Rating: "+mRotten_Rating;
	}
	else{
		mRotten_Rating = body.split("imdbRating")[1].split("imdbVotes")[0];
		mRotten_Rating = mRotten_Rating.substring(3,mRotten_Rating.length - 3);
		mRotten_Rating = "Rotten Tomatoes Rating: N/A ...\n"+"IMDB Rating: "+mRotten_Rating;
	}

	// // * Rotten Tomatoes URL.
	var mRotten_URL = body.split("tomatoURL")[1].split("DVD")[0];
	mRotten_URL = "Rotten Tomatoes URL: "+mRotten_URL.substring(3,mRotten_URL.length - 3);


	var outputText =
		"-----------------------"+"\n"
		+"----START OF OMDB----\n"
		+mTitle+"\n"
		+mYear+"\n"
		+mRating+"\n"
		+mCountry+"\n"
		+mLanguage+"\n"
		+mPlot+"\n"
		+mActors+"\n"
		+mRotten_Rating+"\n"
		+mRotten_URL+"\n"
		+"-----END OF OMDB-----\n"
		+"-----------------------"
	;
	console.log(outputText);
	logText(outputText);
}


// BONUS
// APPEND TEXT TO A FILE
function logText(txt) {
	var fs = require('fs')
	fs.appendFile('log.txt', (txt+"\n"), function (err) {
		if (err) return console.log(err);
		// console.log('Appended!');
	});
}

