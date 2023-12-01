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
  error messages using console.log(), and `bg` is a function that draws the background scenery of the scene.

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
    // Guard clause - make sure the input is actually an image
    if (img.constructor.name != 'p5.Image') {
      console.log('ERROR: Atttempted to add a pose to character ' + this.name + ' except it wasn\'t of type p5.Image.');
    }

    this.pose[key] = img;
  };

  this.set_pose = function (pose) {
    // Check first to see if the request pose actually exists in the character's list of poses
    if (pose in this.poses) {
      // Note to self: See if this functionality works or if you're supposed to use the .hasOwn() method instead
      this.current_pose = pose;
    } else {
      this.current_pose = 'empty';
      console.log('WARNING: Attempted to set pose of character ' + this.name + ' to a pose that doesn\'t exist. Setting pose to EMPTY.');
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
      console.log('ERROR: Attempted to draw character ' + this.name + ' on non-existing side of screen.');
    }

    // Draw the current pose at the trans'd origin
    image(this.pose[this.current_pose], 0, 0);

    pop();
  };
}

// The empty character, for initializing a scene
const VN_EMPTY_CHARACTER = new VN_Character('');

// Define a scene
function VN_Scene (name, bg) {
  this.scene_name = name; // For debugging purposes, so as to report to console which scene broke
  this.background = bg;   // Pass in a fxn so that we can either have procedurally gen'd bg's or just a static image, at our choosing
  this.characters = {
    empty: VN_EMPTY_CHARACTER
  };
  this.active_characters = {
    // Initialize default characters as the empty character
    left: this.characters.empty,
    right: this.characters.empty
  };
  this.characters_visible = false; // Presume scene starts with exposition before someone speaks
  this.speaker = 'NARRATOR';       

  this.set_background = function (bg) {
    if (typeof bg != 'function') {
      console.log('ERROR: Attempted to assign a non-function as the background to ' + this.scene);
    }
    this.background = bg;
  };

  this.add_character = function (char) {
    // Guard clause - make sure the input is actually a character
    if (char.constructor.name != 'VN_Character') {
      console.log('ERROR: Atttempted to add a character to scene ' + this.scene_name + ' except it wasn\'t actually a character!');
      return;
    }

    let key = char.get_name();
    // Warn when character name conflict occurs
    if (key in this.characters) {
      console.log('WARNING: Character name conflict for name ' + key + ' in scene ' + this.scene_name + '. Overriding pre-existing character.');
    }
    this.characters[key] = char;
  }

  this.set_active_character = function (key, side) {
    if (side == 'LEFT') {
      this.active_characters.left = this.characters[key];
    } else if (side == 'RIGHT') {
      this.active_characters.right = this.characters[key];
    } else {
      // Failure case
      console.log('ERROR: Attempted to assign a character to non-existing side of scene ' + this.scene_name);
    }
  };

  this.toggle_character_visibility = function () {
    this.characters_visible = !this.characters_visible;
  }

  this.set_speaker = function (side) {
    if (side == 'LEFT' || side == 'RIGHT' || side == 'NARRATOR') {
      this.speaker = side;
    } else {
      // Default case
      this.speaker = 'NONE';
      console.log('WARNING: Speaker of scene ' + this.scene_name + ' set to NONE.');
    }
  };

  this.display = function () {
    push();

    // draw background image
    this.background();

    // draw the characters
    const x = 0; // TO DO: Replace with actual values
    const y = 0;
    this.active_characters.left.display(x, y, 'LEFT');
    this.active_characters.right.display(x, y, 'RIGHT');

    // draw the textbox
    //  -- you will need to work out some of the values....

    // draw the namebox
    if (this.speaker == 'LEFT') {
      // do the thing
    } else if (this.speaker == 'RIGHT') {
      // do the other thing
    }
    
    pop();
  };

  // TO DO: Add a method for displaying to the viewer a series of options
  //         -- Then to that, add functionality to store player decisions
  //         -- Decision trees, baby!
  //        Add audio functionality
  //        Add a way of distinguish text by speaking vs thinking vs onomatopoeia
}