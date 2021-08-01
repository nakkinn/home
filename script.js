let title;
let url=[];
let m=0;
let leaf=new Array(5000);
for(let i=0;i<leaf.length;i++){
    leaf[i]=new Array(10);
}
let img;
let 

function setup(){
    createCanvas(windowWidth,windowHeight);

    title=createP('なっきんの作品置き場')
    title.position(20,-10);
    title.style('font-size','50px');

    url[0]=createA('https://nakkinn.github.io/othelo/','オセロ');
    url[0].position(30,150);
    url[0].style('font-size','25px');
    url[1]=createA('https://nakkinn.github.io/sketch1/','スケッチ１');
    url[1].position(30,190);
    url[1].style('font-size','25px');
    url[2]=createA('https://nakkinn.github.io/maze/','迷路');
    url[2].position(30,230);
    url[2].style('font-size','25px');

    fractal(width/2,height,0,windowHeight/6,0);
    img=get(0,0,width,height);
    
}

function draw(){
    background(240);
    image(img,0,0);
    for(let i=0;i<m;i++){
        noStroke();
        fill(leaf[i][3],leaf[i][4],leaf[i][5],150);
        circle(leaf[i][0],leaf[i][1],leaf[i][2]); 
        
        if(frameCount>1000&&random(1)<.00001)  leaf[i][6]=1;
        if(leaf[i][6]==1){
          leaf[i][0]+=10*(.5-noise(frameCount*.002,leaf[i][1]*.01));
          leaf[i][1]+=2;
        }
      }
}

function fractal(x,y,a,r,n){
  let p=x+r*cos(PI/2+a),q=y-r*sin(PI/2+a);
  stroke(0);
  strokeWeight(map(r,0,200,0,20));
  line(x,y,p,q);
  if(r<50){
    for(let i=0;i<8;i++){
      leaf[m][0]=x+random(p-x);
      leaf[m][1]=y+random(q-y);
      leaf[m][2]=random(50);
      leaf[m][3]=random(155,255);
      leaf[m][4]=random(100,200);
      leaf[m][5]=random(50,100);
      leaf[m][6]=0;
      m++;  
    }
  }
  if(n<8){
    if(random(1)>.1)  fractal(p,q,a+random(PI/10,PI/5),r*random(.7,1),n+1);
    if(random(1)>.1)  fractal(p,q,a-random(PI/10,PI/5),r*random(.7,1),n+1);
  }
}
/*
void keyPressed(){
  if(keyCode==ENTER){
    m=0;
    background(255);
    fractal(width/2,height,0,200,0);
    img=get(0,0,width,height);
  }
}

void mouseClicked(){
  for(int i=0;i<m;i++){
    if(random(1)<.002)  leaf[i][6]=1;
  }
}*/
