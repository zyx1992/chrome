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
