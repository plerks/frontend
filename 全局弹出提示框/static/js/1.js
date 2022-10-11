const app = Vue.createApp({
    template: `<button class="button" @click="this.$notice('复制操作已完成')">点击提示</button>
    `,
})

// 注册一个全局的属性，所有组件都能直接调this.$notice()
app.config.globalProperties.$notice = (s) => {
    const template = `
    <span class="notice">${s}</span>
    `
    document.body.insertAdjacentHTML("afterbegin", template)
    let noticeElement = document.body.querySelector('.notice')
    setTimeout(() => {
        noticeElement.parentNode.removeChild(noticeElement)
    }, 3000)
}

app.mount("#app");