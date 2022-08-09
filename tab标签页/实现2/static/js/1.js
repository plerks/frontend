// 来自"/波纹按钮"
const rippleButton = {
    template: `
        <button class="button relative ripple-container"
          ref="rippleButton"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @mouseout="handleMouseOut"
          @transitionend="handleTransitionend($event)"
          style="letter-spacing: 0.08em;padding: 15px"
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
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const diagonal = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
            const radius = diagonal;
            this.rippleQueue.push({
                width: radius * 2 + 'px',
                height: radius * 2 + 'px',
                left: x - radius + 'px',
                top: y - radius + 'px',
                isExpanding: false,
                transitionend: false,
                rippleId: this.rippleId++
            });
            this.$nextTick(() => {
                this.$refs.rippleButton.offsetHeight;
                this.rippleQueue[this.rippleQueue.length - 1].isExpanding = true;
            });
        },
        handleMouseUp(e) {
            this.mouseDown = false;
            for(let i = 0; (i < this.rippleQueue.length) && (this.rippleQueue[i].transitionend == true); i++) {
                this.rippleQueue.shift();
            }
        },
        handleMouseOut(e) {
            this.mouseDown = false;
            for(let i = 0; (i < this.rippleQueue.length) && (this.rippleQueue[i].transitionend == true); i++) {
                this.rippleQueue.shift();
            }
        },
        handleTransitionend(e) {
            if (e.propertyName == "transform") {
                this.rippleQueue[0].transitionend = true;
                if ((!this.mouseDown) || (this.rippleQueue.length != 1)) {
                    this.rippleQueue.shift();
                }
            }
        }
    }
}
const tab = {
    components: {
        RippleButton: rippleButton
    },
    data() {
        return {
            activeIndex: 0
        }
    },
    computed: {
        tabTranslateX() {
            return 'translateX(' + (-this.activeIndex / this.tabHeaders.length * 100) + '%'+')'
        },
        tabBarWidth() {
            return 1 / this.tabHeaders.length * 100 + '%';
        },
        tabBarLeft() {
            return this.activeIndex / this.tabHeaders.length * 100 + '%';
        }
    },
    props: ['tabHeaders'],
    template: `
    <div class="tab">
        <div class="tab-header">
            <RippleButton @click="this.activeIndex=index" v-for="header,index in tabHeaders" :key="index">{{ header }}</RippleButton>
            <div class="tab-header-bar-background"></div>
            <div class="tab-header-bar" :style="{width: this.tabBarWidth, left: this.tabBarLeft}"></div>
        </div>
        <div style="overflow: hidden">
            <div style="position: relative">
                <div class="tab-container"
                  :style="{width: this.tabHeaders.length * 100 +'%',transform: this.tabTranslateX}">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
    `
}
const tabItem = {
    template: `
        <div class="tab-item">
            <slot></slot>
        </div>
    `
}
const app = Vue.createApp({
    components: {
        Tab: tab,
        TabItem: tabItem
    },
    data() {
        return {
            tabHeaders: [
                "First",
                "Second",
                "Third"
            ]
        }
    },
    template: `
    <Tab :tabHeaders="this.tabHeaders">
        <TabItem><div class="card" style="border-color: rgb(151, 233, 151)">1</div></TabItem>
        <TabItem><div class="card" style="border-color: red">2</div></TabItem>
        <TabItem><div class="card" style="border-color: blue">3</div></TabItem>
    </Tab>
`
}).mount("#app");