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

function bg_incr_gray () {
  background(counter * 255/4 + 255/8);
}

function preload() {
  can_char = new VN_Character('testee');
  can_char2 = new VN_Character('testee 2');
  can_scene = new VN_Scene('test', 2, 2, 596, 596, bg_incr_gray);
}

function setup() {
  createCanvas(600, 600); // TO DO: Figure out how to center on page
  frameRate(48);
  can_scene.add_character(can_char);
  can_scene.add_character(can_char2);
}

function draw() {
  can_scene.display();

  // frame around canvas
  push();
  noFill();
  stroke(0);
  strokeWeight(1);
  rect(1, 1, 599, 599);
  pop();
}

function mousePressed() {
  // Guard clause - disable control if we're still outputting text to screen
  if (can_scene.dialogue_not_finished()) {
    return;
  }

  switch (counter) {
    case 0:
      can_scene.set_active_speaker('testee', 'LEFT');
      can_scene.set_active_speaker('testee 2', 'RIGHT');
      can_scene.set_speaker('LEFT');
      can_scene.show_characters();
      can_scene.set_dialogue('help me');
      break;
    case 1:
      can_scene.set_speaker('RIGHT');
      can_scene.set_dialogue('Have you considered helping yourself here? Huh? Have you?');
      break;
    case 2:
      can_scene.hide_characters();
      can_scene.set_speaker('NARRATOR');
      can_scene.set_dialogue('oh no.... how rude....');
      break;
    default:
      can_scene.clear_all();
  }
  counter += 1;
  counter %= 4;
}