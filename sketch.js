var PLAY=1;
var END=0;
var gameState=PLAY;
var bg,bgImage;
var player,player_running,player_collided;
var ground,invisibleGround,groundImage;
var cloudsGroup,cloudImage;
var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score;
var gameOverImg,restartImg;
var jumpSound,checkPointSound,dieSound;

function preload(){
    player_running=loadAnimation("r1.png","r2.png","r3.png","r4.png","r5.png","r6.png");
    player_collided=loadAnimation("rd.png");
    bgImage=loadImage("download.png");
    groundImage=loadImage("ground2.png");
    cloudImage=loadImage("cloud.png");

    obstacle1=loadImage("h1.png");
    obstacle2=loadImage("h2.png");
    obstacle3=loadImage("h3.png");
    obstacle4=loadImage("h4.png");
    //obstacle5=loadImage("h5.png");
    //obstacle6=loadImage("h6.png");

    restartImg=loadImage("res.png");
    gameOverImg=loadImage("go.png");

    jumpSound=loadSound("jump.mp3");
    dieSound=loadSound("die.mp3");
    checkPointSound=loadSound("checkPoint.mp3");
}

function setup(){
    createCanvas(600,400);

    bg=createSprite(300,200,600,400);
    player=createSprite(50,350,20,50);
    player.addAnimation("running",player_running);
    player.addAnimation("collided",player_collided);
    bg.addImage(bgImage);
    bg.scale=2.0;

    player.scale=0.2;
    ground=createSprite(300,380,600,20);
    ground.addImage(groundImage);
    ground.x=ground.width/2;
    //obstacles=createSprite(400,170,10,40);
    //obstacles.addImage(obstacle1);
    //obstacles.scale=0.1;

    gameOver=createSprite(300,200);
    gameOver.addImage(gameOverImg);

    restart=createSprite(300,300);
    restart.addImage(restartImg);

    gameOver.scale=0.4;
    restart.scale=0.08;

    invisibleGround=createSprite(200,390,400,10);
    invisibleGround.visible=false;

    obstacleGroup=createGroup();
    cloudsGroup=createGroup();

    player.setCollider("rectangle",0,0,100,300);

    score=0;
}

function draw(){
    background("white");

    if(gameState===PLAY){
        gameOver.visible=false;
        restart.visible=false;

        ground.velocityX=-(4+3*score/100)
        score=score+Math.round(frameRate()/30);

        if(score>0 && score%100===0){
           // checkPointSound.play();
        }

        if(ground.x<0){
            ground.x=ground.width/2;
        }
        player.depth=player.depth+1;

        if(keyDown("space") && player.y>130){
            player.velocityY=-9;
            jumpSound.play();
        }
        player.velocityY=player.velocityY+0.8;
    
    spawnObstacles();
    spawnClouds();

    if(obstacleGroup.isTouching(player)){
        gameState=END;
        dieSound.play();

    }
}

    else if(gameState===END){
        gameOver.visible=true;
        restart.visible=true;
        player.changeAnimation("collided",player_collided);

        player.x=velocityX=0;
        player.velocityY=0;

        ground.velocityX=0;
        player.velocityY=0;

        obstacleGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        obstacleGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
    }

        player.collide(ground);

        if(mousePressedOver(restart) && gameState===END){
            gameState=PLAY;
            obstacleGroup.setLifetimeEach(0);
            cloudsGroup.setLifetimeEach(0);
            score=0;
            player.x=50;
            player.y=160;
            player.changeAnimation("running",player_running);
        }

    drawSprites();
    fill("red");
    text("Score: "+score,500,10);
    text("Athletic Runner Game",100,10);
}

function spawnObstacles(){
    if(frameCount%50===0){
        var obstacles=createSprite(400,370,10,40);
        obstacles.velocityX=-6;
        var rand=Math.round(random(1,4));
        switch(rand){
            case 1:obstacles.addImage(obstacle1);
            break;
            case 2:obstacles.addImage(obstacle2);
            break;
            case 3:obstacles.addImage(obstacle3);
            break;
            case 4:obstacles.addImage(obstacle4);
            break;
            default:break;        
        }
        obstacles.scale=0.1;
        obstacles.lifetime=300;
        
        obstacleGroup.add(obstacles);
        //obstacle.setCollider("rectangle",0,0,200,400);
    }
}

 function spawnClouds(){
     if(frameCount%60===0){
         var cloud=createSprite(600,120,40,10);
         cloud.y=Math.round(random(80,120));
         cloud.addImage(cloudImage);
         cloud.scale=0.5
         cloud.velocityX=-3;

         cloud.lifetime=200;

         cloud.depth=player.depth;
         player.depth=player.depth+1;

         cloudsGroup.add(cloud);
     }
 }