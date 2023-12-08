/****************
vn_globals.js - Stores variables used by other VN objects in a shared, global location

Certain objects, such as (importantly) the parser, need to be able to access other objects
in the VN without necessarily being able to reference said objects by their variable name. Hence, we
store those objects in key-value arrays here so that they may be referenced from a common
access point.

Example of use:
  When the parser finds an `options` command, it needs to set up both a flag and a button panel whose result
  needs to end up becoming the value of the flag. To do so, the parser grabs both the flag and the button panel
  from the global arrays VN_List_Of_Flags and VN_List_Of_Button_Panels.
****************/

let VN_List_Of_Backgrounds = [];
let VN_List_Of_Characters = [];
let VN_List_Of_Flags = [];
let VN_List_Of_Button_Panels = [];
let VN_List_Of_Special_Functions = [];

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
  if (bp.constructor.name != 'VN_Button_Panel') {
    console.error('ERROR: Atttempted to add a button panel to global list of button panels except it wasn\'t actually of type VN_Button_Panel.');
    return;
  }
  VN_List_Of_Button_Panels[bp.get_name()] = bp;
}

function add_vn_special_function_to_list (func) {
  VN_List_Of_Special_Functions[func.name] = func;
}