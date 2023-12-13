/****************
vn_objects.js - Defines object constructors for characters, buttons, and scenes that are used for the VN

Define a character using `new VN_Character(name, b_clr, f_clr)`, where `name` is the name of the character,
  `b_clr` is the color of the border of the namebox drawn on the screen when the character is speaking,
  and `f_clr` is the fill color of said namebox.

Define a button panel using `new VN_Button_Panel()`. You may pass in an optional argument containing the
  default color of the buttons to display to screen.

To assign buttons to a button panel, use the .add_button() method. You DO NOT NEED to use the VN_Button
  constructor directly, but I won't stop you if you do.
    Using .add_button(txt, val, x, y, w, h, [clr2]):
      txt     - text to display on the button
      val     - value associated to the button (the value a flag will be set to if this button is clicked)
      x/y/w/h - position/width/height
      clr2    - optional argument, sets a specific color of the button other than the button panel's default color

Define a scene using `new VN_Scene(name, x, y, w, h, p, tb_h)`, where `name` is the name of the scene (used for
  debugging purposes), `x/y/w/h` are the position/width/height, `p` is the padding on any text elements, and
  `tb_h` is the height of the textbox.

Scenes come equipped with a variety of methods. Several of these are handled by the scene parser
  (see `vn_parser.js`), and so these are not usually called by hand. (But as before, I won't stop you if you
  do call any of the scene methods by hand.) Hence, we document only the methods that are likely to be used
  by hand below:

  .add_image(im, key)
   -- Adds p5.Image object `im` to the scene's list of images under the given `key`
  .add_character(char, key)
   -- Adds VN_Character object `char` to the scene's list of characters under the given `key`
  .dialogue_not_finished()
   -- Returns true if the scene is still typing out dialogue to the screen (dialogue is printed characters as a time
      rather than all at once), and returns false otherwise.
  .add_button_panel(bp, key)
   -- Adds VN_Button_Panel object `bp` to the scene's list of button panels under the given `key`
  .display()
   -- Draws the scene onto the canvas
****************/

// Define a character constructor for the VN scenes
function VN_Character (name, b_clr, f_clr) {
  this.name = name;
  this.border_color = b_clr;
  this.fill_color = f_clr;

  // Best practices mean that we don't access object properties directly
  this.get_name = function () {
    return this.name;
  };

  this.get_border_color = function () {
    return this.border_color;
  }

  this.get_fill_color = function () {
    return this.fill_color;
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------

// Define a button constructor for displaying dialogue choices in scenes
//  -- Upon selecting the button, returns the button value
function VN_Button (txt, val, x, y, w, h, clr) {
  // Properties for button text and flag return value
  this.label = txt;

  // Guard clause - The .return_interaction() method returns either this.value when the button is clicked, or false otherwise.
  // Consequently, we don't want to be able to assign a value of false to a button. And since I'll likely forget to use
  // strict equality/inequality later when I check for the output value of a button, we're gonna use non-strict equality
  // here and rule out 'falsy' values like 0 as well.
  if (val == false) {
    this.value = true;
    console.warn('WARNING: Attempted to assign value of false to button with label \'' + this.label + '\'. Assigning true instead.');
  } else {
    this.value = val;
  }

  // Properties for position and display
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.color = clr;

  this.display = function () {
    push();
    translate(this.x, this.y);

    // Body of the button
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);

    // Button text
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.label, 0, 0);

    pop();
  };

  this.return_interaction = function () {
    // Guard clause - ignore any non-mouse interactions
    if (!mouseIsPressed) {
      return;
    }

    let within_bounds_x = (mouseX >= this.x - this.width/2) && (mouseX <= this.x + this.width/2);
    let within_bounds_y = (mouseY >= this.y - this.height/2) && (mouseY <= this.y + this.height/2);
    if (within_bounds_x && within_bounds_y) {
      return this.value;
    } else {
      return false;
    }
  };
}

