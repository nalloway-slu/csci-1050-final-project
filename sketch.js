/****************
Final Project. 2023-12-13
[TITLE PENDING]
Nathaniel Alloway, CSCI 1050-01

File directory:
  index.html      - Where all the HTML happens
  style.css       - Stylesheets for said HTML
  sketch.js       - Main script file, handles all the p5.js stuff
  main
  | vn_objects.js - Defines object constructors for characters, scenes that occur in the VN
  | vn_parser.js  - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions
  assets
  | 
****************/
let can_char, can_scene;

function empty () {
  return;
}

function preload() {
  can_char = new VN_Character('testee');
  can_scene = new VN_Scene('test', empty);
}

function setup() {
  createCanvas(400, 400);
  can_scene.add_character(can_char);
}

function draw() {
  background('CYAN');
  can_scene.display();
}