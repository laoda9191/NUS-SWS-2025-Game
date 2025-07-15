// 导入arcade_2d游戏引擎
import { set_dimensions,query_scale, create_rectangle, create_text, query_position, update_position, update_scale, update_text, enable_debug, input_key_down, update_loop, build_game ,gameobjects_overlap} from "arcade_2d";

// 启用调试模式
enable_debug();

// 设置游戏窗口尺寸
set_dimensions([1000, 600]);

// 游戏参数
const PLAYER_WIDTH = 15;
const PLAYER_HEIGHT = 25;
const JUMP_FORCE = -25;
const GRAVITY = 0.5;
const PLATFORM_WIDTH = 1000;
const PLATFORM_HEIGHT = 20;
const PLAYER_SPEED = 7;
const trap_speed=7;
// 创建碰撞提示文本
const collision_happened = update_scale(
    update_position(create_text(""), [300, 300]), 
    [2.5, 2.5]
);

// 创建游戏对象
const player = update_position(create_rectangle(PLAYER_WIDTH, PLAYER_HEIGHT), [300, 250]);
const platform = update_position(create_rectangle(PLATFORM_WIDTH, PLATFORM_HEIGHT), [500, 300]);
const obstacle = update_position(create_rectangle(30, 290), [860, 150]);
const door = update_position(create_rectangle(25, 33), [975, 270]);
const trap1=update_position(create_rectangle(20,20),[10,280]);
const trap2=update_position(create_rectangle(20,20),[535,320]);
const button1=update_position(create_rectangle(10,15),[160,320]);//xia
const button2=update_position(create_rectangle(10,15),[350,300]);//shang
const button3=update_position(create_rectangle(10,15),[800,300]);//xia
const button4=update_position(create_rectangle(10,15),[350,300]);//xia
const button5=update_position(create_rectangle(10,15),[600,300]);//shang
const block2=update_position(create_rectangle(120,30),[938,100]);
const block1=update_position(create_rectangle(120,30),[938,130]);
const block3=update_position(create_rectangle(120,30),[938,70]);
const block4=update_position(create_rectangle(120,30),[938,10]);
const block5=update_position(create_rectangle(120,30),[938,40]);
const traps1=update_position(create_rectangle(50,10),[317,300]);
const traps21=update_position(create_rectangle(50,10),[633,300]);
const traps22=update_position(create_rectangle(50,10),[567,300]);
// 游戏状态
let isUpsideDown = false;
let velocityY = 0;
let canJump = true;
let trap1Touch=0;
let trap2Touch=0;
let button1Activated=false; 
let button2Activated=false;
let button3Activated=false;
let button4Activated=false;
let button5Activated=false;
// function checkCollision(rect1, rect2) {
//     const pos1 = query_position(rect1);
//     const pos2 = query_position(rect2);
//     const size1 = query_scale(rect1); // Add this near your imports if not already there
//     const size2 = query_scale(rect2);
    
