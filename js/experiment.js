'use strict';

// Location of data files
const menuL1FileSingle = "./data/menu_depth_1_single.csv"
const menuL2FileSingle = "./data/menu_depth_2_single.csv"
const menuL3FileSingle = "./data/menu_depth_3_single.csv"
const menuL1FileDual = "./data/menu_depth_1_dual.csv"
const menuL2FileDual = "./data/menu_depth_2_dual.csv"
const menuL3FileDual = "./data/menu_depth_3_dual.csv"

// Global variables
var trialsFile = null;
var menu;
var trialsData = []; // [{Menu Type, Menu Depth, Target Item},...]
var numTrials = 0;
var currentTrial = 1;
var markingMenuL1Single = [];
var markingMenuL2Single = [];
var markingMenuL3Single = [];
var markingMenuL1Dual = [];
var markingMenuL2Dual = [];
var markingMenuL3Dual = [];
var radialMenuTree = null;
var radialMenuL1Single = [];
var radialMenuL2Single = [];
var radialMenuL3Single = [];
var radialMenuL1Dual = [];
var radialMenuL2Dual = [];
var radialMenuL3Dual = [];
var tracker = new ExperimentTracker();
var markingMenuSubscription = null;
var radialMenuSvg = null;





// Load CSV files from data and return text
function getData(relativePath) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", relativePath, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}


// Loads the CSV data files on page load and store it to global variables
function initExperiment() {
	if (window.location.pathname == "/practise-trials.html") {
		trialsFile = "./data/practise-trials.csv"
	} else {
		trialsFile = "./data/experiments.csv"
	}

	// Get Trials
	var data = getData(trialsFile);

	var records = data.split("\n");
	numTrials = records.length - 1; // remove title
	for (var i = 1; i <= numTrials; i++) {
		var cells = records[i].split(",");
		var menuType = cells[0].trim();
		var deviceType = cells[1].trim();
		var taskType = cells[2].trim();
		var menuDepth = cells[3].trim();
		var targetItem = cells[4].trim();

		trialsData[i] = {
			'Menu Type': menuType,
			'Device Type': deviceType,
			'Task Type': taskType,
			'Menu Depth': menuDepth,
			'Target Item': targetItem
		};
	}

	// Get Menus
	var menuL1DataSingle = getData(menuL1FileSingle);
	var menuL2DataSingle = getData(menuL2FileSingle);
	var menuL3DataSingle = getData(menuL3FileSingle);

	var menuL1DataDual = getData(menuL1FileDual);
	var menuL2DataDual = getData(menuL2FileDual);
	var menuL3DataDual = getData(menuL3FileDual);
	
	// Format CSV Menu to respective Menu structures
	markingMenuL1Single = formatMarkingMenuData(menuL1DataSingle); // [{Animals,children[{Mammals, children[]}]},...]
	markingMenuL2Single = formatMarkingMenuData(menuL2DataSingle);
	markingMenuL3Single = formatMarkingMenuData(menuL3DataSingle);
	radialMenuL1Single = formatRadialMenuData(menuL1DataSingle);
	radialMenuL2Single = formatRadialMenuData(menuL2DataSingle);
	radialMenuL3Single = formatRadialMenuData(menuL3DataSingle);

	markingMenuL1Dual = formatMarkingMenuData(menuL1DataDual);
	markingMenuL2Dual = formatMarkingMenuData(menuL2DataDual);
	markingMenuL3Dual = formatMarkingMenuData(menuL3DataDual);
	radialMenuL1Dual = formatRadialMenuData(menuL1DataDual);
	radialMenuL2Dual = formatRadialMenuData(menuL2DataDual);
	radialMenuL3Dual = formatRadialMenuData(menuL3DataDual);
	
	//Start the first trial
	nextTrial();
}

// Wrapper around nextTrial() to prevent click events while loading menus
function loadNextTrial(e){
	e.preventDefault();
	if (document.getElementById("selectedItem").innerHTML == "&nbsp;") {
		alert('Please select an item');
	} else {
		nextTrial();
	}
}

