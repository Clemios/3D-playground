import Zdog from 'zdog';
import Zfont from 'zfont';

function generateShapes(){
  let isSpinning = true;

  // Made with Zdog

const TAU = Zdog.TAU;
const offWhite = '#FED';
const gold = '#EA0';
const garnet = '#C25';
const eggplant = '#636';

const illo = new Zdog.Illustration({
  element: '.zdog-canvas-gym',
  zoom: 5,
  rotate: { y: -TAU/8 },
  dragRotate: true,
});

// ----- model ----- //

var hipX = 3;
// hips
var hips = new Zdog.Shape({
  addTo: illo,
  path: [ { x: -hipX }, { x: hipX } ],
  translate: { y: 2 },
  stroke: 4,
  color: eggplant,
});

// ----- legs ----- //

var leg = new Zdog.Shape({
  addTo: hips,
  path: [ { y: 0 }, { y: 12 } ],
  translate: { x: -hipX },
  rotate: { x: TAU/4 },
  color: eggplant,
  stroke: 4,
});

// foot
var foot = new Zdog.RoundedRect({
  addTo: leg,
  width: 2,
  height: 4,
  cornerRadius: 1,
  translate: { y: 14, z: 2 },
  rotate: { x: TAU/4 },
  color: garnet,
  fill: true,
  stroke: 4,
});

var standLeg = leg.copy({
  translate: { x: hipX },
  rotate: { x: -TAU/8 },
});

foot.copy({
  addTo: standLeg,
  rotate: { x: -TAU/8 },
});

// ----- upper body ----- //

var spine = new Zdog.Anchor({
  addTo: hips,
  rotate: { x: TAU/8 },
});

var chest = new Zdog.Shape({
  addTo: spine,
  path: [ { x: -1.5 }, { x: 1.5 } ],
  translate: { y: -6.5 },
  stroke: 9,
  color: garnet,
});

var head = new Zdog.Shape({
  addTo: chest,
  stroke: 12,
  translate: { y: -9.5 },
  color: gold,
});

var eye = new Zdog.Ellipse({
  addTo: head,
  diameter: 2,
  quarters: 2,
  translate: { x: -2, y: 1, z: 4.5 },
  rotate: { z: -TAU/4 },
  color: eggplant,
  stroke: 0.5,
  backface: false,
});
eye.copy({
  translate: { x: 2, y: 1, z: 4.5 },
});
// smile
new Zdog.Ellipse({
  addTo: head,
  diameter: 3,
  quarters: 2,
  translate: { y: 2.5, z: 4.5 },
  rotate: { z: TAU/4 },
  closed: true,
  color: '#FED',
  stroke: 0.5,
  fill: true,
  backface: false,
});

// ----- arms ----- //

var armSize = 6;

// arm on left
var upperArm = new Zdog.Shape({
  addTo: chest,
  path: [ { y: 0 }, { y: armSize } ],
  translate: { x: -5, y: -2 },
  rotate: { x: -TAU/4 },
  color: eggplant,
  stroke: 4,
});

var forearm = new Zdog.Shape({
  addTo: upperArm,
  path: [ { y: 0 }, { y: armSize } ],
  translate: { y: armSize },
  rotate: { x: TAU/8 },
  color: gold,
  stroke: 4,
});

// hand
let hand = new Zdog.Shape({
  addTo: forearm,
  translate: { z: 1, y: armSize },
  stroke: 6,
  color: gold,
});

let bar = new Zdog.Shape({
  addTo: hand,
  path: [ { y: -7.5 }, { y: 7.5 } ],
  stroke: 1,
  rotate: { x: TAU/4 },
  color: "black",
});

// let weight = new Zdog.Shape({
//   addTo: bar,
//   path: [ { y: -7.5 }, { y: 7.5 } ],
//   stroke: 1,
//   rotate: { x: TAU/4 },
//   color: "black",
// });

// let weight = new Zdog.Box({
//   addTo: bar,
//   width: 5,
//   height: 5,
//   depth: 5,
//   stroke: false,
//   translate: { x: 0, y: 7, z: 0 },
//   color: 'black', // default face color
// });

let weight = new Zdog.Ellipse({
  addTo: bar,
  rotate: { x: TAU/4 },
  translate: { y: 7.5 },
  diameter: 5,
  fill: true,
  stroke: 2,
  color: 'black',
});

let weight2 = new Zdog.Ellipse({
  addTo: bar,
  rotate: { x: TAU/4 },
  translate: { y: -7.5 },
  diameter: 5,
  fill: true,
  stroke: 2,
  color: 'black',
});

// arm on right
upperArm.copyGraph({
  translate: { x: 5, y: -2 },
  rotate: { x: TAU/4 },
});

function animate() {
  illo.rotate.y += isSpinning ? -0.05 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}
animate();


      

      
}

export {generateShapes}