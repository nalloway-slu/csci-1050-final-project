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
  background(counter * 255/6 + 255/12);
}

function preload() {
  can_char = new VN_Character('testee');
  can_char2 = new VN_Character('testee 2');
  can_scene = new VN_Scene('test', 2, 2, 596, 596, 10, 596/3, bg_incr_gray); // TO DO: Explain params, this looks a bit opaque

  can_butts = new VN_Button_Panel('ORANGE');
}

function setup() {
  createCanvas(600, 600); // TO DO: Figure out how to center on page
  // frameRate(48);
  can_scene.add_character(can_char);
  can_scene.add_character(can_char2);
  can_scene.set_char_speed(1);

  can_butts.add_button('do nothing', 0, 300, 200, 50, 20);
  can_butts.add_button('do something', 1, 300, 350, 50, 20);
}

function draw() {
  can_scene.display();

  if (counter == 4) {
    can_butts.display();
    butts_result = can_butts.return_interaction();
    console.log('help');
  }

  // frame around canvas
  push();
  noFill();
  stroke(0);
  strokeWeight(1);
  rect(1, 1, 599, 599);
  pop();
}

let butts_result = false;

function mousePressed() {
  // Guard clause - disable control if we're still outputting text to screen
  if (can_scene.dialogue_not_finished()) {
    return;
  }
  // Guard clause 2 - disable control if we're in the middle of an 'options sequence'
  else if (counter == 4 && !butts_result) {
    return;
  }

  switch (counter) {
    case 0:
      can_scene.set_active_speaker_slot('testee', 'LEFT');
      can_scene.set_active_speaker_slot('testee 2', 'RIGHT');
      can_scene.set_speaker('LEFT');
      can_scene.show_characters();

      can_char.set_pose('1');
      can_char2.set_pose('1');

      can_scene.set_dialogue('help me');
      break;
    case 1:
      can_scene.set_speaker('RIGHT');
      can_char.set_pose('2');
      can_char2.set_pose('2');
      can_scene.set_dialogue('Have you considered helping yourself here? Huh? Have you?');
      break;
    case 2:
      can_scene.set_speaker('NARRATOR');
      can_scene.set_dialogue('oh no.... how rude....');
      break;
    case 3:
      can_scene.set_dialogue('what should ' + can_char.get_name() + ' do?');
      break;
    case 4:
      let tmp = butts_result;
      butts_result = false;
      can_scene.set_dialogue('you chose ' + tmp);
      break;
    default:
      can_scene.clear_all();
      butts_result = false;
  }
  counter += 1;
  counter %= 6;
}