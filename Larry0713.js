import { set_dimensions, create_rectangle, create_sprite, create_text, query_position, query_scale, update_color, update_position, update_scale, update_text, update_to_top, set_fps, get_loop_count, enable_debug, debug_log, input_key_down, gameobjects_overlap, update_loop, build_game, create_audio, loop_audio, stop_audio, play_audio, get_game_time } from "arcade_2d";
enable_debug();
set_dimensions([600, 600]);
const GRAVITY = 2;
const JUMP_FORCE = -25;
const GROUND_LEVEL = 500;

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 40;

const PLAYER_MOVE_SPEED = 5;
const player = update_position(create_rectangle(PLAYER_WIDTH, PLAYER_HEIGHT), [300,400]);

const game_solids=[];
for(let i=0;i<21;i=i+1){
    game_solids[i]=create_rectangle(100,100);
}

const game_traps=[];
for(let i=0;i<20;i=i+1){
    game_traps[i]=create_rectangle(100,150);
}

const collision_happened = update_scale(
    update_position(create_text(""), [300, 300]), 
    [2.5, 2.5]
);

let objos_list_size = 0;
const objos_list = [];
let on_object = false;
let tryjump = false;
let velocityY = 0;
let isCrouching = false;
let alive = true;
let trapSequence = 0;
let gameTime = 0;

for(let i=0;i<5;i=i+1){
    update_position(game_solids[i],[50+100*i,50]);
    objos_list[objos_list_size]=i;
    objos_list_size=objos_list_size+1;
}

for(let i=5;i<10;i=i+1){
    update_position(game_solids[i],[50+100*(i-5),550]);
    objos_list[objos_list_size]=i;
    objos_list_size=objos_list_size+1;
}

for(let i=10;i<15;i=i+1){
    update_position(game_solids[i],[50,50+100*(i-10)]);
    objos_list[objos_list_size]=i;
    objos_list_size=objos_list_size+1;
}

for(let i=15;i<20;i=i+1){
    update_position(game_solids[i],[550,50+100*(i-15)]);
    objos_list[objos_list_size]=i;
    objos_list_size=objos_list_size+1;
}

update_position(game_solids[20],[300,300]);
objos_list[objos_list_size]=20;
objos_list_size=objos_list_size+1;

const spikes = create_rectangle(40, 10);
const door = update_position(create_rectangle(10, 40), [120, 480]);

update_loop(game_state => {
    
    if (!alive)
    {
        return undefined;
    }
    
    //Player jump
   const playerPos = query_position(player);
    if (input_key_down("a")) {
        playerPos[0] = playerPos[0] - PLAYER_MOVE_SPEED;
    }
    if (input_key_down("d")) {
        playerPos[0] = playerPos[0] + PLAYER_MOVE_SPEED;
    }
    if(!on_object){
        velocityY = velocityY + GRAVITY;
        playerPos[1] = playerPos[1] + velocityY;
    }
    if (input_key_down("w") && on_object && !isCrouching) {
        tryjump = true;
        velocityY = JUMP_FORCE;
        on_object = false;
    }
   if (input_key_down("s") && on_object) {
        if (!isCrouching) {
            update_scale(player, [1, 0.5]);
            playerPos[1] = playerPos[1] + PLAYER_HEIGHT/2;
            isCrouching = true;
        }
    } 
    else if (isCrouching) {
        update_scale(player, [1, 1]);
        playerPos[1] = playerPos[1] - PLAYER_HEIGHT/2;
        isCrouching = false;
    }
    debug_log("jump check");
    debug_log("on_object check: "+stringify(on_object));
    const currentPlayerHeight = isCrouching ? PLAYER_HEIGHT/2 : PLAYER_HEIGHT;
   // Update GameObjects within update_loop(...)
   let on_object_check=0;
    for (let i = 0; i < objos_list_size; i = i + 1) {
        const ob = game_solids[objos_list[i]];
        const ob_pos=query_position(ob);
        if (!tryjump && (playerPos[1] + currentPlayerHeight/2 >= ob_pos[1]-50) && (playerPos[1] + currentPlayerHeight/2 - ob_pos[1] + 50<= 25) && (playerPos[0] + PLAYER_WIDTH/2 > ob_pos[0]-50) && (playerPos[0] - PLAYER_WIDTH/2 < ob_pos[0]+50)) {
            playerPos[1] = ob_pos[1] - 50 - currentPlayerHeight/2;
            velocityY = 0;
            on_object = true;
        }
        else if((playerPos[1] - currentPlayerHeight/2 <= ob_pos[1]+50) && (playerPos[1] - currentPlayerHeight/2 - ob_pos[1] - 50>= -25) && (playerPos[0] + PLAYER_WIDTH/2 > ob_pos[0]-50) && (playerPos[0] - PLAYER_WIDTH/2 < ob_pos[0]+50)){
            playerPos[1] = ob_pos[1] + 50 + currentPlayerHeight/2;
            velocityY = 0;
            on_object=false;
        }
        if((playerPos[0] + PLAYER_WIDTH/2 >= ob_pos[0]-50) && (playerPos[0] + PLAYER_WIDTH/2 - ob_pos[0] + 50 <= 25) && (playerPos[1] + currentPlayerHeight/2 > ob_pos[1] - 50) && (playerPos[1] - currentPlayerHeight/2 < ob_pos[1] +50)){
            playerPos[0] = ob_pos[0] - 50 - PLAYER_WIDTH/2;
        }
        else if((playerPos[0] - PLAYER_WIDTH/2 <= ob_pos[0]+50) && (playerPos[0] - PLAYER_WIDTH/2 - ob_pos[0] - 50>= -25) && (playerPos[1] + currentPlayerHeight/2 > ob_pos[1] - 50) && (playerPos[1] - currentPlayerHeight/2 < ob_pos[1] +50)){
            playerPos[0] = ob_pos[0] + 50 + PLAYER_WIDTH/2;
        }
    }
    
    if (playerPos[0] === 380 && trapSequence === 0)
    {
        update_position(spikes, [420, 495]);
        trapSequence = trapSequence + 1;
        gameTime = get_game_time();
    }
    
    if (get_game_time() - gameTime >= 3000 && trapSequence === 1)
    {
        const SPIKES_MOVE_SPEED = 8;
        const spikesPos = query_position(spikes);
        update_position(spikes, [spikesPos[0] - SPIKES_MOVE_SPEED, spikesPos[1]]);
    }
    
    if (tryjump) {
        tryjump=false;
    }
    
    if (gameobjects_overlap(player, spikes)) {
        update_text(collision_happened, "Game Over!");
        alive = false;
    }
    
    if (gameobjects_overlap(player, door))
    {
        update_text(collision_happened, "Next level");
        alive = false;
    }

    update_position(player, playerPos); // Still update after push
   debug_log("player position:"+stringify(query_position(player)));
});
build_game();
