/*
b站主页(截止2022/6/24的主页)的轮播图效果。content设置成overflow: hidden，然后img-box放多张图片进去。
这时候最简单的思路是根据当前显示的是第几张图片计算位移百分比改img-box的translateX控制平移产生轮播效果。但是这样轮播到最右边的点的时候平移方向会反，
并且平移距离会比平时大几倍。b站主页的处理办法是，以dom中的img-box正在显示的图片为基准，左边有一张图片，右边是剩下的图片。
也就是说始终让正在显示的是imgs[1]。要达成这种效果，位移动画发生时设置transition有时间，并修改translateX产生动画效果，
位移动画完成后把transition的时间设置成0，然后迅速把imgs数组视做循环列表，旋转使得正在显示的图片(imgs数组中img对象的index属性==activeDot的图片)在imgs数组中的下标是1，
这时候网页中正在展示的图片是将要变的，所以要马上把translateX改回来(这个过程是没有动画的)

以一次点击右箭头或者到点的轮播为例：

一开始假设图片在网页dom中的img-box中的排列顺序是：
8 |0| 1 2 3 4 5 6 7
(数字是imgs数组中img对象的index属性，| |中的是img-box可视的区域(正在显示的图片)。this.imgs也是8 0 1 2 3 4 5 6 7(网页dom是用v-for循环this.imgs渲染出来的，二者顺序一样))

transition时长为0
8 |0| 1 2 3 4 5 6 7 img-box的translateX为-11.1111%
点击右箭头或者到点要轮播，设置transition有时长，修改translateX产生动画
8 0 |1| 2 3 4 5 6 7 img-box的translateX为-22.2222%
这时候动画完成了，transition时长设置为0，把this.imgs元素旋转一次成为0 1 2 3 4 5 6 7 8，这时候如果不处理，v-for渲染出的img-box会是0 1 |2| 3 4 5 6 7 8,
所以要把transform改回来，由于先前设置了transition时长为0，不会有动画，此时img-box排列为
0 |1| 2 3 4 5 6 7 8 img-box的translateX为-11.1111%

此外，直接点击小点时没法做位移动画，比如当前小点在最右边，然后手动点了最左边的小点，移动超过了一张图片，当前显示图片的左边没有那么多图片可以translate，
实际dom中的img-box只能是矩形，没法当循环列表旋转。所以b站也是直接顺变没位移动画的。直接保持transition时长为0并且旋转imgs直到this.imgs[1].index == activeDot就行。

补充，不会因为11.1111%的精度问题导致在显示的图片的左右侧边有一点点其它图片的内容，因为图片的width和translateX都是11.1111%

总结，上面的过程有点饶，主要是为了保证轮播到最后一张图片时下一次轮播方式不会突变。需要把this.imgs当循环列表旋转，在静止状态下(非正在动画)时，总有：
1. 真实dom中正在显示的图片是this.imgs[1]
2. this.imgs[1].index == activeDot
而轮播图的静止状态是什么样子完全由activeDot的值决定
*/

