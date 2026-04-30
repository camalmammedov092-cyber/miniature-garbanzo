const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let gameStarted=false;
let gameOver=false;

let player={x:50,y:50};
let enemy={x:500,y:500};

let door={x:550,y:550};

let cards=[];
let collected=0;
let round=1;

const bgSound=document.getElementById("bgSound");
const scareSound=document.getElementById("scareSound");
const screamer=document.getElementById("screamer");

function spawnCards(){
    cards=[];
    for(let i=0;i<5;i++){
        cards.push({
            x:Math.random()*550,
            y:Math.random()*550
        });
    }
}

spawnCards();

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){
        document.getElementById("menu").style.display="none";
        canvas.style.display="block";
        gameStarted=true;
        bgSound.play();
    }

    if(e.key==="p" && gameOver){
        location.reload();
    }

    if(!gameStarted || gameOver) return;

    if(e.key==="w") player.y-=10;
    if(e.key==="s") player.y+=10;
    if(e.key==="a") player.x-=10;
    if(e.key==="d") player.x+=10;
});

function update(){

    if(!gameStarted || gameOver) return;

    // enemy AI
    enemy.x += (player.x - enemy.x)*0.01;
    enemy.y += (player.y - enemy.y)*0.01;

    // kart yığmaq
    cards = cards.filter(c=>{
        let d=Math.hypot(player.x-c.x,player.y-c.y);
        if(d<20){
            collected++;
            return false;
        }
        return true;
    });

    // düşmən tutsa
    let dEnemy=Math.hypot(player.x-enemy.x,player.y-enemy.y);
    if(dEnemy<20){
        gameOver=true;
        canvas.style.display="none";

        screamer.style.display="block";
        scareSound.play();
    }

    // qapı (win)
    if(collected>=5){
        let dDoor=Math.hypot(player.x-door.x,player.y-door.y);
        if(dDoor<30){
            round++;
            collected=0;
            spawnCards();

            if(round>5){
                alert("🎉 Qazandın!");
                location.reload();
            }
        }
    }
}

function draw(){

    ctx.clearRect(0,0,600,600);

    // player
    ctx.fillStyle="lime";
    ctx.fillRect(player.x,player.y,20,20);

    // enemy
    ctx.fillStyle="red";
    ctx.fillRect(enemy.x,enemy.y,20,20);

    // kartlar
    ctx.fillStyle="yellow";
    cards.forEach(c=>{
        ctx.fillRect(c.x,c.y,10,10);
    });

    // qapı
    ctx.fillStyle="blue";
    ctx.fillRect(door.x,door.y,20,30);

    // 🌑 qaranlıq + 🔦 fənər effekti
    ctx.fillStyle="rgba(0,0,0,0.9)";
    ctx.fillRect(0,0,600,600);

    ctx.globalCompositeOperation="destination-out";
    ctx.beginPath();
    ctx.arc(player.x+10,player.y+10,80,0,Math.PI*2);
    ctx.fill();
    ctx.globalCompositeOperation="source-over";

    // info
    ctx.fillStyle="white";
    ctx.fillText("Kart: "+collected+"/5",10,20);
    ctx.fillText("Raund: "+round,10,40);
}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
