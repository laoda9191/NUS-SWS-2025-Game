import { create_rectangle, query_position, update_position, update_loop, build_game, input_key_down, set_dimensions } from "arcade_2d";

set_dimensions([800, 600]);

// 物理参数 / Physics parameters
const GRAVITY = 2;          // 重力加速度 / Gravity acceleration
const JUMP_FORCE = -15;     // 初始跳跃速度 / Initial jump velocity
const GROUND_LEVEL = 550;   // 地面高度（必须先定义）/ Ground level (must be defined first)

// 初始玩家尺寸 / Initial player dimensions
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 40;

// Create GameObjects outside update_loop(...)
const player = update_position(create_rectangle(PLAYER_WIDTH, PLAYER_HEIGHT), [50, GROUND_LEVEL]);
const movement_dist = 10;

let velocityY = 0;
let isOnGround = true;
let alive = true;

function add_vectors(to, from) {
   to[0] = to[0] + from[0];
   to[1] = to[1] + from[1];
}

const ground = update_position(create_rectangle(800, 50), [400, 575]);

update_loop(game_state => {
   const playerPos = query_position(player);

   //if (input_key_down("w")) {
     //  add_vectors(new_position, [0, -1 * movement_dist]);
   //}
   if (input_key_down("a") && playerPos[0] >= 0 + PLAYER_WIDTH) {
       add_vectors(playerPos, [-1 * movement_dist, 0]);
   }
   //if (input_key_down("s")) {
    //   add_vectors(new_position, [0, movement_dist]);
   //}
   if (input_key_down("d") && playerPos[0] <= 600 - PLAYER_WIDTH) {
       add_vectors(playerPos, [movement_dist, 0]);
   }
   
   if (input_key_down("w") && isOnGround) {
        velocityY = JUMP_FORCE;
        isOnGround = false;
    }
    
    // 3. 物理模拟 / Physics simulation
    velocityY = velocityY + GRAVITY;
    playerPos[1] = playerPos[1] + velocityY;

    // 4. 地面检测 / Ground detection
    const playerBottom = playerPos[1] + PLAYER_HEIGHT;
    if (playerBottom > GROUND_LEVEL) {
        playerPos[1] = GROUND_LEVEL - PLAYER_HEIGHT;
        velocityY = 0;
        isOnGround = true;
    }
   // Update GameObjects within update_loop(...)
   update_position(player, playerPos);
});
build_game();