const carousel = {
    data() {
        // 实际应该有获得图片主色的库，这里手动写的主色
        return {
            imgs:[
                {
                    index: 0,
                    title: "标题一",
                    src: "static/img/1.jpg",
                    mainColor: "#0a7381"
                },
                {
                    index: 1,
                    title: "标题二",
                    src: "static/img/2.jpg",
                    mainColor: "#71b432"
                },
                {
                    index: 2,
                    title: "标题三",
                    src: "static/img/3.jpg",
                    mainColor: "#6b617e"
                },
                {
                    index: 3,
                    title: "标题四",
                    src: "static/img/4.jpg",
                    mainColor: "#0b0e19"
                },
                {
                    index: 4,
                    title: "标题五",
                    src: "static/img/5.jpg",
                    mainColor: "#997246"
                },
                {
                    index: 5,
                    title: "标题六",
                    src: "static/img/6.jpg",
                    mainColor: "#15416e"
                },
                {
                    index: 6,
                    title: "标题七",
                    src: "static/img/7.jpg",
                    mainColor: "#569cfb"
                },
                {
                    index: 7,
                    title: "标题八",
                    src: "static/img/8.jpg",
                    mainColor: "#0663c1"
                },
                {
                    index: 8,
                    title: "标题九",
                    src: "static/img/9.jpg",
                    mainColor: "#01162a"
                }
            ],
            activeDot: 0,
            // 吃豆人是否向左
            pacmanReverse: false,
            imgBoxStyle: {
                width: "900%",
                height: "80%",
                display: "flex",
                transition: "transform 0s ease",
                transform: "translateX(-11.1111%)"
            },
            // 图片切换时下面bottom-box的颜色是设计成瞬变的，上面展示的img-box的图片有渐变延迟，用imgs[1].mainColor来反映下面的颜色不可行，需要新定义一个变量
            bottomColor: "",
            timer: null,
            // 点击一次左右箭头后的移动是否还没结束
            clickArrowMoving: false
        }
    },
    beforeMount() {
        this.bottomColor = this.imgs[1].mainColor;
        // 没移动时，画面中显示的是imgs[1],一开始调下顺序，把初始的第一张图片转到imgs[1]，这样一开始网页显示的就是初始imgs数组的第一张图片
        let last = this.imgs.pop();
        this.imgs.unshift(last);
        this.bottomColor = this.imgs[1].mainColor;
    },
    mounted() {
        this.$refs.imgBox.addEventListener("transitionend", () => {
            this.imgBoxStyle.transition = "transform 0s ease";
            this.imgBoxStyle.transform = "translateX(-11.1111%)";
            if(this.pacmanReverse == true) {
                let last = this.imgs.pop();
                this.imgs.unshift(last);
            }
            else {
                let first = this.imgs.shift();
                this.imgs.push(first);
            }
            this.bottomColor = this.imgs[1].mainColor;
            this.clickArrowMoving = false;
        })
        // 开始轮播
        this.startAutoPlay();
    },
    methods: {
        handleClickDot($event, index) {
            this.stopAutoPlay();
            this.pacmanReverse = this.activeDot > index;
            this.activeDot = index;
            while(this.imgs[1].index != index) {
                let last = this.imgs.pop();
                this.imgs.unshift(last);
            }
            this.bottomColor = this.imgs[1].mainColor;
        },
        handleClickLeftArrow() {
            // 连续点击时，在第一次点击的动画完成前，后续点击无效
            if(!this.clickArrowMoving) {
                this.clickArrowMoving = true;
                this.bottomColor = this.imgs[0].mainColor;
                this.activeDot = (this.activeDot - 1 + this.imgs.length) % this.imgs.length;
                let offset = 0;
                this.imgBoxStyle.transition = "transform 0.3s ease";
                this.imgBoxStyle.transform = `translateX(${offset}%)`; // 然后这里会有个注册的transitionend回调
                this.pacmanReverse = true;
            }
        },
        handleClickRightArrow() {
            // 连续点击时，在第一次点击的动画完成前，后续点击无效
            if(!this.clickArrowMoving) {
                this.clickArrowMoving = true;
                this.bottomColor = this.imgs[2].mainColor;
                this.activeDot = (this.activeDot + 1) % this.imgs.length;
                let offset = -11.1111 * 2;
                this.imgBoxStyle.transition = "transform 0.3s ease";
                this.imgBoxStyle.transform = `translateX(${offset}%)`; // 然后这里会有个注册的transitionend回调
                this.pacmanReverse = false;
            }
        },
        // 根据activeDot的值旋转imgs，activeDot的值反映了轮播图静止下来后的状态
        reachStatusByActiveDot() {
            this.imgBoxStyle.transition = "transform 0s ease";
            this.imgBoxStyle.transform = "translateX(-11.1111%)";
            // 把activeDot对应的图片转到imgs[1]的位置
            while(this.imgs[1].index != this.activeDot) {
                let last = this.imgs.pop();
                this.imgs.unshift(last);
                this.bottomColor = this.imgs[1].mainColor;
            }
        },
        startAutoPlay() {
            this.timer = setInterval(() => {
                this.bottomColor = this.imgs[2].mainColor;
                this.activeDot = (this.activeDot + 1) % this.imgs.length;
                let offset = -11.1111 * 2;
                this.imgBoxStyle.transition = "transform 0.3s ease";
                this.imgBoxStyle.transform = `translateX(${offset}%)`;
                this.pacmanReverse = false;
            }, 3000)
        },
        stopAutoPlay() {
            clearInterval(this.timer);
        }
    },
    template: `
    <!-- 这里wrapper用了"/让高度等于宽度的一个比例(例如正方形图片)"中的技巧 -->
    <div class="wrapper" style="padding-top: 60%;border-radius: 8px" @mouseover="stopAutoPlay" @mouseout="startAutoPlay">
        <div class="content">
            <!-- 这里必须显式设置height,否则子元素的百分比height不会有效,见"/百分比height需要父元素指定height属性" -->
            <div class="img-box" ref="imgBox" :style="imgBoxStyle">
                <img v-for="(img,index) in imgs" :src="img.src" style="width: 11.1111%;"/>
            </div>
            <div class="bottom-box space-between" :style="{'height': '20%', 'background-color': bottomColor}">
                <div class="gradient" :style="{'background': 'linear-gradient(to top,'+bottomColor+',transparent)'}"></div>
                <div class="col-8" style="padding: 0 15px">
                    <div class="title">{{imgs[1].title}}</div>
                    <ul>
                        <li v-for="img,index in imgs" :class="{'dot':true,'active':index===activeDot,'reverse':pacmanReverse&&activeDot==index}" @click="handleClickDot($event, index)">
                            <div class="before"></div>
                            <div class="after"></div>
                        </li>
                    </ul>
                </div>
                <div class="col-4 justify-center" style="padding: 0 15px">
                    <div class="gray-button justify-center align-center" style="margin-right: 12px" @click="handleClickLeftArrow()">
                        <span class="left-arrow"></span>
                    </div>
                    <div class="gray-button justify-center align-center" @click="handleClickRightArrow()">
                        <span class="right-arrow"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}
const app = Vue.createApp({
    components: {
        carousel
    },
    template: `<carousel></carousel>`
}).mount("#app");