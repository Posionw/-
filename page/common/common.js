
var app = getApp()

function shopXq(){
  var a;
  wx.request({
    url: app.d.hostUrl + '/api/index/index',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      res.data
      a = res.data
      console.log(a)
    }
  })
 
  return a;
}
//获取当前时间
function getTime() {
  var time = new Date();
  //时  
  var h = time.getHours();
  //分  
  var m = time.getMinutes();
  if (m < 10) {
    m = "0" + m;
  }
  //天
  var date = time.getDate(); 
  if (date < 10) {
    date = "0" + date;
  }
  //年
  var year = time.getFullYear();
  if (year < 10) {
    year = "0" + year;
  }
  //月
  var month = time.getMonth() + 1; 
  if (month < 10) {
    month = "0" + month;
  }
  //秒
  var s = time.getSeconds();
  if (s < 10) {
    s = "0" + s;
  }
  time =year+"-"+month+"-"+date+" "+ h + ":" + m + ":" + s;
  return time
}
// 全局信息
function qjsj(){
  var b;
  wx.request({
    url: app.d.hostUrl + '/api/Cate/all',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log(res)
      b=res
    }
  })
  
  return b;
}
function toDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()+' ';
  var S = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()+':';
  var F = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()+':';
  var A = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return (Y + M + D + S + F + A)
}  
module.exports = {
  shopXq: shopXq(),
  getTime: getTime(),
  qjsj:qjsj(),
  toDate: toDate
}