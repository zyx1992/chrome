function injectCustomJs(jsPath) {
  console.log('==injext')
  jsPath = jsPath || 'js/context.js'
  var temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  // ��õĵ�ַ���ƣ�chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  temp.src = chrome.extension.getURL(jsPath)
  temp.onload = function () {
    // ����ҳ�治�ÿ���ִ������Ƴ���
    this.parentNode.removeChild(this)
  }
  document.head.appendChild(temp)
}

injectCustomJs()
