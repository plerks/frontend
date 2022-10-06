const barsOutline = {
    template: `
        <svg class="header-outline-icon" viewBox="0 0 1000 1000">
            <path class="bars-outline" d="M 300 250 l 700 0 M 300 500 l 700 0 M 300 750 l 700 0"/>
        </svg>
    `
}

const header = {
    components: {
        BarsOutline: barsOutline
    },
    template: `
    <div class="header flex-between">
        <div sidebar-closed="false" ref="headerStretch" class="header-stretch">
            <BarsOutline @click="sidebarExpandSwitch()"/>
        </div>
        <div class="header-content flex-between align-center">
            <input class="search" placeholder="Search"/>
            <img class="icon" src="static/img/1.jpg"/>
        </div>
    </div>
    `,
    methods: {
        sidebarExpandSwitch() {
            let sidebar = document.querySelector('.sidebar')
            let headerStretch = this.$refs.headerStretch
            let contentPanel = document.querySelector('.content-panel')
            // sidebar.getAttribute获得的是字符串，不是布尔值
            if (headerStretch.getAttribute('sidebar-closed') == "true") {
                headerStretch.setAttribute('sidebar-closed', "false");
                sidebar.setAttribute('sidebar-closed', "false");
                document.documentElement.style.setProperty('--sidebar-current',
                    window.getComputedStyle(document.documentElement).getPropertyValue('--sidebar-opened'));
            }
            else {
                headerStretch.setAttribute('sidebar-closed', "true");
                sidebar.setAttribute('sidebar-closed', "true");
                document.documentElement.style.setProperty('--sidebar-current',
                    window.getComputedStyle(document.documentElement).getPropertyValue('--sidebar-closed'));
            }
        }
    }
}

// 折叠动画实现来自"/折叠面板"
const userInfo = {
    data() {
        return {
            expanded: false
        }
    },
    template: `
    <div class="user-info" @click="expand()">
        <img class="icon" src="static/img/1.jpg" style="margin-right: 15px;display: inline-block"/>
        <span class="to-be-hidden" style="display: inline-flex;flex-direction: column;justify-content: flex-start;margin-right: 15px">
            <span style="font-size: 13px">Username</span>
            <span style="font-size: 13px;font-weight: 500;color: rgb(85,85,85);">Self introduction</span>
        </span>
    </div>
    <div class="to-be-hidden" style="overflow: hidden;border-bottom: 1px solid rgba(222, 222, 222, 0.5)">
        <transition
            @beforeEnter="beforeEnter"
            @enter="enter"
            @afterEnter="afterEnter"
            @beforeLeave="beforeLeave"
            @leave="leave"
            @afterLeave="afterLeave"
        >
            <div v-show="expanded" style="padding: 0 15px">
                <div style="font-size: 13px;color: rgba(60, 60, 60, 0.7);line-height: 25px">Self Profile</div>
                <div style="font-size: 13px;color: rgba(60, 60, 60, 0.7);line-height: 25px/* margin-bottom: 5px 这里有margin的话动画结尾就会卡一下,很怪 */">Settings</div>
            </div>
        </transition>
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
            el.style.height = el.scrollHeight + 'px';
        },
        afterEnter(el) {
            el.classList.remove('collapse-transition')
            el.style.height = '';
        },
        beforeLeave(el) {
            el.style.height = el.scrollHeight + 'px';
        },
        leave(el) {
            el.classList.add('collapse-transition');
            el.style.height = '0';
        },
        afterLeave(el) {
            el.classList.remove('collapse-transition');
            el.style.height = '';
        }
    }
}

// base,tables这几个组件重复度很高，可以重构一下，这里不管
const base = {
    data() {
        return {
            expanded: false
        }
    },
    template: `
    <div class="navbar-item" @click="expand()">
        <span style="width: 20px;height: 20px;">
            <svg class="svg-icon title-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 100 370 L 500 170 L 900 370 L 500 570"/>
                <path d="M 500 610 L 100 410 L 100 490 L 500 690 L 900 490 L 900 410"/>
                <path d="M 500 730 L 100 530 L 100 610 L 500 810 L 900 610 L 900 530"/>
            </svg>
        </span>
        <span class="to-be-hidden navbar-item-title">Base</span>
        <svg class="svg-icon to-be-hidden" width="13" height="13" viewBox="0 0 1000 1000" :style="{rotate: this.expanded==true?'0deg':'-90deg'}">
            <path d="M 200 326.8 L 800 326.8 L 500 846.4"/>
        </svg>
    </div>
    <div class="to-be-hidden" style="overflow: hidden;">
        <transition
            @beforeEnter="beforeEnter"
            @enter="enter"
            @afterEnter="afterEnter"
            @beforeLeave="beforeLeave"
            @leave="leave"
            @afterLeave="afterLeave"
        >
            <div v-show="expanded" style="padding: 0 35px">
                <div class="navbar-links">Base1</div>
                <div class="navbar-links">Base2</div>
            </div>
        </transition>
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
            el.style.height = el.scrollHeight + 'px';
        },
        afterEnter(el) {
            el.classList.remove('collapse-transition')
            el.style.height = '';
        },
        beforeLeave(el) {
            el.style.height = el.scrollHeight + 'px';
        },
        leave(el) {
            el.classList.add('collapse-transition');
            el.style.height = '0';
        },
        afterLeave(el) {
            el.classList.remove('collapse-transition');
            el.style.height = '';
        }
    }
}

