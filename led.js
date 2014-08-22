var five = require("johnny-five");
var temporal = require("temporal");

board = new five.Board({
  port: "/dev/rfcomm0"
});

var keypress = require("keypress");


board.on("ready", function() {

//var pin = new five.Pin(5);
//pin.write(0);

var speed = 0	;
var motorState = true;

//var motorR = new five.Motor(5);
//var motorL = new five.Motor(9);
var motorL = new five.Motor({
    pins: {
      pwm: 3,
      dir: 9
    }
  });

//var motorR = new five.Motor([5, 6]);
var motorR = new five.Motor({
    pins: {
      pwm: 6,
      dir: 5
    }
  });

var ping = new five.Ping(7);
ping.on("data", function(err, value) {
    //console.log("data", value);
  });

  ping.on("change", function(err, value) {

    //console.log(typeof this.cm);
    //console.log("Object is " + this.cm + "cm away");
  });

//----------------------------

var servo = new five.Servo({
  pin: 12,
  range: [45, 135]
});

board.repl.inject({
    motorR: motorR,
    motorL: motorL,
	servo: servo
  });

servo.center();
//	servo.sweep();

var increment = 32;

function controller(ch, key) {
    var isThrottle = false; 
	//console.log("Current speed=" + speed);
	//console.log("keyname=" + key.name);

	if(key.name === "up" || key.name === "down"){
	      if (key.name === "up") {
		speed += increment;
		isThrottle = true;
	      }

	      if (key.name === "down") {
		speed -= increment;
		isThrottle = true;
	      }

	      if (isThrottle) {
		//console.log("Speed adjustment. speed=" + speed);
		if(speed == 0){
			motorR.stop();
			motorL.stop();
		}else if(speed > 0){
			motorR.forward(255 - speed);	
			motorL.forward(255 - speed);	
		}else{
			motorR.reverse(speed*-1);
			motorL.reverse(speed*-1);
		}
	      }
	}else if(key.name === "left" || key.name === "right"){
		motorR.stop();
		motorL.stop();
	      if (key.name === "left") {
			motorR.forward(200);
			motorL.reverse(55);		
	      }

	      if (key.name === "right") {
			motorR.reverse(55);
			motorL.forward(200);
	      }
      
	    }else if(key.name === "space"){
		console.log("space pressed");
				speed = 0; 
				motorR.reverse(1);
				motorL.reverse(1);
			servo.center();
		}else if(key.name === "pageup"){
			motorR.forward(1);
			motorL.forward(1);
		}else if(key.name === "pagedown"){
			motorR.reverse(255);
			motorL.reverse(255);
		}else if(key.name === "z"){
			servo.min();
		}else if(key.name === "x"){
			servo.max();
		}

	
  }

  keypress(process.stdin);

  process.stdin.on("keypress", controller);
  process.stdin.setRawMode(true);
  process.stdin.resume();

});

