// 来自"/svg-icons"
const copy = {
    template: `
    <svg class="svg-icon copy" width="100%" height="100%" viewBox="0 0 16 16">
        <path d="M 2 6 L 6 6 L 6 7.5 L 2.5 7.5 A 1 1 0 0 0 1.5 8.5 L 1.5 13.5 A 1 1 0 0 0 2.5 14.5 L 7.5 14.5 A 1 1 0 0 0 8.5 13.5 L 8.5 8.5
        L 10 8.5 L 10 14 A 2 2 0 0 1 8 16 L 2 16 A 2 2 0 0 1 0 14 L 0 8 A 2 2 0 0 1 2 6
        "/>
        <path fill-rule="evenodd" d="M 8 0 h 6 A 2 2 0 0 1 16 2 L 16 8 A 2 2 0 0 1 14 10 L 8 10 A 2 2 0 0 1 6 8 L 6 2 A 2 2 0 0 1 8 0
                M 8.5 1.5 L 13.5 1.5 A 1 1 0 0 1 14.5 2.5 L 14.5 7.5 A 1 1 0 0 1 13.5 8.5 L 8.5 8.5 A 1 1 0 0 1 7.5 7.5 L 7.5 2.5 A 1 1 0 0 1 8.5 1.5
        "/>
    </svg>
    `
}

// 来自"/svg-icons"
const loading = {
    template: `
    <svg viewBox="0 0 16 16">
        <circle class="circle-progress-background" cx="8" cy="8" r="7"/>
        <circle class="circle-progress" cx="8" cy="8" r="7"/>
    </svg>
    `
}

// 来自"/svg-icons"
const finish = {
    template: `
    <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" stroke-width="2" fill="none" stroke="green"/>
        <polyline class="finish" points="3.7,8 7,11.5 11.7,5.7" stroke-width="2" fill="none" stroke="green" stroke-linecap="round"/>
    </svg>
    `
}

// 来自"/svg-icons"
const error = {
    template: `
    <svg class="svg-icon" width="100%" height="100%" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" stroke-width="2" fill="none" stroke="#ab1313"/>
        <line x1="8" y1="3" x2="8" y2="10" stroke-width="2" stroke="#ab1313"/>
        <circle cx="8" cy="12" r="1" fill="#ab1313"/>
    </svg>
    `
}

const codeFragment = {
    data() {
        return {
            copyStatus: "Copy",
        }
    },
    components: {
        Copy: copy,
        Loading: loading,
        Finish: finish,
        Error: error
    },
    template: `
    <div class="code-fragment" ref="root">
        <div class="header">
            <span>5 lines</span>
            <span style="width: 20px;height: 20px;margin-left: 3px;">
                <component :is="copyStatus" @click="copy"/>
            </span>
        </div>
        <div class="content" ref="content">
        </div>
    </div>
    `,
    mounted() {
        let contentTemplate = `
        <table style="white-space: pre">
            <tbody>
                <tr>
                    <td class="line-number">1</td>
                    <td><span class="red">public</span> <span class="red">class</span> <span>Test</span> <span>{</span></td>
                </tr>
                <tr>
                    <td class="line-number">2</td>
                    <td>    <span class="red">public</span> <span class="red">static</span> <span>void</span> <span class="purple">main</span><span>(String[] args) {</span></td>
                </tr>
                <tr>
                    <td class="line-number">3</td>
                    <td>        <span>System.out.</span><span class="purple">println(</span><span class="blue">"test"</span><span>);</span></td>
                </tr>
                <tr>
                    <td class="line-number">4</td>
                    <td>    <span>}</span></td>
                </tr>
                <tr>
                    <td class="line-number">5</td>
                    <td><span>}</span></td>
                </tr>
            </tbody>
        </table>
        `
        /*
        必须通过js写innerHTML，而且要设置white-space: pre，否则实际dom中有空格，但是会不显示。
        直接写在vue的template里无法避免多个空格被浏览器变成一个的问题(甚至<td>    <span>的空格一个都没了)，而且不能用&nbsp;，
        否则复制出来会是nbsp(U+00a0)，不是空格。
        */
        this.$refs.content.innerHTML = contentTemplate
    },
    methods: {
        copy() {
            this.copyStatus = "Loading"
            let codeTags = this.$refs.root.querySelectorAll(".content td:not(.line-number)")
            let lines = []
            codeTags.forEach(e => {lines.push(e.innerText)})
            navigator.clipboard.writeText(lines.join("\n"))
            .then(() => {
                /* 此时已经完成复制，不过这里仿照github做个动画，等Loading的动画完(1.2s)后再转为Finish,此时再等1.5s(Finish的动画(1s)足够完成了)再回到开始的Copy状态。
                   github要做这个动画应该是因为github点复制时获取复制内容是通过发个请求，需要等待响应，不像直接从页面上获取一般能瞬时完成。 */
                setTimeout(() => {
                    this.copyStatus = "Finish"
                    setTimeout(() => {
                        this.copyStatus = "Copy"
                    }, 1500)
                }, 1200)
            })
            .catch(() => {
                setTimeout(() => {
                    this.copyStatus = "Error"
                    setTimeout(() => {
                        this.copyStatus = "Copy"
                    }, 1500)
                }, 1200)
            })
        }
    }
}

const app = Vue.createApp({
    components: {
        CodeFragment: codeFragment
    },
    template: `<CodeFragment/>
    `
}).mount("#app");
