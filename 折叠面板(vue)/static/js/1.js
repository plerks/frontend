const collapse = {
    data() {
        return {
            expanded: false
        }
    },
    template: `
<div class="card" style="width: 300px;padding: 5px">
    <div class="container">
        <div class="row" style="border: 1px solid #dedede;color: #79848b;font-family: Arial, Helvetica;">
<!--        这里可以用.has-arrow:not(.expanded)::after和.has-arrow.expanded::after来画箭头并控制旋转，但一般都是用aria-expanded属性来控制旋转
            <span class="has-arrow" :class="{expanded:expanded}" @click="expand()" style="flex: 1 1;padding: 5px;color: #5f5f5f">点击</span>-->
            <span class="has-arrow" :aria-expanded="expanded" @click="expand()" style="flex: 1 1;padding: 5px;color: #5f5f5f">点击</span>
        </div>
    </div>
    <div style="overflow: hidden;">
        <transition
            name="fade-in"
            @beforeEnter="beforeEnter"
            @enter="enter"
            @afterEnter="afterEnter"
            @beforeLeave="beforeLeave"
            @leave="leave"
            @afterLeave="afterLeave"
        >
          <div v-show="expanded">
            <button class="button">Collapse Content</button>
            <button class="button">Collapse Content</button>
            <button class="button">Collapse Content</button>
            <button class="button">Collapse Content</button>
            <button class="button">Collapse Content</button>
            <div class="h-scrollbar" style="max-height: 50px;overflow-y: scroll">
                <button class="button" style="height: 100px">test when content scrolls</button>
            </div>
          </div>
        </transition>
    </div>
</div>
    `,
    methods: {
        expand: function () {
            this.expanded = !this.expanded
        },
        beforeEnter(el) {
            el.classList.add("collapse-transition")
            el.style.height = '0'
            console.log("beforeEnter")
        },
        enter(el) {
            if (el.scrollHeight !== 0) {
                el.style.height = el.scrollHeight + 'px';
            } 
            else {
                el.style.height = '';
            }
        },
        afterEnter(el) {
            console.log("afterEnter")
            el.classList.remove("collapse-transition")
            el.style.height=''
        },
        beforeLeave(el) {
            el.style.height = el.scrollHeight + 'px';
        },
        leave(el) {
            if (el.scrollHeight !== 0) {
                // for safari: add class after set height, or it will jump to zero height suddenly, weired
                el.classList.add("collapse-transition")
                el.style.height = 0;
              }
        },
        afterLeave(el) {
            el.classList.remove("collapse-transition")
            el.style.height = '';
        }
    }
}
const app = Vue.createApp({
    components: {
        Collapse: collapse
    },
    template: `<collapse></collapse>
                <collapse></collapse>
    `
}).mount("#app");