// Move to next trial and record events
function nextTrial() {
	if (currentTrial <= numTrials) {

		var pid = DataStorage.getItem('pid');
        if (!pid) {
            alert('Current participant not set!');
            pid = prompt('Enter current participant ID:').toString();
            DataStorage.setItem('pid', pid);
		}

		var menuType = trialsData[currentTrial]['Menu Type']; // [[Menu Type, Menu Depth, Target Item], ...]
		var deviceType = trialsData[currentTrial]['Device Type'];
		var taskType = trialsData[currentTrial]['Task Type'];
		var menuDepth = trialsData[currentTrial]['Menu Depth'];
		var targetItem = trialsData[currentTrial]['Target Item'];

		document.getElementById("trialNumber").innerHTML = String(currentTrial) + "/" + String(numTrials);
		document.getElementById("menuType").innerHTML = menuType;
		document.getElementById("deviceType").innerHTML = deviceType;
		document.getElementById("taskType").innerHTML = taskType;
		document.getElementById("menuDepth").innerHTML = menuDepth;
		document.getElementById("targetItem").innerHTML = targetItem;
		document.getElementById("selectedItem").innerHTML = "&nbsp;";

		tracker.newTrial();
		tracker.pid = pid;
		tracker.numTrials = numTrials;
		tracker.trial = currentTrial;
		tracker.menuType = menuType;
		tracker.deviceType = deviceType;
		tracker.taskType = taskType;
		tracker.menuDepth = menuDepth;
		tracker.targetItem = targetItem;

		if (window.location.pathname == "/experiment.html" && currentTrial == (numTrials/2) + 1) {
			alert('First Section Complete. Please take a 3 minute break before resuming the next section');
		}

		if (deviceType === "Mouse") {
			document.getElementById('deviceType').setAttribute("style", "color: #18FF6D")
		} else if (deviceType === "Trackpad") {
			document.getElementById('deviceType').setAttribute("style", "color: #FEF102")
		}

		if (menuType === "Marking") {
				
			initializeMarkingMenu();

			if (taskType === "single") {
				if(menuDepth == 1){
					menu = MarkingMenu(markingMenuL1Single, document.getElementById('marking-menu-container'));
				}else if(menuDepth == 2){
					menu = MarkingMenu(markingMenuL2Single, document.getElementById('marking-menu-container'));
				}else if(menuDepth == 3){
					menu = MarkingMenu(markingMenuL3Single, document.getElementById('marking-menu-container'));
				}
			} else {
				if(menuDepth == 1){
					menu = MarkingMenu(markingMenuL1Dual, document.getElementById('marking-menu-container'));
				}else if(menuDepth == 2){
					menu = MarkingMenu(markingMenuL2Dual, document.getElementById('marking-menu-container'));
				}else if(menuDepth == 3){
					menu = MarkingMenu(markingMenuL3Dual, document.getElementById('marking-menu-container'));
				}
			}

			markingMenuSubscription = menu.subscribe((selection) => markingMenuOnSelect(selection));

		} else if (menuType === "Radial") {

			initializeRadialMenu();	
			if (taskType === "single") {
				if (menuDepth == 1){
					menu = createRadialMenu(radialMenuL1Single);
				}else if(menuDepth == 2){
					menu = createRadialMenu(radialMenuL2Single);
				}else if(menuDepth == 3){
					menu = createRadialMenu(radialMenuL3Single);
				}
			} else {
				if (menuDepth == 1){
					menu = createRadialMenu(radialMenuL1Dual);
				}else if(menuDepth == 2){
					menu = createRadialMenu(radialMenuL2Dual);
				}else if(menuDepth == 3){
					menu = createRadialMenu(radialMenuL3Dual);
				}
			}
		}

		currentTrial++;
	} else {
		if (window.location.pathname == "/practise-trials.html") {
			window.location = 'walkthrough.html';
		} else {
			tracker.toCsv();
			event.preventDefault();
			window.location = 'post-questionnaire.html';
		}
	}
}

/*Functions related to MarkingMenu*/

// Reconstructs marking menu container
function initializeMarkingMenu(){
	
	//Unload Radial Menu
	var radialMenuContainer = document.getElementById('radial-menu-container');
	if(radialMenuContainer != null){
		radialMenuContainer.parentNode.removeChild(radialMenuContainer);
	}
	
	// Load Marking Menu
	var interactionContainer = document.getElementById('interaction-container');
	// remove previous selection
	if (markingMenuSubscription != null) {
		markingMenuSubscription.unsubscribe();
	}
	var markingMenuContainer = document.getElementById('marking-menu-container');
	// populate interactionContainer if markingMenuContainer do not exist
	if(markingMenuContainer == null){
		interactionContainer.innerHTML += "<div id=\"marking-menu-container\" style=\"height:100%;width:100%\" onmousedown=\"markingMenuOnMouseDown()\" oncontextmenu=\"preventRightClick(event)\"></div>";
	}
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatMarkingMenuData(data) {

	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {} // { {Animals,children[{Mammals, children[]}]},...}

	// Parse through the records and create individual menu items
	for (var i = 1; i < numRecords; i++) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var label = items[2].trim();
		menuItems[id] = {
			'name': label,
			'children': [] 
		};
	}

	for (var i = numRecords - 1; i >= 1; i--) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var parent = items[1].trim();
		if (parent === '0') { // no parent with id '0'
			continue;
		} else {
			var children = menuItems[parent]['children']; //[]
			children.push(menuItems[id]);
			delete menuItems[id]
			menuItems[parent]['children'] = children;
		}
	}

	var menuItemsList = [];
	for (var key in menuItems) {
		menuItemsList.push(menuItems[key]);
	}
	return menuItemsList;
}

