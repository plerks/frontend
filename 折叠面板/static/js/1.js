const collapse = {
    data() {
        return {
            expanded: false,
            currentHeight: 0
        }
    },
    template: `
<div class="card" style="width: 300px;padding: 5px">
    <div class="container">
        <div class="row" style="border: 1px solid #dedede;color: #79848b;font-family: Arial, Helvetica;">
            <!--这里可以用.has-arrow:not(.expanded)::after和.has-arrow.expanded::after来画箭头并控制旋转，但一般都是用aria-expanded属性来控制旋转
            <span class="has-arrow" :class="{expanded:expanded}" @click="expand()" style="flex: 1 1;padding: 5px;color: #5f5f5f">点击</span>-->
            <span class="has-arrow" :aria-expanded="expanded" @click="expand()" style="flex: 1 1;padding: 5px;color: #5f5f5f">点击</span>
        </div>
    </div>
    <div style="overflow: hidden">
        <transition
            name="fade-in"
            @beforeEnter="beforeEnter"
            @enter="enter"
            @afterEnter="afterEnter"
            @beforeLeave="beforeLeave"
            @leave="leave"
            @afterLeave="afterLeave"
        >
          <div v-show="expanded" ref="content">
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
            this.currentHeight = this.$refs.content.offsetHeight
        },
        beforeEnter(el) {
            el.style.height = ''
            el.classList.add("collapse-transition")
        },
        enter(el) {
            let expandedHeight = window.getComputedStyle(el).height
            el.style.height = this.currentHeight + 'px'
            el.offsetHeight // 触发浏览器回流
            el.style.height = expandedHeight // 要展开不能设置height为auto，不会出动画，所以要先获得固定值的高度
        },
        afterEnter(el) {
            el.style.height = ''
            el.classList.remove("collapse-transition")
        },
        beforeLeave(el) {
            el.style.height = ''
            el.classList.add("collapse-transition")
        },
        leave (el) {
            el.style.height = this.currentHeight + 'px'
            el.offsetHeight // 触发浏览器回流
            el.style.height = '0px'
        },
        afterLeave(el) {
            el.style.height = ''
            el.classList.remove("collapse-transition")
        }

        /*
        上面的v-show="expanded"不能换成v-if="expanded"。否则会有问题，毕竟v-if要重新插入元素到dom中，所以这里用v-if动画会不正常。
        
        为了保证动画被打断时的开闭连续(打开到一半时点关闭，要保证从半高缩到0，而非突然变成全高再缩到0)，必须获得目前变化到的高度。
        所以要在click时获得当前的高度并记录，然后动画变化到0/全高。

        很奇怪，不能用fade-in-enter-active和fade-in-leave-active来声明transition，否则把transition时长拉大，反复点击开闭，还是会出现
        突然瞬间变到完全打开/完全关闭的情况。得在enter,leave的钩子函数里添加/删除class来控制transition。

        仍然还有一个问题是有时会出现快要到展开/关闭结束时，突然跳到完全展开/关闭(例如关闭到一半再点打开)。
        */
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
