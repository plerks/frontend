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
    <div style="overflow: hidden">
        <transition
            name="fade-in"
            @enter="enter"
            @leave="leave"
        >
          <div v-if="expanded">
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
        enter(el) {
            let expandedHeight = window.getComputedStyle(el).height
            el.style.height = '0px'
            el.offsetHeight // 触发浏览器回流
            el.style.height = expandedHeight // 要展开不能设置height为auto，不会出动画，所以要先获得固定值的高度
        },
        leave (el) {
            //el.style.height = window.getComputedStyle(el).height
            el.offsetHeight // 触发浏览器回流，这里可以不用触发，上面enter()需要触发回流，见"../../说明.md"，应该只需要保证渲染线程看到高度从固定值到固定值的变化就行
            el.style.height = '0px'
        },
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