// Then define a constructor for physically collating buttons together
function VN_Button_Panel (clr = 'CYAN') {
  this.color = clr;
  this.buttons = [];

  this.add_button = function (txt, val, x, y, w, h, clr2 = this.color) {
    this.buttons[val] = new VN_Button(txt, val, x, y, w, h, clr2);
  };

  this.display = function () {
    for (let key in this.buttons) {
      this.buttons[key].display();
    }
  };

  this.return_interaction = function () {
    // We're going to call each button in order to see which button, if any, has been clicked.
    // Upon calling, each button will either return false if not clicked, or otherwise any other value.
    // We stop calling once we find a button that returns something other than false.
    let result = false;

    for (let key in this.buttons) {
      // We need strict inequality here so that JS doesn't try to coerce a `0` to `false` or something like that.
      let tmp = this.buttons[key].return_interaction();
      if (tmp !== false) {
        result = tmp;
        break;
      }
    }

    return result;
  };
}

//-------------------------------------------------------------------------------------------------------------------------------------------------

// Define a scene constructor
//  -- For modularization, properties/methods related to parser functionality are offloaded to file `vn_parser.js`
//     and properties/methods related to handling user interaction are offloaded to file `vn_handler.js`
function VN_Scene (name, x, y, w, h, p, tb_h) {
  this.name = name; // For debugging purposes, so as to report to console which scene broke
  
  // Properties for position of scene on screen, other elements in scene
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.padding = p;
  this.textbox_height = tb_h;

  // Properties for what images we can display to the screen
  this.images = [];
  this.current_img = '';
  
  // Properties for characters associated to the scene
  this.characters = [];
  this.speaker = 'NARRATOR'; // Can be either a key in `this.characters` or the string 'NARRATOR'

  // Properties for dialogue displayed to screen
  this.dialogue = '';
  this.dg_char_speed = 1;   // Characters to display per frame
  this.dg_char_counter = 0; // For tracking how many characters left needed to display to screen

  // Properties for any button panels/dialogue choices displayed to screen
  this.button_panels = [];
  this.flags = [];
  this.is_displaying_options = false;
  this.current_options_displayed = '';
  this.current_flag = '';

  // Begin methods //

  // Add an image to the scene's list of available images
  this.add_image = function (im, key) {
    // Guard clause - make sure given `key` is a non-empty string
    if (typeof key != 'string' || key == '') {
      console.error('ERROR: A key given when assigning image in scene ' + this.name + ' is not a non-empty string');
      return;
    }
    this.images[key] = im;
  }

  // Set which image you want to display to screen
  this.set_image = function (key) {
    // Make sure input is actually one of the images we have available
    if (key in this.images) {
      this.current_img = this.images[key];
    } else {
      console.error('ERROR: Attempted to display image with key `' + key + '` for scene ' + this.name + ' except key wasn\'t found in the scene\'s list of images.');
    }
  };

  // Add a character to the list of the characters for the scene, to be accessed by other methods via the given `key`
  this.add_character = function (char, key) {
    // Guard clause - make sure the input is actually a character
    if (char.constructor.name != 'VN_Character') {
      console.error('ERROR: Atttempted to add a character to scene ' + this.name + ' except it wasn\'t actually of type VN_Character.');
      return;
    }

    // Guard clause - make sure given `key` is a non-empty string
    if (typeof key != 'string' || key == '') {
      console.error('ERROR: A key given when assigning character in scene ' + this.name + ' is not a non-empty string');
      return;
    }

    // Warn when character name conflict occurs
    if (key in this.characters) {
      console.warn('WARNING: Character name conflict for key `' + key + '` in scene ' + this.name + '. Overriding pre-existing character.');
    }

    this.characters[key] = char;
  };

  // Set who is going to speak the upcoming piece of dialogue
  this.set_speaker = function (key) {
    if (key in this.characters) {
      this.speaker = this.characters[key];
    } else if (key == 'NARRATOR') {
      this.speaker = 'NARRATOR';
    } else {
      console.error('ERROR: Character with key `' + key + '` not found in scene ' + this.name + '.');
    }
  };

  // Methods for handling the textbox
  this.set_dialogue = function (msg) {
    if (typeof msg != 'string') {
      console.error('ERROR: Attempted to assign a non-string as dialogue in scene ' + this.name + '. Assgining the empty string instead.');
      msg = '';
    }
    this.dialogue = msg;
    this.dg_char_counter = msg.length;
  };

  this.set_char_speed = function (v) {
    if (typeof v != 'number') {
      console.error('ERROR: Attempted to assign a non-number as the character scroll speed in ' + this.name + '. Now using speed = 1.');
      v = 1;
    } else if (!Number.isFinite(v) || v <= 0) {
      console.error('ERROR: Attempted to assign NaN/infinite/negative as the character scroll speed in ' + this.name + '. Now using speed = 1.');
      v = 1;
    }
    this.dg_char_speed = v;
  };

  // Output whether or not the dialogue is finished being typed to screen so that the handler knows when we're ready to continue.
  this.dialogue_not_finished = function () {
    if (this.dg_char_counter == 0) {
      return false;
    } else {
      return true;
    }
  };

  // Methods for setting/handling dialogue choices
  this.add_button_panel = function (bp, key) {
    // Guard clause - make sure input is of type VN_Button_Panel
    if (bp.constructor.name != 'VN_Button_Panel') {
      console.error('ERROR: Atttempted to add a button panel to scene ' + this.name + ' except it wasn\'t actually of type VN_Button_Panel.');
      return;
    }

    // Guard clause - make sure given `key` is a non-empty string
    if (typeof key != 'string' || key == '') {
      console.error('ERROR: A key given when assigning button panel in scene ' + this.name + ' is not a non-empty string');
      return;
    }

    this.button_panels[key] = bp;
  };

  this.set_dialogue_options = function (key, flag) {
    // Make sure the given `key` is actually one of the button panels we have available
    if (key in this.button_panels) {
      this.is_displaying_options = true;
      this.current_options_displayed = this.button_panels[key];
      this.current_flag = flag;
    } else {
      console.error('ERROR: Button panel with key `' + key + '` not found in scene ' + this.name + '.');
    }
  };

  this.clear_dialogue_options = function () {
    this.is_displaying_options = false;
    this.current_options_displayed = '';
    this.current_flag = '';
  };

  // Reset some properties to defaults
  this.clear = function () {
    this.current_img = '';
    this.speaker = 'NARRATOR';
    this.set_dialogue('');
  }

  // Draw the scene!!
  //  -- Characters are drawn at center line, dividing the screen into thirds.
  this.display = function () {
    push();
    translate(this.x, this.y);

    // Draw image for scene
    if (this.current_img == '') {
      // In case no image is set, draw a blank background
      push();
      fill(20);
      noStroke();
      rect(0, 0, this.width, this.height);
      pop();
    } else {
      image(this.current_img, 0, 0);
    }

    // Draw the textbox
    fill(235); // TO CONSIDER: Change the textbox color?
    stroke(255);
    strokeWeight(4);

    let textbox_y = this.height - this.textbox_height;
    rect(0, textbox_y, this.width, this.height/3);

    fill(0);
    noStroke();
    textSize(14);

    // Display text characters of the dialogue incrementally
    let dg_text;

    // TO DO: Add audio functionality

    // Decrease the dialogue-output-counter every frame that we call the .display() method
    if (this.dg_char_counter > 0) {
      this.dg_char_counter -= this.dg_char_speed;

      // In case we go below zero...
      if (this.dg_char_counter < 0) {
        this.dg_char_counter = 0;
      }
    }
    // Display additional characters each time .display() is called
    dg_text = this.dialogue.substring(0, this.dialogue.length - this.dg_char_counter);

    // Set text to italic or draw namebox where applicable, then print dialogue to screen
    if (this.speaker == 'NARRATOR') {
      textStyle(ITALIC);
      text(dg_text, this.padding, textbox_y + 2 * this.padding, this.width - 2 * this.padding);
    }
    else
    {
      // Get color of namebox from the character
      let border_color = this.speaker.get_border_color();
      let fill_color = this.speaker.get_fill_color();

      // Draw the namebox
      stroke(border_color);
      strokeWeight(3);
      fill(fill_color);
      rect(this.padding, textbox_y - this.padding, textWidth(this.speaker.get_name()) + 2 * this.padding, 2 * this.padding);

      // Draw the name in the namebox
      fill(0);
      noStroke();
      textAlign(LEFT, CENTER);
      text(this.speaker.get_name(), 2 * this.padding, textbox_y);

      // Print dialogue to screen, slightly below the namebox
      text(dg_text, this.padding, textbox_y + 3 * this.padding, this.width - 2 * this.padding);
    }

    // If we need to display some dialogue choices, do so here
    if (this.is_displaying_options) {
      this.current_options_displayed.display();
    }

    pop();
  };
}