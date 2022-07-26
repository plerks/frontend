const rippleButton = {
    template: `
        <button class="button relative ripple-container" ref="rippleButton" @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mouseout="handleMouseOut"
         style="font-weight: 500;letter-spacing: 0.08em;padding: 8px 24px">
            <slot></slot>
            <span v-for="(ripple,index) in rippleQueue"
                :key=index
                :style="{
                    width: ripple.width,
                    height: ripple.height,
                    left: ripple.left,
                    top: ripple.top
                }"
                :class="['ripple',ripple.isExpanding? 'expand':'']"></span>
        </button>
    `,
    data() {
        return {
            rippleQueue: [],
            mouseDown: false
        }
    },
    methods: {
        handleMouseDown(e) {
            this.mouseDown = true;
            const rect = this.$refs.rippleButton.getBoundingClientRect();
            // x,y为点击位置在button中的坐标
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const diagonal = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
            // 波纹的圆以对角线为半径时能保证不管点击哪里波纹都能覆盖按钮
            const radius = diagonal;
            this.rippleQueue.push({
                width: radius * 2 + 'px',
                height: radius * 2 + 'px',
                left: x - radius + 'px',
                top: y - radius + 'px',
                isExpanding: false,
                transitionend: false
            });
            /*window.setTimeout(() => {
                this.rippleQueue[this.rippleQueue.length - 1].isExpanding = true;
            },0)*/
            // 必须要nextTick，不然没动画
            this.$nextTick(() => {
                // 强制回流，试一下刚好就出动画了，很有意思，和"/折叠面板"中的技巧一样，上面通过window.setTimeout触发波纹扩张也能出动画。
                this.$refs.rippleButton.offsetHeight;
                // 开启波纹扩张动画
                this.rippleQueue[this.rippleQueue.length - 1].isExpanding = true;
                this.$refs.rippleButton.addEventListener("transitionend", () => {
                    // this.rippleQueue[i].transitionend值是给handleMouseUp用的
                    for(let i = 0; (i < this.rippleQueue.length) && (this.rippleQueue[i].transitionend == false); i++) {
                        this.rippleQueue[i].transitionend = true;
                    }
                    // transitionend时按理应该清除所有波纹，但是要处理长按的情况，所以transitionend时如果鼠标是按下状态，要剩一个波纹在那里
                    if(!(this.mouseDown && this.rippleQueue.length == 1)) {
                        this.rippleQueue.shift();
                    }
                })
            });
        },
        handleMouseUp(e) {
            this.mouseDown = false;
            // handleMouseUp只负责清除因为长按而没有在transitionend时清除的波纹(延时了一点)
            window.setTimeout(() => {
                if(this.rippleQueue[0].transitionend==true) {
                    this.rippleQueue.shift()
                }
            }, 30)
        },
        handleMouseOut(e) {
            // 鼠标移出，延时一点后清除所有波纹
            window.setTimeout(() => {
                this.rippleQueue = [];
            }, 30)
        }
    }
}
const app = Vue.createApp({
    components: {
        RippleButton: rippleButton
    },
    template: `
        <RippleButton>button</RippleButton>
    `
});
app.mount('#app');