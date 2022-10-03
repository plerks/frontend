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
            <!--用这个当锚点，用paragraph-title当锚点的话，段落标题会直接跑到header里被挡住-->
            <div style="height: var(--header-height)" class="paragraph-anchor" id="paragraph-1"></div>
            <h2 class="paragraph-title">
                <a href="#paragraph-1" class="head-anchor">#</a>
                段落一
            </h2>
            <div style="height: 500px;background-color: #6fdc6f">内容</div>
            <div style="height: var(--header-height)" class="paragraph-anchor" id="paragraph-2"></div>
            <h2 class="paragraph-title">
                <a href="#paragraph-2" class="head-anchor">#</a>
                段落二
            </h2>
            <div style="height: 500px;background-color: #6fdc6f">内容</div>
            <div style="height: var(--header-height)" class="paragraph-anchor" id="paragraph-3"></div>
            <h2 class="paragraph-title">
                <a href="#paragraph-3" class="head-anchor">#</a>
                段落三
            </h2>
            <div style="height: 500px;background-color: #6fdc6f">
                内容
            </div>
        </div>
        <div class="aside" style="flex: 1 1 25%;">
            <!--这里手动把catalog高度变高一点，这样滑到最下面时能看到catalog被滑出的效果(因为catalog的包含块的下边界把sticky定位的catalog挤上去了)-->
            <div class="catalog" style="min-height: 600px">
                <a v-for="(title,index) in titles" :key=index :href="'#paragraph-'+(index+1)" :class="{'outline-link': true}">{{ title }}</a>
                <div class="outline-marker" :style="{top: this.outlineMarkerTop}"></div>
            </div>
        </div>
    </div>
    `,
    mounted() {
        let paragraphAnchors = this.$refs.root.querySelectorAll(".paragraph-anchor");
        let headerHeightPx = window.getComputedStyle(document.documentElement).getPropertyValue('--header-height');
        let rootMarginBottom = window.innerHeight - parseInt(headerHeightPx); // 这样实现，按developer tool出来(视口高度变了)，右边目录就会对应不上
        this.options = {
            root: null, // 指定要检查与target交集情况的元素为viewport
            rootMargin: `0px 0px -${rootMarginBottom}px 0px`, // 用负margin将要判断的root矩形压缩到header的矩形位置
            threshold: [0, 0.05, 0.1, 0.15, 0.2] // 触发密集一点
        }

        /* 很奇怪，这样写右侧目录进度显示功能不行：
        let rootMarginBottom = document.body.scrollHeight - parseInt(headerHeightPx);
        let options = {
            root: document, // 换成document.documentElement,document.body也不行
            rootMargin: `0px 0px -${rootMarginBottom}px 0px`,
            threshold: [0, 0.05, 0.1, 0.15, 0.2]
        }
        ,但是这样可以：
        let rootMarginBottom = document.body.scrollHeight - parseInt(headerHeightPx);
        let options = {
            root: document, // 换成document.documentElement,document.body不行
            rootMargin: `0px 0px -90% 0px`,
            threshold: [0, 0.05, 0.1, 0.15, 0.2]
        } */

        let observer = new IntersectionObserver((entries) => {
            for (let i = 0; i < entries.length; i++) {
                // console.log("intersectionRatio为："+entries[i].intersectionRatio)
                // paragraph-anchor触碰到header的位置，就改变activeIndex
                if (entries[i].intersectionRatio > 0) {
                    paragraphAnchors.forEach((paragraphAnchor, index) => {
                        if (paragraphAnchor == entries[i].target) {
                            this.activeIndex = index;
                        }
                    })
                }
            }
        }, this.options);
        this.observer = observer;
        // 目标元素
        let targets = this.$refs.root.querySelectorAll(".paragraph-anchor");
        targets.forEach(t => observer.observe(t));
    },
    unmounted() {
        this.observer.disconnect();
    }
}

const contentPanel = {
    components: {
        Content: content
    },
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