/****************
Exercise. 2023-11-19
RECURSIVE TREE
Nathaniel Alloway, CSCI 1050-01

Click the canvas to change the flower colors.
****************/

function branch(x, y, orient, incr, clr, lvl) {
  let scaleX = 10 * lvl;
  let scaleY;
  if (lvl % 2 == 0) {
    scaleY = scaleX / 2;
  } else {
    scaleY = scaleX * 2;
  }
  
  push();
  translate(x, y);
  rotate(orient);
  stroke(clr);
  line(0, 0, -scaleX, scaleY);
  line(0, 0, scaleX, scaleY);
  
  if (lvl > 0) {
    branch(-scaleX, scaleY, incr + get_mouse_orient(), incr, clr, lvl - 1);
    branch(scaleX, scaleY, -incr + get_mouse_orient(), incr, clr, lvl - 1);
  } else {
    flower(scaleX, scaleY);
  }
  
  pop();
}

let flower_ind = 0;

const FLOWER_CLRS = [
  {stroke: 'BROWN', body: 'MAGENTA', center: 'YELLOW'},
  {stroke: 'BLACK', body: 'NAVY', center: 'CRIMSON'},
  {stroke: 'GRAY', body: 'BLACK', center: 'WHITE'},
  {stroke: 'GREEN', body: 'LIME', center: 'GREEN'}
];

function flower(x, y) {
  push();
  translate(x, y);
  strokeWeight(2);
  stroke( FLOWER_CLRS[flower_ind].stroke );
  fill( FLOWER_CLRS[flower_ind].body );
  circle(-5, -5, 10);
  circle( 5, -5, 10);
  circle(-5,  5, 10);
  circle( 5,  5, 10);
  noStroke();
  fill( FLOWER_CLRS[flower_ind].center );
  circle(0, 0, 10);
  
  pop();
}

function next_flower_ind () {
  flower_ind++;
  flower_ind %= FLOWER_CLRS.length;
}

function get_mouse_orient () {
  // Recall that mouseX is invariant under coordinate transf's -- it always measures
  // from the top-left corner.
  return map(mouseX, 0, width, TAU/16, -TAU/16);
}

function setup() {
  createCanvas(600, 600);
  strokeWeight(3);
}

function draw() {
  background('CYAN');
  
  push();
  noStroke();
  fill('KHAKI');
  rect(0, height - 50, width, 50);
  pop();
  
  translate(width/2, height - 47);
  scale(1, -1);
  branch(0, 0, 0, TAU/18, 'BROWN', 6);
}

function mousePressed() {
  next_flower_ind();
}