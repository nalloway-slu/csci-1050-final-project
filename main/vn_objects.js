// Define a character constructor for the VN scenes
function VN_Character (name) {
  this.name = name;
  this.poses = {
    default: '' // TO DO: replace with global empty image
  };
  this.current_pose = 'default';

  this.add_pose = function (key, img) {
    // add error handling in case img is not p5.Image
    this.pose[key] = img;
  };

  this.set_pose = function (pose) {
    // Check first to see if the request pose actually exists in the character's list of poses
    if (pose in this.poses) {
      // Note to self: See if this functionality works or if you're supposed to use the .hasOwn() method instead
      this.current_pose = pose;
    } else {
      console.log('ERROR: Attempted to set pose of character ' + this.name + ' to a pose that doesn\'t exist.');
    }
  };

  this.display = function (x, y, side='LEFT') {
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
  this.background = bg;
  this.characters = [VN_EMPTY_CHARACTER];
  this.active_characters = {
    // Initialize default characters as the empty character
    left: this.characters[0],
    right: this.characters[0]
  };
  this.focus = 'NARRATOR'; // Default, as scenes may start with exposition before someone speaks

  this.set_background = function (bg) {
    this.background = bg;
  };

  this.add_character = function (char) {
    this.characters.push(char);
  };

  // In the event you want to override a pre-existing character instead (e.g., the default empty character)
  this.set_character = function (index, char) {
    this.characters[index] = char;
  }

  this.set_active_character = function (index, side) {
    if (side == 'LEFT') {
      this.active_characters.left = this.characters[index];
    } else if (side == 'RIGHT') {
      this.active_characters.right = this.characters[index];
    } else {
      // Failure case
      console.log('ERROR: Attempted to assign a character to non-existing side of scene ' + this.scene_name);
    }
  };

  this.set_focus = function (side) {
    if (side == 'LEFT') {
      this.focus = 'RIGHT';
    } else if (side == 'RIGHT') {
      this.focus = 'LEFT';
    } else if (side == 'NARRATOR') {
      this.focus = 'NARRATOR';
    } else {
      // Default case
      this.focus = 'NONE';
      console.log('WARNING: Focus of scene ' + this.scene_name + ' set to NONE.');
    }
  };

  this.display = function () {
    push();

    // draw background image
    // draw any active characters
    // draw the appropriate text
      // fetch name of the focused character
      // draw name in name box on the correct side of the screen
    
    pop();
  };

  // TO DO: Add a method for displaying to the viewer a series of options
  //         -- Then to that, add functionality to store player decisions
  //         -- Decision trees, baby!
}