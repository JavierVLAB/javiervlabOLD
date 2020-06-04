var COLOURS = [ '#EC3277', '#93EC32', '#F7DF31', '#3077FC', '#20F8E7', '#9B3DEF', '#BBBBBB',];

var hexToRGB = function(hex) {
var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
return result ? {
r: parseInt(result[1], 16),
g: parseInt(result[2], 16),
b: parseInt(result[3], 16)
} : null;
}

var polygon = function (ctx, x, y, radius, sides, rotateAngle) {
if (sides >= 3){
  var a = (Math.PI * 2)/sides;
  ctx.beginPath();
  ctx.translate(x,y);
  //ctx.rotate(rotateAngle);
  ctx.moveTo(radius,0);
  for (var i = 1; i < sides; i++) {
  	ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
	}
	
} else {
	ctx.beginPath();
	ctx.arc( x, y, radius, 0, TWO_PI );
}
ctx.closePath();
ctx.translate(0,0);
};

////// particles   /////
function Particle(x,y,radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.vx = random(-6,6);
	this.vy = random(-6,6);
	this.ax = 0;
	this.ay = 0.01;
	this.color = random( COLOURS );
	this.r = hexToRGB(this.color).r;
	this.g = hexToRGB( this.color ).g;
	this.b = hexToRGB( this.color ).b;
	this.trace = [];
	this.maxTrace = 20;
	this.live = true;
	this.drag = random(0.9,0.96);
	this.wander = random(0.5,2);
	this.theta = random( TWO_PI );
	for(var i = 0; i < this.maxTrace; i++){
		this.trace.push({'x':x,'y':y});
	}
	//this.sides = Math.floor((Math.random() * 5) + 2);
}

Particle.prototype = {
	move: function() { 
		this.vx += this.ax;
		this.vy += this.ay;	
		this.vx *= this.drag;
this.vy *= this.drag;
this.theta += random( -0.5, 0.5 ) * this.wander;
this.vx += sin( this.theta ) * 0.1;
this.vy += cos( this.theta ) * 0.1;			
		this.x += this.vx;
		this.y += this.vy;
		this.ax = 0;
		this.ay = 0;

	},
	draw: function( ctx ) {
		
		ctx.beginPath();
ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
ctx.fillStyle = this.color;
ctx.fill();

  },


	borders: function(w, h) {
		if(this.x >= w){
			this.vx *= -1;
		}
		if(this.x <= 0){
			this.vx *= -1;
		}
		if(this.y >= h - 20){
			this.vy *= -1;
		}
		if(this.y <= 0){
			this.vy *= -1;
		}

	},
	addForcesAc: function(ax,ay) {
		// add forces by adding the aceleration
		this.ax += ax;
		this.ay += ay;
	},
	addForcesXY: function(x,y) {
		// add forces by adding the location of the atracctor o repeller
		var dx = x - this.x;
		var dy = y - this.y;
		var C = 10;
		var m = dx*dx + dy*dy + 1;
		this.ax += C*dx/m;
		this.ay += C*dy/m;
	},
	update: function(){
		//this.trace.shift();
		//this.trace.push({'x':this.x,'y':this.y});
		this.radius *= 0.99;
		this.live = this.radius > 0.8;

	}


};


/// particle system   /////

function System(ctx, N){
	this.init(ctx,N);
}

System.prototype = {
	
	init: function(ctx, N){
		this.width = ctx.width;
		this.height = ctx.height;
		this.particles = [];
		this.N = N;
		this.ctx = ctx;

		for(var i = 0; i < this.N; i++){
			var particle = new Particle(random(this.width),random(this.height),random(2,10));
    	this.particles.push(particle);

		}
	},
	update: function() {
		for(var i = 0; i < this.particles.length; i++){
			//this.particles[i].addForcesAc(0,0.03); //Gravity
			//this.particles[i].addForcesXY(this.mouse.x, this.mouse.y);
			this.particles[i].borders(this.width,this.height);
			this.particles[i].move();
			this.particles[i].update();

		}

		for (var i = this.particles.length - 1; i >= 0; i--) {
			if(!this.particles[i].live){
				this.particles.splice(i,1);
			}
		}

	},
	draw: function() {

		for(var i = 0; i < this.particles.length; i++){
			this.particles[i].draw(this.ctx);

		}
		/*
		this.ctx.font = "30px Helvetica";
		this.ctx.fillStyle = "#555";
		this.ctx.textAlign = "left";
		this.ctx.fillText("Hey", this.ctx.width/5, this.ctx.height/4+35);
		this.ctx.fillText("Welcome to my web", this.ctx.width/5, this.ctx.height/4+70);
		this.ctx.fillText("where I aim to share", this.ctx.width/5, this.ctx.height/4+105);
		this.ctx.fillText("things that I make", this.ctx.width/5, this.ctx.height/4+140);
		this.ctx.fillText("Enjoy", this.ctx.width/5, this.ctx.height/4+175);
		*/

	},
	atracForce: function(x, y){
		for(var i = 0; i < this.N; i++){
			this.particles[i].addForcesXY(x,y);

		}
	},
	addParticle: function(x,y){
		var p = new Particle(x,y,random(8,16));
		this.particles.push(p);
	}

}

var cloud;




//------ Skecth ------////

Sketch.create({
	
	container: document.getElementById( 'containerSketch' ),

  setup: function() {
    cloud = new System(this, 0);
    //this.autoclear = false;
    this.fullscreen = false;

    
  },
  mousemove: function() {

    cloud.atracForce(this.mouse.x, this.mouse.y);
    cloud.addParticle( this.mouse.x, this.mouse.y );


  },
  draw: function() {
  	//this.globalCompositeOperation  = 'destination-over';
  	//this.globalCompositeOperation  = 'soft-light';
  	//this.fillStyle = 'rgba(255,255,255,0.2)';
    //this.fillRect( 0, 0, this.width, this.height );	  

    if(this.millis % 15 === 0){
    	cloud.addParticle( random(cloud.width), random(cloud.height) );
    }  
    cloud.update();
    cloud.draw();

  }
});