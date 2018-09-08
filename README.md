# cs4249 Assignment 1
This repository contains a basic interface and instrumentation to perform an empirical evaluation of Marking Menus and Radial Menus. 

Details of the experiment as follows:

1. Independent Variable(s): 
•   Technique (2 levels: Marking Menu, Radial Menu) 
•   Pointing device (2 levels: Mouse, Trackpad)
•   Usage scenarios (2 levels: single-task vs dual-task)
•   Menu depths (3 levels: 1, 2, 3)

2. Dependent Variable(s):
•   Completion time (seconds)
•   Error rate (%)
•   No. of Error Correction Event (i.e. no. of re-attempts, in this case) 

## Project Structure
 The interface is a static web project. As such, Github Pages is used the forked repository. Link to Github Page: https://e0011875.github.io/cs4249_assgn1_ay1819s1/
 
    ├── css                     # Style Sheets
         ├── external           
         ├── experiment.css
         ├── boostrap.min.css 
         ├── likert.css 
    ├── img                     # Screenshots
         ├── interface.png           
         ├── marking_menu.png
         ├── radial_menu.png  
    ├── js                      # Javascript
         ├── external     
         ├── DataStorage.js    
         ├── experiment-tracker.js
         ├── experiment.js    
         ├── form-tracker.js
    ├── data           
         ├── experiment_p1.csv     # Contains arrangement of trials for p1
         ├── experiment_p2.csv     # Contains arrangement of trials for p2
         ├── experiment_p3.csv     # Contains arrangement of trials for p3
         ├── experiment_p4.csv     # Contains arrangement of trials for p3
         ├── menu_depth_1_single.csv   # Menu with depth 1, single task
         ├── menu_depth_1_dual.csv     # Menu with depth 1, dual task
         ├── menu_depth_2_single.csv   # Menu with depth 2, single task
         ├── menu_depth_2_dual.csv     # Menu with depth 2, dual task
         ├── manu_depth_3_single.csv   # Menu with depth 3, single task
         ├── manu_depth_3_dual.csv     # Menu with depth 3, dual task
    ├── experiment.html    
    ├── index.html    
    ├── post-questionnaire.html    
    ├── practise-trials.html    
    ├── pre-questionnaire.html

 ## Project Walkthrough

A total of 5 screens has been implemented for the experiment, each corresponding to a step of the experiment. The breakdown of the screens is as follows:

1. Welcome Screen
2. Pre-Questionnaire
3. Walkthrough/Instructions
4. Practise Trials
5. Experiment
6. Post-Questionnaire


#### Welcome Screen

Path: `index.html`.

The welcome screen of the experiment containing basic information on the flow of the experiment. Collect input from the participant/experimenter the participant ID to generate the correct experiment trials and data log for a particular experimental subject. Participants is required to agree to the terms and conditions in order to proceed with the experiment.

The participant ID will be saved into HTML5 `localStorage` and the value is refereenced across other screens. Should other pages be visited without setting the participant ID, the user will be prompted to enter a value to be used as the participant ID.


#### Pre-Questionnaire Screen

Path: `pre-questionnaire.html`.

Collects pre-experiment information. The purpose of this questionnaire is to report the participant data and convince readers that you have picked an appropriate target user group and the result has certain generalizability.

Upon clicking the **Submit** button, form responses on the page is serialized and CSV file containing the responses will be generated and available for downloading into the user's computer. The CSV file will be named `pre-questionnaire_<pid>.csv`.

Validation has been added for the form fields. Participants are required to fill in the required fields properly before they can proceed to the next step.

#### Walkthrough/Instructions Screen

Path: `walkthrough.html`.

This page contains instructions on how to use the interface incl. the various menus during the experiment. Participants can refer to cmmands to perform various actions on the respective menu. Diagrams and screenshots are provided to better aid the participants in using the interface. 

Participants has the option to choose between the practise trial and the main experiment on this screen.

#### Practise Trials

A few practise trials have been set up to familiarize participants with the interface. The practice session is not timed, nor will any data be collected for this session. Once complete, participants are brought bback to the walkthrough screen to proceed with the main experiment.

#### Experiment Screen

Path: `experiment.html`.

The experiment screen is split into two parts, the info panel listing the conditions of the experiment and a window for users to perform their selection.

**Info Panel**

The info panel provides the following information:
-   Trial: Current progress / total no. of trials
-   Menu Type: The type of menu you will be using
-   Device: Mouse pointing device needed to perform a selection on the menu. To help you readily switch between the two pointing devices, each device name is highlighted in a different colour. Mouse is highlighted in green while Trackpad is in yellow
-   Task: The number of items in a selection. single vs dual.
-   Menu Depth: Number of menu layer included in a trial
-   Please select: Target menu item
-   Item Selected:  Selected menu item. No item is selected by default.
-   Next: Proceed to the next trial once done. If no selection is made, a dialog box will appear to prompt you to select before advancing to the next trial.

**Selection Window**

The selection window will render the correct menu according to the current experiment trial set for users to perform their selections. Users will be prompted to take a 3-min break halfway through the experiment.

***Marking Menu***:
- Open Menu: Hold down left mouse button
- Select: Hold down left mouse button and stroke towards the target menu item. Release mouse down once done.
- Reset: Release mouse down
*Expert users can make a fast stroke to select target item and need not use the menu popup invoked by holding the left mouse button. 
*Should there be more choices available for a particular selection, stroking towards it will open up a new menu.

***Radial Menu***:
- Open Menu: Right Click
- Select: Left Click
- Reset: Right Click
*Should there be more choices available for a particular selection, clicking on it will open up a new menu.

After the participant is satisfied with their selection, pressing the **Next** button on the info panel will load the next trial with its respective conditions.

After completing the experiment, the data containing the conditions and results of the trials will be generated in the form of a CSV file, `acp-<pid>-trials.csv`.

#### Post-Experiment Questionnaire Screen

Path: `post-questionnairehtml`.

Similar to the Pre-Questionnaire, in this screen, participants responses will be collected. However, unlike the Pre-Experiment Questionnaire, over here, you want to collect more qualitative and quantitative feedback about the tested techniques. This is to provide more in-depth information about the trade-offs between the tested techniques. Some of the typical questions include, satisfaction level, any difficulties participants experienced in the experiment, and the conduct of the experiment.

Upon clicking the Submit button, form responses on the page is serialized and CSV file containing the responses will be generated and available for downloading into the user's computer. The CSV file will be named `post-questionnaire.html`.

## Documentation

All interface files are saved as `.html` files in the root directory of the repository. The names of the files correspond to the respective screens.

### Recommended Browsers
This repository has been tested on the browsers listed below. It is suggested you use Chrome.
1. Chrome 68.0.3440.106
2. Firfox 61.0.2
3. Safari V10

 ## Credits
This repository contains modified implementations of menus from the original contributors listed below.
1. Marking Menu : Forked from https://github.com/QuentinRoy/Marking-Menu
2. Radial Menu : Forked from https://github.com/lgrkvst/d3-sunburst-menu
3. Interface: Modify and forked from https://github.com/emmeryn/autocompaste-html
