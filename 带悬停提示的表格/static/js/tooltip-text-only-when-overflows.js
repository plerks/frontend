// 比较clientWidth和scrollWidth,判断文本是否有溢出,如果没有,就不需要tooltip-text提示
let contents = document.querySelectorAll(".common-table tbody tr td .overflow-text-ellipsis");
let tooltipTexts = document.querySelectorAll(".common-table tbody tr td .tooltip-text");
/* tooltipTexts是个NodeList,如果从0到contents.length - 1遍历,因为删除tooltipTexts元素后右侧的元素往左靠,tooltipTexts.length减一,
最终i会溢出tooltipTexts下标,需要额外处理 */
for(let i = contents.length - 1; i >= 0; i--) {
  if(!(contents[i].clientWidth < contents[i].scrollWidth)) {
    tooltipTexts[i].remove();
  }
}