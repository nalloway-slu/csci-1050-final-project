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
  | vn_handler.js - Handles execution of instructions as parsed in `vn_parser.js` upon user input
  assets
  | 
****************/

let lines;

function preload() {
  lines = loadStrings('assets/test_scene.txt');
}

let scene, testee, testee_2, butts;

function setup() {
  createCanvas(600, 600);
  textFont('Courier New');

  scene = new VN_Scene('cool and new scene', 1, 1, 598, 598, 10, 150);

  testee = new VN_Character('Testee', color('RED'), color(255, 200, 200));
  testee_2 = new VN_Character('Testee 2', color('CYAN'), color(200, 255, 255));

  scene.add_character(testee, 'testee');
  scene.add_character(testee_2, 'testee_2');

  butts = new VN_Button_Panel();
  butts.add_button('Do something', 1, 300, 200, 100, 20);
  butts.add_button('Do nothing', 2, 300, 300, 100, 20);

  scene.add_button_panel(butts, 'butts');

  lines.splice(0, 0, ''); // Prepend an empty command since text files are one-indexed instead of zero-indexed.

  scene.assign_instruction_set(lines);
}

function draw() {
  scene.display();
}

function mousePressed() {
  if (scene.check_if_reached_end_of_instruction_set()) {
    return;
  }
  scene.handle_interaction();
}