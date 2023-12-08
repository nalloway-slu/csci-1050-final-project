/****************
vn_handler.js - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions

TO DO: Finish rest of documentation!
****************/

let VN_List_Of_Backgrounds = [];
let VN_List_Of_Characters = [];
let VN_List_Of_Flags = [];
let VN_List_Of_Button_Panels = [];
let VN_List_Of_Special_Functions = [];
let VN_List_Of_Scenes = [];

function add_vn_background_to_list (bg) {
  // Guard clause - make sure the input is actually a function
  if (typeof bg != 'function') {
    console.error('ERROR: Atttempted to add a background fxn to global list of backgrounds except it wasn\'t actually a function.');
    return;
  }
  VN_List_Of_Backgrounds[bg.name] = bg;
}

function add_vn_character_to_list (char) {
  // Guard clause - make sure the input is actually a character
  if (char.constructor.name != 'VN_Character') {
    console.error('ERROR: Atttempted to add a character to global list of characters except it wasn\'t actually of type VN_Character.');
    return;
  }
  VN_List_Of_Characters[char.get_name()] = char;
}

function add_vn_flag_to_list (flag) {
  VN_List_Of_Flags[flag] = false;
}

function add_vn_button_panel_to_list (bp) {
  // Guard clause - make sure the input is actually a button panel
  if (char.constructor.name != 'VN_Button_Panel') {
    console.error('ERROR: Atttempted to add a button panel to global list of button panels except it wasn\'t actually of type VN_Button_Panel.');
    return;
  }
  VN_List_Of_Button_Panels[bp.get_name()] = bp;
}

function add_vn_special_function_to_list (func) {
  VN_List_Of_Special_Functions[func.name] = func;
}

function add_vn_scene_to_list (scene) {

}

//-------------------------------------------------------------------------------------------------------------------------------------------------

function handler () {

}

// grab scene file
// figure out how to do control for it
// figure out how to read from scene file