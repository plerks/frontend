const rippleButton = {
    template: `
        <button class="button relative ripple-container" ref="rp" @mousedown="handleMouseDown" @mouseup="handleMouseUp"
         style="font-weight: 500;letter-spacing: 0.08em">
            <slot></slot>
            <span v-if="isShow" :style="rippleStyle" :class="rippleClass"></span>
        </button>
    `,
    data() {
        return {
            isShow: false,
            radius: 0,
            left: 0,
            top: 0,
            isHolding: false,
        }
    },
    methods: {
        handleMouseDown(e) {
            this.isShow = true;
            // vue完成dom更新后，调用$nextTick注册的方法
            this.$nextTick(() => {
                const rect = this.$refs.rp.getBoundingClientRect();
                // console.log(`rect.width:${rect.width} rect.height:${rect.height}`)
                // x,y为点击位置在button中的坐标
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                // console.log(`x:${x} y:${y}`);
                const diagonal = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
                // 波纹的圆以对角线为半径时能保证不管点击哪里波纹都能覆盖按钮
                const radius = diagonal;
                // console.log(`radius:${radius}`);
                this.radius = radius;
                this.left = x - radius;
                this.top = y - radius;
                this.isHolding = true;
            });
        },
        handleMouseUp(e) {
            window.setTimeout(() => {
                this.isShow = false;
                this.radius = "0px";
                this.left = 0;
                this.top = 0;
                this.isHolding = false;
            }, 300)
        }
    },
    computed: {
        rippleStyle() {
            return {
                width: this.radius * 2 + "px",
                height: this.radius * 2 + "px",
                left: this.left + "px",
                top: this.top + "px",
            }
        },
        rippleClass() {
            return [
                "ripple",
                this.isHolding ? "is-holding":""
            ]
        }
    },
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