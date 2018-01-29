// Study with passive training on alien picnic objects and a triad task testing phase.

// Adapted from a study demonstrating the use of a tablet-designed webpage by Michael Frank at github.com/langcog 
// Adapted 2018 by Claire Bergey in Dan Yurovsky's Communication and Learning Lab

// Overview: (i) Parameters (ii) Helper Functions (iii) Control Flow

// ---------------- PARAMETERS ------------------

var normalpause = 100;

// number of training trials
var numtraintrials = 60; // must be a multiple of 4

// number of testing trials
var numtesttrials = 10;

// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();
	var milliseconds = currentTime.getMilliseconds();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes + ":" + seconds + ":" + milliseconds);
}

// Shuffle the image array to randomly assign images to co-occurrence design
makeimageArray = function() {
	imageArray = shuffle(allimages);
	return imageArray;
}

// Is this a train or test trial ?
getTrainOrTest = function(num) {
	var trialtype = "";
   	if (num < numtraintrials + 1) {
   		trialtype = "train";
   	} else {
   		trialtype = "test";
   	}
   	return trialtype;  
}


var allimages = ["object1", "object2", "object3", "object4", "object5"];

var traintrialtypes = [];

for (i = 0; i < numtraintrials/4; i++) {
	traintrialtypes.push(1, 2, 3, 4);
}


var testtrialtypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


/****** start it all off *******/
showSlide("prestudy");

