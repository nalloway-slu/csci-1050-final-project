/****************
Final Project. 2023-12-13
[TITLE PENDING]
Nathaniel Alloway, CSCI 1050-01

TO DO: Credits
TO DO: Description

File directory:
  index.html      - Where all the HTML happens
  style.css       - Stylesheets for said HTML
  sketch.js       - Main script file, loads all the assets and calls all the requisite functions [TO DO: Revise]
  main
  | vn_objects.js - Defines object constructors for characters, buttons, and scenes that are used for the VN
  | vn_parser.js  - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions
  | vn_handler.js - TO DO: Write description
  assets
  | 
****************/

function preload() {
  
}

function setup() {
  createCanvas(600, 600);
  textFont('Courier New');

  // lines.splice(0, 0, ''); // Prepend an empty command since text files are one-indexed instead of zero-indexed.
}

function draw() {
  
}

// Global variables for storing any dialogue choices or other options to the user, along with
// whether we're displaying any options and the result of user decisions
let VN_Current_Options_Displayed = '';
let VN_Is_Drawing_Options = false;
let VN_Option_Return_Value = false;
let VN_Line_Counter = 1;

function mousePressed() {
  can_scene.handle_interaction();
}