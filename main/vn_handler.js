/****************
vn_handler.js - Handles execution of instructions as parsed in `vn_parser.js` upon user input

The .handle_interaction() method executes instructions from the scene's instruction set continuously
  until it hits a `say` or `pause` command, at which point it stops execution. Important, we note
  that execution will STILL CONTINUE if the parser hits an error with one of its instructions!

Included also are a few additional methods related to the index of instruction that's currently being handled.
****************/

// Stores the current index that we're looking at in the scene's instruction set
VN_Scene.prototype.current_inst_index = 0;

// Get the current index, if desired
VN_Scene.prototype.get_current_inst_index = function () {
  return this.current_inst_index;
}

// Set the current index in for the scene's instruction set
//  -- Good for debugging, but probably don't set this manually otherwise
VN_Scene.prototype.set_current_inst_index = function (index) {
  // Guard clauses - make sure index is number within range of instruction set
  //  -- Note that internally a scene is allowed to have a `current_inst_index` out of the instruction set's range, which is
  //     how we check for when we've run out of instructions
  if (typeof index != 'number') {
    console.error('ERROR: Attempted to change the current index for the instruction set of scene ' + this.name + 'but index given is not a number.');
    return;
  } else if (!Number.isFinite(index) || index >= this.inst_length || index < 0) {
    console.error('ERROR: Attempted to change the current index for the instruction set of scene ' + this.name + 'but index given is out of range.');
    return;
  }
  this.current_inst_index = index;
}

// Returns true if we've run out of instructions, false otherwise
VN_Scene.prototype.check_if_reached_end_of_instruction_set = function () {
  return (this.current_inst_index >= this.inst_length);
}

// This method handles user interaction with the scene. This method does nothing if the user attempts to interact
// while the scene is still displaying dialogue. It also does nothing if there are dialogue choices displayed, but
// the user does not click on any of the buttons whilst interacting.
VN_Scene.prototype.handle_interaction = function () {
  // Don't do anything if we've run out of lines in the instruction set
  if (this.current_inst_index >= this.inst_length) {
    console.error('ERROR: Attempted to handle an interaction but already reached end of instruction set.');
    return;
  }

  // Don't do anything if the scene's still printing the dialogue to the screen
  if (this.dialogue_not_finished()) {
    return;
  }

  // Logic for when displaying dialogue options to the user
  // If we are displaying options to the user....
  if (this.is_displaying_options) {

    // Then get the value of the button selected by the user if there is a button, otherwise set to false.
    let val = this.current_options_displayed.return_interaction();

    // If the user *has* selected a button, i.e. we have not set to false in the last step...
    if (val != false) {

      // Then set the value of the associated flag to the value of the selected button...
      this.flags[this.current_flag] = val;

      // And stop drawing the buttons on the screen
      this.clear_dialogue_options();
    } else {

      // Otherwise, ignore the user input.
      return;
    }
  }

  // Now execute lines in the parser's instruction set until we hit a specific command.
  let tmp = '';
  while (true) {
    tmp = this.execute_instruction(this.current_inst_index);
    this.current_inst_index++;

    // We've hit an `options` command, so we'll set up a dialogue choice here
    if (typeof tmp == 'object') {
      if ('target_flag' in tmp) {
        this.set_dialogue_options(tmp.button_panel_key, tmp.target_flag);
      }
    }

    // We've hit an `if` command whose if-condition was met, so we'll go to the given index
    if (typeof tmp == 'number') {
      this.current_inst_index = tmp;
    }

    // Pause execution if we hit `say` or `pause`
    if (tmp == 'say' || tmp == 'pause') {
      break;
    }

    // Break if we've reached the end of the instruction set
    if (this.current_inst_index >= this.inst_length) {
      break;
    }
  }
};