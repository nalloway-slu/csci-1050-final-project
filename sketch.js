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
let can_char, can_char2, can_scene;
let counter = 0;

function empty () {
  return;
}

function preload() {
  can_char = new VN_Character('testee');
  can_char2 = new VN_Character('testee 2');
  can_scene = new VN_Scene('test', 0, 0, 400, 400, empty);
}

function setup() {
  createCanvas(400, 400);
  can_scene.add_character(can_char);
  can_scene.add_character(can_char2);
}

function draw() {
  background('CYAN');
  can_scene.display();
}

function mousePressed() {
  switch (counter) {
    case 0:
      can_scene.set_active_speaker('testee', 'LEFT');
      can_scene.set_active_speaker('testee 2', 'RIGHT');
      can_scene.set_speaker('LEFT');
      can_scene.set_dialogue('help me');
      break;
    case 1:
      can_scene.set_speaker('RIGHT');
      can_scene.set_dialogue('no you');
      break;
    case 2:
      can_scene.toggle_character_visibility();
      can_scene.set_speaker('NARRATOR');
      can_scene.set_dialogue('oh no....');
      break;
    default:
      can_scene.clear_all();
  }
  counter += 1;
  counter %= 4;
}