// Function to start tracking timer on mouse down
function markingMenuOnMouseDown(){

	tracker.startTimer();
}

//Function to track selected item
function markingMenuOnSelect(selectedItem){

	tracker.recordSelectedItem(selectedItem.name);
	document.getElementById("selectedItem").innerHTML = selectedItem.name;
}

function preventRightClick(e){
	e.preventDefault();
}


/*Functions related to RadialMenu*/

// Reconstructs radial menu container
function initializeRadialMenu(){
	
	// Unload Marking Menu
	if (markingMenuSubscription != null) {
		markingMenuSubscription.unsubscribe();
	}
	var markingMenuContainer = document.getElementById('marking-menu-container');
	if(markingMenuContainer!=null){
		markingMenuContainer.parentNode.removeChild(markingMenuContainer);
	}
	
	

	// Reload Radial Menu
	var interactionContainer = document.getElementById('interaction-container');
	var radialMenuContainer = document.getElementById('radial-menu-container');
	if(radialMenuContainer == null){
		interactionContainer.innerHTML += "<div id=\"radial-menu-container\" style=\"height:100%;width:100%\" oncontextmenu=\"toggleRadialMenu(event)\"></div>";
	}

}

// Create radial menu svg element
function createRadialMenu(radialMenuL){ // radialMenuL = {'_children': menuItemsList}
	
    var radialmenuElement = document.getElementById('radialmenu');
    if(radialmenuElement != null){
    	radialmenuElement.parentNode.removeChild(radialmenuElement);
    }
	
	
	var w = window.innerWidth;
	var h = window.innerHeight;
	var radialMenuSvgElement = document.getElementById('radial-menu-svg');
	if (radialMenuSvgElement != null){
		radialMenuSvgElement.parentNode.removeChild(radialMenuSvgElement);
	}
	radialMenuSvg = d3.select("#radial-menu-container").append("svg").attr("width", w).attr("height", h).attr("id","radial-menu-svg");
	radialMenuTree = radialMenuL;
	return radialMenuSvg;
}

// Toggle radial menu on right click
function toggleRadialMenu(e) {
	
	if(tracker.startTime == null){
	
		if(radialMenuTree != null){
				menu = module.exports(radialMenuTree, {
					x: e.clientX,
					y: e.clientY
				}, radialMenuSvg);
		
			// Start timing once menu appears
			tracker.startTimer();
		}
	}else{
		
		// Previous item recorded as null. Still in the process of selection.
		tracker.recordSelectedItem(null);
		
		if(radialMenuTree != null){
			menu = module.exports(radialMenuTree, {
				x: e.clientX,
				y: e.clientY
			}, radialMenuSvg);
	
		// Start timing once menu appears
		tracker.startTimer();
		}
	}
	e.preventDefault();
}

//Callback for radialmenu when a leaf node is selected
function radialMenuOnSelect() {

	tracker.recordSelectedItem(this.id);
	// remove radial menu
	var radialmenu = document.getElementById('radialmenu');
	radialmenu.parentNode.removeChild(radialmenu);
	
	document.getElementById("selectedItem").innerHTML = this.id;
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatRadialMenuData(data) {
	
	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {} // { {Animals, fill, Animals, _children[{Mammals, children[]}], callback},...}

	// Parse through the records and create individual menu items
	for (var i = 1; i < numRecords; i++) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var label = items[2].trim();
		menuItems[id] = {
			'id': label,
			'fill': "#39d",
			'name': label,
			'_children': []
		};
	}

	for (var i = numRecords - 1; i >= 1; i--) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var parent = items[1].trim();
		if (parent === '0') {
			continue;
		} else {
			// modify child menuItems
			if(menuItems[id]['_children'].length == 0){
				menuItems[id]['callback'] = radialMenuOnSelect;	
			}
			// child menuItems to be stored under the respective parent
			var _children = menuItems[parent]['_children'];
			_children.push(menuItems[id]);
			delete menuItems[id];
			menuItems[parent]['_children'] = _children;
		}
	}


	var menuItemsList = [];
	for (var key in menuItems) {
		if (menuItems[key]['_children'].length == 0){
			delete menuItems[key]['_children'];
			menuItems[key]['callback'] = radialMenuOnSelect;
		} else{
			delete menuItems[key]['callback'];
		}
		menuItemsList.push(menuItems[key]);
	}

	return {
		'_children': menuItemsList
	};

}
