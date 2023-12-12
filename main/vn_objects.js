/****************
vn_objects.js - Defines object constructors for characters, buttons, and scenes that are used for the VN

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
TO DO: Write note about parser
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
//  -- For legibility, properties and methods related to parser functionality are offloaded to file `vn_parser.js`
function VN_Scene (name, x, y, w, h, p, tb_h) {
  this.name = name;       // For debugging purposes, so as to report to console which scene broke
  
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
  this.speaker = 'NARRATOR';       // Can be either a key in `this.characters` or the string 'NARRATOR'

  // Properties for dialogue displayed to screen
  this.dialogue = '';
  this.dg_char_speed = 1;   // Characters to display per frame
  this.dg_char_counter = 0; // For tracking how many characters left needed to display to screen

  // Begin methods
  this.get_name = function () {
    return this.name;
  };

  // TO DO: Write comment
  this.add_image = function (im, key) {
    this.images[key] = im;
  }

  this.set_image = function (key) {
    // Make sure input is actually one of the images we have available
    if (key in this.images) {
      this.current_img = this.images[key];
    } else {
      console.error('ERROR: Attempted to display image with key `' + key + '` for scene ' + this.name + ' except key wasn\'t found in the scene\'s list of images.');
    }
  };

  // TO DO: Write comment
  this.add_character = function (char, key) {
    // Guard clause - make sure the input is actually a character
    if (char.constructor.name != 'VN_Character') {
      console.error('ERROR: Atttempted to add a character to scene ' + this.name + ' except it wasn\'t actually of type VN_Character.');
      return;
    }

    // Warn when character name conflict occurs
    if (key in this.characters) {
      console.warn('WARNING: Character name conflict for key `' + key + '` in scene ' + this.name + '. Overriding pre-existing character.');
    }

    this.characters[key] = char;
  };

  // TO DO: Write comment
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
      // In case no image is set, draw a black background
      push();
      fill(255);
      rect(0, 0, this.width, this.height);
      pop();
    } else {
      image(this.current_img, 0, 0);
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

    // Set text to italic or draw namebox where applicable,m then print dialogue to screen
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
      text(this.speaker.get_name(), 2 * this.padding, 2/3 * this.height);

      // Print dialogue to screen, slightly below the namebox
      text(dg_text, this.padding, textbox_y + 3 * this.padding, this.width - 2 * this.padding);
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