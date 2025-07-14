import { set_dimensions, create_rectangle, create_sprite, create_text, query_position, query_scale, update_color, update_position, update_scale, update_text, update_to_top, set_fps, get_loop_count, enable_debug, debug_log, input_key_down, gameobjects_overlap, update_loop, build_game, create_audio, loop_audio, stop_audio, play_audio, get_game_time, create_circle } from "arcade_2d";
//enable_debug();
set_dimensions([600, 600]);
const GRAVITY = 2;
const JUMP_FORCE = -25;

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 40;

const PLAYER_MOVE_SPEED = 5;
const player = update_position(create_rectangle(PLAYER_WIDTH, PLAYER_HEIGHT), [70, 300]);

const game_solids = [];
for(let i = 0;i < 24;i = i + 1){
    game_solids[i] = update_color(create_rectangle(100, 100), [255, 150, 0, 255]);
}

const game_traps=[];
for(let i=0;i<20;i=i+1){
    game_traps[i] = update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Spikes1.png"), [-500, -500]);
}

const gear_traps = [];
for (let i = 0; i < 20; i = i + 1)
{
    gear_traps[i] = update_color(update_position(create_circle(20), [-500, -500]), [255, 0, 0, 255]);
}

const collision_happened = update_scale(update_position(create_text(""), [300, 300]), [2.5, 2.5]);

let objos_list_size = 0;
const objos_list = [];
let on_object = false;
let tryjump = false;
let velocityY = 0;
let isCrouching = false;
let alive = true;
let trapSequence = 0;
let gameTime = 0;

for(let i = 0; i < 6; i = i + 1){
    update_position(game_solids[i], [75 + 100 * i, 225]);
    objos_list[objos_list_size] = i;
    objos_list_size = objos_list_size + 1;
}

for(let i = 6;i < 12;i = i + 1){
    update_position(game_solids[i], [75 + 100 * (i - 6), 375]);
    objos_list[objos_list_size] = i;
    objos_list_size = objos_list_size + 1;
}

for(let i = 12; i < 18; i = i + 1){
    update_position(game_solids[i], [-25, 50 + 100 * (i - 12)]);
    objos_list[objos_list_size]=i;
    objos_list_size=objos_list_size+1;
}

for(let i = 18; i < 24; i = i + 1){
    update_position(game_solids[i], [625, 50 + 100 * (i - 18)]);
    objos_list[objos_list_size] = i;
    objos_list_size = objos_list_size + 1;
}

