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
  | vn_parser.js  - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions
  | vn_globals.js - Stores variables used by other VN objects in a shared, global location
  assets
  | 
****************/
let can_char, can_char2, can_scene;

// TO DO: Revise comment, a bit hard to understand.

// Global variables for storing any dialogue choices or other options to the user, along with
// whether we're displaying any options and the result of user decisions
let VN_Current_Options_Displayed = '';
let VN_Is_Drawing_Options = false;
let VN_Option_Return_Value = false;
let VN_Line_Counter = 1;

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

  can_char = new VN_Character('testee', color(0, 200, 200), color(0, 240, 240));
  can_char2 = new VN_Character('testee 2', color(220, 160, 30), color(255, 200, 40));

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
}

function vn_handle_interaction (scene) {
  // Don't do anything if the scene's still printing the dialogue to the screen
  if (scene.dialogue_not_finished()) {
    return;
  }

  // Logic for when displaying options to the user.
  // If we are displaying options to the user....
  if (VN_Is_Drawing_Options) {

    // Then get the value of the button selected by the user if there is a button, otherwise set to false.
    VN_Option_Return_Value = VN_Current_Options_Displayed.button_panel.return_interaction();

    // If the user *has* selected a button, i.e. we have not set to false in the last step...
    if (VN_Option_Return_Value != false) {

      // Then set the value of the associated flag to the value of the selected button...
      VN_List_Of_Flags[VN_Current_Options_Displayed.target_flag] = VN_Option_Return_Value;

      // And stop drawing the buttons on the screen.
      VN_Is_Drawing_Options = false;
    } else {

      // Otherwise, ignore the user input.
      return;
    }
  }

  // Now execute lines in the parser's instruction set until we hit a specific command.
  let tmp = '';
  while (true) {
    tmp = scene.execute_instruction(VN_Line_Counter);
    VN_Line_Counter++;
    VN_Line_Counter %= scene.get_instructions_length();

    // We've hit an `options` command, so we'll set up a button panel here
    if (typeof tmp == 'object') {
      if ('target_flag' in tmp) {
        VN_Current_Options_Displayed = tmp;
        VN_Is_Drawing_Options = true;
      }
    }

    // We've hit an `if` command whose if-condition was met, so we'll go to the given index
    if (typeof tmp == 'number') {
      VN_Line_Counter = tmp;
    }

    // Pause execution if we hit `say` or `pause`
    if (tmp == 'say' || tmp == 'pause') {
      break;
    }
  }
}

function mousePressed() {
  vn_handle_interaction(can_scene);
}