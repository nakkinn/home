let s=80;
let board=new Array(5);
for(let i=0;i<5;i++)    board[i]=new Array(8);
for(let i=0;i<5;i++)    for(let j=0;j<8;j++)    board[i][j]=[];
let enasite=new Array(5);
for(let i=0;i<5;i++)    enasite[i]=new Array(8);
let mode=0,c,r,turn,fturn,c1=-1,c2=-1,r1=-1,r2=-1;
let peer,room;

function setup(){
    createCanvas(windowWidth,windowHeight);

    for(let i=0;i<5;i++)    board[i][6][0]=0;
    
    peer=new Peer({
        key: 'cf1155ef-ab9f-41a3-bd4a-b99c30cc0663',
        debug:1
    });
    peer.on('open',()=>{
        id=peer.id;
        room=peer.joinRoom("nokka",{
            mode:'sfu'
        });
        room.on('open',()=>{
            if(room.members.length==0)  turn=true;
            else{
                turn=false;
                for(let i=0;i<5;i++)    board[i][1][0]=1;

            }
            fturn=turn;
        });
        room.on('peerJoin',peerId=>{
            console.log(peerId+"参加");
            if(turn)    for(let i=0;i<5;i++)    board[i][1][0]=1;
        });
        room.on('peerLeave',peerId=>{
            console.log(peerId+"退出");
        });
        room.on('data',message=>{
            console.log(message.data);
            receive(message.data);
        });
    });
}

function draw(){
    background(255);

    noStroke(),fill(200);
    rect(s,s,5*s,6*s);
    stroke(0);
    for(let i=0;i<6;i++)    line(s+i*s,s,s+i*s,7*s);
    for(let i=0;i<7;i++)    line(s,s+i*s,6*s,s+i*s);

    strokeWeight(8);
    if(!turn)   line(s*0.8,s,s*0.8,s*4);
    if(turn)    line(s*0.8,s*4,s*0.8,s*7);
    strokeWeight(1);

    for(let i=0;i<5;i++)    for(let j=0;j<8;j++){

        if(enasite[i][j]){
            stroke('#ff7700'),noFill(),strokeWeight(2);
            rect(s+i*s,j*s,s,s);
            stroke(0),strokeWeight(1);
        }
        noStroke(),fill(160);
        if((i==c1&&j==r1)||(i==c2&&j==r2)){
            rect(s+i*s+1,j*s+1,s-2,s-2);
        }

        stroke(0);
        rectMode(CENTER);
        for(let k=0;k<board[i][j].length;k++)    if(board[i][j][k]!=undefined){
            if(board[i][j][k]==0)   fill('#7777ff');
            else    fill('#ffffff');
            rect(s+i*s+s/2,j*s+s/2,s*(0.8-0.2*k),s*(0.8-0.2*k),5);
        }
        rectMode(CORNER);
    }
}

function mouseClicked(){

    if(turn){
        let flag=false;
        if(mouseX>=s&&mouseX<s*6&&mouseY>=0&&mouseY<s*7){
            for(let i=0;i<5;i++)    for(let j=0;j<8;j++){
                if(mouseX>=(i+1)*s&&mouseX<(i+2)*s&&mouseY>=j*s&&mouseY<(j+1)*s){
                    if(enasite[i][j]){
                        board[i][j][board[i][j].length]=0;
                        board[c][r].length--;
                        turn=false;
                        room.send(c+','+r+','+i+','+j);
                        c1=c,r1=r,c2=i,r2=j;
                        flag=true;
                    }else{
                        let len=board[i][j].length;
                        if(len>0){
                            if(board[i][j][len-1]==0){
                                c=i,r=j;
                                enable(i,j);
                            }else   flag=true;
                        }else   flag=true; 
                    }   
                }
            }
        }else   flag=true;
        if(flag)    for(let i=0;i<5;i++)    for(let j=0;j<8;j++)    enasite[i][j]=false;
    }
}

function keyPressed(){
    if(key=='r'){
        room.send("reset");
        reset();
    }
}

function enable(c,r){
    let dir=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
    for(let i=0;i<5;i++)    for(let j=0;j<8;j++)    enasite[i][j]=false;
    for(let i=0;i<8;i++){
        if(ins(c+dir[i][0],r+dir[i][1])){
            if(board[c+dir[i][0]][r+dir[i][1]].length<3)    enasite[c+dir[i][0]][r+dir[i][1]]=true;
        }
    }
}

function ins(c,r){
    if(c>=0&&c<5&&r>=0&&r<7)    return true;
    else    return false;
}

function receive(s){
    if(s=="reset"){
        reset();
    }else   if(s=="close"){
        room.close();
    }else{
        s=s.split(',');
        for(let i=0;i<4;i++)    s[i]=int(s[i]);
        s[0]=4-s[0];
        s[1]=7-s[1];
        s[2]=4-s[2];
        s[3]=7-s[3];
        c1=s[0],r1=s[1],c2=s[2],r2=s[3];
        board[s[0]][s[1]].length--;
        board[s[2]][s[3]].push(1);
        turn=true;
    }
}

function reset(){
    for(let i=0;i<5;i++)    for(let j=0;j<8;j++)    board[i][j].length=0;
    for(let i=0;i<5;i++){
        board[i][1][0]=1;
        board[i][6][0]=0;
    }
    turn=!fturn;
    fturn=turn;
    c1=c2=r1=r2=-1;
}
