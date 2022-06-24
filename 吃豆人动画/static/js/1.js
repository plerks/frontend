const pacman = {
    template: `
    <div class="pacman">
        <div class="before"></div>
        <div class="after"></div>
    </div>
    `
}
const dots = {
    data() {
        return {
            dotNum: 5
        }
    },
    template: `
    <div class="dots"></div>
    `
}
const app = Vue.createApp({
    components: {
        pacman,
        dots
    },
    template: `
    <pacman></pacman>
    <dots></dots>
    `
}).mount("#app");