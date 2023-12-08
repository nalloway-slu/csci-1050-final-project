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

function bg_incr_gray () {
  background(VN_Line_Counter * 255/40 + 255/80);
}

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
  can_char = new VN_Character('testee');
  can_char2 = new VN_Character('testee 2');
  can_scene = new VN_Scene('test', 2, 2, 596, 596, 10, 596/3); // TO DO: Explain params, this looks a bit opaque

  can_butts = new VN_Button_Panel('can_butts', 'ORANGE');
  can_butts.add_button('do something', 1, 300, 200, 100, 25);
  can_butts.add_button('do nothing', 2, 300, 250, 100, 25);

  lines = loadStrings('assets/test_scene.txt');
}

function setup() {
  createCanvas(600, 600);

  lines.splice(0, 0, ''); // Prepend an empty command since text files are one-indexed instead of zero-indexed.

  add_vn_background_to_list(bg_incr_gray);
  add_vn_character_to_list(can_char);
  add_vn_character_to_list(can_char2);
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

    if (typeof tmp == 'object') {
      if ('target_flag' in tmp) {
        VN_Current_Options_Displayed = tmp;
        VN_Is_Drawing_Options = true;
      }
    }

    if (typeof tmp == 'number') {
      VN_Line_Counter = tmp;
    }

    if (tmp == 'say' || tmp == 'pause') {
      break;
    }
  }
}

function mousePressed() {
  vn_handle_interaction(can_scene);
}

// function setup() {
//   createCanvas(600, 600); // TO DO: Figure out how to center on page
//   // frameRate(48);
//   can_scene.set_background(bg_incr_gray);
//   can_scene.add_character(can_char);
//   can_scene.add_character(can_char2);
//   can_scene.set_char_speed(1);

//   can_butts.add_button('do nothing', 0, 300, 200, 50, 20);
//   can_butts.add_button('do something', 1, 300, 350, 50, 20);
// }

// function draw() {
//   can_scene.display();

//   if (counter == 4) {
//     can_butts.display();
//     butts_result = can_butts.return_interaction();
//     console.log('help');
//   }

//   // frame around canvas
//   push();
//   noFill();
//   stroke(0);
//   strokeWeight(1);
//   rect(1, 1, 599, 599);
//   pop();
// }

// let butts_result = false;

// function mousePressed() {
//   // Guard clause - disable control if we're still outputting text to screen
//   if (can_scene.dialogue_not_finished()) {
//     return;
//   }
//   // Guard clause 2 - disable control if we're in the middle of an 'options sequence'
//   else if (counter == 4 && !butts_result) {
//     return;
//   }

//   switch (counter) {
//     case 0:
//       can_scene.set_active_speaker_slot('testee', 'LEFT');
//       can_scene.set_active_speaker_slot('testee_2', 'RIGHT');
//       can_scene.set_speaker('LEFT');
//       can_scene.show_characters();

//       can_scene.set_pose('testee', '1');
//       can_scene.set_pose('testee_2', '1');

//       can_scene.set_dialogue('help me');
//       break;
//     case 1:
//       can_scene.set_speaker('RIGHT');
//       can_scene.set_pose('testee', '2');
//       can_scene.set_pose('testee', '2');
//       can_scene.set_dialogue('Have you considered helping yourself here? Huh? Have you?');
//       break;
//     case 2:
//       can_scene.set_speaker('NARRATOR');
//       can_scene.set_dialogue('oh no.... how rude....');
//       break;
//     case 3:
//       can_scene.set_dialogue('what should ' + can_char.get_name() + ' do?');
//       break;
//     case 4:
//       let tmp = butts_result;
//       butts_result = false;
//       can_scene.set_dialogue('you chose ' + tmp);
//       break;
//     default:
//       can_scene.clear_all();
//       butts_result = false;
//   }
//   counter += 1;
//   counter %= 6;
// }