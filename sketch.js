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
let counter = 0;

function bg_incr_gray () {
  background(counter * 255/40 + 255/80);
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

  lines.splice(0, 0, '');
  parser = new VN_Parser(can_scene, lines);

  add_vn_background_to_list(bg_incr_gray);
  add_vn_character_to_list(can_char);
  add_vn_character_to_list(can_char2);
  add_vn_button_panel_to_list(can_butts);
  add_vn_flag_to_list('butt');
  add_vn_special_function_to_list(say_result_of_butts);

  let tmp = '';
  while (tmp != 'pause') {
    tmp = parser.execute_line(counter);
    counter++;
  }
}

let opt = '';
let drawing_options = false;
let opt_return = false;

function draw() {
  can_scene.display();

  if (drawing_options) {
    opt.button_panel.display();
  }
}

function mousePressed() {
  if (can_scene.dialogue_not_finished()) {
    return;
  }

  if (drawing_options) {
    opt_return = opt.button_panel.return_interaction();
    if (opt_return != false) {
      VN_List_Of_Flags[opt.target_flag] = opt_return;
      drawing_options = false;
    } else {
      return;
    }
  }

  let tmp = '';
  while (true) {
    tmp = parser.execute_line(counter);
    counter++;
    counter %= lines.length;

    if (typeof tmp == 'object') {
      if ('target_flag' in tmp) {
        opt = tmp;
        drawing_options = true;
      }
    }

    if (typeof tmp == 'number') {
      counter = tmp;
    }

    if (tmp == 'say' || tmp == 'pause') {
      break;
    }
  }
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