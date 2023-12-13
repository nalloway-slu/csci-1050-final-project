/****************
Final Project. 2023-12-13
A CONVERSATION IN MADRID
Nathaniel Balmoja Alloway, CSCI 1050-01

Description: This is the code for a virtual novel (hereafter VN) in which I have a
  fictitious conversation with another person whilst on a walk through
  Dehesa de la Villa Park in Madrid. The folder `main` contains code for a
  VN-creation framework, which may be adapted and expanded upon in future projects.
  The `assets` folder contains assets particular to this specific VN.

Credits: Images and dialogue are wholly my own, excepting the quotation "ever-living forces",
  which is due to my intro philosophy professor Carlos Segovia. The discussion on Guattari's
  subjectivity diagram is also due to Carlos Segovia. The discussion on Heidegger's "dwelling"
  fourfold is (yet again) in part due to Carlos Segovia, but some of it also draws from a thread on
  the 'ma pona pi toki pona' Discord server created by @aardvark0825. The thread may be found at
  the given link:
    https://discord.com/channels/301377942062366741/1174566951553613834/1174570004079976468
  The code for centering the p5 canvas was taken from this link:
    https://github.com/processing/p5.js/wiki/Positioning-your-canvas#centering-the-sketch-on-the-page-with-css

File directory:
  index.html        - Where all the HTML happens
  style.css         - Stylesheets for said HTML
  sketch.js         - Main script file, loads all the assets and calls all the requisite functions [TO DO: Revise]
  main
  | vn_objects.js   - Defines object constructors for characters, buttons, and scenes that are used for the VN
  | vn_parser.js    - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions
  | vn_handler.js   - Handles execution of instructions as parsed in `vn_parser.js` upon user input
  assets
  | 00_dialogue.txt - Instruction set for the VN
  | awkward_0.png
  |  ...
  | thanks_12.png   - Images displayed in the VN
****************/

// Load in the images and the instruction set
let lines;
let awkward = new Array(6);
let cooler = new Array(13);
let finals = new Array(4);
let fourfold = new Array(11);
let opening = new Array(10);
let thanks = new Array(13);

function preload() {
  lines = loadStrings('assets/00_dialogue.txt');
  
  for (let i = 0; i < awkward.length; i++) {
    awkward[i] = loadImage('assets/awkward_' + i + '.png');
  }
  
  for (let i = 0; i < cooler.length; i++) {
    cooler[i] = loadImage('assets/cooler_' + i + '.png');
  }
  
  for (let i = 0; i < finals.length; i++) {
    finals[i] = loadImage('assets/finals_' + i + '.png');
  }
  
  for (let i = 0; i < fourfold.length; i++) {
    fourfold[i] = loadImage('assets/fourfold_' + i + '.png');
  }
  
  for (let i = 0; i < opening.length; i++) {
    opening[i] = loadImage('assets/open_' + i + '.png');
  }
  
  for (let i = 0; i < thanks.length; i++) {
    thanks[i] = loadImage('assets/thanks_' + i + '.png');
  }
}

// Define the scene and the characters
let scene, natalia, nathaniel;

// Define the necessary button panels
let bp_awkward, bp_fourfold, bp_cooler;

// Define parameters for the canvas
//  -- Width given is the width of any image in the `assets` folder
//  -- Height given is the height of any image in said folder, plus 150px for space for the textbox
let c_width = 806;
let im_height = 605;
let tbox_height = 100;
let c_height = im_height + tbox_height;

function setup() {
  createCanvas(c_width, c_height);
  frameRate(48);
  textFont('Courier New');

  // Initialize the scene
  scene = new VN_Scene('cool and new scene', 1, 1, c_width - 2, c_height - 2, 10, tbox_height);

  // Add the images we just loaded in
  for (let i = 0; i < awkward.length; i++) {
    scene.add_image(awkward[i], 'awkward_' + i);
  }

  for (let i = 0; i < cooler.length; i++) {
    scene.add_image(cooler[i], 'cooler_' + i);
  }

  for (let i = 0; i < finals.length; i++) {
    scene.add_image(finals[i], 'finals_' + i);
  }

  for (let i = 0; i < fourfold.length; i++) {
    scene.add_image(fourfold[i], 'fourfold_' + i);
  }

  for (let i = 0; i < opening.length; i++) {
    scene.add_image(opening[i], 'opening_' + i);
  }

  for (let i = 0; i < thanks.length; i++) {
    scene.add_image(thanks[i], 'thanks_' + i);
  }

  // Add characters
  //  -- The given colors match the colors of the figures on the scene's images
  let orange = color(255, 104, 25);
  natalia = new VN_Character('Natalia', color(0, 76, 101), color(80, 156, 181));
  nathaniel = new VN_Character('Nathaniel', orange, color(255, 184, 105));

  scene.add_character(natalia, 'Natalia');
  scene.add_character(nathaniel, 'Nathaniel');

  // Define button panels
  bp_awkward = new VN_Button_Panel(orange);
  let awk_width = textWidth('Things have been getting') + 40; // get max width of buttons + padding
  bp_awkward.add_button('Oh, no reason...', 1, c_width/2, 1/4 * im_height, awk_width, 20);
  bp_awkward.add_button('Just checking on\nhow you’re doing...', 2, c_width/2, 2/4 * im_height, awk_width, 40);
  bp_awkward.add_button('Things have been getting\nweird between us.', 3, c_width/2, 3/4 * im_height, awk_width, 40);

  bp_fourfold = new VN_Button_Panel(orange);
  let four_width = textWidth('Heidegger’s fourfold') + 40;
  bp_fourfold.add_button('Guattari’s fourfold', 1, c_width/2, 1/3 * im_height, four_width, 20);
  bp_fourfold.add_button('Heidegger’s fourfold', 2, c_width/2, 2/3 * im_height, four_width, 20);

  bp_cooler = new VN_Button_Panel(orange);
  let cool_width = textWidth('Like you.') + 40;
  bp_cooler.add_button('Like you.', 1, c_width/2, 1/3 * im_height, cool_width, 20);
  bp_cooler.add_button('Like me.', 2, c_width/2, 2/3 * im_height, cool_width, 20);

  // Add the button panels
  scene.add_button_panel(bp_awkward, 'bp_awkward');
  scene.add_button_panel(bp_fourfold, 'bp_fourfold');
  scene.add_button_panel(bp_cooler, 'bp_cooler');

  // Assign the instructions to the scene
  lines.splice(0, 0, ''); // Prepend an empty string since text files are one-indexed in my editor instead of zero-indexed.
  scene.assign_instruction_set(lines);

  //  scene.set_current_inst_index(226); // For debugging: Jump to first choice - 51 / second choice - 226 / third choice - 351

}

function draw() {
  scene.display();
}

function mousePressed() {
  // Don't do anything if we've run out of instructions
  if (scene.check_if_reached_end_of_instruction_set()) {
    return;
  }

  // Only do the interaction if clicking inside the canvas
  let mouse_inside_canvas_x = (mouseX >= 0) && (mouseX < c_width);
  let mouse_inside_canvas_y = (mouseY >= 0) && (mouseY < c_height);
  if (mouse_inside_canvas_x && mouse_inside_canvas_y) {
    scene.handle_interaction();
  }
}