const rippleButton = {
    template: `
        <button class="button relative ripple-container" ref="rp" @mousedown="handleMouseDown" @mouseup="handleMouseUp"
         style="font-weight: 500;letter-spacing: 0.08em">
            <slot></slot>
            <span v-for="ripple in rippleQueue"
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
            rippleQueue: []
        }
    },
    methods: {
        handleMouseDown(e) {
            const rect = this.$refs.rp.getBoundingClientRect();
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
            });
            /*window.setTimeout(() => {
                this.rippleQueue[this.rippleQueue.length - 1].isExpanding = true;
            },0)*/
            // 必须要nextTick，不然没动画
            this.$nextTick(() => {
                // 强制回流，试一下刚好就出动画了，很有意思，和"/折叠面板(vue)中的技巧一样"，上面通过window.setTimeout触发波纹扩张也能出动画。
                this.$refs.rp.offsetHeight;
                this.rippleQueue[this.rippleQueue.length - 1].isExpanding = true;
            });
            // console.log(this.rippleQueue);
        },
        handleMouseUp(e) {
            window.setTimeout(() => {
                this.rippleQueue.shift();
            }, 300)
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