let circleRadius = 75;
let initialDotNumber = 60;
let dotNumberDecrement = 5;
let noiseOffsets = [];
let seeds = [];
let noiseLocations = [];
let patterns = [];
let backgroundNoiseTime = 0;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB);

  let spacing = 190;
  let rows = height / spacing;
  let cols = width / spacing;
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) {
      let x = j * spacing + spacing / 2;
      let y = i * spacing + spacing / 2;
      let pattern = { x, y, radius: circleRadius };
      patterns.push(pattern);
      noiseOffsets.push({ x: random(1000), y: random(1000) });
      seeds.push(random(1000));
      noiseLocations.push(random(1000));
    }
  }
}

function draw() {
  background(195, 99, 40);
  drawBackgroundLines();

  translate(width / 2, height / 2);
  rotate(PI / 4);
  translate(-width / 2 - 80, -height / 2 - 80);
  //wheels noise moving
  for (let i = 0; i < patterns.length; i++) {
    let pattern = patterns[i];
    let distanceToCenter = dist(pattern.x, pattern.y, width / 2, height / 2);
    let wheelScale = map(distanceToCenter, 0, max(width, height), 0.5, 2);
    let scaleRadius = circleRadius * wheelScale;
    let [noisyX, noisyY] = getNoisyPosition(pattern.x, pattern.y, noiseOffsets[i], noiseLocations[i]);
    randomSeed(seeds[i]);
    drawWheels(noisyX, noisyY, scaleRadius, noiseLocations[i], wheelScale);
    noiseLocations[i] += 0.015;
  }
  backgroundNoiseTime += 0.01;
}
//draw universal black hole
function drawBackgroundLines() {
  let backgroundX = width / 2;
  let backgroundY = height / 2;

  let angleIncrement = 0.02;
  for (let angle = 0; angle < TWO_PI; angle += angleIncrement) {
    let outerRadius = (width / 2) * 1.5;
    let noiseValue = noise(cos(angle) * 5 + backgroundNoiseTime, sin(angle) * 5 + backgroundNoiseTime);
    let radiusOffset = map(noiseValue, 0, 1, -50, 50);
    let innerRadius = outerRadius * 0.1 + radiusOffset;

    let x1 = backgroundX + cos(angle) * innerRadius;
    let y1 = backgroundX + sin(angle) * innerRadius;
    let x2 = backgroundY + cos(angle) * outerRadius;
    let y2 = backgroundY + sin(angle) * outerRadius;

    stroke(0, 0, 0, 0.5);
    strokeWeight(1);
    line(x1, y1, x2, y2);
  }
}
//Wheel overall generates offsets
//Refer to  week 10 tutorial
function getNoisyPosition(x, y, offset, noiseLocation) {
  let noiseX = (noise(noiseLocation + offset.x) - 0.5) * 30;
  let noiseY = (noise(noiseLocation + offset.y) - 0.5) * 30;
  return [x + noiseX, y + noiseY];
}
//////Wheel's element//////
function drawWheels(x, y, radius, t, wheelScale) {
  // Draw line or dots
  let drawLines = random(1) > 0.5;
  // Whether to draw arc
  let drawArcs = random(1) > 0.8;
  let numDotRings = 5;
  let dotNumber = [];
  // The number of dots per ring
  for (let i = 0; i < numDotRings; i++) {
    let currentDotNumber = initialDotNumber - i * dotNumberDecrement;
    dotNumber.push(currentDotNumber);
  }
  // Outermost ring
  //Replaced ellipse with vertex for outmost ring
  push();
  let baseRadius = radius;
  let noiseScale = 0.5;

  fill(color(50, random(0, 30), 95));
  noStroke();
  beginShape();
  for (let i = 0; i < TWO_PI; i += 0.1) {
    let noiseValue = noise(cos(i) * noiseScale, sin(i) * noiseScale, t);
    let r = map(noiseValue, 0, 1, baseRadius - 20, baseRadius + 20);
    let xOffset = r * cos(i);
    let yOffset = r * sin(i);
    vertex(x + xOffset, y + yOffset);
  }
  endShape(CLOSE);
  // Using if-else to draw two different kinds of wheels
  if (drawLines) {
    let numLines = 70;
    stroke(random(360), 50, 60);
    strokeWeight(1.5 * wheelScale);
    noFill();
    beginShape();

    fill(50, random(0, 30), 95, 0.1);
    for (let k = 0; k < numLines; k++) {
      let angle = TWO_PI / numLines * k;
      let startX = x + cos(angle) * radius * 0.7;
      let startY = y + sin(angle) * radius * 0.7;
      let endX = x + cos(angle) * radius * 0.94;
      let endY = y + sin(angle) * radius * 0.94;
      vertex(startX, startY);
      vertex(endX, endY);
    }
    endShape(CLOSE);

    let dotColor = color(random(360), 50, 60);

    for (let i = 0; i < 3; i++) {
      let dotRingRadius = radius * (1 - i * 0.12);
      let numDots = dotNumber[i];
      for (let j = 0; j < numDots; j++) {
        let angle = j * TWO_PI / numDots;
        let dotX = x + cos(angle) * dotRingRadius * 0.63;
        let dotY = y + sin(angle) * dotRingRadius * 0.63;
        fill(dotColor);
        noStroke();
        ellipse(dotX, dotY, 5 * wheelScale);
      }
    }
  } else {
    let dotColor = color(random(360), 60, 60);

    for (let i = 0; i < numDotRings; i++) {
      let dotRingRadius = radius * (1 - i * 0.1);
      let numDots = dotNumber[i];
      for (let j = 0; j < numDots; j++) {
        let angle = j * TWO_PI / numDots;
        let dotX = x + cos(angle) * dotRingRadius * 0.95;
        let dotY = y + sin(angle) * dotRingRadius * 0.95;
        fill(dotColor);
        noStroke();
        ellipse(dotX, dotY, 6 * wheelScale);
      }
    }
  }
  // Center circle 
  let numInnerCircles = 5;
  for (let i = 0; i < numInnerCircles; i++) {
    let innerRadius = radius * 0.5 * (1 - i * 0.2);
    fill(color(random(330), 50, random(30, 90)));
    stroke(color(random(330), 50, random(30, 90)));
    strokeWeight(1 * wheelScale);
    ellipse(x, y, innerRadius * 1.8 * wheelScale);
  }
  // Pink arcs
  if (drawArcs) {
    stroke(348, 63, 90);
    strokeWeight(4 * wheelScale);
    noFill();
    let arcRadius = radius * 2;
    let startAngle = PI / 2;
    let endAngle = PI;
    arc(x, y - radius * wheelScale, arcRadius * wheelScale, arcRadius * wheelScale, startAngle, endAngle);
  }

  pop();
}

function windowResized() {
  resizeCanvas(800, 800);
}