const tables = {
    data() {
        return {
            expanded: false
        }
    },
    template: `
    <div class="navbar-item" @click="expand()">
        <span style="width: 20px;height: 20px;">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 100 250 A 120 120 0 0 1 220 130 h 560 A 120 120 0 0 1 900 250"/>
                <path d="M 100 250 L 100 810 A 60 60 0 0 0 160 870 L 160 250"/>
                <path d="M 900 250 L 900 810 A 60 60 0 0 1 840 870 L 840 250"/>
                <path d="M 160 810 L 840 810 L 840 870 L 160 870"/>
                <path d="M 160 530 L 840 530 L 840 590 L 160 590"/>
                <path d="M 470 250 L 530 250 L 530 810 L 470 810"/>
            </svg>
        </span>
        <span class="to-be-hidden navbar-item-title">Tables</span>
        <svg class="svg-icon to-be-hidden" width="13" height="13" viewBox="0 0 1000 1000" :style="{rotate: this.expanded==true?'0deg':'-90deg'}">
            <path d="M 200 326.8 L 800 326.8 L 500 846.4"/>
        </svg>
    </div>
    <div class="to-be-hidden" style="overflow: hidden;">
        <transition
            @beforeEnter="beforeEnter"
            @enter="enter"
            @afterEnter="afterEnter"
            @beforeLeave="beforeLeave"
            @leave="leave"
            @afterLeave="afterLeave"
        >
            <div v-show="expanded" style="padding: 0 35px">
                <div class="navbar-links">Table1</div>
                <div class="navbar-links">Table2</div>
            </div>
        </transition>
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
            el.style.height = el.scrollHeight + 'px';
        },
        afterEnter(el) {
            el.classList.remove('collapse-transition')
            el.style.height = '';
        },
        beforeLeave(el) {
            el.style.height = el.scrollHeight + 'px';
        },
        leave(el) {
            el.classList.add('collapse-transition');
            el.style.height = '0';
        },
        afterLeave(el) {
            el.classList.remove('collapse-transition');
            el.style.height = '';
        }
    }
}

const charts = {
    data() {
        return {
            expanded: false
        }
    },
    template: `
    <div class="navbar-item" @click="expand()">
        <span style="width: 20px;height: 20px;">
            <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 170 170 L 170 770 A 60 60 0 0 0 230 830 L 830 830 L 830 770 L 230 770 L 230 170"/>
                <path d="M 305 670 L 305 470 L 380 470 L 380 670"/>
                <path d="M 455 670 L 455 270 L 530 270 L 530 670"/>
                <path d="M 605 670 L 605 370 L 680 370 L 680 670"/>
                <path d="M 755 670 L 755 270 L 830 270 L 830 670"/>
            </svg>
        </span>
        <span class="to-be-hidden navbar-item-title">Charts</span>
        <svg class="svg-icon to-be-hidden" width="13" height="13" viewBox="0 0 1000 1000" :style="{rotate: this.expanded==true?'0deg':'-90deg'}">
            <path d="M 200 326.8 L 800 326.8 L 500 846.4"/>
        </svg>
    </div>
    <div class="to-be-hidden" style="overflow: hidden;">
        <transition
            @beforeEnter="beforeEnter"
            @enter="enter"
            @afterEnter="afterEnter"
            @beforeLeave="beforeLeave"
            @leave="leave"
            @afterLeave="afterLeave"
        >
            <div v-show="expanded" style="padding: 0 35px">
                <div class="navbar-links">Chart1</div>
                <div class="navbar-links">Chart2</div>
            </div>
        </transition>
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
            el.style.height = el.scrollHeight + 'px';
        },
        afterEnter(el) {
            el.classList.remove('collapse-transition')
            el.style.height = '';
        },
        beforeLeave(el) {
            el.style.height = el.scrollHeight + 'px';
        },
        leave(el) {
            el.classList.add('collapse-transition');
            el.style.height = '0';
        },
        afterLeave(el) {
            el.classList.remove('collapse-transition');
            el.style.height = '';
        }
    }
}

const sidebar = {
    components: {
        UserInfo: userInfo,
        Base: base,
        Tables: tables,
        Charts: charts
    },
    template: `
    <div sidebar-closed="false" class="sidebar h-scrollbar">
        <UserInfo></UserInfo>
        <router-link to="/base" class="title"><Base/></router-link>
        <router-link to="/tables" class="title"><Tables/></router-link>
        <router-link to="/charts" class="title"><Charts/></router-link>
    </div>
    `
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
        <ContentPanel class="content-panel"></ContentPanel>
    </div>
    `
}

const { computed } = Vue;
const app = Vue.createApp({
    components: {
        Header: header,
        MainPanel: mainPanel
    },
    data() {
        return {
            isExpanded: true
        }
    },
    provide() {
        return {
            isExpanded: computed(() => this.isExpanded)
        }
    },
    template: `
    <Header></Header>
    <MainPanel></MainPanel>
    `
});

const routes = [
    {
        // 这里是"/伸缩侧边栏/1.html",用VSCode live server打开时的url,重定向到/base
        path: '/%E4%BC%B8%E7%BC%A9%E4%BE%A7%E8%BE%B9%E6%A0%8F/1.html',
        components: {
            default: { template: '<div>url opened with live server</div>' }
        },
        redirect: '/base'
    },
    {
        path: '/base',
        components: {
            default: { template: '<div>base</div>' }
        }
    },
    {
        path: '/tables',
        components: {
            default: { template: '<div>tables</div>' }
        }
    },
    {
        path: '/charts',
        components: {
            default: { template: '<div>charts</div>' }
        }
    }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: routes,
})

app.use(router)
app.mount("#app")