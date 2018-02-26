// page/component/new-pages/cart/cart.js
var util = require('../../common/common.js')
var app = getApp()
// var goodlistdata = require('../../good/good.js')
Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    sfPrice: 0, 
    selectAllStatus: true,    // 全选状态，默认全
    obj: {
      name: "hello"
    },
    yh:0,                     //优惠金额
    yid:'',                   //优惠卷id
    name:'>',                 //名字
    zs:0,                     //最少金额
    person_num:0,
    zuowei_num:0,
    time:'',
    personInfo:'',
    ctzq:{},
    zhi:0,
    state:false,
  },
  onShow() {
    console.log("输出接口url：" + util.shopXq);
   console.log(this.data.name)
   console.log(this.data.yid)
    var that = this;
    var sdxq = wx.getStorageSync('sdxq')
    that.setData({
      ctzq: sdxq
    })

    wx.getStorage({
      key: 'shoppingcar',                                 //购物车缓存
      success: function (res) {
        console.log(res.data)
        var bb = res.data
        let selectAllStatus = that.data.selectAllStatus; 
        for (let i = 0; i < bb.length; i++) {             //赋值选中状态
          bb[i].selected = selectAllStatus;
        }
        that.setData({
          hasList: true,
          carts: bb
        })
        that.getTotalPrice();
      }
    })
    var person_num = wx.getStorageSync('person_num', that.data.zid);
    var zuowei_num = wx.getStorageSync('zuowei_num', that.data.zid);
    console.log(person_num)
    // 判断 如果未选人数与座位号强制跳转到选座页面
    if (person_num == '') {
      console.log('111')
      wx.switchTab({ url: "../diancan/diancan" })
    } else {
      that.setData({
        person_num: person_num,
        zuowei_num: zuowei_num,
        time: util.getTime
      })
    }
    
    
    
    // this.selectAll();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;       //当前下标
    let carts = this.data.carts;                       //获取购物车
    const selected = carts[index].selected;            //改变选中状态
    carts[index].selected = !selected;
    this.setData({
      carts: carts                                     //从新赋值购物车
    });
    this.getTotalPrice();                              //计算总价
    
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;      //购物车清除
    let carts = this.data.carts;                      //获取购物车
    carts.splice(index, 1);
    this.setData({
      carts: carts
    });

    // 修改购物车缓存
    wx.setStorageSync('shoppingcar', carts);
    if (!carts.length) {                              //判断是否为空
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
    //  修改全局缓存
    const current = e.currentTarget.dataset.current;  //类型id
    const gid = e.currentTarget.dataset.gid;          //商品id    
    var arr = wx.getStorageSync('goodlistdata')       //获取全局缓存
    for (var i in arr.type) {
      console.log(i)
      if (arr.type[i].tid == current) {               //判断类型id相同
        for (var j in arr.type[i].goods) {
          if (arr.type[i].goods[j].gid == gid) {      //判定商品id相同
            arr.type[i].goods[j].num = 0
          }
        }
      }
    }
    wx.setStorageSync('goodlistdata', arr)             //修改全局缓存
  },

  /**
   * 购物车全选事件
   */
  selectAll() {
    
    let selectAllStatus = this.data.selectAllStatus;    
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    // console.log(this.data.carts)
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    let carts = this.data.carts;
    const current = e.currentTarget.dataset.current;    //点击获取类型id
    const index = e.currentTarget.dataset.index;        //点击获取购物车缓存下标
    const gid = e.currentTarget.dataset.gid;            //点击获取商品id
    let num = carts[index].num;                         //当前数量
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    // 修改存缓存
    var arr = wx.getStorageSync('goodlistdata')         //全局缓存
    for (var i in arr.type) {
      console.log(i)
      if (arr.type[i].tid == current) {                 //判断类型id
        for (var j in arr.type[i].goods) {
          if (arr.type[i].goods[j].gid == gid) {        //判断商品id
            arr.type[i].goods[j].num = carts[index].num //修改全局缓存数量
          }
        }
      }
    }
    wx.setStorageSync('goodlistdata', arr)              //更新全局缓存
    this.buyNow(index)                                  //购物车缓存
    this.getTotalPrice();                               //计算总价
  },
                                                        //绑定减数量事件
  minusCount(e) {
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    const current = e.currentTarget.dataset.current;
    const index = e.currentTarget.dataset.index;
    const gid = e.currentTarget.dataset.gid;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    console.log(gid)
                                                        // 修改存缓存
    var arr = wx.getStorageSync('goodlistdata')
    console.log(arr.type)
    for (var i in arr.type) {
      console.log(i)
      if (arr.type[i].tid == current) {
        for (var j in arr.type[i].goods) {
          if (arr.type[i].goods[j].gid == gid) {
            arr.type[i].goods[j].num = carts[index].num
          }
        }
      }
    }
    wx.setStorageSync('goodlistdata', arr)
    this.buyNow(index)
    this.getTotalPrice();
  },
                                                         
  getTotalPrice() {                                      //计算总价
    let carts = this.data.carts;                         // 获取购物车列表
    console.log(carts)
    let total = 0;
    for (let i = 0; i < carts.length; i++) {             // 循环列表得到每个数据
      if (carts[i].selected) {                           // 判断选中才会计算价格
        total += carts[i].num * carts[i].currentPrice;   // 所有价格加起来
      }
    }
    var sfPrice
    if(total>=this.data.zs){
      sfPrice = total - this.data.yh;                  //计算实付金额
      if(sfPrice<0){
        sfPrice=0;
      }
    }else{
      wx.showToast({
        title: '优惠卷使用失败',
        icon: 'loading',
        duration: 2000
      })
      sfPrice = total - 0;  
    }
    this.setData({                                      // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      sfPrice: sfPrice.toFixed(2)
    });
  },

  buyNow: function (a) {                                // 存入购物车
    let goods = this.data.carts[a]
    let num = goods.num;
    num = (num > 0) ? num : 0;
    //取出购物车商品
    goods = { gid: goods.gid, name: goods.name, pic: goods.pic, currentPrice: goods.currentPrice, num: num, tid: goods.tid };
    try {
      var allGoods = wx.getStorageSync('shoppingcar')
      if (allGoods == "") {
        allGoods = []
      }
      //检查购物车是否有此商品
      var hasCount = 0;
      for (var i = 0; i < allGoods.length; i++) {
        var temp = allGoods[i];
        if (temp.gid == goods.gid) {
          hasCount = temp.num;
          allGoods.splice(i, 1);
          break;
        }
      }
      goods.num = goods.num;
      if (goods.num > 0) {
        allGoods.push(goods);
      }
      wx.setStorageSync('shoppingcar', allGoods);
    } catch (m) {
      console.log('立即购买失败!');
    }
    
  },
  onLoad: function (options) {
    // 第二种方法
    // var that = this
    // var hyh = options.id                              //获取传过来的参数
    // if(hyh>0){                                        //判断是否有值
    //   that.setData({
    //     yh: options.id,                               //从新赋值优惠
    //     yid:options.yid                               //优惠卷id
    //   }) 
    // }
   
  },
  toPay:function(){
    this.setData({
      state:true
    })
    
    let carts = this.data.carts;                     // 获取购物车列表
    if (carts.length>0){
    var sfPrice = this.data.sfPrice                  // 实付金额
    var totalPrice = this.data.totalPrice;           // 商品总价
   
    console.log(carts)
    let yid = this.data.yid;                         // 优惠卷
    let person_num = this.data.person_num            // 人数
    let zuowei_num = this.data.zuowei_num            // 座位号
    console.log(yid)
    var arr1=[]                                      // 商品数组
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) { 
        arr1.push(carts[i])                          // 判断选中才会计算价格
        console.log(carts[i])                        // 选中商品信息
      }
    }
    // 获取用户信息
    var that = this;
    app.getUserInfo(function (personInfo) {          //调用应用实例的方法获取全局数据
      that.setData({                                  //更新数据
        personInfo: personInfo
      })
    })
    var uid = this.data.personInfo.id;                //获取uid
    var openid = this.data.personInfo.openid;         //获取openid
    
    var arr2 = [];                                    // 重新赋值字段名
    var goods
    for (var i = 0; i < arr1.length; i++){     
      var temp = arr1[i];
       goods= { id: temp.gid, name: temp.name, pic: temp.pic, price: temp.currentPrice, num: temp.num, kwei_id: temp.tid, type: temp.type, };
       arr2.push(goods)
    }
    // 字段名赋值
    console.log(arr1, yid, person_num, zuowei_num, sfPrice)
    var content = { "peoplenum": person_num, "seatnum": zuowei_num, "content": arr2, "sfPrice": sfPrice}
    // 订单
    wx.request({
      url: app.d.hostUrl + '/api/pay/payorder',       //生成订单接口
      // method:POST,
      data:{
        content:content,                              //菜单信息
        uid:uid,                                      //用户id
        openid:openid,
        vid:yid,                                      //套餐id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)      
        if(res.data.status==0){
          wx.showToast({
            title: res.data.err,
            icon: 'loading',
            duration: 2000
          })
        }else{

        
        // 支付
        wx.request({
          url: app.d.hostUrl + '/api/pay/pay',         //支付接口
          method: 'POST',
          data: {
            uid: res.data.arr.uid,                            //uid
            openid: openid,                            //openid
            order_id: res.data.arr.order_id,           //order_id
            order_sn: res.data.arr.order_sn            //order_sn
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
                  console.log(res)
                  that.setData({
                    state: false
                  })
                  // 跳转到订单页面
                  wx.redirectTo({
                    url: "../dingdan/dingdan"
                  })
                },
                'fail': function (res) {
                  wx.redirectTo({
                    url: "../dingdan/dingdan"
                  })
                 },
                'complete': function (res) { }
              })
          }
        })
       
        //清理购物车缓存
        wx.removeStorage({                               
          key: 'shoppingcar',
          success: function (res) { },
        })
        wx.removeStorage({
          key: 'zuowei_num',
          success: function (res) { },
        })
        wx.removeStorage({
          key: 'person_num',
          success: function (res) { },
        })
        // 从新定义全局数据
        wx.request({                              
          url: app.d.hostUrl + '/api/Cate/all',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            var goodlistdata = res.data
            wx.setStorageSync('goodlistdata', goodlistdata);
          }
        })
        // var goodlistdata = res.data
        // wx.setStorageSync('goodlistdata', goodlistdata);
      }


    }


    })



     
    // console.log(goodlistdata)
    
    // wx.setStorageSync('goodlistdata', goodlistdata);//重新赋值全局缓存
    }else{
      wx.showToast({
        title: '请选择菜品',
        icon: 'loading',
        duration: 2000
      })
    }
  },
  back:function(){
    wx.navigateBack();
  },
  onShareAppMessage: function () {
    return {
      title: '美食',
      path: 'page/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }

})

