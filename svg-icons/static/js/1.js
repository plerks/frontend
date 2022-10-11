const { markRaw } = Vue
const app = Vue.createApp({
    data() {
        return {
            /*
            这里直接写icons: icons会因为:is提示:
            Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead,
            and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.
            不过markRaw之后也丢失了this.icons的响应性
            */
            icons: markRaw(icons)
        }
    },
    template: `
    <div class="svg-list" @click="this.icons.pop()">
        <component v-for="icon in icons" :is="icon"/>
    </div>
    `
});

/* js的变量提升(https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting)，
变量可以在声明之前进行初始化和使用，但是如果没有初始化，就不能使用它们(只提升了声明)。 */
//console.log({icons: icons}) //报错未初始化icons
//console.log({data() { return {icons: icons}}}.data) //这里定义包含data函数的一个对象，应该是不算使用icons，不报错，甚至可以把icons换成一个不存在的变量名
//console.log({data() { return {icons: icons}}}.data()) //报错未初始化icons
const icons = []

const barsOutline = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon bars-outline" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 200 250 l 600 0 M 200 500 l 600 0 M 200 750 l 600 0"/>
            </svg>
        </span>
        <span class="svg-icon-name">BarsOutline</span>
    </div>
    `
}
icons.push(barsOutline)

const home = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 100 500 L 500 100 L 900 500 A 30 30 0 0 1 857.58 542.42 L 500 184.84 L 142.42 542.42 A 30 30 0 0 1 100 500"/>
                <path d="M 730 330 L 730 100 L 670 100 L 670 270"/>
                <path d="M 200 900 L 200 600 L 500 300 L 800 600 L 800 900 L 600 900 L 600 600 L 400 600 L 400 900 Z"/>
            </svg>
        </span>
        <span class="svg-icon-name">Home</span>
    </div>
    `
}
icons.push(home)

const dot3 = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <circle cx="500" cy="250" r="80"/>
                <circle cx="500" cy="500" r="80"/>
                <circle cx="500" cy="750" r="80"/>
            </svg>
        </span>
        <span class="svg-icon-name">Dot3</span>
    </div>
    `
}
icons.push(dot3)

const group = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 100 370 L 500 170 L 900 370 L 500 570"/>
                <path d="M 500 610 L 100 410 L 100 490 L 500 690 L 900 490 L 900 410"/>
                <path d="M 500 730 L 100 530 L 100 610 L 500 810 L 900 610 L 900 530"/>
            </svg>
        </span>
        <span class="svg-icon-name">Group</span>
    </div>
    `
}
icons.push(group)

const tables = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 100 250 A 120 120 0 0 1 220 130 h 560 A 120 120 0 0 1 900 250"/>
                <path d="M 100 250 L 100 810 A 60 60 0 0 0 160 870 L 160 250"/>
                <path d="M 900 250 L 900 810 A 60 60 0 0 1 840 870 L 840 250"/>
                <path d="M 160 810 L 840 810 L 840 870 L 160 870"/>
                <path d="M 160 530 L 840 530 L 840 590 L 160 590"/>
                <path d="M 470 250 L 530 250 L 530 810 L 470 810"/>
            </svg>
        </span>
        <span class="svg-icon-name">Tables</span>
    </div>
    `
}
icons.push(tables)

const charts = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 170 170 L 170 770 A 60 60 0 0 0 230 830 L 830 830 L 830 770 L 230 770 L 230 170"/>
                <path d="M 305 670 L 305 470 L 380 470 L 380 670"/>
                <path d="M 455 670 L 455 270 L 530 270 L 530 670"/>
                <path d="M 605 670 L 605 370 L 680 370 L 680 670"/>
                <path d="M 755 670 L 755 270 L 830 270 L 830 670"/>
            </svg>
        </span>
        <span class="svg-icon-name">Charts</span>
    </div>
    `
}
icons.push(charts)

const screen = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 100 145 A 60 60 0 0 1 160 85 L 840 85 A 60 60 0 0 1 900 145 Z"/>
                <path d="M 100 145 L 100 645 A 60 60 0 0 0 160 705 L 160 145 Z"/>
                <path d="M 900 145 L 900 645 A 60 60 0 0 1 840 705 L 840 145 Z"/>
                <path d="M 160 645 L 840 645 L 840 705 L 160 705 Z"/>
                <path d="M 560 705 L 560 855 L 440 855 L 440 705 Z"/>
                <path d="M 300 855 L 700 855 A 60 60 0 0 1 700 915 L 300 915 A 60 60 0 0 1 300 855 Z"/>
            </svg>
        </span>
        <span class="svg-icon-name">Screen</span>
    </div>
    `
}
icons.push(screen)

const triangleDown = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 200 326.8 L 800 326.8 L 500 846.4"/>
            </svg>
        </span>
        <span class="svg-icon-name">TriangleDown</span>
    </div>
    `
}
icons.push(triangleDown)

const copy = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 16 16">
                <path d="M 2 6 L 6 6 L 6 7.5 L 2.5 7.5 A 1 1 0 0 0 1.5 8.5 L 1.5 13.5 A 1 1 0 0 0 2.5 14.5 L 7.5 14.5 A 1 1 0 0 0 8.5 13.5 L 8.5 8.5
                L 10 8.5 L 10 14 A 2 2 0 0 1 8 16 L 2 16 A 2 2 0 0 1 0 14 L 0 8 A 2 2 0 0 1 2 6
                "/>
                <!--内外两条线都是顺时针,必须指定fill-rule为evenodd,nonezero不行-->
                <path fill-rule="evenodd" d="M 8 0 h 6 A 2 2 0 0 1 16 2 L 16 8 A 2 2 0 0 1 14 10 L 8 10 A 2 2 0 0 1 6 8 L 6 2 A 2 2 0 0 1 8 0
                        M 8.5 1.5 L 13.5 1.5 A 1 1 0 0 1 14.5 2.5 L 14.5 7.5 A 1 1 0 0 1 13.5 8.5 L 8.5 8.5 A 1 1 0 0 1 7.5 7.5 L 7.5 2.5 A 1 1 0 0 1 8.5 1.5
                "/>
            </svg>
        </span>
        <span class="svg-icon-name">Copy</span>
    </div>
    `
}
icons.push(copy)

const finish = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="7" stroke-width="2" fill="none" stroke="green"/>
                <polyline class="finish" points="3.7,8 7,11.5 11.7,5.7" stroke-width="2" fill="none" stroke="green" stroke-linecap="round"/>
            </svg>
        </span>
        <span class="svg-icon-name">Finish</span>
    </div>
    `
}
icons.push(finish)

const error = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="7" stroke-width="2" fill="none" stroke="#ab1313"/>
                <line x1="8" y1="3" x2="8" y2="10" stroke-width="2" stroke="#ab1313"/>
                <circle cx="8" cy="12" r="1" fill="#ab1313"/>
            </svg>
        </span>
        <span class="svg-icon-name">Error</span>
    </div>
    `
}
icons.push(error)

const loading1 = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 16 16">
                <circle class="loading1-background" cx="8" cy="8" r="7"/>
                <circle class="loading1" cx="8" cy="8" r="7"/>
            </svg>
        </span>
        <span class="svg-icon-name">Loading-1</span>
    </div>
    `
}
icons.push(loading1)

const loading2 = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 16 16">
                <circle class="loading2" cx="8" cy="8" r="7"/>
            </svg>
        </span>
        <span class="svg-icon-name">Loading-2</span>
    </div>
    `
}
icons.push(loading2)

app.mount("#app")