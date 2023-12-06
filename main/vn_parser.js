/****************
vn_parser.js - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions

TO DO: Finish rest of documentation!

List of keywords, ordered by appearance in the definition of the VN_Scene constructor (see vn_objects.js):
  bg <func>
   -- Sets the background to the function <func>
  add <char>
   -- Adds character <char> to the parsed scene
  pose <char> <pose>
   -- Sets the pose of character <char> to <pose>
  speaker <side>
   -- Sets whether the character on the 'LEFT', the character on the 'RIGHT', or the 'NARRATOR' is speaking (or 'NONE')
  slot <char> <side>
   -- Assigns character <char> to the given <side> of the screen
  show
   -- Shows all the characters
  hide
   -- Hides all the characters
  say <msg>
   -- Sets the displayed dialogue to <msg>
  speed <speed>
   -- Sets the character scroll speed to be <speed> characters per frame
  clear
   -- Resets scene to default settings, in particular setting the speaker to 'NARRATOR', setting the on-screen characters to the
      global empty character VN_EMPTY_CHARACTER, and toggling the scene to hide characters instead of show
****************/

// decide on a language for writing scene files
//  -- pass in any other custom effects
//      -- looking up online says DON'T USE eval(), so maybe don't use eval()

// TO DO CONTINUALLY: Update list of keywords as you expand functionality of VN_Scene

// List of valid keywords accepted by the parser, in order of how many parameters they take
const VN_PARSER_KEYWORDS_ZERO_PARAMS = ['show', 'hide', 'clear'];
const VN_PARSER_KEYWORDS_ONE_PARAMS = ['bg', 'add', 'speaker', 'say', 'speed'];
const VN_PARSER_KEYWORDS_TWO_PARAMS = ['pose', 'slot'];

// Define the parser
function VN_Parser (scene, instructions) {
  // TO DO: Type checking!!
  this.scene = scene;
  this.name = scene.get_name();
  this.instructions = instructions;

  this.execute_line = function (index) {
    let line = this.instructions[index];
    // Get rid of leading/ending whitespace if there be any
    line = line.trim();

    // Determine if line is a single word, and if not, extract the first word only
    let first_space = line.indexOf(' ');
    let first_word;

    if (first_space == -1) { // the .indexOf() method returns -1 if the input is not in the string
      first_word = line;
    } else {
      first_word = line.substring(0, first_space);
    }

    // Execute the line based on the initial keyword
    if (VN_PARSER_KEYWORDS_ZERO_PARAMS.indexOf(first_word) > -1) {
      // The above line returns true iff the initial keyword is in the array VN_PARSER_KEYWORDS_ZERO_PARAMS (see previous comment on .indexOf())
      switch (first_word) {
        case 'show':
          this.scene.show_characters();
          break;
        case 'hide':
          this.scene.hide_characters();
          break;
        case 'clear':
          this.scene.clear_all();
          break;
        default:
          // This case should be impossible -- "should be"!
          console.error('ERROR: Something has gone horribly wrong in executing line ' + index + ' of scene ' + this.name);
      }
    }
    else if (VN_PARSER_KEYWORDS_ONE_PARAMS.indexOf(first_word) > -1)
    {
      // TO DO: Extract next keyword, or throw error if none exists
      // TO DO: Wrap the below in try-catch where necessary
      switch (first_word) {
        case 'bg':
          // do stuff
          break;
        case 'add':
          // do stuff
          break;
        case 'speaker':
          // do stuff
          break;
        case 'say':
          // do stuff
          break;
        case 'speed':
          // do stuff
          break;
        default:
          // We cover the impossible case as before
          console.error('ERROR: Something has gone horribly wrong in executing line ' + index + ' of scene ' + this.name);
      }
    }
    else if (VN_PARSER_KEYWORDS_TWO_PARAMS.indexOf(first_word) > -1)
    {
      // TO DO: Extract next two keywords
      switch (first_word) {
        case 'pose':
          // do stuff
          break;
        case 'slot':
          // do stuff
          break;
        default:
          // Yet another impossible case we still have to cover
          console.error('ERROR: Something has gone horribly wrong in executing line ' + index + ' of scene ' + this.name);
      }
    } else {
      // The initial keyword wasn't in any of the lists of valid keywords, so...
      console.error('ERROR: Unable to execute line ' + index + ' of scene ' + this.name + ' due to unrecognized keyword.');
    }
    
  };
}

