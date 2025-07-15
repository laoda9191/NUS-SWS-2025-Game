import { set_dimensions, create_rectangle, create_sprite, create_text, query_position, query_scale, update_color, update_position, update_scale, update_text, update_to_top, set_fps, get_loop_count, enable_debug, debug_log, input_key_down, gameobjects_overlap, update_loop, build_game, create_audio, loop_audio, stop_audio, play_audio, get_game_time, create_circle } from "arcade_2d";

// Array of players' animation
const player_frames = [
  create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Static_Player.png"),
  create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player1.png"),
  create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player2.png"),
  create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player3.png")
];

// frame index
let player_frame_index = 0;

let player_pos = [300, 400];

let facing_left = false;

// Hide player sprites in current frame
function hide_all_frames(frames) {
  for (let i = 0; i < array_length(frames); i = i + 1) {
    update_position(frames[i], [9999, 9999]);
  }
}

// update the sprite of player by hide other sprites
function update_sprite(frames, index, pos) {
  hide_all_frames(frames);                           
  update_position(frames[index], pos);    
  return frames[index];             
}


function set_sprite_direction(frames, face_left) {
  const scale = face_left ? [-1, 1] : [1, 1];
  for (let i = 0; i < array_length(frames); i = i + 1) {
    update_scale(frames[i], scale);
  }
}

let frame_counter = 0;
const FRAME_DELAY = 3;

update_loop(game_state => {
  const left  = input_key_down("a");
  const right = input_key_down("d");
  
  const moving = left || right;
  const vx = right ? 4 : left ? -4 : 0;
  
  player_pos[0] = player_pos[0] + vx;

  if (left && !facing_left) {
    facing_left = true;
    set_sprite_direction(player_frames, true);
  } else if (right && facing_left) {
    facing_left = false;
    set_sprite_direction(player_frames, false);
  }

  if (moving) {
    frame_counter = frame_counter + 1;
    if (frame_counter >= FRAME_DELAY) {
      frame_counter = 0;
      player_frame_index = player_frame_index + 1;
      if (player_frame_index > 3) {
        player_frame_index = 1; // idle = 0; running = 1 ~ 3
      }
    }
  } else {
    player_frame_index = 0;
    frame_counter = 0;
  }

  update_sprite(player_frames, player_frame_index, player_pos);
});

build_game();
