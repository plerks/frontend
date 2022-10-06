const app = Vue.createApp({
    template: `
    <div class="svg-list">
        <BarsOutline/>
        <Home/>
        <Dot3/>
        <Group/>
        <Tables/>
        <Charts/>
        <Screen/>
        <TriangleDown/>
    </div>
    `
});

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
app.component('BarsOutline', barsOutline)

const home = {
    template: `
    <div class="svg-container">
        <span class="svg-icon-container">
            <svg class="svg-icon home" width="100%" height="100%" viewBox="0 0 1000 1000">
                <path d="M 100 500 L 500 100 L 900 500 A 30 30 0 0 1 857.58 542.42 L 500 184.84 L 142.42 542.42 A 30 30 0 0 1 100 500"/>
                <path d="M 730 330 L 730 100 L 670 100 L 670 270"/>
                <path d="M 200 900 L 200 600 L 500 300 L 800 600 L 800 900 L 600 900 L 600 600 L 400 600 L 400 900 Z"/>
            </svg>
        </span>
        <span class="svg-icon-name">Home</span>
    </div>
    `
}
app.component('Home', home)

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
app.component('Dot3', dot3)

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
app.component('Group', group)

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
app.component('Tables', tables)

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
app.component('Charts', charts)

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
app.component('Screen', screen)

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
app.component('TriangleDown', triangleDown)

app.mount("#app")