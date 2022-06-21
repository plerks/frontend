const commonTable = {
    data() {
        return {
          items: ['BSD 4-Clause',
          'MIT License',
          '“Commons Clause” License Condition v1.0',
          'GNU General Public License v3.0 or later',
          'Creative Commons Attribution 4.0 International',
          'Artistic-2.0'],
          // 存模板引用
          contents: [],
          // 对应的模板引用是否需要tooltip-text
          ifShowTooltipText: []
        }
    },
    mounted() {
        for(let i=0;i<this.contents.length;i++) {
            this.ifShowTooltipText[i] = (this.contents[i].clientWidth < this.contents[i].scrollWidth)
        }
    },
    template: `
<div style="width: 80%;">
    <div class="card">
      <div class="card-body">
          <table class="common-table">
              <thead>
                <tr>
                    <th style="width: 20%">
                      1
                    </th>
                    <th style="width: 20%">
                      2
                    </th>
                    <th style="width: 20%">
                      3
                    </th>
                    <th style="width: 20%">
                      4
                    </th>
                    <th style="width: 20%">
                      5
                    </th>
                    <th style="width: 20%">
                      6
                    </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                    <!-- 简便起见，这里改成循环td而非tr -->
                    <td v-for="(item,index) in items">
                      <div class="tooltip" style="display: inline-flex;max-width: 100%;">
                        <span class="tooltip-text" v-if="ifShowTooltipText[index]">{{item}}</span>
                        <span class="overflow-text-ellipsis" :ref="el => { if(el) { contents[index] = el; } }">{{item}}</span>
                      </div>
                    </td>
                </tr>
              </tbody>
          </table>
      </div>
    </div>
</div>`
}
const app = Vue.createApp({
    components: {
        CommonTable: commonTable
    },
    template: `<CommonTable></CommonTable>`
}).mount("#app");

/*
实现只有文本发生溢出时才有tooltip-text的主要思路是循环的时候把对应的dom节点的ref存起来，然后mounted之后(这时候才更新到了实际dom中，
才能获取width)，判断元素clientWidth和scrollWidth大小，从而知道是否溢出，然后决定是否要有tooltip-text。

缩小浏览器窗口宽度，可能原本没有发生文本溢出的span出现文本溢出，这时候对于Vue，新的文本溢出的span不会有tooltip-text。
不过Angular的检测更新能力似乎要更强一点，在Angular里这样写：

<tr *ngFor="let license of licenseList;">
    <td>
        <div class="tooltip" style="display: inline-flex;max-width: 100%;">
            <span class="overflow-text-ellipsis" #fullName>{{license.name}}</span>
            <span class="tooltip-text" *ngIf="isEllipsisActive(fullName)">{{license.name}}</span>
        </div>
    </td>
    <!-- 其它td -->
    <td>...</td>
    <td>...</td>
</tr>

isEllipsisActive(e: any) {
    return (e.clientWidth < e.scrollWidth);
}

不仅能实现tooltip-text的按需出现，浏览器窗口宽度缩小时，新的发生文本溢出的span也会被添加上tooltip-text，
应该是Vue和Angular原理实现导致的差别。此外，Angular这里循环里都是用的fullName作为引用名也没有导致问题，
甚至overflow-text-ellipsis和tooltip-text顺序对换也没有导致问题，可能ngFor的每次循环都有一个单独的作
用域(https://angular.io/guide/template-reference-variables#template-variable-scope)？
*/