/****************
vn_parser.js - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions

To expedite the writing process, we invent a language and write a parser for it:

List of keywords, ordered by appearance in the definition of the VN_Scene constructor (see vn_objects.js):
  img <key>
   -- Sets the image for the scene to be the this.
  speaker <key|NARRATOR>
   -- Sets the current speaker to be either `this.characters[key]` or the string 'NARRATOR'
  speaker_is_thinking
   -- Set the upcoming dialogue to be printed to screen as thinking instead of talking aloud
  speaker_is_speaking
   -- Set the upcoming dialogue to be printed to screen as talking aloud
  say <msg>
   -- Sets the displayed dialogue to <msg>
  say_nothing
   -- Sets the displayed dialogue to the empty string
  speed <speed>
   -- Sets the text character scroll speed to be <speed> characters per frame
  clear
   -- Clears the scene image and dialogue

The following keywords do NOT appear in VN_Scene:
  pause
   -- Does nothing
  #
   -- Functions identically to the `pause` command but is used for writing comments in the instructions document.
  exec <func>
   -- Executes special function <func> from VN_List_Of_Special_Functions
  goto <index>
   -- Returns <index> so that the handler knows to jump to that number line
  options <flag> <button_panel>
   -- Returns an object consisting of the key-value pairs `target_flag: <flag>` and `button_panel: VN_List_Of_Button_Panels[<button_panel>]`
  if <flag> <value> goto <index>
   -- If the value of the variable <flag> is <value>, then returns line number <line> so that the handler knows to jump there
****************/

// List of valid keywords accepted by the parser, in order of how many parameters they take
const VN_PARSER_KEYWORDS_ZERO_PARAMS = ['speaker_is_thinking', 'speaker_is_speaking', 'say_nothing', 'clear', 'pause', '#'];
const VN_PARSER_KEYWORDS_ONE_PARAMS  = ['img', 'speaker', 'say', 'speed', 'exec', 'goto'];
const VN_PARSER_KEYWORDS_TWO_PARAMS  = ['options'];
const VN_PARSER_KEYWORDS_MANY_PARAMS = ['if'];

VN_Scene.prototype.assign_instruction_set = function (instructions) {
  this.instructions = instructions;
  this.inst_length = instructions.length;
}

VN_Scene.prototype.get_instructions_length = function () {
  return this.inst_length;
}

// This method executes an instruction and returns the type of instruction performed, except for a few cases: If the
// method executes an `options` command, then it returns an object containing a VN_Button_Panel object and the name of
// a flag whose value will be set by the user selecting one of the buttons on the button panel. If the method executes
// a `goto` instruction, then it returns the value of the next index to look at. Similarly, if the method executes an `if`
// instruction, then we return either `if` if the if-condition fails, or the value of the next index to look at if the
// if-condition holds. If method fails to execute for some reason, it returns 'error'. Lastly, if the instruction is just
// empty, then we do nothing and return 'empty'.

// TO DO: Revise documentation note above


