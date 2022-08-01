const rippleButton = {
    template: `
        <button class="button relative ripple-container"
          ref="rippleButton"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @mouseout="handleMouseOut"
          @transitionend="handleTransitionend($event)"
          style="font-weight: 500;letter-spacing: 0.08em;padding: 8px 24px"
        >
            <slot></slot>
            <span v-for="(ripple,index) in rippleQueue"
              :key=this.rippleQueue[index].rippleId
              :style="{
                  width: ripple.width,
                  height: ripple.height,
                  left: ripple.left,
                  top: ripple.top
              }"
              :class="['ripple',ripple.isExpanding? 'expand':'']"
            ></span>
        </button>
    `,
    data() {
        return {
            rippleQueue: [],
            mouseDown: false,
            rippleId: 0
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
                transitionend: false,
                /* 必须v-for里给个key,不然会受vue v-for的就地更新策略影响,而且key不能用循环的index(重坑) */
                rippleId: this.rippleId++
            });
            /*window.setTimeout(() => {
                this.rippleQueue[this.rippleQueue.length - 1].isExpanding = true;
            },0)*/
            // 必须要nextTick，不然没动画
            this.$nextTick(() => {
                // 强制回流，试一下刚好就出动画了，很有意思，和"/折叠面板"中的技巧一样，上面通过window.setTimeout触发波纹扩张也能出动画。
                this.$refs.rippleButton.offsetHeight;
                // 开启波纹扩张动画,也可以直接在ripple的class里写个animation
                this.rippleQueue[this.rippleQueue.length - 1].isExpanding = true;
            });
        },
        handleMouseUp(e) {
            this.mouseDown = false;
            // mouseup时清除所有已完成过渡的波纹
            for(let i = 0; (i < this.rippleQueue.length) && (this.rippleQueue[i].transitionend == true); i++) {
                this.rippleQueue.shift();
            }
        },
        handleMouseOut(e) {
            // 虽然有可能在按住鼠标的情况下把光标移出按钮,这里仍然要把mouseDown置成false(这时鼠标左键可能是按下的状态),因为要给handleTransitionend做判断
            this.mouseDown = false;
            // 鼠标移出时清除所有已完成过渡的波纹
            for(let i = 0; (i < this.rippleQueue.length) && (this.rippleQueue[i].transitionend == true); i++) {
                this.rippleQueue.shift();
            }
        },
        handleTransitionend(e) {
            if (e.propertyName == "transform") {
                this.rippleQueue[0].transitionend = true;
                // transitionend时,若鼠标在长按则要留下最后一个波纹
                if ((!this.mouseDown) || (this.rippleQueue.length != 1)) {
                    this.rippleQueue.shift();
                }
            }
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