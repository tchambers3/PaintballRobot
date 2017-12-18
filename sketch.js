
var input;
var analyzer;
var volume = 0;
var numObjects = 10;
var centerX;
var centerY;
var angle = 0;
var distance = 100;
var objects = [];
var randO = 0;
var serial;
var shots = 0;
var canShoot = true;
var shotsAvg = 0;

function setup() {
  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Assuming our Arduino is connected, let's open the connection to it
  serial.on('data', serialEvent);  // callback for when new data arrives
  serial.on('error', serialError);
  // Change this to the name of your arduino's serial port
  serial.open("/dev/cu.usbmodem1421");
  createCanvas(400, 600);
  frameRate(15)
  //background(200);
  // Create an Audio input
  mic = new p5.AudioIn();
  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  // mic.connect();
  mic.start();
  fft = new p5.FFT();
  centerX = width / 2;
  centerY = height / 2;
  noStroke();
  ellipseMode(CENTER);
}

function serialEvent() {
 // read a byte from the serial port:
 var inByte = serial.read();
 if (inByte == "69") {
    canShoot = true;
 }
 // store it in a global variable:
  console.log("Serial Event: "+inByte);
}
 
function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function draw() {
  shotsAvg++;
  //background(200);
  // Get the overall volume (between 0 and 1.0)
  var v = mic.getLevel();
  // "Smooth" the volume variable with an easing function
  volume += (v - volume) / 3;
  noStroke();
  var dotSize = map(volume, 0, 1, 10, 300);
  // volume = map(volume, 0, 1, -7, 7);
  numObjects = dotSize;
  // console.log(volume);
  // var posY = (volume * -1000) + height - 10
  var posY = random(0,height);
  var posX =  (random(centerX-((height-posY)/4), centerX+((height-posY)/4))% width)
  // Will need same for X if this is what we are doing
  var ardPosY = map(posY, 0, height, -300,200);
  var ardPosX = map(posX, 0, width, -200,200);
  imageMode(CENTER);
  // var str = "led 1"
  var str = "paint" + " " +ardPosX + " " + -ardPosY + " \n"

  // if(shotsAvg % 10 == 0) {
  //   ellipse(posX, posY, 20)
  //   fill("blue"); 
  //   serial.write(str) 
  //   console.log(str);
  // }

  if(volume > 0.01 && shotsAvg % 10 == 0) {
    ellipse(posX, posY, 20)
    fill("blue"); 
    serial.write(str)
    shots++
    console.log(str);
  } 
}
