var app = getApp();
Page({
  data: {
    id:"",
    items: [
      { name: '10', value: '美国' ,yid:'1'},
      { name: '20', value: '中国',yid:"2" },
      { name: '10', value: '巴西',yid:"3" },
      { name: '30', value: '日本' ,yid:'4'},
      { name: '40', value: '英国',yid:"5" },
      { name: '10', value: '法国',yid:"6" },
    ],
    yid:'',
    name:'',
    zs:''
  },
  radioChange: function (e) {
   
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      id:e.detail.value,
      // amount: e.detail.value
    })

  },
  dian:function(e){
    const yid = e.currentTarget.dataset.yid;
    const name = e.currentTarget.dataset.name;
    const zs = e.currentTarget.dataset.zs;
    console.log(name)
    this.setData({
      yid: yid,
      name:name,
      zs:zs
    })
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var juanId = options.juanId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/voucher',
      data: { uid: app.d.userId },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var vou = res.data.nouses;
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            vou: vou,
          });
          console.log(that.data.vou)
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        //endInitData
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })

  },
  tiaozhuan: function (e) {
    // console.log(e.currentTarget.dataset.title)
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2] 
    var that=this;
    prevPage.setData({
      yid: that.data.yid,
      yh: that.data.id,
      name: that.data.name,
      zs: that.data.zs
    })
    wx.navigateBack();

    // 第二种方法
    // wx.redirectTo({
    //   url: '../cart2/cart2?id=' + that.data.id + '&yid=' + that.data.yid,
    // })
    // wx.setStorage({
    //   key: 'yhq',
    //   data: that.data.id,
    // })



    // console.log('1')
  }
})