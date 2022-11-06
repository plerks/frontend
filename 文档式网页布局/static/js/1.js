const header = {
    template: `
    <div class="header flex-between">
        <input class="search" placeholder="Search"/>
        <img class="icon" src="static/img/1.jpg"/>
    </div>
    `
}

const sidebar = {
    template: `
    <div class="sidebar h-scrollbar">
        <router-link to="/title1" class="title">标题1</router-link>
        <router-link to="/title2" class="title">标题2</router-link>
        <router-link to="/title3" class="title">标题3</router-link>
        <router-link to="/title4" class="title">标题4</router-link>
        <router-link to="/title5" class="title">标题5</router-link>
    </div>
    `
}

const content = {
    data() {
        return {
            activeIndex: 0,
            titles: ['段落一标题', '段落二标题', '段落三标题'],
            options: null
        }
    },
    methods: {
        scrollInto(e) {
            // 需要preventDefault,直接用锚点跳转加上html{scroll-behavior: smooth},hash会瞬变成目标hash,但是滚动时又会被我写的滚动进度检测改写,hash会闪一下
            e.preventDefault()
            e.target.scrollIntoView({behavior: 'smooth'})
        },
        scrollIntoTargetAnchor(e) {
            // 需要preventDefault,直接用锚点跳转加上html{scroll-behavior: smooth},hash会瞬变成目标hash,但是滚动时又会被我写的滚动进度检测改写,hash会闪一下
            e.preventDefault()
            let href = e.target.getAttribute('href').substring(1)
            document.getElementById(href).scrollIntoView({behavior: 'smooth'})
        }
    },
    computed: {
        outlineMarkerTop() {
            let outlineLinkHeight = window.getComputedStyle(document.documentElement).getPropertyValue('--outline-link-height');
            let outlineLinkMarginBottom = window.getComputedStyle(document.documentElement).getPropertyValue('--outline-link-margin-bottom');
            let outlineLinkPaddingTop = window.getComputedStyle(document.documentElement).getPropertyValue('--outline-link-padding-top');
            return parseInt(outlineLinkPaddingTop) + this.activeIndex * (parseInt(outlineLinkHeight) + parseInt(outlineLinkMarginBottom)) + 'px';
        }
    },
    template: `
    <!--这里加个padding-top: 30px，刚开始往下滚动时右边目录会往上动一下，然后sticky住-->
    <div style="display: flex;padding-top: 30px" ref="root">
        <div style="flex: 1 1 75%;">
            <div class="paragraph">
                <h2 class="paragraph-title" id="paragraph-1">
                    <a href="#paragraph-1" class="head-anchor" @click="scrollInto">#</a>
                    段落一
                </h2>
                <div style="height: 500px;background-color: #6fdc6f" class="content">内容</div>
            </div>
            <div class="paragraph">
                <h2 class="paragraph-title" id="paragraph-2">
                    <a href="#paragraph-2" class="head-anchor" @click="scrollInto">#</a>
                    段落二
                </h2>
                <div style="height: 500px;background-color: #6fdc6f" class="content">内容</div>
            </div>
            <div class="paragraph">
                <h2 class="paragraph-title" id="paragraph-3">
                    <a href="#paragraph-3" class="head-anchor" @click="scrollInto">#</a>
                    段落三
                </h2>
                <div style="height: 500px;background-color: #6fdc6f" class="content">内容</div>
            </div>
        </div>
        <div class="aside" style="flex: 1 1 25%;">
            <!--这里手动把catalog高度变高一点，这样滑到最下面时能看到catalog被滑出的效果(因为catalog的包含块的下边界把sticky定位的catalog挤上去了)-->
            <div class="catalog" style="min-height: 600px">
                <a v-for="(title,index) in titles" :key=index :href="'#paragraph-'+(index+1)" :class="{'outline-link': true}" @click="scrollIntoTargetAnchor">{{ title }}</a>
                <div class="outline-marker" :style="{top: this.outlineMarkerTop}"></div>
            </div>
        </div>
    </div>
    `,
    mounted() {
        // 这个通过元素位置判断是否在视口的函数写法参考https://juejin.cn/post/6950471443264045064
        const isElementVisibleExcludeHeader = (el) => {
            const rect = el.getBoundingClientRect()
            const vWidth = window.innerWidth || document.documentElement.clientWidth
            const vHeight = window.innerHeight || document.documentElement.clientHeight
            let headerHeight = window.getComputedStyle(document.documentElement).getPropertyValue('--header-height');
            if (
              rect.right < 0 ||
              // 这里减去header的高度
              rect.bottom - parseInt(headerHeight) < 0 ||
              rect.left > vWidth ||
              rect.top > vHeight
            ) {
              return false
            }
            return true
        }
        let paragraphs = this.$refs.root.querySelectorAll(".paragraph");
        window.addEventListener('scroll', (e) => {
            for (let i = 0; i < paragraphs.length; i++) {
                if (isElementVisibleExcludeHeader(paragraphs[i])) {
                    this.activeIndex = i;
                    window.location.hash = `paragraph${i+1}`
                    break;
                }
            }
        })
    }
}

const contentPanel = {
    template: `
    <div>
        <router-view name="default"></router-view>
    </div>
    `
}

const mainPanel = {
    components: {
        Sidebar: sidebar,
        ContentPanel: contentPanel
    },
    template: `
    <div class="main-panel">
        <Sidebar></Sidebar>
        <!--这里这个margin-bottom: 300px是为了能继续向下滑动，让段落三对应的target能滑到header的位置，更新右侧目录进度-->
        <ContentPanel class="content-panel" style="margin-bottom: 300px"></ContentPanel>
    </div>
    `
}

const app = Vue.createApp({
    components: {
        Header: header,
        MainPanel: mainPanel
    },
    template: `
    <Header></Header>
    <MainPanel></MainPanel>
    `
});

const routes = [
    {
        path: '/title1',
        components: {
            default: content
        }
    },
    {
        path: '/title2',
        components: {
            default: { template: '<div>具体内容在标题1</div>' }
        }
    },
    {
        path: '/title3',
        components: {
            default: { template: '<div>具体内容在标题1</div>' }
        }
    },
    {
        path: '/title4',
        components: {
            default: { template: '<div>具体内容在标题1</div>' }
        }
    },
    {
        path: '/title5',
        components: {
            default: { template: '<div>具体内容在标题1</div>' }
        }
    },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: routes,
})

app.use(router)
app.mount("#app")