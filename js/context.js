$(document).ready(() => {
  console.log('===brn', $(document).find('a'))
  let body =  $('#mBtn').context.body
  console.log('===d', $(document))
  $('#mBtn').context.body.click(() => {
    console.log('==body')
  })
  this.$('#mBtn').click(() => {
    let url = $('#mHref').val()
    chrome.runtime.sendMessage({
      url: url,
      action: 'server'
    }, res => {
      // 答复
    })
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      let html = request || {}
      console.log('==res', html)
      $('#mMain').html(html.list)
      sendResponse('receive success')
    })
  })
})
