/****************
vn_handler.js - TO DO: Documentation



end documentation
****************/

// TO DO: Extract out option-sequence globals and put them as object properties

VN_Scene.prototype.handle_interaction = function () {
  // Don't do anything if the scene's still printing the dialogue to the screen
  if (this.dialogue_not_finished()) {
    return;
  }

  // Logic for when displaying options to the user.
  // If we are displaying options to the user....
  if (VN_Is_Drawing_Options) {

    // Then get the value of the button selected by the user if there is a button, otherwise set to false.
    VN_Option_Return_Value = VN_Current_Options_Displayed.button_panel.return_interaction();

    // If the user *has* selected a button, i.e. we have not set to false in the last step...
    if (VN_Option_Return_Value != false) {

      // Then set the value of the associated flag to the value of the selected button...
      VN_List_Of_Flags[VN_Current_Options_Displayed.target_flag] = VN_Option_Return_Value;

      // And stop drawing the buttons on the screen.
      VN_Is_Drawing_Options = false;
    } else {

      // Otherwise, ignore the user input.
      return;
    }
  }

  // Now execute lines in the parser's instruction set until we hit a specific command.
  let tmp = '';
  while (true) {
    tmp = this.execute_instruction(VN_Line_Counter);
    VN_Line_Counter++;
    VN_Line_Counter %= this.inst_length;

    // We've hit an `options` command, so we'll set up a button panel here
    if (typeof tmp == 'object') {
      if ('target_flag' in tmp) {
        VN_Current_Options_Displayed = tmp;
        VN_Is_Drawing_Options = true;
      }
    }

    // We've hit an `if` command whose if-condition was met, so we'll go to the given index
    if (typeof tmp == 'number') {
      VN_Line_Counter = tmp;
    }

    // Pause execution if we hit `say` or `pause`
    if (tmp == 'say' || tmp == 'pause') {
      break;
    }
  }
};