//     return (
//         pos1[0] - size1[0]/2 < pos2[0] + size2[0]/2 &&
//         pos1[0] + size1[0]/2 > pos2[0] - size2[0]/2 &&
//         pos1[1] - size1[1]/2 < pos2[1] + size2[1]/2 &&
//         pos1[1] + size1[1]/2 > pos2[1] - size2[1]/2
//     );
// }
let gameOver = false;
let gameWon = false;
// 游戏主循环
update_loop(game_state => {
    const playerPos = query_position(player);
    const platformPos = query_position(platform);
    const obstaclePos = query_position(obstacle);
    const doorPos = query_position(door);
    const trap1Pos = query_position(trap1);
    const trap2Pos = query_position(trap2);
    const traps1Pos = query_position(traps1);
    const traps21Pos = query_position(traps21);
    const traps22Pos = query_position(traps22);
// 先检查胜利条件
if (gameobjects_overlap(player, door)) {
    gameWon = true;
    update_text(collision_happened, "YOU WIN!!!");
    update_position(collision_happened, [500, 300]);
    return 0;
}

// 再检查死亡条件
if (gameobjects_overlap(player, trap1) || 
    gameobjects_overlap(player, trap2) ||
    gameobjects_overlap(player, traps1) ||
    gameobjects_overlap(player, traps21) ||
    gameobjects_overlap(player, traps22)) {
    gameOver = true;
    update_text(collision_happened, "YOU DIE!!!");
    update_position(collision_happened, [500, 300]);
    return 0;
}
    if (!button1Activated) {
        const button1Pos = query_position(button1);
        const isPlayerOnButton1 = (
            playerPos[0] > button1Pos[0] - 15 &&  
            playerPos[0] < button1Pos[0] + 15 && 
            playerPos[1] > button1Pos[1] - 20 &&  
            playerPos[1] < button1Pos[1] + 20     
        );
        if (isPlayerOnButton1) {
            button1Activated = true;  
            update_position(button1, [160, 300]);  
            update_position(button2, [350, 280]);
            update_position(block1, [1500, 100]); 
        }
    }
    if (!button2Activated) {
        const button2Pos = query_position(button2);
        const isPlayerOnButton2 = (
            playerPos[0] > button2Pos[0] - 15 &&  
            playerPos[0] < button2Pos[0] + 15 && 
            playerPos[1] > button2Pos[1] - 20 &&  
            playerPos[1] < button2Pos[1] + 20     
        );
        if (isPlayerOnButton2) {
            button2Activated = true;  
            update_position(button3, [800, 320]);  
            update_position(button2, [350, 300]);
            update_position(block2, [1500, 100]); 
        }
    }
    if (!button3Activated) {
        const button3Pos = query_position(button3);
        const isPlayerOnButton3 = (
            playerPos[0] > button3Pos[0] - 15 &&  
            playerPos[0] < button3Pos[0] + 15 && 
            playerPos[1] > button3Pos[1] - 20 &&  
            playerPos[1] < button3Pos[1] + 20     
        );
        if (isPlayerOnButton3) {
            button3Activated = true;  
            update_position(button3, [800, 300]); 
            update_position(button4, [350,280]);
            update_position(traps1,[387,280]);
            update_position(block3, [1500, 100]); 
        }
    }
    if (!button4Activated) {
        const button4Pos = query_position(button4);
        const isPlayerOnButton4 = (
            playerPos[0] > button4Pos[0] - 15 &&  
            playerPos[0] < button4Pos[0] + 15 && 
            playerPos[1] > button4Pos[1] - 20 &&  
            playerPos[1] < button4Pos[1] + 20     
        );
        if (isPlayerOnButton4) {
            button4Activated = true;  
            update_position(button5, [600, 320]); 
            update_position(button4, [350,300]);
            update_position(block4, [1500, 100]); 
            update_position(traps21, [633,320]);
            update_position(traps22, [567,320]); 
        }
    }
    if (!button5Activated) {
        const button5Pos = query_position(button5);
        const isPlayerOnButton5 = (
            playerPos[0] > button5Pos[0] - 15 &&  
            playerPos[0] < button5Pos[0] + 15 && 
            playerPos[1] > button5Pos[1] - 20 &&  
            playerPos[1] < button5Pos[1] + 20     
        );
        if (isPlayerOnButton5) {
            button5Activated = true;  
            update_position(button5, [600,300]);
            update_position(block5, [1500, 100]); 
        }
    }
    if(trap1Touch%2===0)
    {
        trap1Pos[0]=trap1Pos[0]+trap_speed;
        if(trap1Pos[0]>=855)
        {
            trap1Touch=trap1Touch+1;
        }
    }
    else
    {
        trap1Pos[0]=trap1Pos[0]-trap_speed;
        if(trap1Pos[0]<=20)
        {
            trap1Touch=trap1Touch+1;
        }
    }
    update_position(trap1,trap1Pos);
    if(trap2Touch%2===0)
    {
        trap2Pos[0]=trap2Pos[0]+trap_speed;
        if(trap2Pos[0]>=979)
        {
            trap2Touch=trap2Touch+1;
        }
    }
    else
    {
        trap2Pos[0]=trap2Pos[0]-trap_speed;
        if(trap2Pos[0]<=20)
        {
            trap2Touch=trap2Touch+1;
        }
    }
    update_position(trap2, trap2Pos);
    // 应用重力
    velocityY =velocityY+(isUpsideDown ? -GRAVITY : GRAVITY);
    
    // 水平移动（保留原始移动逻辑）
    if (input_key_down("a")) {
        playerPos[0] =playerPos[0]- PLAYER_SPEED;
    }
    if (input_key_down("d")) {
        playerPos[0] =playerPos[0]+ PLAYER_SPEED;
    }
    
    // 跳跃控制
    if (input_key_down("w") && canJump) {
        velocityY = isUpsideDown ? -JUMP_FORCE : JUMP_FORCE;
        canJump = false;
    }
    
    // 更新玩家垂直位置（保持原始循环逻辑）
    playerPos[1] =playerPos[1]+ velocityY;
    
    // 1. 屏幕水平边界限制（只限制左右不限制上下）
    playerPos[0] = math_max(PLAYER_WIDTH/2, math_min(1000 - PLAYER_WIDTH/2, playerPos[0]));
    
    // 2. 垂直方向循环（保持你的原始设计）
    if (playerPos[1] > 600 + PLAYER_HEIGHT/2) {
        playerPos[1] = -PLAYER_HEIGHT/2;
    } else if (playerPos[1] < -PLAYER_HEIGHT/2) {
        playerPos[1] = 600 + PLAYER_HEIGHT/2;
    }
    
    // 3. 障碍物碰撞检测（修正版）
    if (gameobjects_overlap(player, obstacle)) {
        // 根据碰撞方向反弹
        if (playerPos[0] < obstaclePos[0]) { // 从左侧碰撞
            playerPos[0] = obstaclePos[0] - 30/2 - PLAYER_WIDTH/2;
        } else { // 从右侧碰撞
            playerPos[0] = obstaclePos[0] + 30/2 + PLAYER_WIDTH/2;
        }
    }
    
    // 4. 平台碰撞检测（完全保留你的原始逻辑）
    const isHorizontallyOverlapping = 
        playerPos[0] + PLAYER_WIDTH/2 > platformPos[0] - PLATFORM_WIDTH/2 &&
        playerPos[0] - PLAYER_WIDTH/2 < platformPos[0] + PLATFORM_WIDTH/2;
    
    // 平台顶部碰撞（正常状态）
    if (isHorizontallyOverlapping && 
        playerPos[1] + PLAYER_HEIGHT/2 >= platformPos[1] - PLATFORM_HEIGHT/2 &&
        playerPos[1] + PLAYER_HEIGHT/2 <= platformPos[1] - PLATFORM_HEIGHT/2 + 10 &&
        velocityY > 0) {
        
        playerPos[1] = platformPos[1] - PLATFORM_HEIGHT/2 - PLAYER_HEIGHT/2;
        velocityY = 0;
        canJump = true;
        isUpsideDown = false;
        update_scale(player, [1, 1]); // 确保玩家正常朝向
    }
    // 平台底部碰撞（倒立状态）
    else if (isHorizontallyOverlapping && 
             playerPos[1] - PLAYER_HEIGHT/2 <= platformPos[1] + PLATFORM_HEIGHT/2 &&
             playerPos[1] - PLAYER_HEIGHT/2 >= platformPos[1] + PLATFORM_HEIGHT/2 - 10 &&
             velocityY < 0) {
        
        playerPos[1] = platformPos[1] + PLATFORM_HEIGHT/2 + PLAYER_HEIGHT/2;
        velocityY = 0;
        canJump = true;
        isUpsideDown = true;
        update_scale(player, [1, -1]); // 玩家倒立
    }
    // 状态转换检测 - 从下往上穿过平台
    else if (isUpsideDown && isHorizontallyOverlapping &&
             playerPos[1] + PLAYER_HEIGHT/2 < platformPos[1] - PLATFORM_HEIGHT/2 &&
             playerPos[1] + PLAYER_HEIGHT/2 + velocityY >= platformPos[1] - PLATFORM_HEIGHT/2) {
        
        playerPos[1] = platformPos[1] - PLATFORM_HEIGHT/2 - PLAYER_HEIGHT/2;
        velocityY = 0;
        canJump = true;
        isUpsideDown = false;
        update_scale(player, [1, 1]);
    }
    // 状态转换检测 - 从上往下穿过平台
    else if (!isUpsideDown && isHorizontallyOverlapping &&
             playerPos[1] - PLAYER_HEIGHT/2 > platformPos[1] + PLATFORM_HEIGHT/2 &&
             playerPos[1] - PLAYER_HEIGHT/2 + velocityY <= platformPos[1] + PLATFORM_HEIGHT/2) {
        
        playerPos[1] = platformPos[1] + PLATFORM_HEIGHT/2 + PLAYER_HEIGHT/2;
        velocityY = 0;
        canJump = true;
        isUpsideDown = true;
        update_scale(player, [1, -1]);
             }
    update_position(player, playerPos);
});

// 构建并启动游戏
build_game();
