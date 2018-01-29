// Simple study demonstrating the use of a tablet-designed webpage. 
// Study is designed using simple JS/HTML/CSS, with data saves to a server
// controlled by call to a short php script. 

// Overview: (i) Parameters (ii) Helper Functions (iii) Control Flow

// ---------------- PARAMETERS ------------------

var numTrials = 32;

//amount of white space between trials
var normalpause = 1500;

//pause after picture chosen, to display red border around picture selected
var timeafterClick = 1000;

//length of filler (every time fill2 comes up, add 1sec of time)
var fillerpause = 5000;

//an array of all the novel words used in the study; used for look-up purposes in pic1type, pic2type, and trialtype
var novelWords = ["modi", "dax", "pifo", "dofa", "toma", "fep", "wug", "kreeb"];

//******for handling sound; see helper function playPrompt(word)
var audioSprite = $("#sound_player")[0];
var handler;

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


//currently not called; could be useful for reaction time?
getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

//returns the word array; in the below order for list 1 and reversed for list 2
makeWordList = function(order) {
	var wordList = ["object1", "object2", "object3", "object4", "object5", "object6", "object7", "object8", "object9", "object10", "object11",
					"object12", "object13", "object14", "object15", "object16", "object17", "object18", "object19", "object20"];
	if (order === 2) {
		wordList.reverse();
	}
	return wordList;
}

//returns the image array; in the below order for list 1 and reversed with side-sway for list 2
makeImageArray = function(order) {
	//remove filler names from allimages array used in preloading. 
	//Trial 1 will be "pifo" on left and "frog" on right, trial two will be "carrot" on left and "lamp" on right, etc...
	var toSlice = allimages.length - 4;
	var imageArray = allimages.slice(0, toSlice);

	//reverse the list so that the trials are reversed and the sides are swapped: trial 1 will be "shoe" 
	//on left and "kreeb" on right, etc...
	if (order === 2) {
		imageArray.reverse();
	}
	return imageArray;
}

getTrialType = function(word) {
   	var trialtype = "train";
   	return trialtype;  
}

createDot = function(dotx, doty, i, tag) {
	var dots;
	if (tag === "smiley") {
		dots = ["smiley1", "smiley2", "smiley3", "smiley4", "smiley5"];
	} else {
		dots = [1, 2, 3, 4, 5];
	}

	var dot = document.createElement("img");
	dot.setAttribute("class", "dot");
	dot.id = "dot_" + dots[i];
	if (tag === "smiley") {
		dot.src = "dots/dot_" + "smiley" + ".jpg";
	} else {
		dot.src = "dots/dot_" + dots[i] + ".jpg";
	}

    var x = Math.floor(Math.random()*950);
    var y = Math.floor(Math.random()*540);

    var invalid = "true";

    //make sure dots do not overlap
    while (true) {
    	invalid = "true";
	   	for (j = 0; j < dotx.length ; j++) {
    		if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 250) {
    			var invalid = "false";
    			break; 
    		}
		}
		if (invalid === "true") {
 			dotx.push(x);
  		  	doty.push(y);
  		  	break;	
  	 	}
  	 	x = Math.floor(Math.random()*400);
   		y = Math.floor(Math.random()*400);
	}

    dot.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");
   	training.appendChild(dot);
}

//Handles audio; indexes into the sprite to play the prompt associated with a critical word 
playPrompt = function(word) {
	
}

//CONTROL FLOW

//PRELOAD ALL IMAGES//---------------------------
var allimages = ["object1", "object2", "object3", "object4", "object5", "object6", "object7", "object8", "object9", "object10", "object11",
                 "object12", "object13", "object14", "object15", "object16", "object17", "object18", "object19", "object20"];


var trialtypes = [1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4];

//for critical trials and fillers
var images = new Array();
for (i = 0; i<allimages.length; i++) {
	images[i] = new Image();
	images[i].src = "objects/" + allimages[i] + ".jpg";
}

//for dot game
var dots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", "x", "dot_smiley"];
for (i = 0; i<dots.length; i++) {
	images[i] = new Image();
	images[i].src = "dots/" + dots[i] + ".jpg";
}
//-----------------------------------------------


showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {

	subid: "",
		//inputed at beginning of experiment
	trialnum: 0,
		//trial number
	order: 1,
		//whether child received list 1 or list 2
	word: "",
		//word that child is queried on
	pic1: "",
		//the name of the first picture from the left
	pic2: "",
		//the name of the second picture from the left
	pic3: "",
		//the name of the third picture from the left
	pic4: "",
		//the name of the fourth picture from the left
	side: "",
		//whether the child picked the left (L) or the right (R) picture
	chosenpic: "",
		//the name of the picture the child picked
	response: "",
		//whether the response was the correct response (Y) or the incorrect response (N)
	trialtype: "",
		//whether the trial was a word recognition (rec) or mutual exclusivity (me) trial;
		// control (MEcontrol) or experimental (MEexperimental)
	date: getCurrentDate(),
		//the date of the experiment
	timestamp: getCurrentTime(),
		//the time that the trial was completed at 
	reactiontime: 0,
	//TODO : add reaction time variable ***** 

	trialtypes: shuffle(trialtypes),

	preStudy: function() {
		document.body.style.background = "black";
		$("#prestudy").hide();
		setTimeout(function () {
			experiment.next();
		}, normalpause);
	},

	//sets up and allows participants to play "the dot game"
	training: function(dotgame) {
		var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", 
						"dot_smiley1", "dot_smiley2", "dot_smiley3", 
						"dot_smiley4", "dot_smiley5"];
		var xcounter = 0;
		var dotCount = 5;

		var dotx = [];
		var doty = [];

		if (dotgame === 0) {
			for (i = 0; i < dotCount; i++) {
				createDot(dotx, doty, i, "");
			}
		} else {
			for (i = 0; i < dotCount; i++) {
				createDot(dotx, doty, i, "smiley");
			}
		}
		showSlide("training");
		$('.dot').bind('click touchstart', function(event) {
	    	var dotID = $(event.currentTarget).attr('id');

	    	//only count towards completion clicks on dots that have not yet been clicked
	    	if (allDots.indexOf(dotID) === -1) {
	    		return;
	    	}
	    	allDots.splice(allDots.indexOf(dotID), 1);
	    	document.getElementById(dotID).src = "dots/x.jpg";
	    	xcounter++
	    	if (xcounter === dotCount) {
	    		setTimeout(function () {
	    			$("#training").hide();
	    			if (dotgame === 0) {		
	    				//hide old x marks before game begins again
	    				var dotID;
	    				for (i = 1; i <= dotCount; i++) {
	    					dotID = "dot_" + i;
	    					training.removeChild(document.getElementById(dotID));
	    				}
						experiment.training();
						dotgame++; 
					} else {
						//document.body.style.background = "black";
						setTimeout(function() {
							showSlide("prestudy");
							//experiment.next();
						}, normalpause*2);
					}
				}, normalpause*2);
			}
	    });	   
	},


	//Checks to see whether the experimenter inputted appropriate values before moving on with the experiment
	checkInput: function() {
		//subject ID
  		if (document.getElementById("subjectID").value.length < 1) {
			$("#checkMessage").html('<font color="red">You must input a subject ID</font>');
			return;
		}
  		experiment.subid = document.getElementById("subjectID").value;

		//list
		if (document.getElementById("order").value !== "1" && document.getElementById("order").value !== "2") { //|| document.getElementById("order").value !== "2") {
			$("#checkMessage").html('<font color="red">For list, you must choose either a 1 or 2</font>');
			return;
		}
		experiment.order = parseInt(document.getElementById("order").value);
		experiment.training(0);
	},

	//TODO: second training round?

	//the end of the experiment, where the background becomes completely black
    end: function () {
    	setTimeout(function () {
    		$("#stage").fadeOut();
    	}, normalpause);
    	showSlide("finish");
    	document.body.style.background = "black";
    },

    //for filler rounds; most experimental variables set to "na"; fades in the filler after the regular 
    //amount of time between rounds, and fades it out after the specified time "fillerpause"
	displayFiller: function(fillername, counter) {
		experiment.trialtype = 0; //filler
		experiment.word = fillername;
		experiment.trialnum = counter;
		experiment.pic1 = "na";
		experiment.pic2 = "na";
		experiment.pic1type = "na";
		experiment.pic2type = "na";
		experiment.side = "na";
		experiment.chosenpic = "na";
		experiment.response = "na";
		experiment.reactiontime = "na";
		experiment.processOneRow();

		var lengthoffiller = fillerpause;


		var filler_html = '<table align = "center" cellpadding="30"><tr><td align="center"><img class="pic" src="' + 'objects/' + fillername + '.jpg" id= "fillerPic"/></td></tr></table>';
		$("#filler").html(filler_html); 
		setTimeout(function() {
		 	$("#filler").fadeIn();
		 	playPrompt(fillername);
		}, normalpause);
		setTimeout(function() {
			$("#filler").fadeOut();
		}, lengthoffiller);
	},

	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		var dataforRound = experiment.subid; 
		dataforRound += "," + experiment.order + "," + experiment.trialnum + "," + experiment.word;
		dataforRound += "," + experiment.pic1 + "," + experiment.pic2 + "," + experiment.pic3 + "," + experiment.pic4;
		dataforRound += "," + experiment.side + "," + experiment.chosenpic + "," + experiment.response + "," + experiment.trialtype;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.reactiontime + "\n";
		$.post("http://langcog.stanford.edu/cgi-bin/TABLET/tabletstudysave.php", {postresult_string : dataforRound});	
	},

	// MAIN DISPLAY FUNCTION
  	next: function() {

		//returns the list of all words to use in the study - list dependent
  		var wordList = makeWordList(experiment.order);
  		//returns the list of all images to use in the study - list dependent
		var imageArray = makeImageArray(experiment.order);

		

		var objects_html = "";
		var counter = 1;

		experiment.trialtype = trialtypes[counter];

		var stims = [];
	    	if (experiment.trialtype == 1) {
	    		stims = [0,1,2,3];
	    		stims = shuffle(stims);
	    		experiment.pic1 = imageArray[stims[0]];
	    		experiment.pic2 = imageArray[stims[1]];
	    		experiment.pic3 = imageArray[stims[2]];
	    		experiment.pic4 = imageArray[stims[3]];
	    	} else if (experiment.trialtype == 2) {
	    		stims = [0,1,2,4];
	    		stims = shuffle(stims);
	    		experiment.pic1 = imageArray[stims[0]];
	    		experiment.pic2 = imageArray[stims[1]];
	    		experiment.pic3 = imageArray[stims[2]];
	    		experiment.pic4 = imageArray[stims[3]];
	    	} else if (experiment.trialtype == 3) {
	    		stims = [5,1,2,3];
	    		stims = shuffle(stims);
	    		experiment.pic1 = imageArray[stims[0]];
	    		experiment.pic2 = imageArray[stims[1]];
	    		experiment.pic3 = imageArray[stims[2]];
	    		experiment.pic4 = imageArray[stims[3]];
	    	} else if (experiment.trialtype == 4) {
	    		stims = [5,1,2,4];
	    		stims = shuffle(stims);
	    		experiment.pic1 = imageArray[stims[0]];
	    		experiment.pic2 = imageArray[stims[1]];
	    		experiment.pic3 = imageArray[stims[2]];
	    		experiment.pic4 = imageArray[stims[3]];
	    	}
 			
   		// Create the object table (tr=table row; td= table data)
		//objects_html = '<table class = "centered" ><tr><td id=word colspan="2">' + wordList[0] + '</td></tr><tr>';;
	    
	   	//HTML for the first object on the left
		firstname = "objects/" + imageArray[stims[0]] + ".jpg";
		objects_html += '<table align = "center" cellpadding="30"><tr></tr><tr><td align="center"><img class="pic" src="' + firstname +  '"alt="' + firstname + '" id= "firstPic"/></td>';
	
		//HTML for the first object on the right
		secondname = "objects/" + imageArray[stims[1]] + ".jpg";
	   	objects_html += '<td align="center"><img class="pic" src="' + secondname +  '"alt="' + secondname + '" id= "secondPic"/></td>';

	   	thirdname = "objects/" + imageArray[stims[2]] + ".jpg";
	   	objects_html += '<td align="center"><img class="pic" src="' + thirdname +  '"alt="' + thirdname + '" id= "thirdPic"/></td>';

	   	fourthname = "objects/" + imageArray[stims[3]] + ".jpg";
	   	objects_html += '<td align="center"><img class="pic" src="' + fourthname +  '"alt="' + fourthname + '" id= "fourthPic"/></td>';
		
    	objects_html += '</tr></table>';
	    $("#objects").html(objects_html); 

	    $("#stage").fadeIn();

	    var startTime = (new Date()).getTime();
	
		

	    $('.pic').bind('click touchstart', function(event) {

	    	//time the participant clicked - the time the audio began - the amount of time between the beginning of the audio and the 
	    	//onset of the word 
	    	experiment.reactiontime = (new Date()).getTime() - startTime; 

	    	experiment.trialnum = counter;

	    	
	    	experiment.word = wordList[0];
	    	
	    	console.log(experiment.trialtype);

	    	/******** CHANGE THIS *************/
	    	//Was the picture clicked on the right or the left?
	    	var picID = $(event.currentTarget).attr('id');
	    	if (picID === "firstPic") {
				experiment.side = "L";
				experiment.chosenpic = imageArray[0];
	    	} else {
				experiment.side = "R";
				experiment.chosenpic = imageArray[1];
			}
			
			/******** CHANGE THIS *************/
			//If the child picked the picture that matched with the word, then they were correct. If they did not, they were not correct.
			if (experiment.chosenpic === experiment.word) {
				experiment.response = "Y";
			} else {
				experiment.response = "N"
			}



			//Add one to the counter and process the data to be saved; the child completed another "round" of the experiment
			experiment.processOneRow();
			
	    	counter++;

	    	$(document.getElementById(picID)).css('margin', "-8px");
			$(document.getElementById(picID)).css('border', "solid 8px red");

			//remove the pictures from the image array that have been used, and the word from the wordList that has been used
			
			
			wordList.splice(0, 1);

		
			setTimeout(function() {
				$("#stage").fadeOut();

				//there are no more trials for the experiment to run
				if (counter === numTrials + 1) {
					experiment.end();
					return;
				}	

				var gap;
				//check to see if the next round is going to be a filler round; if so, display a filler
				if (wordList[0].indexOf("fill") !== -1) {
					experiment.displayFiller(wordList[0], counter);
					//remove the filler word so that the next round features the next critical word (do not change the images array)
					
					gap = fillerpause;

					//boy filler is 1s longer
					if (wordList[0] === "fill2") gap += 1000;

					//another round has now passed, so increment the counter and remove the filler word from the list
					
					wordList.splice(0, 1);
					counter++;

				} else {
					gap = 0;
				}

				//move on to the next round after either the normal amount of time between critical rounds, or after 
				//the filler has occurred
				setTimeout(function() {	
						experiment.trialtype = trialtypes[counter];

						var stims = [];
	    				if (experiment.trialtype == 1) {
	    					stims = [0,1,2,3];
	    					stims = shuffle(stims);
	    					experiment.pic1 = imageArray[stims[0]];
	    					experiment.pic2 = imageArray[stims[1]];
	    					experiment.pic3 = imageArray[stims[2]];
	    					experiment.pic4 = imageArray[stims[3]];
	    				} else if (experiment.trialtype == 2) {
	    					stims = [0,1,2,4];
	    					stims = shuffle(stims);
	    					experiment.pic1 = imageArray[stims[0]];
	    					experiment.pic2 = imageArray[stims[1]];
	    					experiment.pic3 = imageArray[stims[2]];
	    					experiment.pic4 = imageArray[stims[3]];
	    				} else if (experiment.trialtype == 3) {
	    					stims = [5,1,2,3];
	    					stims = shuffle(stims);
	    					experiment.pic1 = imageArray[stims[0]];
	    					experiment.pic2 = imageArray[stims[1]];
	    					experiment.pic3 = imageArray[stims[2]];
	    					experiment.pic4 = imageArray[stims[3]];
	    				} else if (experiment.trialtype == 4) {
	    					stims = [5,1,2,4];
	    					stims = shuffle(stims);
	    					experiment.pic1 = imageArray[stims[0]];
	    					experiment.pic2 = imageArray[stims[1]];
	    					experiment.pic3 = imageArray[stims[2]];
	    					experiment.pic4 = imageArray[stims[3]];
	    				}		
						document.getElementById("firstPic").src = "objects/" + imageArray[stims[0]] + ".jpg";
						document.getElementById("secondPic").src = "objects/" + imageArray[stims[1]] + ".jpg";
						document.getElementById("thirdPic").src = "objects/" + imageArray[stims[2]] + ".jpg";
						document.getElementById("fourthPic").src = "objects/" + imageArray[stims[3]] + ".jpg";

						//to make word display visible (as an alternative to sound), uncomment just change background of display to white
						//document.getElementById("word").innerHTML = wordList[0];

						$(document.getElementById(picID)).css('border', "none"); 
						$(document.getElementById(picID)).css('margin', "0px");

						$("#stage").fadeIn();

						//reactivate clicks only after a little bit after the prompt's word
						setTimeout(function() {clickDisabled = false;}, 300);

						startTime = (new Date()).getTime();
						
				}, gap + normalpause);
			}, timeafterClick);
	    });
    },
}
		