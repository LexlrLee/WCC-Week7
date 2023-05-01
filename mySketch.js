
// reduce these for less lag
var maxPass = 3;// max number of bubbles that can be placed each frame
var maxBubbles = 2000;// max number of bubbles that can be on the screen
var maxSize = 80;//max size the bubbles grow too

var bubbles = [];
var bubbleImg,bubblePop;
function preload(){
	bubbleImg = loadImage("bubble.png");
	soundFormats('mp3', 'ogg');
  bubblePop = loadSound('preview.mp3');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	imageMode(CENTER);
}

function bubbleMain(x,y,s){
	
	//displayed x&y pos
	this.x = x;
	this.y = y;
	
	//true x&y pos
	this.tx = x;
	this.ty = y;
	
	this.d = false;//is the bubble done growing
	this.popped = false;//has the bubble been popped
	
	this.s = s;//size
	
	//displays bubble
	this.display = function(){
		image(bubbleImg,this.x,this.y,this.s*2,this.s*2);
	};
	
	//handle bubble movement
	this.move = function(){
		
		let d = dist(this.x,this.y,mouseX,mouseY);
		//pop the bubble if close to mouse
		if(d < 75){
			this.popped=true;
		}
		//move bubble back to true pos
		else if(d < 100){
			this.x -= (mouseX - this.x) * 0.12;
			this.y -= (mouseY - this.y) * 0.12;
		}
		//move bubble away from mouse
		else if(d > 150){
			this.x += (this.tx - this.x) * 0.1;
			this.y += (this.ty - this.y) * 0.1;
		}
	}
	
	
	this.grow = function(){
		//increase bubble size
		if(!this.d){
			this.s += 3;
		}
		
		//stop bubble growth
		if(this.s > maxSize){
			this.d = true;
		}
	}
	
	//test to see if bubble is within screen
  this.edges = function(s) {
    return (
      this.x + this.s >= width ||
      this.x - this.s <= 0 ||
      this.y + this.s >= height ||
      this.y - this.s <= 0
    );
  };
}

//add a new bubble
function bubbleAdd(){
	var x = random(width);
	var y = random(height);
	var possible = true;
	
	//test if bubble was placed within another
	for(var i = 0;i < bubbles.length;i++){
		var c = bubbles[i];
		var d = dist(x,y,c.x,c.y); 
		if(d < c.s){
			possible = false;
			break;
		}
	}
	
	if(possible){
		return new bubbleMain(x,y,5);//add new bubble
	}else{
		return null;
	}
}


function draw() {
	frameRate(60);
	background(30,50,100);
	
	//trys to place new bubbles each frame
	for(var e = 0; e < maxPass && bubbles.length < maxBubbles; e++){
		
		for(var f = 0; f < 100;f++){ 
			var nc = bubbleAdd();
			if(nc!==null){
				bubbles.push(nc);
				break;
			}
		}
	}
	
	
	for (var i = 0; i < bubbles.length; i++) {
		var c=bubbles[i];
		c.display();
		c.move();
		
		//removes bubble if popped
		if(c.popped){
			if(c.s>30){
				bubblePop.play();//play pop sound 
			}
			
			//remove bubbles
			bubbles.splice(i,1);
			i--;
			
		}
		//see if bubble is done or is outside of bounds
		else if(!c.d && !c.edges()){
	
			for (var j = 0; j < bubbles.length; j++) {
				
				if(i !== j){
					var c2 = bubbles[j];
					var d = dist(c.x,c.y,c2.x,c2.y);
					
					//see if bubble has room to grow
					if(d <= c.s + c2.s){
						c.d=true;
						
						break;
					}
				}	
			}
			c.grow();
		}
	}	
}