/****************
vn_objects.js - Defines object constructors for characters, scenes that occur in the VN.

Create a character using `new VN_Character(name)`, where `name` is the name of the character.
The `name` parmater will be used by the VN_Scene object to display in the on-screen namebox.
The character stores poses, which are key-value pairs consisting of the name of the pose and a p5.Image object
  containing an image of the character.
Use add_pose() to add poses to the character, and use set_pose() to change the displayed pose.
The display() method takes parameters `x` and `y` for the position of the pose on screen and an optional
  paramter `side` which determines whether to reflect the character pose or not. (If `side == 'RIGHT'`, then
  we presume the character is to be displayed on the right side of the screen, and hence we reflec them so that
  they face left.)

Create a scene using `new VN_Scene(name, bg)`, where `name` is the name of the scene, which we use to record
  error messages using console.error(), and `bg` is a function that draws the background scenery of the scene.

TO DO: Finish rest of documentation!
****************/

// Define a character constructor for the VN scenes
function VN_Character (name) {
  this.name = name;
  this.poses = {
    'empty': ''
  };
  this.current_pose = 'empty';

  // Best practices mean that we don't access object properties directly
  this.get_name = function () {
    return this.name;
  };

  this.add_pose = function (key, img) {
    // TO DO(?): Fix guard clause functionality

    // // Guard clause - make sure the input is actually an image
    // if (img.constructor.name != 'p5.Image') {
    //   console.error('ERROR: Atttempted to add a pose to character ' + this.name + ' except it wasn\'t of type p5.Image.');
    // }

    this.poses[key] = img;
  };

  this.set_pose = function (pose) {
    // Check first to see if the request pose actually exists in the character's list of poses
    if (pose in this.poses) {
      // Note to self: See if this functionality works or if you're supposed to use the .hasOwn() method instead
      this.current_pose = pose;
    } else {
      this.current_pose = 'empty';
      console.warn('WARNING: Attempted to set pose of character ' + this.name + ' to a pose that doesn\'t exist. Setting pose to EMPTY.');
    }
  };

  this.display = function (x, y, side) {
    // Guard clause - draw nothing if the pose is empty
    if (this.current_pose == 'empty') {
      return;
    }

    push();
    translate(x, y);
    imageMode(CENTER);

    // Flip the character pose if on the right hand side
    if (side == 'RIGHT') {
      scale(-1, 1);
    } else if (side != 'LEFT') {
      console.error('ERROR: Attempted to draw character ' + this.name + ' on non-existing side of screen.');
    }

    // Draw the current pose at the trans'd origin
    image(this.poses[this.current_pose], 0, 0);

    pop();
  };
}

// The empty character, for initializing a scene
const VN_EMPTY_CHARACTER = new VN_Character('');

//-------------------------------------------------------------------------------------------------------------------------------------------------

// Define a button constructor for displaying dialogue choices in scenes
//  -- Upon selecting the button, returns the button value
function VN_Button (txt, val, x, y, w, h, clr) {
  // Properties for button text and flag return value
  this.label = txt;
  if (val == false) {
    // Guard clause - The .return_if_interaction() method returns either this.value when the button is clicked, or false otherwise.
    //  -- Hence, we don't want to be able to assign a value of false to the button.
    this.value = true;
    console.warn('WARNING: Attempted to assign value of false to button with label ' + this.label + '. Assigning true instead.');
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
    let within_bounds_x = (mouseX >= this.x - this.width/2) && (mouseX <= this.x + this.width/2);
    let within_bounds_y = (mouseY >= this.y - this.height/2) && (mouseY <= this.y + this.height/2);
    if (within_bounds_x && within_bounds_y) {
      return this.value;
    } else {
      return false;
    }
    // TO DO: Figure out how to have a clicking animation
  };
}

