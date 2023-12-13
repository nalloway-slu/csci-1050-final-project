/****************
Final Project. 2023-12-13
A CONVERSATION IN MADRID
Nathaniel Alloway, CSCI 1050-01

Description: This is the code for a virtual novel (hereafter VN) in which I have a
  fictitious conversation with another person whilst on a walk through
  Dehesa de la Villa Park in Madrid. The folder `main` contains code for a
  VN-creation framework, which may be adapted and expanded upon in future projects.
  The `assets` folder contains assets particular to this specific VN.

Credits: Images and dialogue are wholly my own, excepting the quotation "ever-living forces",
  which is due to my intro philosophy professor Carlos Segovia. The discussion on Guattari's
  subjectivity diagram is also due to Carlos Segovia. The discussion on Heidegger's "dwelling"
  fourfold is (yet again) in part due to Carlos Segovia, but most of it draws from a thread on
  the 'ma pona pi toki pona' Discord server created by @aardvark0825. The thread may be found at
  the given link:
    https://discord.com/channels/301377942062366741/1174566951553613834/1174570004079976468

File directory:
  index.html      - Where all the HTML happens
  style.css       - Stylesheets for said HTML
  sketch.js       - Main script file, loads all the assets and calls all the requisite functions [TO DO: Revise]
  main
  | vn_objects.js - Defines object constructors for characters, buttons, and scenes that are used for the VN
  | vn_parser.js  - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions
  | vn_handler.js - Handles execution of instructions as parsed in `vn_parser.js` upon user input
  assets
  | awkward_0.png
  |  ...
  | thanks_12.png - Images displayed in the VN
  | dialogue.txt  - Instruction set for the VN
****************/

// Load in the images and the instruction set
let lines;
let awkward = new Array(6);
let cooler = new Array(13);
let finals = new Array(4);
let fourfold = new Array(11);
let opening = new Array(11);
let thanks = new Array(13);

function preload() {
  lines = loadStrings('assets/dialogue.txt');
  
  for (let i = 0; i < awkward.length; i++) {
    awkward[i] = loadImage('assets/awkward_' + i + '.png');
  }
  
  for (let i = 0; i < cooler.length; i++) {
    cooler[i] = loadImage('assets/cooler' + i + '.png');
  }
  
  for (let i = 0; i < finals.length; i++) {
    finals[i] = loadImage('assets/finals' + i + '.png');
  }
  
  for (let i = 0; i < fourfold.length; i++) {
    fourfold[i] = loadImage('assets/fourfold' + i + '.png');
  }
  
  for (let i = 0; i < opening.length; i++) {
    opening[i] = loadImage('assets/open' + i + '.png');
  }
  
  for (let i = 0; i < thanks.length; i++) {
    thanks[i] = loadImage('assets/thanks' + i + '.png');
  }
}

// Define the scene and the characters
let scene, natalia, nathaniel;

// Define the necessary button panels
let bp, bp2, bp3;

function setup() {
  createCanvas(600, 600);
  textFont('Courier New');

  scene = new VN_Scene('cool and new scene', 1, 1, 598, 598, 10, 150);

  natalia = new VN_Character('Natalia', color(0, 76, 101), color(30, 106, 131));
  nathaniel = new VN_Character('Nathaniel', color(225, 104, 25), color(255, 134, 55));

  scene.add_character(natalia, 'Natalia');
  scene.add_character(nathaniel, 'Nathaniel');

  // butts = new VN_Button_Panel();
  // butts.add_button('Do something', 1, 300, 200, 100, 20);
  // butts.add_button('Do nothing', 2, 300, 300, 100, 20);

  // scene.add_button_panel(butts, 'butts');

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