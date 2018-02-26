// page/component/detail/detail.js
var app = getApp();
Page({
  data: {
    carts: [],                                           //全局数据
    gid:'',                                              //商品id
    current:'',                                          //类型id
    pic:'',                                              //商品图片
    price:'', 
    name:'',                                           //商品价格
    num:'',                                              //数量
    z_price:'',
    z_type:[],
    g_type:''                                           //总价格
  },
  onShow: function () {
    var that=this;
    var arr = wx.getStorageSync('goodlistdata')
    console.log(arr)
    
    this.setData({
      carts:arr
    })
   
    var g = this.data.price * this.data.num               //初始化总价格
    that.setData({
      z_price: g
    })
    
  },
 
  onLoad: function (options) {
    var that=this
    that.setData({
      gid: options.gid,                                   //获取gid
      current:options.current                             //获取类型id
    }) 
    var gid = this.data.gid;
    var current = this.data.current;

    // 为菜品详情接口
    // wx.request({
    //   url: app.d.ceshiUrl + '/api/Cate/index',
    //   method: 'post',
    //   data: { id: gid },
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     console.log(res.data.info[0].photo_x)
    //   }
    // })




    // 修改存缓存
    var arr = wx.getStorageSync('goodlistdata')           //获取全局缓存
    for (var i in arr.type) {
      if (arr.type[i].tid == current) {                   //判断类型id相同
        for (var j in arr.type[i].goods) {
          if (arr.type[i].goods[j].gid == gid) {          //判断商品id相同
           var a = arr.type[i].goods[j].pic               //赋值图片
           var b = arr.type[i].goods[j].currentPrice      //赋值价格
           var c = arr.type[i].goods[j].num               //赋值数量
           var d = arr.type[i].goods[j].type              //赋值类型
           var e = arr.type[i].goods[j].name              //赋值名字
           this.setData({
             pic:a,
             price:b,
             num:c,
             z_type:d,
             name:e
           })
          }
        }
      }
    }  
    console.log(that.data.z_type.length)
  },
  // 打印选择
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var aa = e.detail.value
    this.setData({
      g_type: aa
    })
    console.log(this.data.g_type)
  },
  // go
  go(e){
    const current = e.currentTarget.dataset.current;        //获取类型id
    let gid = e.currentTarget.dataset.gid;                  //获取商品id
    let num = this.data.num;                                //数量
    // num = num + 1;
    // this.setData({
    //   num: num
    // })
    var arr = wx.getStorageSync('goodlistdata')             //获取全局缓存
    for (var i in arr.type) {
      if (arr.type[i].tid == current) {                     //判断类型id相同
        for (var j in arr.type[i].goods) {
          if (arr.type[i].goods[j].gid == gid) {            //判断商品id相同
            arr.type[i].goods[j].num = num                  //赋值数量
            var rr = arr.type[i].goods[j]                  //获取此商品
          }
        }
      }
    }
    wx.setStorageSync('goodlistdata', arr)                  //从新存储全局缓存

    var g = this.data.price * this.data.num                 //计算总价格
    this.setData({
      z_price: g                                            //从新赋值价格
    })
    console.log(g)
    this.buyNow(rr)
    var person_num = wx.getStorageSync('person_num');
    var zuowei_num = wx.getStorageSync('zuowei_num');

    console.log(person_num)
    if (person_num =='') {
      console.log('111')
      wx.switchTab({ url: "../diancan/diancan" })
    }else{
      wx.navigateTo({ url: "../liebiao2/liebiao2" })
    }


  },
  // 点击添加按钮
  addCount(e) {
    const current = e.currentTarget.dataset.current;        //获取类型id
    let gid = e.currentTarget.dataset.gid;                  //获取商品id
    let num = this.data.num;                                //数量
    num = num + 1;
    this.setData({
      num:num
    })
    var arr = wx.getStorageSync('goodlistdata')             //获取全局缓存
    for (var i in arr.type) {
      if (arr.type[i].tid == current) {                     //判断类型id相同
        for (var j in arr.type[i].goods) {        
          if (arr.type[i].goods[j].gid == gid) {            //判断商品id相同
            arr.type[i].goods[j].num = num                  //赋值数量
             var rr = arr.type[i].goods[j]                  //获取此商品
          }
        }
      }
    }
    wx.setStorageSync('goodlistdata', arr)                  //从新存储全局缓存

    var g = this.data.price * this.data.num                 //计算总价格
    this.setData({
      z_price: g                                            //从新赋值价格
    })
    console.log(g)
    this.buyNow(rr)                                         //调用购物车函数
  },
  // 减少
  minusCount(e) {
    const current = e.currentTarget.dataset.current;        //获取类型id
    let gid = e.currentTarget.dataset.gid;                  //获取商品id
    let num = this.data.num;                                //数量
    if (num <= 0) {
      return false;
    }
    num = num - 1;
    this.setData({
      num: num
    })
    
    var arr = wx.getStorageSync('goodlistdata')             //获取全局缓存
    console.log(arr.type)
    for (var i in arr.type) {
      console.log(i)
      if (arr.type[i].tid == current) {                     //判断类型id相同
        for (var j in arr.type[i].goods) {
          if (arr.type[i].goods[j].gid == gid) {            //判断商品id相同
            arr.type[i].goods[j].num = num                  //赋值数量
            var rr = arr.type[i].goods[j]                   //获取此商品
          }
        }
      }
    }
    console.log(rr)
    wx.setStorageSync('goodlistdata', arr)                  //从新存储全局缓存
    var g = this.data.price * this.data.num                 //计算总价格
    this.setData({
      z_price: g                                            //从新赋值价格
    })
    this.buyNow(rr)                                         //调用购物车函数
  },
  buyNow: function (a) {
    console.log(this.data.goodData)
    let goods = a                                           // 此商品
    let num = goods.num; 
    let g_type = this.data.g_type                                  // 数量
    num = (num > 0) ? num : 0;
    //取出购物车商品
    goods = { gid: goods.gid, name: goods.name, pic: goods.pic, currentPrice: goods.currentPrice, num: num, tid: goods.tid,type:goods.type};
    try {
      var allGoods = wx.getStorageSync('shoppingcar')       //获取购物车缓存
      if (allGoods == "") {
        allGoods = []
      }
      //检查购物车是否有此商品
      var hasCount = 0;
      for (var i = 0; i < allGoods.length; i++) {
        var temp = allGoods[i];
        if (temp.gid == goods.gid) {                         //判断商品ID相同
          // console.log('1')

          hasCount = temp.num;
          allGoods.splice(i, 1);
          break;
        }
      }
      goods.num = goods.num;
      goods.type = g_type
      if (goods.num > 0) {
        allGoods.push(goods);
      }

      wx.setStorageSync('shoppingcar', allGoods);
    } catch (m) {
      console.log('立即购买失败!');
    }

  },
  
 
  onReady: function () {
  
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
    return {
      title: '美食',
      path: 'page/component/liebiao2/liebiao2',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})