const door = update_scale(update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Door.jpg"), [550, 300]), [0.9, 0.95]);
const transportDoor = update_position(create_rectangle(25, 25), [-500,-500]);
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
        const ob_pos = query_position(ob);
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
    debug_log("trapSequence: "+stringify(trapSequence));
    //First Spike
    if (playerPos[0] === 100 && input_key_down("d") && trapSequence === 0)
    {
        update_position(gear_traps[0], [0, 325]);
        trapSequence = trapSequence + 1;
        gameTime = get_game_time();
    }
    
    let SPIKES_MOVE_SPEED = 6;
    let spikesPos = query_position(gear_traps[0]);
    debug_log("trap 1 pos: " + stringify(spikesPos));
    if (spikesPos[0] >= 300 && spikesPos[1] >= 340 && trapSequence === 1){
        trapSequence = 2;
    }
    else if(spikesPos[0]>=300 && trapSequence === 1){
        update_position(gear_traps[0], [spikesPos[0], spikesPos[1]+SPIKES_MOVE_SPEED*2]);
    }
    else if (trapSequence === 1)
    {
        update_position(gear_traps[0], [spikesPos[0] + SPIKES_MOVE_SPEED, spikesPos[1]]);
    }
    
    //Second Spike
    if (playerPos[0] >= 350 && input_key_down("d") && trapSequence === 2)
    {
        update_position(gear_traps[1], [420, 350]);
        trapSequence = trapSequence + 1;
        gameTime = get_game_time();
    }

    spikesPos = query_position(gear_traps[1]);
    if (spikesPos[0] <= 115 && spikesPos[1] >= 350 && trapSequence === 4){
        trapSequence = 5;
    }
    else if (spikesPos[0] <= 115 && trapSequence === 4 && get_game_time() - gameTime >= 500){
        update_position(gear_traps[1], [spikesPos[0], spikesPos[1] + SPIKES_MOVE_SPEED]);
        update_position(gear_traps[0], [query_position(gear_traps[0])[0]-SPIKES_MOVE_SPEED*2, 305]);
    }
    else if (spikesPos[0] <= 115 && trapSequence === 3){
        //nothing
    }
    else if (get_game_time() - gameTime >= 1000 && trapSequence === 3)
    {
        update_position(gear_traps[1], [spikesPos[0] - SPIKES_MOVE_SPEED, spikesPos[1]]);
    }
    else if (get_game_time() - gameTime > 100 && trapSequence === 3){
        //nothing
    }
    else if (get_game_time() - gameTime > 0 && trapSequence === 3){
        update_position(gear_traps[1], [spikesPos[0], spikesPos[1] - SPIKES_MOVE_SPEED]);
    }
    
    if (spikesPos[0] <= 150 && trapSequence === 3 && query_position(gear_traps[0])[0]>=300){
        update_position(gear_traps[0], [0, 305]);
    }
    else if (spikesPos[0] <= 150 && trapSequence === 3 && query_position(gear_traps[0])[0] < 20){
        update_position(gear_traps[0], [query_position(gear_traps[0])[0]+SPIKES_MOVE_SPEED, 300]);
    }
    else if (spikesPos[0] <= 150 && trapSequence === 3 && query_position(gear_traps[0])[0] >= 20){
        gameTime = get_game_time();
        trapSequence = 4;
    }
    
    //Above Spikes
    if(playerPos[0] >= 300 && trapSequence === 5){
        for(let i = 2; i < 13; i = i + 1){
            update_position(game_traps[i], [75 + 40 * (i - 2), 260]);
        }
        gameTime = get_game_time();
        trapSequence = 6;
    }
    if(trapSequence === 6){
        for(let i = 2; i < 13; i = i + 1){
            if(get_game_time()-gameTime >= 100 * (i-2) && get_game_time()-gameTime<=100*(i-1)){
                update_position(game_traps[i], [query_position(game_traps[i])[0], query_position(game_traps[i])[1] + SPIKES_MOVE_SPEED]);
            }
        }
    }
    if(trapSequence===6 && get_game_time() - gameTime >= 1300){
        trapSequence = 7;
    }
    //Transport Door
    if(trapSequence===7){
        gameTime = get_game_time();
        trapSequence = 8;
    }
    if(trapSequence === 8 && get_game_time()-gameTime > 100){
        trapSequence = 9;
        if(playerPos[0] < 100){
            update_position(transportDoor, [-500, -500]);
        }
    }
    else if(trapSequence===8){
        for(let i = 2; i < 13;i = i + 1){
            update_position(game_traps[i], [query_position(game_traps[i])[0], query_position(game_traps[i])[1] - SPIKES_MOVE_SPEED]);
        }
        if(query_position(game_traps[10])[1] !== 265){
            update_position(transportDoor, [520, 300]);
        }
    }
    
    //Changing Door positiion
    if(trapSequence === 9 && query_position(door)[0] >= 650){
        update_position(door, [-50,305]);
        trapSequence = 10;
    }    
    else if(trapSequence === 9 && playerPos[0]>500){
        update_position(door,[query_position(door)[0] + SPIKES_MOVE_SPEED, 300]);
    }
    else if(trapSequence === 9 && query_position(door)[0] !== 555){
        update_position(door,[query_position(door)[0]+SPIKES_MOVE_SPEED, 300]);
    }
    if(trapSequence === 10 && query_position(door)[0] <= 100){
        update_position(door,[query_position(door)[0]+SPIKES_MOVE_SPEED, 300]);
    }
    if(trapSequence === 10 && query_position(door)[0] > 100){
        trapSequence = 11;
        for(let i = 1; i < 7; i = i + 1){
            update_position(game_traps[i], [-500, -500]);
        }
    }
    
    //Changing Door, Floor, and Ceiling Position
    if(trapSequence === 11 && query_position(door)[0] > 50 && playerPos[0] < 165 && input_key_down("a")){
        trapSequence = 12;
    }
    if(trapSequence === 12 && query_position(door)[0]>50){
        update_position(door,[query_position(door)[0]-SPIKES_MOVE_SPEED, 300]);
        update_position(game_solids[6],[query_position(game_solids[6])[0]-SPIKES_MOVE_SPEED, 375]);
        update_position(game_solids[0],[75,query_position(game_solids[0])[1]-SPIKES_MOVE_SPEED * 1.35]);
        update_position(game_solids[1],[175,query_position(game_solids[1])[1]-SPIKES_MOVE_SPEED * 1.35]);
    }
    //Getting Ready for next loop
    if (gameobjects_overlap(player, transportDoor))
    {
        playerPos[0] = 70;
        playerPos[1] = 300;
    }
    
    update_position(player, playerPos); // Still update after push
    if (tryjump) {
        tryjump=false;
    }
    
    for(let i=0;i<20;i=i+1){
        if (gameobjects_overlap(player, game_traps[i]) || gameobjects_overlap(player, gear_traps[i])) {
            update_text(collision_happened, "Game Over!");
            alive = false;
        }
    }
    
    if (gameobjects_overlap(player, door))
    {
        update_position(player, [30, 300]);
        update_text(collision_happened, "Next level");
        alive = false;
    }
    
    debug_log("game_solids[0] pos: "+stringify(query_position(game_solids[0])));
    debug_log("game_solids[6] pos: "+stringify(query_position(game_solids[6])));
    debug_log("door position: "+stringify(query_position(door)));
   debug_log("player position:"+stringify(query_position(player)));
});
build_game();