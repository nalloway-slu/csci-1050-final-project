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
  | vn_objects.js - Defines object constructors for characters, scenes that occur in the VN
  | vn_handler.js - Handles scene and parsing control along with user interaction
  assets
  | 
****************/

let counter = 0;
const WIDTH = 600, HEIGHT = 600;

function preload() {
  scene_can_preload();
}

function setup() {
  createCanvas(600, 600); // TO DO: Figure out how to center on page
  
  scene_can_setup();
}

function draw() {
  scene_can_draw();

  // frame around canvas
  push();
  noFill();
  stroke(0);
  strokeWeight(1);
  rect(1, 1, 599, 599);
  pop();
}

function mousePressed() {
  scene_can_interaction();
}