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
  | vn_globals.js - Stores variables used by other VN objects in a shared, global location
  assets
  | 
****************/
let can_char, can_char2, can_scene;

// TO DO: Revise comment, a bit hard to understand.

function say_result_of_butts () {
  let adj;
  if (VN_List_Of_Flags['butt'] == 1) {
    adj = 'better';
  } else {
    adj = 'poorer';
  }
  can_scene.set_dialogue('You picked option ' + VN_List_Of_Flags['butt'] + ' and we were all the ' + adj + ' for it.');
}

function preload() {
  can_scene = new VN_Scene('test', 2, 2, 596, 596, 10, 596/3); // TO DO: Explain params, this looks a bit opaque

  can_char = new VN_Character('testee', color(0, 200, 200), color(0, 240, 240));      // namebox color is teal
  can_char2 = new VN_Character('testee 2', color(220, 160, 30), color(255, 200, 40)); // namebox color is orange

  can_scene.add_character(can_char, 'testee');
  can_scene.add_character(can_char2, 'testee_2');

  can_butts = new VN_Button_Panel('can_butts', 'ORANGE');
  can_butts.add_button('do something', 1, 300, 200, 100, 25);
  can_butts.add_button('do nothing', 2, 300, 250, 100, 25);

  lines = loadStrings('assets/test_scene.txt');
}

function setup() {
  createCanvas(600, 600);
  textFont('Courier New');

  lines.splice(0, 0, ''); // Prepend an empty command since text files are one-indexed instead of zero-indexed.

  add_vn_button_panel_to_list(can_butts);
  add_vn_flag_to_list('butt');
  add_vn_special_function_to_list(say_result_of_butts);

  can_scene.assign_instruction_set(lines);

  let tmp = '';
  while (tmp != 'pause') {
    tmp = can_scene.execute_instruction(VN_Line_Counter);
    VN_Line_Counter++;
  }
}

function draw() {
  can_scene.display();

  if (VN_Is_Drawing_Options) {
    VN_Current_Options_Displayed.button_panel.display();
  }

  push();
  noFill();
  rect(1, 1, width - 1, height - 1);
  pop();
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