// page/component/ddxq/ddxq.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasList:true,
    state:'',
    orderid:'',
    info:{},
    detail:{},
    togglePrice:'',
    time:'',
    person_num:'',
    zuowei_num:'',
    order_sn:'',
    price_yh:'',
    product_num:'',
    fstate:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
    var state = options.state                       //获取传过来的参数
    var orderid = options.orderid
    var time = options.time
    var togglePrice = options.toggleprice
    var order_sn = options.order_sn
    var price_yh = options.price_yh
    var pnum = options.pnum
    var snum = options.snum
    var product_num = options.product_num
    // if (state==1){                               //判断是否有值
      that.setData({
        state: state,                               //从新赋值优惠
        orderid: orderid, 
        time: time,
        togglePrice: togglePrice,
        price_yh: price_yh,
        order_sn: order_sn,
        person_num: pnum,
        zuowei_num: snum,
        product_num: product_num
      }) 
    // }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    // var person_num = wx.getStorageSync('person_num', that.data.zid);
    // var zuowei_num = wx.getStorageSync('zuowei_num', that.data.zid);
    // console.log(person_num)
    // that.setData({
    //   person_num: person_num,
    //   zuowei_num: zuowei_num,
    // })
    console.log(that.data.state)
    console.log(that.data.orderid)
    app.getUserInfo(function (personInfo) {          //调用应用实例的方法获取全局数据
      that.setData({                                  //更新数据
        personInfo: personInfo
      })
    })
    var uid = this.data.personInfo.id;
    var openid = this.data.personInfo.openid;
    console.log(uid)
    wx.request({
      url: app.d.hostUrl + '/api/index/info',
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        that.setData({
          info:res.data.info
        })
      }
    })
    wx.request({
      url: app.d.hostUrl + '/api/order/order_details',
      method: 'POST',
      data: {
        uid: uid,                                  //uid
        orderid: that.data.orderid,
        openid: openid
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res)
        that.setData({
          detail: res.data.pro
        })
      }
    })
  },
  toPay:function(){
    this.setData({
      fstate: true
    })
    var that=this
    var uid = this.data.personInfo.id;
    var openid = this.data.personInfo.openid;
    console.log(this.data.orderid, openid, uid, this.data.order_sn) 
    wx.request({
      url: app.d.hostUrl + '/api/pay/pay',         //支付接口
      method: 'POST',
      data: {
        uid: uid,                                  //uid
        openid: openid,                            //openid
        order_id: this.data.orderid,           //order_id
        order_sn: this.data.order_sn            //order_sn
      },
      header: {
        
          'Content-Type': 'application/x-www-form-urlencoded' // 默认值
       
      },
      success: function (res) {
        console.log(res)
        wx.requestPayment(
          {
            'timeStamp': res.data.arr.timeStamp,
            'nonceStr': res.data.arr.nonceStr,
            'package': res.data.arr.package,
            'signType': 'MD5',
            'paySign': res.data.arr.paySign,
            'success': function (res) {
              that.setData({
                fstate: false
              })
              // 跳转到订单页面
              wx.switchTab({
                url: "../index"
              })
            },
            'fail': function (res) {
              // wx.switchTab({
              //   url: "../index"
              // })
              that.setData({
                fstate: false
              })
            },
            'complete': function (res) { }
          })
      }
    })
  }

  

 

  
})