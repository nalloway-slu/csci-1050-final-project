/****************
vn_parser.js - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions

TO DO: Finish rest of documentation!

List of keywords, ordered by appearance in the definition of the VN_Scene constructor (see vn_objects.js):
  bg <func>
   -- Sets the background to the function <func> as found in global variable VN_List_Of_Backgrounds (see vn_handler.js)
  add <char>
   -- Adds to the scene the character <char> as found in global variable VN_List_Of_Characters
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

TO DO: Decide if the following needs refactoring into inclusion in the VN_Scene constructor

The following keywords do NOT appear in VN_Scene:
  options <flag> <option_sequence>
    -- TO DO: Write documentation here
  if <flag> <value> goto <line>
   -- If the value of the variable <flag> is <value>, then return line number <line> so that the handler knows to jump there
****************/

// decide on a language for writing scene files
//  -- pass in any other custom effects
//      -- looking up online says DON'T USE eval(), so maybe don't use eval()

// TO DO CONTINUALLY: Update list of keywords as you expand functionality of VN_Scene

// List of valid keywords accepted by the parser, in order of how many parameters they take
const VN_PARSER_KEYWORDS_ZERO_PARAMS = ['show', 'hide', 'clear'];
const VN_PARSER_KEYWORDS_ONE_PARAMS  = ['bg', 'add', 'speaker', 'say', 'speed'];
const VN_PARSER_KEYWORDS_TWO_PARAMS  = ['pose', 'slot', 'options'];
const VN_PARSER_KEYWORDS_MANY_PARAMS = ['if'];

// Define the parser
function VN_Parser (scene, instructions) {
  // TO DO: Type checking!!
  this.scene = scene;
  this.name = scene.get_name();
  this.instructions = instructions; // This assignment is the sole reason why we're making the parser into a kind of object: I don't want
                                    // to have to reinput the list of instructions every time I want to parse a new line -- that sounds
                                    // computationally expensive.

                                    // TO DO: Determine if it'd be better to have the parser as a VN_Scene method

  // This method executes line number `index` from `this.instructions` and returns (to the handler) the type of instruction performed, except
  // in three cases: If the method executes an `if` instruction, then it returns the value of the next index (for the handler) to look at. If
  // instead the method fails to execute for some reason, it returns 'error'. Lastly, if the line is just empty, then we do nothing and return
  // 'empty'.
  this.execute_line = function (index) {
    let line = this.instructions[index];
    // Get rid of leading/ending whitespace if there be any
    line = line.trim();

    // Immediately return if the line is the empty string
    if (line == '') {
      return 'empty';
    }

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
          // This case should be impossible (key word: "should be"!)
          console.error('ERROR: Something has gone horribly wrong in executing line ' + index + ' of scene ' + this.name);
          return 'error';
      }
    }
    else if (VN_PARSER_KEYWORDS_ONE_PARAMS.indexOf(first_word) > -1)
    {
      // If the initial keyword is `say`, then the rest of the line consists of text we want a character to say
      if (first_word == 'say') {
        // Get the rest of the text in `line` following the initial keyword
        let txt = line.substring(first_space + 1);
        this.scene.set_dialogue(txt);
      }
      else
      {
        // Otherwise, the line should consist of only two words, the initial keyword and the parameter. If there's any additional text,
        // then we ignore it.
        let cmd = line.split(' ', 2);
        let param = cmd[1];
        switch (first_word) {
          // See vn_handler.js for the global variables VN_List_Of_Backgrounds/Characters
          case 'bg':
            this.scene.set_background(VN_List_Of_Backgrounds[param]);
            break;
          case 'add':
            this.scene.add_character(VN_List_Of_Characters[param]);
            break;
          case 'speaker':
            this.scene.set_speaker(param);
            break;
          case 'speed':
            this.scene.set_char_speed(param);
            break;
          default:
            // We cover the impossible case as before
            console.error('ERROR: Something has gone horribly wrong in executing line ' + index + ' of scene ' + this.name);
            return 'error';
        }
      }
    }
    else if (VN_PARSER_KEYWORDS_TWO_PARAMS.indexOf(first_word) > -1)
    {
      // In this case, the line should consist of an initial keyword and two additional parameters. As before, we ignore any extra text.
      let cmd = line.split(' ', 3);
      let param1 = cmd[1];
      let param2 = cmd[2];
      switch (first_word) {
        case 'pose':
          this.scene.set_character_pose(param1, param2);
          break;
        case 'slot':
          this.scene.set_active_speaker_slot(param1, param2);
          break;
        case 'options':
          // TO DO: Implement this!!
          break;
        default:
          // Yet another impossible case we still have to cover
          console.error('ERROR: Something has gone horribly wrong in executing line ' + index + ' of scene ' + this.name);
          return 'error';
      }
    }
    else if (VN_PARSER_KEYWORDS_MANY_PARAMS.indexOf(first_word) > -1)
    {
      switch (first_word) {
        case 'if':
          // Here the format of the command should be `if <flag> <value> goto <line>`. As usual, we will ignore any extra text.
          //  -- We're also going to ignore the `goto` keyword as it's not actually relevant to the execution of the command here.
          //     We specify including the `goto` keyword for the `if` command just to aid readability when looking at the
          //     scene instruction files.
          let cmd = line.split(' ', 5);
          let flag = cmd[1];
          let val = cmd[2];
          let next_line = cmd[4];

          // Recall that for the `if` instruction, the method returns the value of the next index in the list of instructions
          // that the handler needs to look at.
          if (VN_List_Of_Flags[flag] == val) {
            return next_line;
          } else {
            return index + 1;
          }
          break;
        default:
          // Still yet another impossible case.
          console.error('ERROR: Something has gone horribly wrong in executing line ' + index + ' of scene ' + this.name);
          return 'error';
      }
    } else {
      // The initial keyword wasn't in any of the lists of valid keywords, so...
      console.error('ERROR: Unable to execute line ' + index + ' of scene ' + this.name + ' due to unrecognized keyword.');
      return 'error';
    }

    // If all is successful (and we didn't look at an `if` command), then return the initial keyword to the handler.
    return first_word;
    
  };
}

