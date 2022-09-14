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
          <div v-show="expanded">
            <button class="button">Collapse Content</button>
            <button class="button">Collapse Content</button>
            <button class="button">Collapse Content</button>
            <button class="button">Collapse Content</button>
            <button class="button">Collapse Content</button>
            <div class="h-scrollbar" style="max-height: 50px;overflow-y: scroll">
                <button class="button" style="height: 100px">test when content scrolls(打开关闭时滑块位置会保留，上面是v-show，不是v-if)</button>
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
            el.classList.add('collapse-transition')
            el.style.height = '0';
        },
        enter(el) {
            console.log("enter offsetHeight: " + el.offsetHeight) // 实时高度
            console.log("enter scrollHeight: " + el.scrollHeight) // 全高
            el.style.height = el.scrollHeight + 'px';
        },
        afterEnter(el) {
            el.classList.remove('collapse-transition')
            el.style.height = '';
        },
        beforeLeave(el) {
            console.log("leave offsetHeight: " + el.offsetHeight) // 实时高度
            console.log("leave scrollHeight: " + el.scrollHeight) // 全高
            // el.classList.add('collapse-transition');
            el.style.height = el.scrollHeight + 'px';
        },
        leave(el) {
            el.classList.add('collapse-transition'); // 这里和beforeEnter()对应，写在beforeLeave()里也行
            el.style.height = '0';
        },
        afterLeave(el) {
            el.classList.remove('collapse-transition');
            el.style.height = '';
        }

        /*
        上面的v-show="expanded"不能换成v-if="expanded"。否则会有问题，毕竟v-if要重新插入元素到dom中，所以这里用v-if动画会不正常。
        
        这里的写法参考了element的写法(https://github.com/ElemeFE/element/blob/dev/src/transitions/collapse-transition.js)。
        要让开闭动画过程中发生开闭切换时的动画正常，钩子函数里居然只要设置height为0/scrollHeight(console.log看会是全高，不是实时高度)就行，完全不明白为什么，
        明明这种写法beforeEnter里把height设置成了0，关闭动画被中断时居然不是先变成0再打开。原本以为是需要记录动画被中断时的实时高度。

        很奇怪，不能用fade-in-enter-active和fade-in-leave-active来声明transition，否则动画不对(把transition时长调大点就能看出来)。
        得在钩子函数里添加/删除class来控制transition，此外，直接<div v-show="expanded" class="collapse-transition">加个持久的collapse-transition好像也行。

        用offsetHeight动画会不对(第一次打开没有动画，现象是等transition时间到后瞬间展开，后续再点，动画也不对)，这里的写法，offsetHeight会是dom中实际的实时高度，如果把el.scrollHeight换成
        el.offsetHeight，第一次点打开时offsetHeight会是0。enter里用scrollHeight，beforeLeave里用offsetHeight也不行。不知道用offsetHeight能不能实现连续变化。

        这里的写法，el.offsetHeight表现为dom中实际的实时高度，但commit feeb268bc830de00d33c4dc43f07f91f0f234911 和 d39a04f312da6aa715946af3e0309b40c101fa48 里的写法，在
        enter和leave钩子函数里el.style.height = this.currentHeight + 'px'的上一行加上console.log(el.offsetHeight)，打印出来的会是全高，不是dom中实际的实时高度。
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
