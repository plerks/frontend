const circularProgress = {
    data() {
        return {
            progressRatio: 0
        }
    },
    computed: {
        computedOffset() {
            // 百分比stroke-offset是相对于viewbox的,这里需要算一下
            return (100 - this.progressRatio) * 2.9516;
        }
    },
    template: `
    <div style="width: 100px;height: 100px;position: relative">
        <svg viewBox="0 0 100 100">
            <circle class="circle-progress-background"
                cx="50" cy="50" r="47"
            ></circle>
            <circle class="circle-progress"
                cx="50" cy="50" r="47"
                :style="{'stroke-dashoffset': computedOffset+'%'}"
            ></circle>
            <text x="50" y="50" fill="#1890ff" text-anchor="middle" alignment-baseline="middle">
                {{ progressRatio==""? '0%' : progressRatio+'%' }}
            </text>
        </svg>
        <input class="input-ratio" v-model="progressRatio"/>
    </div>
    `,
}
const app = Vue.createApp({
    components: {
        CircularProgress: circularProgress
    },
    template: `<CircularProgress/>`
}).mount("#app");
