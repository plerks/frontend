const target = document.querySelector(".background-gradient");
const basicColors = [
    [62,35,255],
    [60,255,60],
    [255,35,98],
    [45,175,230],
    [255,0,255],
    [255,128,0]
];
// 颜色调和比率
let p = 0;
// 比例每次增量
let gradientSpeed = 0.002;
// 背景是从左侧颜色到右侧颜色的渐变，而左右颜色是从colorIndice取两组索引，从而从baseColorArr中选两组颜色，按p混合
let colorIndice = [0,1,2,3];
// 更新函数
const updateGradient = function() {
    // 设置颜色
    let colorLeft1 = basicColors[colorIndice[0]];
    let colorLeft2 = basicColors[colorIndice[1]];
    let colorRight1 = basicColors[colorIndice[2]];
    let colorRight2 = basicColors[colorIndice[3]];
    let colorLeft = [
        (1 - p) * colorLeft1[0] + p * colorLeft2[0],
        (1 - p) * colorLeft1[1] + p * colorLeft2[1],
        (1 - p) * colorLeft1[2] + p * colorLeft2[2]
    ];
    let colorRight = [
        (1 - p) * colorRight1[0] + p * colorRight2[0],
        (1 - p) * colorRight1[1] + p * colorRight2[1],
        (1 - p) * colorRight1[2] + p * colorRight2[2]
    ];
    // 转成rgb格式
    let colorL = `rgb(${colorLeft[0]}, ${colorLeft[1]}, ${colorLeft[2]})`;
    let colorR = `rgb(${colorRight[0]}, ${colorRight[1]}, ${colorRight[2]})`;
    target.style.background = "linear-gradient(90deg, " + colorL + " 0%, " + colorR + " 100%)";

    //更新颜色
    p += gradientSpeed;
    if (p >= 1) {
        p %= 1;
        /*需要从basicColors中选两个新的颜色放到colorIndice中供colorLeft,colorRight混合，
        p变化前趋近1-，colorLeft主色为basicColors[colorIndice[1]]；
        p变化后趋近0+，colorLeft主色为basicColors[colorIndice[0]]；
        为了防止颜色突变，需要把colorIndice[1]调到colorIndice[0]*/
        colorIndice[0] = colorIndice[1];
        colorIndice[2] = colorIndice[3];
        // 挑新的颜色时，要避免和将要混合的对象颜色重复，所以Math.floor()的结果不能是0，也要保证可能取到basicColors中的任一个
        colorIndice[1] = (colorIndice[1] + Math.floor(1 + Math.random() * (basicColors.length - 1))) % basicColors.length;
        colorIndice[3] = (colorIndice[3] + Math.floor(1 + Math.random() * (basicColors.length - 1))) % basicColors.length;
    }
}
setInterval(updateGradient,10);