VN_Scene.prototype.execute_instruction = function (index) {
  // Guard clause - do nothing if index is out of range of instruction set
  if (index >= this.inst_length) {
    console.error('ERROR: Attempted to execute instruction at line ' + index + ' for scene ' + this.name + ', but index was out of range.');
    return;
  }

  // Get rid of leading/ending whitespace if there be any
  instruction = this.instructions[index].trim();

  // Immediately return if the instruction is the empty string
  if (instruction == '') {
    return 'empty';
  }

  // Determine if instruction is a single word, and if not, extract the first word only
  let first_space = instruction.indexOf(' ');
  let first_word;

  if (first_space == -1) { // the .indexOf() method returns -1 if the input is not in the string
    first_word = instruction;
  } else {
    first_word = instruction.substring(0, first_space);
  }

  // Execute the instruction based on the initial keyword
  if (VN_PARSER_KEYWORDS_ZERO_PARAMS.indexOf(first_word) > -1) {
    // The above line returns true iff the initial keyword is in the array VN_PARSER_KEYWORDS_ZERO_PARAMS (see previous comment on .indexOf())
    switch (first_word) {
      case 'speaker_is_thinking':
        this.speaker_is_thinking();
        break;
      case 'speaker_is_speaking':
        this.speaker_is_speaking();
        break;
      case 'say_nothing':
        this.set_dialogue('');
        break;
      case 'clear':
        this.clear();
        break;
      case 'pause':
      case '#':
        // These commands do nothing
        break;
      default:
        // This case should be impossible (key word: "should be"!)
        console.error('ERROR: Something has gone horribly wrong in executing `' + instruction + '` of scene ' + this.name);
        return 'error';
    }
  }
  else if (VN_PARSER_KEYWORDS_ONE_PARAMS.indexOf(first_word) > -1)
  {
    // If the initial keyword is `say`, then the rest of the instruction consists of text we want a character to say
    if (first_word == 'say') {
      // Get the rest of the text in rhe instruction following the initial keyword
      let txt = instruction.substring(first_space + 1);
      this.set_dialogue(txt);
    }
    else
    {
      // Otherwise, the instruction should consist of only two words, the initial keyword and the parameter. If there's any additional text,
      // then we ignore it.
      let cmd = instruction.split(' ', 2);
      let param = cmd[1];
      switch (first_word) {
        case 'img':
          this.set_image(param);
          break;
        case 'speaker':
          this.set_speaker(param);
          break;
        case 'speed':
          param = parseInt(param);
          this.set_char_speed(param);
          break;
        case 'exec':
          // TO DO: Make sure param is in array
          // TO DO: Write comment involving vn_globals.js
          VN_List_Of_Special_Functions[param]();
          break;
        case 'goto':
          // Remember that parameters in the instruction file are strings, so we have to convert to number first
          param = parseInt(param);

          // Make sure the parameter that the goto command comes with is actually a valid index
          if (param >= 0) {
            return param;
          }

          // Else...
          console.error('ERROR: Attempted to execute goto command `' + instruction + '` of scene ' + this.name + ', but given command does not have valid index');
          return 'error';
        default:
          // We cover the impossible case as before
          console.error('ERROR: Something has gone horribly wrong in executing `' + instruction + '` of scene ' + this.name);
          return 'error';
      }
    }
  }
  else if (VN_PARSER_KEYWORDS_TWO_PARAMS.indexOf(first_word) > -1)
  {
    // In this case, the instruction should consist of an initial keyword and two additional parameters. As before, we ignore any extra text.
    let cmd = instruction.split(' ', 3);
    let param1 = cmd[1];
    let param2 = cmd[2];
    switch (first_word) {
      case 'options':
        // TO DO: Check to make sure param1 is a flag, param2 is a button panel, &c.
        return {
          target_flag: param1,
          button_panel: VN_List_Of_Button_Panels[param2]
        };
      default:
        // Yet another impossible case we still have to cover
        console.error('ERROR: Something has gone horribly wrong in executing `' + instruction + '` of scene ' + this.name);
        return 'error';
    }
  }
  else if (VN_PARSER_KEYWORDS_MANY_PARAMS.indexOf(first_word) > -1)
  {
    switch (first_word) {
      case 'if':
        // Here the format of the command should be `if <flag> <value> goto <index>`. As usual, we will ignore any extra text.
        //  -- We're also going to ignore the `goto` keyword as it's not actually relevant to the execution of the command here.
        //     We specify including the `goto` keyword for the `if` command just to aid readability when looking at the
        //     scene instruction files.
        let cmd = instruction.split(' ', 5);
        let flag = cmd[1];
        let val = parseInt(cmd[2]);       // Remember that parameters in the instruction
        let goto_index = parseInt(cmd[4]); // file are strings, so we have to convert them to numbers.

        // Recall that for the `if` instruction, the function could return the goto-index instead of the instruction keyword.
        if (VN_List_Of_Flags[flag] == val) {
          return goto_index;
        }
        break;
      default:
        // Still yet another impossible case.
        console.error('ERROR: Something has gone horribly wrong in executing `' + instruction + '` of scene ' + this.name);
        return 'error';
    }
  } else {
    // The initial keyword wasn't in any of the lists of valid keywords, so...
    console.error('ERROR: Unable to execute `' + instruction + '` of scene ' + this.name + ' due to unrecognized keyword.');
    return 'error';
  }

  // If all is successful (and we didn't return earlier), then return the initial keyword to the handler.
  return first_word;
  
}