// Then define a constructor for physically collating buttons together
function VN_Button_Panel (name, clr = 'CYAN') {
  this.name = name;
  this.color = clr;
  this.buttons = [];

  this.get_name = function () {
    return this.name;
  }

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
function VN_Scene (name, x, y, w, h, p, tb_h) {
  this.scene_name = name;     // For debugging purposes, so as to report to console which scene broke
  this.background = () => {}; // Bg's are fxn's so that we can either have procedurally gen'd bg's or just a static image, at our choosing
  
  // Properties for position of scene on screen, other elements in scene
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.padding = p;
  this.textbox_height = tb_h;
  
  // Properties for characters associated to the scene
  this.characters = {
    empty: VN_EMPTY_CHARACTER
  };
  this.active_speakers = {
    // Initialize default characters as the empty character
    left: this.characters.empty,
    right: this.characters.empty
  };
  this.speaker = 'NARRATOR';       // Can be either 'LEFT', 'RIGHT', 'NARRATOR', or 'NONE'
  this.characters_visible = false; // Presume scene starts with exposition before someone speaks - hence this and the previous line

  // Properties for dialogue displayed to screen
  this.dialogue = '';
  this.dg_char_speed = 1;   // Characters to display per frame
  this.dg_char_counter = 0; // For tracking how many characters left needed to display to screen

  // Begin methods
  this.get_name = function () {
    return this.scene_name;
  };

  this.set_background = function (bg) {
    if (typeof bg != 'function') {
      console.error('ERROR: Attempted to assign a non-function as the background to ' + this.scene);
    }
    this.background = bg;
  };

  this.add_character = function (char) {
    // Guard clause - make sure the input is actually a character
    if (char.constructor.name != 'VN_Character') {
      console.error('ERROR: Atttempted to add a character to scene ' + this.scene_name + ' except it wasn\'t actually of type VN_Character.');
      return;
    }

    let key = char.get_name();
    // Warn when character name conflict occurs
    if (key in this.characters) {
      console.warn('WARNING: Character name conflict for name ' + key + ' in scene ' + this.scene_name + '. Overriding pre-existing character.');
    }
    this.characters[key] = char;
  };

  this.set_character_pose = function (key, pose) {
    if (key in this.characters) {
      this.characters[key].set_pose(pose);
    } else {
      console.error('ERROR: Character ' + key + ' not found for scene ' + this.scene_name);
    }
  };

  // Designate if the character on the LEFT, the character on the RIGHT, or the NARRATOR is going to speak
  this.set_speaker = function (side) {
    if (side == 'LEFT' || side == 'RIGHT' || side == 'NARRATOR') {
      this.speaker = side;
    } else {
      // Default case
      this.speaker = 'NONE';
      console.warn('WARNING: Speaker of scene ' + this.scene_name + ' set to NONE.');
    }
  };

  // Assign a character from this.characters to either the LEFT or RIGHT side of the screen
  this.set_active_speaker_slot = function (key, side) {
    if (side == 'LEFT') {
      this.active_speakers.left = this.characters[key];
    } else if (side == 'RIGHT') {
      this.active_speakers.right = this.characters[key];
    } else {
      // Failure case
      console.error('ERROR: Attempted to assign a character to non-existing side of scene ' + this.scene_name);
    }
  };

  // A pair of function for when you want to hide characters during a cutaway or return them thereafter
  this.show_characters = function () {
    this.characters_visible = true;
  };

  this.hide_characters = function () {
    this.characters_visible = false;
  };

  // Methods for handling the textbox
  this.set_dialogue = function (msg) {
    this.dialogue = msg;
    this.dg_char_counter = msg.length;
  };

  this.set_char_speed = function (v) {
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
  
  // Resets all the active speakers and dialogue and stuff to the defaults.
  this.clear_all = function () {
    this.set_speaker('NARRATOR');
    this.set_active_speaker_slot('empty', 'LEFT');
    this.set_active_speaker_slot('empty', 'RIGHT');
    this.set_dialogue('');
    this.hide_characters();
  };

  // Draw the scene!!
  //  -- Characters are drawn at center line, dividing the screen into thirds.
  this.display = function () {
    push();
    translate(this.x, this.y);

    // Draw background image
    this.background(); // TO DO: See about adding functionality for passing in optional args for this fxn

    // Draw the characters
    if (this.characters_visible) {
      this.active_speakers.left.display(this.width/3, this.height/2, 'LEFT'); // space characters at thirds
      this.active_speakers.right.display(2/3 * this.width, this.height/2, 'RIGHT');
    }

    // Draw the textbox
    fill(235);
    // TO CONSIDER: Use opacity instead of off-white
    // fill(255, 255, 255, 220);
    stroke(255);
    strokeWeight(4);

    let textbox_y = this.height - this.textbox_height;
    rect(0, textbox_y, this.width, this.height/3);

    fill(0);
    noStroke();
    textSize(14);

    // Display text characters of the dialogue incrementally
    let dg_text;
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

    // Draw text and namebox if applicable
    if (this.speaker == 'NARRATOR') {
      textStyle(ITALIC);
      text(dg_text, this.padding, textbox_y + 2 * this.padding, this.width - 2 * this.padding);
    }
    else if (this.speaker == 'LEFT')
    {
      // Draw text on left side of screen
      text(dg_text, this.padding, textbox_y + 2 * this.padding, 2/3 * this.width - 2 * this.padding);

      // Draw the namebox
      fill(60, 210, 255);
      stroke(35, 185, 250);
      strokeWeight(3);
      rect(this.padding, textbox_y - this.padding, textWidth(this.active_speakers.left.get_name()) + 2 * this.padding, 2 * this.padding);

      fill(0);
      noStroke();
      textAlign(LEFT, CENTER);
      text(this.active_speakers.left.get_name(), 2 * this.padding, 2/3 * this.height);
    }
    else if (this.speaker == 'RIGHT')
    {
      // Draw text on right side of screen
      textAlign(RIGHT);
      text(dg_text, 1/3 * this.width + this.padding, textbox_y + 2 * this.padding, 2/3 * this.width - 2 * this.padding);

      // Draw the namebox
      fill(255, 210, 60);   // TO DO: Add custom color functionality by assigning color to VN_Character
      stroke(250, 185, 35);
      strokeWeight(3);
      rect(this.width - this.padding, textbox_y - this.padding, -textWidth(this.active_speakers.right.get_name()) - 2 * this.padding, 2 * this.padding);

      fill(0);
      noStroke();
      textAlign(RIGHT, CENTER);
      text(this.active_speakers.right.get_name(), this.width - 2 * this.padding, 2/3 * this.height);
    }

    pop();
  };

  // TO DO: Figure out if i should assign button panels to scenes or if they should be independent
  //        Add audio functionality
  //        Add a way of distinguish text by speaking vs thinking vs onomatopoeia
  //        Figure out how to hook in ways to control the back-background behind the VN_Scene -- maybe put in the parser as a separate component?
  //        Perhaps refactor the whole speaker thing into a L-R vs. face-viewer mode
  //        Have a way to output prior dialog to a history box somewhere?
}