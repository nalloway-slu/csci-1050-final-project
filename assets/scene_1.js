/****************
scene_1.js - Defines scene 1


****************/

let scene_1;
let ringo, ecolo;

function scene_1_preload () {
  scene_1 = new VN_Scene('scene_1', 2, 2, WIDTH - 4, HEIGHT - 4, 10, (WIDTH - 4) / 3);
  ringo = new VN_Character('Ando Ringo');
  ecolo = new VN_Character('Ecolo');
}

function scene_1_setup () {
  scene_1.set_background(
    () => {
      background('RED');
    }
  );
  
}

