// Class used to track experiment
class ExperimentTracker {


	constructor() {
		this.trials = [];
		this.pid = null;
		this.numTrials=null;
		this.attempt = 0;
		this.trial = null;
		this.attempt = null;
		this.menuType = null;
		this.deviceType = null;
		this.taskType = null;
		this.menuDepth = null;
		this.targetItem = null;
		this.selectedItem = null;
		this.startTime = null;
		this.endTime = null;
	}
	
	resetTimers(){
		this.startTime = null;
		this.endTime = null;
	}

	startTimer() {
		this.startTime = Date.now();
	}

	recordSelectedItem(selectedItem) {
		this.selectedItem = selectedItem;
		this.stopTimer();
	}

	stopTimer() {
		var nextButton = document.getElementById("nextButton");
		if (this.numTrials == this.trial && window.location.pathname == "/practise-trials.html") {
			nextButton.innerHTML = "Return";
		} else if (this.numTrials == this.trial && window.location.pathname == "/experiment.html"){
			nextButton.innerHTML = "Done";
		}
		if (this.trial%3 == 0){
			this.trial = 3;
		} else {
			this.trial= this.trial%3;
		}
		this.endTime = Date.now();
		this.trials.push([this.pid, this.menuType, this.deviceType, this.taskType, this.menuDepth, this.trial, this.targetItem, this.selectedItem, this.attempt, this.startTime, this.endTime]);
		this.resetTimers();
		this.attempt++;

	}

	newTrial() {
		this.attempt = 1;
	}

	toCsv() {
		var csvFile = "pid, Technique, Pointing Device, Usage Scenerio, Depth, Trial, Target Item, Selected Item, Attempt ID, Start Time, End Time\n";
		for (var i = 0; i < this.trials.length; i++) {
			csvFile += this.trials[i].join(',');
			csvFile += "\n";
		}

		var hiddenLink = document.createElement('a');
		hiddenLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
		hiddenLink.target = '_blank';
		hiddenLink.download = 'experiment_' + this.pid + '.csv';
		document.body.appendChild(hiddenLink);
		hiddenLink.click();
	}


}