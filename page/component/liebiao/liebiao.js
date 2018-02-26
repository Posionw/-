var GoodList = {};
// var goodlistdata = require('../../good/good.js');


Page({
  data: {
   
    isLoading: true,
    typeData: {},
    goodData: {},
    totalPrice: 0,
    z_num:0,
    zong:{}
  },
  onShow() {
    let _this = this;
    // wx.request({
    //   url: 'https://xcxkj.tech/xcxi/weixin/goods/goodlist',
    //   data: {},
    //   success: function (res) {
    //     setTimeout(() => { 
    //       _this.setData({
    //         isLoading: false
    //       }
    //     }, 300);
    //     GoodList = res.data;
    //     _this.initData();
    //   }
    // })

    // 模拟获取数据
    setTimeout(() => {
      _this.setData({
        isLoading: false
      });
    }, 300);
   
    // getTotalPrice()
    wx.getStorage({
      key: 'goodlistdata',
      success: function (res) {
        console.log(res.data)
        var bb = res.data
        // that.setData({
        //   hasList: true,
        //   carts: bb
        // })
      GoodList = bb;
      _this.setData({
        zong: GoodList
      })
      console.log(_this.data.zong)
      _this.initData();
      }
    })
    
    
    
    // 初始化scroll-view高度
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },
  initData() {
    let orderArr = [];
    let types = [];
    for (let i in GoodList.type) {
      orderArr.push(GoodList.type[i].tid);
    }
    console.log(orderArr)

    // 拿到最大的ID设为初始化分类
    let orderId = Math.max(...orderArr);

    this.setData({
      current: orderId,
      typeData: GoodList.type
    });

    // 初始化商品列表
    this.setGoodList(orderId);
  },
  tapTpye(event) {
    this.setData({
      current: event.currentTarget.dataset.current
    });
    this.setGoodList(event.currentTarget.dataset.current);
  },
  // tapGood(event) {
  //   wx.navigateTo({
  //     url: '../detail/detail?gid=' + event.currentTarget.dataset.gid
  //   });
  // },
  setGoodList(typ) {
    for (let i in GoodList.type) {
      if (GoodList.type[i].tid == typ) {
        this.setData({
          goodData: GoodList.type[i]
        });
      }
    }
  },
  addCount(e) {  
    const index = e.currentTarget.dataset.index;
    let goods = this.data.goodData.goods;
    let num = goods[index].num; 
    num = num + 1;  
    goods[index].num = num;
    console.log(num)
    // console.log(this)
    this.setData({
      goodData:{
        goods: goods
      }  
    });
    this.getTotalPrice();
    this.buyNow(index)
  },
  // 减少
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let goods = this.data.goodData.goods;
    let num = goods[index].num; 
    if (num <= 0) {
      return false;
    }
    num = num - 1;
    goods[index].num = num;
    console.log(this)
    this.setData({
      goodData: {
        goods: goods
      }  
    });
    this.getTotalPrice();
    this.buyNow(index)
  },
  // 计算总价
  getTotalPrice() {
    var that = this;
    wx.getStorage({
      key: 'shoppingcar',
      success: function (res) {
        console.log(res.data)
        var bb = res.data
        that.setData({
          hasList: true,
          carts: bb
        })
      }
    })
    
    let goods = this.data.goodData.goods;                  // 获取购物车列表
    console.log(goods)
    let total = 0;
    let nnm=0;
    for (let i = 0; i < goods.length; i++) {         // 循环列表得到每个数据
      if (goods[i].num>0) {                     // 判断选中才会计算价格
        total += goods[i].num * goods[i].currentPrice;   // 所有价格加起来
        nnm += goods[i].num
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      goodData: {
        goods: goods
      },
      totalPrice: total.toFixed(2),
      z_num:nnm
    });
    // wx.setStorageSync('shoppingcar', allGoods)
  },
  go: function (e) {
  
    wx.navigateTo({ url: "../cart/cart"})
    // 获取缓存
    // wx.getStorage({
    //   key: 'shoppingcar',
    //   success: function(res) {
    //     console.log(res.data)
    //   }
    // })
  },
  
  buyNow: function (a) {
    let goods = this.data.goodData.goods[a];
    let num = goods.num; 
    num = (num > 0) ? num : 0;
    //取出购物车商品
    goods = { gid: goods.gid, name: goods.name, pic: goods.pic, currentPrice: goods.currentPrice, num: num };
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
          // console.log('1')
          
          hasCount = temp.num;
          allGoods.splice(i, 1);
          break;
        }
      }
      goods.num = goods.num;
      allGoods.push(goods);
      wx.setStorageSync('shoppingcar', allGoods);
    } catch (m) {
      console.log('立即购买失败!');
    }
    // if (e != '') {
    //   var currentPagess = getCurrentPages();
    //   wx.navigateBack({
    //     delta: 1, // 回退前 delta(默认为1) 页面
    //     success: function (res) {
    //       // success
    //       // wx.navigateTo({ url: '/pages/shoppingcar/index' })
    //     }
    //   })
    // }
  }

})