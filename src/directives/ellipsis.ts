// directives/ellipsis.ts
import type { App, Directive, DirectiveBinding } from 'vue'

let tooltipDom: HTMLElement

const ellipsisDirective: Directive = {
  mounted(el: HTMLElement, bindings: DirectiveBinding) {
    bindEvent(el, bindings)
  },
  updated(el: HTMLElement, bindings: DirectiveBinding) {
    bindEvent(el, bindings)
  },
  unmounted() {
    removeTooltip()
  },
}

function bindEvent(el: HTMLElement, bindings: DirectiveBinding) {
  // 先移除上一次绑定的事件
  el.removeEventListener('mouseenter', handleMouseEnter)
  el.removeEventListener('mouseleave', removeTooltip)

  if (bindings.value === false) {
    return
  }
  // 给当前元素设置超出隐藏
  el.style.overflow = 'hidden'
  el.style.textOverflow = 'ellipsis'
  el.style.whiteSpace = 'nowrap'

  // 如果超出，绑定鼠标移入移出事件
  if (el.scrollWidth > el.offsetWidth) {
    el.addEventListener('mouseenter', handleMouseEnter)
    // 鼠标移出 将提示信息移除
    el.addEventListener('mouseleave', removeTooltip)
  }
}

/** 鼠标移入事件 */
function handleMouseEnter(evt: MouseEvent) {
  if (!tooltipDom) {
    // 创建浮层元素
    tooltipDom = document.createElement('div')
    // 将浮层插入到body中
    document.body.appendChild(tooltipDom)
  }
  const maxWidth = 600
  let cssText = `
          max-width: ${maxWidth}px;
          overflow: auto;
          position: fixed;
          background: #262627;
          color: #fff;
          border-radius: 4px;
          line-height: 20px;
          padding: 10px;
          display: block;
          font-size: 12px;
          z-index: 99999;
          word-break: break-all;
        `
  // 根据鼠标移入位置判断浮层位于左侧还是右侧，避免遮挡
  if (window.innerWidth - evt.clientX < maxWidth) {
    cssText += `right:${window.innerWidth - evt.clientX}px;`
  } else {
    cssText += `left:${evt.clientX + 20}px;`
  }
  // 根据鼠标移入位置判断浮层位于上方还是下方，避免遮挡
  if (window.innerHeight - evt.clientY < 600) {
    cssText += `bottom:${window.innerHeight - evt.clientY}px;`
  } else {
    cssText += `top:${evt.clientY}px;`
  }

  tooltipDom.style.cssText = cssText
  // 浮层中的文字
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltipDom.innerHTML = (evt?.currentTarget as any)?.innerText ?? ''
}

function removeTooltip() {
  // 隐藏浮层
  if (tooltipDom) {
    tooltipDom.style.display = 'none'
  }
}

export function setupEllipsisDirective(app: App) {
  app.directive('ellipsis', ellipsisDirective)
}
