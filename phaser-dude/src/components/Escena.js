import Phaser from "phaser";

class Escena extends Phaser.Scene{ 

    platforms = null;
    player = null;
    cursors = null;
    stars = null;
    score = 0;
    bomb = null;



    preload (){
    this.load.image('sky', 'img/FONDO..png');
    this.load.image('ground', 'img/platform.png');
    this.load.image('star', 'img/star.jpg');
    this.load.image('bomb', 'img/bomb.png');
    this.load.spritesheet('dude', 
        'img/dude.png',
        { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('bird', 
        'img/bird.png',
        { frameWidth: 90, frameHeight: 93 });

}

    create (){
        this.add.image(400,300, 'sky');

        //Se crearan las plataformas y se les asigna un comportamiento estatico
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

    //Se agrega al player
    this.player = this.physics.add.sprite(100, 250, 'dude');
    
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    
    //Se agregan los movimientos del player
     this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1

    });

    //Se agregan las estrellas a la escena
    this.stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    //Se genera un efecto de rebote en grupo
    this.stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });

    //Añadimos colisiones a los bordes de la pantalla
    this.physics.add.collider(this.player, this.platforms);

    //Se añade colision a las estrellas con las plataformas
    this.physics.add.collider(this.stars, this.platforms);

    //Se crea el objeto cursor
    this.cursors = this.input.keyboard.createCursorKeys();

    //Colision entre las estrellas con el player
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    //Agrega el texto de score a la pantalla
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    this.bombs = this.physics.add.group();

    //Se añade colision a las bombas con las plataformas
    this.physics.add.collider(this.bombs, this.platforms);
    //Se añade colision a las bombas con el jugador y le provoca un daño
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

}
update (){

    //Movimiento de las teclas
    if (this.cursors.left.isDown)
{
    this.player.setVelocityX(-160);

    this.player.anims.play('left', true);
}
else if (this.cursors.right.isDown)
{
    this.player.setVelocityX(160);

    this.player.anims.play('right', true);
}
else
{
    this.player.setVelocityX(0);

    this.player.anims.play('turn');
}

if (this.cursors.up.isDown && this.player.body.touching.down)
{
    this.player.setVelocityY(-330);
}
this.physics.add.overlap(this.player, this.stars, this.scollectStar, null, this);
}

//Esto causa que la estrella al chocar con el player se ponga en invisible y se destruya de la pantalla
collectStar(player, star) {
    star.disableBody(true, true);

    //Suma 10 puntos al recoger una estrella
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
    if (this.stars.countActive(true) === 0) {
        this.stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.gameOver = true;
}

}

export default Escena;