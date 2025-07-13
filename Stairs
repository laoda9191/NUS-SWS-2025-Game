import { 
    set_dimensions, create_rectangle, update_position, query_position, 
    input_key_down, update_loop, build_game, update_scale, update_text,
    gameobjects_overlap, create_text
} from "arcade_2d";

// 设置游戏窗口尺寸
set_dimensions([600, 600]);

// 物理参数
const GRAVITY = 2;
const JUMP_FORCE = -25;
const GROUND_LEVEL = 500;

// 初始玩家尺寸
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 40;

// 玩家移动速度
const MOVEMENT_SPEED = 5;

// 创建玩家矩形，初始位置 [50, GROUND_LEVEL - PLAYER_HEIGHT]
const player = update_position(
    create_rectangle(PLAYER_WIDTH, PLAYER_HEIGHT), 
    [50,0]
);

// 创建地面
const ground = update_position(
    create_rectangle(600, 20), 
    [300, GROUND_LEVEL + 20]
);

// 创建阶梯
const steps = [];
const STEP_WIDTH = 100;
const STEP_HEIGHT = 20;
const STEP_COUNT = 3;
const STEP_SPACING = 150;
const STEP_START_X = 200;
const STEP_START_Y = GROUND_LEVEL - STEP_HEIGHT;

for (let i = 0; i < STEP_COUNT; i = i + 1) {
    const stepX = STEP_START_X + i * STEP_SPACING;
    const stepY = STEP_START_Y - i * 80;
    
    steps[i] = update_position(
        create_rectangle(STEP_WIDTH, STEP_HEIGHT), 
        [stepX, stepY]
    );
}

// 碰撞文本
const collision_happened = update_scale(
    update_position(create_text(""), [300, 300]), 
    [2.5, 2.5]
);

const score_board = update_scale(update_position(create_text("Score: "), [500, 20]), [1.5, 1.5]);

// 玩家状态
let velocityY = 0;
let isOnGround = true;
let isCrouching = false;
let alive = true;
let times = 0;

// 主游戏循环
update_loop(game_state => {
    update_text(score_board, "Score: " + stringify(times));
    
    const playerPos = query_position(player);

    if (!alive) {
        return undefined;
    }
    
    // 1. 下蹲控制
    if (input_key_down("s") && isOnGround) {
        if (!isCrouching) {
            update_scale(player, [1, 0.5]);
            playerPos[1] = playerPos[1] + PLAYER_HEIGHT/2;
            isCrouching = true;
        }
    } else if (isCrouching) {
        update_scale(player, [1, 1]);
        playerPos[1] = playerPos[1] - PLAYER_HEIGHT/2;
        isCrouching = false;
    }

    // 2. 左右移动控制
    if (input_key_down("a")) {
        playerPos[0] = playerPos[0] - MOVEMENT_SPEED;
    }
    
    if (input_key_down("d")) {
        playerPos[0] = playerPos[0] + MOVEMENT_SPEED;
    }
    
    // 限制玩家在屏幕内
    if (playerPos[0] - PLAYER_WIDTH/2 < 0) {
        playerPos[0] = PLAYER_WIDTH/2;
    }
    
    if (playerPos[0] > 600 - PLAYER_WIDTH/2) {
        playerPos[0] = 600 - PLAYER_WIDTH/2;
    }

    // 3. 跳跃控制
    if (input_key_down("w") && isOnGround && !isCrouching) {
        velocityY = JUMP_FORCE;
        isOnGround = false;
    }

    // 4. 物理模拟
    velocityY = velocityY + GRAVITY;
    playerPos[1] = playerPos[1] + velocityY;

    // 5. 碰撞检测 - 地面和阶梯
    let wasOnGround = isOnGround;
    isOnGround = false;
    
    // 当前玩家高度
    const currentPlayerHeight = isCrouching ? PLAYER_HEIGHT/2 : PLAYER_HEIGHT;
    
    // 检测地面碰撞
    if (playerPos[1] + currentPlayerHeight/2 > GROUND_LEVEL) {
        playerPos[1] = GROUND_LEVEL-currentPlayerHeight/4;
        velocityY = 0;
        isOnGround = true;
    }
    
    // 检测阶梯碰撞
    for (let i = 0; i < STEP_COUNT; i = i + 1) {
        const stepPos = query_position(steps[i]);
        const stepTop = stepPos[1] - STEP_HEIGHT/2;
        const stepLeft = stepPos[0] - STEP_WIDTH/2;
        const stepRight = stepPos[0] + STEP_WIDTH/2;
        
        // 检查玩家是否在阶梯上方且下落aaa
        if (velocityY > 0 
            && playerPos[1] + currentPlayerHeight/2 <= stepTop + 5 
            && playerPos[1] + currentPlayerHeight/2 + velocityY >= stepTop 
            && playerPos[0] + PLAYER_WIDTH/2 > stepLeft 
            && playerPos[0] - PLAYER_WIDTH/2 < stepRight) {
            
            playerPos[1] = stepTop - currentPlayerHeight/2;
            velocityY = 0;
            isOnGround = true;
            break;
        }
    }
    
    // 每在地面走一步增加分数
    if (isOnGround && !wasOnGround) {
        times = times + 1;
    }

    update_position(player, playerPos);
    update_text(collision_happened, "");
});

build_game();