// MAIN EXPERIMENT
var experiment = {

	subid: "", // subject id from turk

	counter: 0, // trial number

	traintest: "", // train or test trial

	pic1: "", //the name of the first picture from the left

	pic2: "", //the name of the second picture from the left

	pic3: "", //the name of the third picture from the left

	trialtype: "", // type of trial in abstract design

	target: "", // target in testing triad task

	options: [], // options in testing triad task

	chosenpic: "", // which pic subject chooses in testing triad task
		
	date: getCurrentDate(), //the date of the experiment

	timestamp: getCurrentTime(), //the time that the trial was completed at 

	starttime: 0, // holds start time for each trial

	reactiontime: 0, 

	traintrials: [], // array of trial types for training

	testtrials: [], // array of trial types for testing

	imageArray: [], // images in the randomized order we used for this participant

	stims: [], // stims used on this trial

	data: [], // all the data for mmturkey

	
	// just skip right through the prestudy
	preStudy: function() {
		document.body.style.background = "white";
		$("#prestudy").hide();
		setTimeout(function () {
			experiment.start();
		}, normalpause);
	},


	// the end of the experiment. submit the data to turk.
    end: function () {
    	setTimeout(function () {
    		$("#stage").fadeOut();
    	}, normalpause);
    	
    	setTimeout(function() { turk.submit(experiment, true) }, 1500);
    	showSlide("finish");
    	document.body.style.background = "black";
    },



	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		var dataforRound = experiment.subid; 
		dataforRound += "," + numtraintrials + "," + experiment.counter + "," + experiment.traintest;
		dataforRound += "," + experiment.pic1 + "," + experiment.pic2 + "," + experiment.pic3 + "," + experiment.trialtype + "," + experiment.stims;
		dataforRound += "," + experiment.target + "," + experiment.options + "," + experiment.chosenpic;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.reactiontime + "," + experiment.imageArray + "\n";
		experiment.data.push(dataforRound);	

	},
	
	showTestInstructions: function() {
		showSlide("testinstructions");
	},


	// MAIN DISPLAY FUNCTION - this is called each time we go to a new trial
  	next: function() {

  		$("#objects").hide();
  		$("#instructions").hide();
  		$("#testinstructions").hide();

  		// if we've done the last trial already, end the experiment
  		if (experiment.counter > (numtraintrials + numtesttrials)) {
			experiment.end();
			return;
		}

		// is this a train or test trial?
		experiment.traintest = getTrainOrTest(experiment.counter);

		if (experiment.traintest == "train") { // if we're training...

			// disable clicks 
			clickDisabled = true;
  			$( "#advancebutton" ).attr('disabled', true);

			var objects_html = "";
			var aliens_html = "";

			experiment.trialtype = experiment.traintrials[experiment.counter - 1];

			// get the stims to display based on the trial type
			var stims = [];
	    	if (experiment.trialtype == 1) {
	    		stims = [0,1,2];
	    	} else if (experiment.trialtype == 2) {
	    		stims = [0,1,3];
	    	} else if (experiment.trialtype == 3) {
	    		stims = [4,1,2];
	    	} else if (experiment.trialtype == 4) {
	    		stims = [4,1,3];
	    	}
	    	// randomize their order on the screen
	    	stims = shuffle(stims);
	    	experiment.stims = stims;

	    	// prepare the html for the stimuli ...
	 		experiment.pic1 = experiment.imageArray[stims[0]];
		    experiment.pic2 = experiment.imageArray[stims[1]];
		    experiment.pic3 = experiment.imageArray[stims[2]];

		   	//HTML for the first object on the left
			firstname = "objects/" + experiment.imageArray[stims[0]] + ".jpg";
			objects_html += '<table align = "center" cellpadding="30"><tr></tr><tr><td align="center"><img class="pic" src="' + firstname +  '"alt="' + firstname + '" id= "firstPic"/></td>';
		
			//HTML for the first object on the right
			secondname = "objects/" + experiment.imageArray[stims[1]] + ".jpg";
		   	objects_html += '<td align="center"><img class="pic" src="' + secondname +  '"alt="' + secondname + '" id= "secondPic"/></td>';

		   	thirdname = "objects/" + experiment.imageArray[stims[2]] + ".jpg";
		   	objects_html += '<td align="center"><img class="pic" src="' + thirdname +  '"alt="' + thirdname + '" id= "thirdPic"/></td>';
			
	    	objects_html += '</tr></table>';
	    	$("#objects").css("margin-top", "-100px");

	    	// show the blanket
	    	blanket_html = '<img class="displayed" src="' + "objects/blanket.jpg" +  '"alt="' + "objects/blanket.jpg" + '" id= "blanket"/>'
		    $("#blanket").html(blanket_html);

		    $("#objects").html(objects_html); 

		    // prepare the html for the aliens 
		    aliens_html += '<table align = "center" cellpadding="70"><tr></tr><tr><td align="center"><img class="pic" src="' + "objects/alien.jpg" +  '"alt="' + "alien.jpg" + '" id= "firstAlien"/></td>';
		    aliens_html += '<td align="center"><img class="pic" src="' + "objects/alien.jpg" +  '"alt="' + "alien.jpg" + '" id= "secondAlien"/></td>';
		    aliens_html += '<td align="center"><img class="pic" src="' + "objects/alien.jpg" +  '"alt="' + "alien.jpg" + '" id= "thirdAlien"/></td>';
		    aliens_html += '</tr></table>';

		    $("#aliens").html(aliens_html); 

		    experiment.trialnum = experiment.counter;

		    // show everything
		    $("#blanket").show();
		    $("#objects").show();
		    $("#target").hide();
		    $("#options").hide();
		    $("#stage").fadeIn();

		    // get the start time for this trial to use for rt
		    experiment.starttime = Date.now();
		
		    // don't allow clicks for 3 seconds so participants have to look at stims
			setTimeout(function() {clickDisabled = false; $( "#advancebutton" ).attr('disabled', false);}, 3000);
			
		} else if (experiment.traintest == "test") { // if we're testing (triad task)...
			
			// disable clicks
			clickDisabled = true;
			$( "#advancebutton" ).attr('disabled', true);

			// get rid of html and hide objects from training
			$("#objects").html("");
			$("#aliens").html("");
			$("#blanket").html("");
			$("#aliens").hide();
			$("#blanket").hide();
			$("#objects").hide();
			$("#target").show();
		    $("#options").show();
			var target_html = "";
			var options_html = "";

			// based on the trial type, pick the stims to show in the triad task
			experiment.trialtype = experiment.testtrials[experiment.counter - numtraintrials -1];

	    	if (experiment.trialtype == 1) {
	    		experiment.target = 0;
	    		experiment.options = [1,4];
	    	} else if (experiment.trialtype == 2) {
	    		experiment.target = 0;
	    		experiment.options = [2,4];
	    	} else if (experiment.trialtype == 3) {
	    		experiment.target = 4;
	    		experiment.options = [1,0];
	    	} else if (experiment.trialtype == 4) {
	    		experiment.target = 4;
	    		experiment.options = [3,0];
	    	} else if (experiment.trialtype == 5) {
	    		experiment.target = 2;
	    		experiment.options = [1,3];
	    	} else if (experiment.trialtype == 6) {
	    		experiment.target = 2;
	    		experiment.options = [0,3];
	    	} else if (experiment.trialtype == 7) {
	    		experiment.target = 3;
	    		experiment.options = [1,2];
	    	} else if (experiment.trialtype == 8) {
	    		experiment.target = 3;
	    		experiment.options = [4,2];
	    	} else if (experiment.trialtype == 9) {
	    		experiment.target = 1;
	    		experiment.options = [0,2];
	    	} else if (experiment.trialtype == 10) {
	    		experiment.target = 1;
	    		experiment.options = [3,4];
	    	}
	    	// randomize order on screen of two options to compare to the target
	    	experiment.options = shuffle(experiment.options);

	    	experiment.stims = [];
	 		experiment.pic1 = experiment.imageArray[experiment.target];
		    experiment.pic2 = experiment.imageArray[experiment.options[0]];
		    experiment.pic3 = experiment.imageArray[experiment.options[1]];
		    
		    // prepare html for stims
			targetname = "objects/" + experiment.imageArray[experiment.target] + ".jpg";
			target_html += '<table align = "center" cellpadding="50"><tr></tr><tr><td align="center"><img class="pic" src="' + targetname +  '"alt="' + targetname + '" id= "targetPic"/></td>';
			target_html += '</tr></table>';
		    $("#target").html(target_html); 
			
			leftname = "objects/" + experiment.imageArray[experiment.options[0]] + ".jpg";
		   	options_html += '<table align = "center" cellpadding="70"><tr></tr><tr><td align="center"><img class="pic" src="' + leftname +  '"alt="' + leftname + '" id= "leftoption"/></td>';

		   	rightname = "objects/" + experiment.imageArray[experiment.options[1]] + ".jpg";
		   	options_html += '<td align="center"><img class="pic" src="' + rightname +  '"alt="' + rightname + '" id= "rightoption"/></td>';

			
	    	options_html += '</tr></table>';
		    $("#options").html(options_html); 

		    
	  		// depending on what option is chosen, put a black box around chosen object and record it as the chosen pic
			$( "#leftoption" ).click(function() {
				$("#leftoption").css({"border-color": "#000000", 
         			"border-width":"2px", 
         			"border-style":"solid"});
				$("#rightoption").css({"border-color": "#FFFFFF", 
         			"border-width":"2px", 
         			"border-style":"solid"});
				experiment.chosenpic = experiment.options[0];
				clickDisabled = false;
  				$( "#advancebutton" ).attr('disabled', false);
			});
			$( "#rightoption" ).click(function() {
				$("#rightoption").css({"border-color": "#000000", 
         			"border-width":"2px", 
         			"border-style":"solid"});
				$("#leftoption").css({"border-color": "#FFFFFF", 
         			"border-width":"2px", 
         			"border-style":"solid"});
				experiment.chosenpic = experiment.options[1];
				clickDisabled = false;
  				$( "#advancebutton" ).attr('disabled', false);
			});
			
			// if not clicked, we want an invisible white border around both objects
			$("#leftoption").css({"border-color": "#FFFFFF", 
         			"border-width":"2px", 
         			"border-style":"solid"});
			$("#rightoption").css({"border-color": "#FFFFFF", 
         			"border-width":"2px", 
         			"border-style":"solid"});
			

			experiment.trialnum = experiment.counter;

			// show instructions, fade in
			$("#instructions").html("Choose which of the two objects at the bottom of the screen is more similar to the object at the top.");
	    	$("#instructions").show();
		    $("#stage").fadeIn();

		    // get start time for this trial to use for rt
			experiment.starttime = Date.now();
		}
		
	},

	// start the experiment by showing the participant the objects they'll learn about
	// also set up random assignments/orders for this participant
	start: function() {
		
		// put column headers in data file
		experiment.data.push("subid, numtraintrials, trialnum, trainortest, pic1, pic2, pic3, trialtype, stims, target, options, chosenpic, date, timestamp, rt, imageArray");

		// randomize order of train and test trial types
		experiment.traintrials = shuffle(traintrialtypes);
  		experiment.testtrials = shuffle(testtrialtypes);

  		// make (randomize) the image array
		experiment.imageArray = makeimageArray();

		// when we move forward in the trial, get the rt, add a line of data, add to the counter
		$( "#advancebutton" ).click(function() {
			experiment.reactiontime = Date.now() - experiment.starttime;
			experiment.processOneRow();
			experiment.counter++;
			$("#stage").fadeOut(500);
				setTimeout(function() {
					if (experiment.counter == numtraintrials + 1) {
						experiment.showTestInstructions();
					} else {
						experiment.next()
					}	
				}, 550);
			
		});

		// display the images subjects will learn at the start
		// we don't want to display them in an order corresponding to our design, so shuffle first
		displayOrder = shuffle([0,1,2,3,4]);

		// get all that html ready
		var objects_html = "";
		firstname = "objects/" + experiment.imageArray[displayOrder[0]] + ".jpg";
		objects_html += '<table align = "center" cellpadding="10"><tr></tr><tr><td align="center"><img class="pic" src="' + firstname +  '"alt="' + firstname + '" id= "firstPic"/></td>';
		
		secondname = "objects/" + experiment.imageArray[displayOrder[1]] + ".jpg";
		objects_html += '<td align="center"><img class="pic" src="' + secondname +  '"alt="' + secondname + '" id= "secondPicAlt"/></td>';

		thirdname = "objects/" + experiment.imageArray[displayOrder[2]] + ".jpg";
		objects_html += '<td align="center"><img class="pic" src="' + thirdname +  '"alt="' + thirdname + '" id= "thirdPic"/></td>';

		fourthname = "objects/" + experiment.imageArray[displayOrder[3]] + ".jpg";
		objects_html += '<td align="center"><img class="pic" src="' + fourthname +  '"alt="' + fourthname + '" id= "fourthPic"/></td>';

		fifthname = "objects/" + experiment.imageArray[displayOrder[4]] + ".jpg";
		objects_html += '<td align="center"><img class="pic" src="' + fifthname +  '"alt="' + fifthname + '" id= "fifthPic"/></td>';

	    objects_html += '</tr></table>';

	    // show instructions, objects
	    $("#instructions").html("The five alien objects you will learn about are shown below. Take a moment to take note of these objects.");
	    $("#instructions").show();
		$("#objects").html(objects_html); 
		$("#stage").fadeIn();

		// get time for rt
		experiment.starttime = Date.now();
	},
    
}
		