//获取网站的数据
var Html = {
  getHtml: function (url, try_times, callback) {
    $.ajax({
      url: url,
      type: 'GET',
      timeout: 30000,
      data: {},
      success: function (data) {//从网站获取到的数据作为参数给回调函数
        alert(data)
        typeof(data) == 'object' && (data = JSON.stringify(data))
        callback({html: data})
      },
      complete: function (XMLHttpRequest, status) {//请求完成之后执行
        // console.log(XMLHttpRequest,status)
        if (status == 'timeout') {//超过3次，取回的数据为空
          try_times >= 3 ? callback({html: ''}) :
            setTimeout(function () {
              Html.getHtml(url, try_times + 1, callback)
            }, 5000)
        }
        else if (status == 'error') {
          try_times >= 3 ? callback({html: ''}) :
            setTimeout(function () {
              Html.getHtml(url, try_times + 1, callback)
            }, 5000)
        }
        else if (status == 'parsererror') {
          var data = XMLHttpRequest.responseText
          callback({html: data})
        }
      }
    })
  }
}

const getRes = function (res) {
  console.log('===res', res)
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    sendResponse('get success')
    //  发送请求抓取页面
    if (req.action === 'server') {
      console.log('=====get')
      Html.getHtml(req.url, 1, (data) => {
        let content = data.html
        if (content) {
          data.list = []
          content = content.replace(new RegExp('\\("', 'gm'), '')	// 去掉开始的 (" 符号
          content = content.replace(new RegExp('"\\)', 'gm'), '')	// 去掉最后的 ") 符号
          content = content.replace(new RegExp('\\\\', 'gm'), '')	// 去掉多余的"\"符号，要不然解析不了     ue=\"303690936\">
          data.html = content
          var div = $('<div></div>')
          div.html(data.html)
          div.find('.j-select').each(function(i) {
            let list = $(this).find('.j-list-sku .price') || []
            list.each(function() {
              data.list[i] = data.list[i] || []
              data.list[i].push(this.innerHTML)
            })
          })
        }else {
          data.list = []
        }
        // 发送通知给content
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, data, res => {
            console.log(res)
          })
        })
      })
    }
  }
)
