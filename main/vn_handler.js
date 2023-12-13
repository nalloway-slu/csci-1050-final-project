/****************
vn_handler.js - TO DO: Documentation



end documentation
****************/

// TO DO: Write comment
VN_Scene.prototype.current_inst_index = 0;

// TO DO: Write comment
VN_Scene.prototype.get_current_inst_index = function () {
  return this.current_inst_index;
}

// TO DO: Write comment
VN_Scene.prototype.handle_interaction = function () {
  // Don't do anything if we've run out of lines in the instruction set
  if (this.current_inst_index >= this.inst_length) {
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
    let val = this.button_panels[this.current_options_displayed].return_interaction();

    // If the user *has* selected a button, i.e. we have not set to false in the last step...
    if (val != false) {

      // Then set the value of the associated flag to the value of the selected button...
      this.flags[this.current_flag] = val;

      // And stop drawing the buttons on the screen.
      this.is_displaying_options = false;

      // TO DO: Remove the thing at this.current_options_displayed
    } else {

      // Otherwise, ignore the user input.
      return;
    }
  }

  // Now execute lines in the parser's instruction set until we hit a specific command.
  let tmp = '';
  while (true) {
    tmp = this.execute_instruction(VN_Line_Counter);
    this.current_inst_index++;

    // We've hit an `options` command, so we'll set up a dialogue choice here
    if (typeof tmp == 'object') {
      if ('target_flag' in tmp) {
        this.is_displaying_options = true;
        this.current_options_displayed = tmp.button_panel_key;
        this.current_flag = tmp.target_flag;
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
  }
};