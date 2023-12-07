/****************
vn_handler.js - Defines how to interpret text files in `assets` folder containing VN scene dialogs and instructions

TO DO: Finish rest of documentation!
****************/

let VN_List_Of_Backgrounds = [];
let VN_List_Of_Characters = [];
let VN_List_Of_Flags = [];
let VN_List_Of_Scenes = [];

function add_vn_background_to_list (bg) {
  VN_List_Of_Backgrounds[bg.name] = bg;
}

function add_vn_character_to_list (char) {
  VN_List_Of_Characters[char.get_name()] = char;
}

function add_vn_flag_to_list (flag) {

}

function add_vn_scene_to_list (scene) {

}

//-------------------------------------------------------------------------------------------------------------------------------------------------

function handler () {

}

// grab scene file
// figure out how to do control for it
// figure out how to read from scene file