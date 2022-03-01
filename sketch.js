const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope, fruit, ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button;
var bunny;
var blink, eat, sad;
var bg_sound, cut_sound, sad_sound, eating_sound, air;
var blower;
var canW, canH, isMobile;

function preload() {
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  bg_sound = loadSound("sound1.mp3")
  cut_sound = loadSound("rope_cut.mp3")
  sad_sound = loadSound("sad.wav")
  eating_sound = loadSound("eating_sound.mp3")
  air = loadSound("air.wav")

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}

function setup() {
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // return true/false
  if (isMobile) {
    canW = displayWidth
    canH = displayHeight
    createCanvas(displayWidth + 80, displayHeight)
  }
  else {
    canW = windowWidth
    canH = windowHeight
    createCanvas(windowWidth, windowHeight)
  }
  frameRate(80);

  engine = Engine.create();
  world = engine.world;

  bg_sound.play()
  bg_sound.setVolume(0.1)

  button = createImg('cut_btn.png');
  button.position(220, 30);
  button.size(50, 50);
  button.mouseClicked(drop);

  button2 = createImg('cut_btn.png');
  button2.position(320, 30);
  button2.size(50, 50);
  button2.mouseClicked(drop2);

  button3 = createImg('cut_btn.png');
  button3.position(360, 100);
  button3.size(50, 50);
  button3.mouseClicked(drop3);

  blower = createImg('blower.png');
  blower.position(10, 210);
  blower.size(150, 150);
  blower.mouseClicked(airBlower);

  mute_button = createImg('mute.png');
  mute_button.position(400, 30);
  mute_button.size(50, 50);
  mute_button.mouseClicked(mute);

  rope = new Rope(7, { x: 245, y: 30 });
  rope2 = new Rope(8, { x: 340, y: 30 });
  rope3 = new Rope(7, { x: 390, y: 100 });
  ground = new Ground(200,canH, 600, 20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(450, canH-80, 100, 100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking', blink);

  bunny.addAnimation('eating', eat);
  bunny.addAnimation('crying', sad);
  bunny.changeAnimation('blinking');

  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);
  fruit_con3 = new Link(rope3, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  //imageMode(CENTER);

}

function draw() {
  background(51);
  image(bg_img,0,0, displayWidth+80,displayHeight);

  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }

  rope.show();
  rope2.show()
  rope3.show()
  Engine.update(engine);
  ground.show();

  if (collide(fruit, bunny) == true) {
    eating_sound.play()
    bunny.changeAnimation('eating');
  }

  if (fruit != null && fruit.position.y >= 650) {
    sad_sound.play()
    sad_sound.setVolume(0.01)
    bunny.changeAnimation('crying');
    fruit = null;
  }

  drawSprites();
}

function drop() {
  cut_sound.play()
  rope.break();
  fruit_con.dettach();
  fruit_con = null;
}

function drop2() {
  cut_sound.play()
  rope2.break();
  fruit_con2.dettach();
  fruit_con2 = null;
}

function drop3() {
  cut_sound.play()
  rope3.break();
  fruit_con3.dettach();
  fruit_con3 = null;
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    }
    else {
      return false;
    }
  }
}

function airBlower() {
  Matter.Body.applyForce(fruit, { x: 0, y: 0 }, { x: 0.01, y: 0 })
  air.play()
}

function mute() {
  if (bg_sound.isPlaying()) {
    bg_sound.stop()
  } else {
    bg_sound.play()
  }
}


