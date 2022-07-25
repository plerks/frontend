const linearProgress = {
    data() {
        return {
            progressRatio: 50
        }
    },
    template: `
    <div style="width: 200px;height: 10px;position: relative;">
        <!-- 这个不用svg就能比较方便地实现 -->
        <div class="linear-progress-background"></div>
        <div class="linear-progress" :style="{width: progressRatio==''? '0%': progressRatio+'%'}"></div>
        <input class="input-ratio" v-model="progressRatio"/>
    </div>
    `,
}
const app = Vue.createApp({
    components: {
        LinearProgress: linearProgress
    },
    template: `<LinearProgress/>`
}).mount("#app");
