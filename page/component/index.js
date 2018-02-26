var app = getApp()
// var common = require('common.js')
Page({
  data: {
    list:[],                                            //首页信息接口
    imgUrls: [
      '/image/b1.jpg',
      '/image/b2.jpg',
      '/image/b3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    ctzq: {},                                           //商店信息
  },
  // 地址
  watchAddress: function () {
    wx.openLocation({
      latitude: this.data.ctzq.info.newlat,                  // 纬度，范围为-90~90，负数表示南纬
      longitude: this.data.ctzq.info.newlng,                 // 经度，范围为-180~180，负数表示西经
      scale: 28,                                             // 缩放比例
      name: this.data.ctzq.info.newaddress,                  // 位置名
      address: this.data.ctzq.info.newtite,                  // 地址的详细说明
      success: function (res) {
      },
    })
  },
  // 电话
  calling: function () {
    console.log(this.data.ctzq.info.tel)
    wx.makePhoneCall({
      phoneNumber: this.data.ctzq.info.tel,                 //此号码并非真实电话号码，仅用于测试  
    })
  },
  onShow:function(){
    var that=this;
    wx.request({
      url: app.d.hostUrl + '/api/index/index',              // 首页信息
      header: {
        'content-type': 'application/json'                  // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data,                                   //首页信息
        })
        console.log(that.data.list)
      }
    })
    var sdxq = wx.getStorageSync('sdxq')                    //获取商店信息
    that.setData({
      ctzq: sdxq                                            //赋值
    })
    // wx.request({
    //   url: app.d.hostUrl + '/api/index/info',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       ctzq: res.data
    //     })
    //   }
    // })
    
  },
  onLoad:function(){
    wx.setStorage({
      key: 'l',
      data: '123',
      key:"2",
      data:"1234"
    })
  },
  onShareAppMessage: function () {
    return {
      title: '美食',
      path: '/pages/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
  
})