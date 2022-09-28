const lazyLoadDemo = {
    data() {
        return {
            picSrc: [
                {src: "static/img/1.jpg", ifShow: false},
                /* 有多张图片时,第二张图片进入视口的判断好像不太灵敏,有时要快到viewport上边界时才触发,不知道为什么,
                   把threshold再调密一点应该有用 */
                // {src: "static/img/2.jpg", ifShow: false}
            ],
            observer: null
        }
    },
    template: `
    <div ref="root">
        <div v-for="(pic, index) in this.picSrc" :ds="index" :key=index class="card pic-lazy-load-container">
           <img v-if="pic.ifShow" :src="pic.src" :class="{'pic-lazy-load': true,'slide-in': pic.ifShow}"/>
        </div>
    </div>
    `,
    mounted() {
        let options = {
            root: null, // 指定要检查与target交集情况的元素为viewport
            rootMargin: '0px',
            threshold: [0, 0.2, 0.75, 1]
        }
        let observer = new IntersectionObserver((entries) => {
            console.log(entries);
            for (var i = 0; i < entries.length; i++) {
                // 回调时entries只会包含触发了threshold的target，不一定是全部被observe了的target
                console.log(i+" "+"intersectionRatio为："+entries[i].intersectionRatio);
                if (entries[i].intersectionRatio >= 0.75) { // intersectionRatio不一定能刚好到1,用0.75的比率作判断
                    /* 用户滑动图片到可视区域,<img>添加到dom中时浏览器会去取src对应的图片,
                       从而实现懒加载(对应src的图片取回来后删除再添加相同src的<img>不会重新请求) */
                    this.picSrc[i].ifShow = true;
                }
                if (entries[i].intersectionRatio <= 0.2) {
                    this.picSrc[i].ifShow = false;
                }
            }
        }, options);
        this.observer = observer;
        // 目标元素
        let targets = this.$refs.root.querySelectorAll(".pic-lazy-load-container");
        targets.forEach(t => observer.observe(t));
    },
    unmounted() {
        this.observer.disconnect();
    }
}
const app = Vue.createApp({
    components: {
        LazyLoadDemo: lazyLoadDemo
    },
    template: `
        <LazyLoadDemo></LazyLoadDemo>
        <LazyLoadDemo></LazyLoadDemo>
    `
}).mount("#app");