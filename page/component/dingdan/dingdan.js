// page/component/dingdan/dingdan.js
var util = require('../../common/common.js')
var app = getApp()
Page({
  data: {
    info:{},
    endTime:[],
    ddxq:{}
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    var that = this;
    app.getUserInfo(function (personInfo) {          // 获取用户信息
      that.setData({                                  //更新数据
        personInfo: personInfo
      })
    })
    var uid = this.data.personInfo.id;                //获取uid
    
    wx.request({
      url: app.d.hostUrl + '/api/index/info',         // 获取商店名图片 
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res)
          that.setData({
            info: res.data.info
          })
          console.log(that.data.info)
      }
    })
    // 详情接口
    wx.request({
      url: app.d.hostUrl + '/api/order',         //支付接口
      method: 'POST',
      data: {
        uid: uid,                                  //uid
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        
        for (var i = 0; i < res.data.ord.length; i++) {
          res.data.ord[i].addtime= util.toDate(res.data.ord[i].addtime)
          
        }
        // var xq = res
        // console.log(xq)
        that.setData({
          ddxq: res
        })
        console.log(that.data.ddxq)
      }
    })
  },
  quxiao: function (e) {
    const index = e.currentTarget.dataset.index;
    let ddxq = this.data.ddxq;                      //获取购物车
    ddxq.data.ord.splice(index, 1);
    this.setData({
      ddxq: ddxq
    });
    const orderid = e.currentTarget.dataset.id;
    console.log(this.data.personInfo);    
    var uid = this.data.personInfo.id;
    var openid = this.data.personInfo.openid;
    console.log(orderid)
    wx.request({
      url: app.d.hostUrl + '/api/order/del',         //支付接口
      method: 'POST',
      data: {
        uid: uid,                                  //uid
        openid:openid,
        orderid:orderid
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        wx.showToast({
          title: '已删除',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})