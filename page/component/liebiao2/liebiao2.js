var GoodList = {};
Page({
  data: {
    isLoading: true,
    typeData: {},                           //类型信息
    goodData: {},                           //商品信息
    totalPrice: 0,                          //总价格
    z_num: 0,                               //数量
    zong: {},
    carts: [],                              //购物车数据
    ctzq:{}
  },
  onShow() {
    
    let _this = this;
    this.getTotalPrice()                    //计算总价
    // 模拟获取数据
    setTimeout(() => {
      _this.setData({
        isLoading: false
      });
    }, 300);
    wx.getStorage({                         // 购物车缓存
      key: 'shoppingcar',
      success: function (res) {
        console.log(res.data)
        var bb = res.data
        _this.setData({
          hasList: true,
          carts: bb                         // 赋值购物车
        })
      }
    })

    var sdxq = wx.getStorageSync('sdxq')                    //获取商店信息
    _this.setData({
      ctzq: sdxq                                            //赋值
    })
    wx.getStorage({                         // 全局缓存
      key: 'goodlistdata',
      success: function (res) {
        console.log(res.data)
        var bb = res.data
        GoodList = bb;
        _this.setData({
          zong: GoodList
        })
        console.log(GoodList)
        _this.initData();
      }
    })    
    
    var that = this;                        // 初始化scroll-view高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },
  initData() {
    console.log(GoodList)
    let orderArr = [];
    let types = [];
    for (let i in GoodList.type) {
      orderArr.push(GoodList.type[i].tid);
    }
    console.log(orderArr)
    let orderId = Math.max(...orderArr);      // 拿到最大的ID设为初始化分类
    this.setData({
      current: orderId,
      typeData: GoodList.type
    });
    this.setGoodList(orderId);                // 初始化商品列表
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
    wx.getStorage({                           // 获得缓存数据
      key: 'goodlistdata',
      success: function (res) {
        console.log(res.data)
        var bb = res.data
        GoodList = bb;
        console.log(GoodList)
      }
    })
    
    for (let i in GoodList.type) {            // 判断id相同
      if (GoodList.type[i].tid == typ) {
        this.setData({
          goodData: GoodList.type[i]
        });
      }
    }
    console.log(this.data.goodData)
  },
  
  addCount(e) {                               // 点击添加按钮
    const index = e.currentTarget.dataset.index;
    const current = e.currentTarget.dataset.current;
    let goods = this.data.goodData.goods;
    let num = goods[index].num;
    num = num + 1;
    goods[index].num = num;
    console.log(index)
    this.setData({
      'goodData.goods': goods
    });
                                               // 修改存缓存
    var arr = wx.getStorageSync('goodlistdata')
    console.log(arr.type)
    console.log(goods)
    for (var i in arr.type) {
      console.log(i)
      if (arr.type[i].tid == current) {        
          arr.type[i].goods= goods
          console.log(goods)        
      }
    }
    wx.setStorageSync('goodlistdata', arr)
    this.buyNow(index)
    this.getTotalPrice();
  },
                                              // 减少商品
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const current = e.currentTarget.dataset.current;
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
                                              // 修改全局缓存
    var arr = wx.getStorageSync('goodlistdata')
    console.log(arr.type)
    console.log(goods)
    for (var i in arr.type) {
      console.log(i)
      if (arr.type[i].tid == current) {
        arr.type[i].goods = goods
        console.log(goods)
      }
    }
    wx.setStorageSync('goodlistdata', arr)    
    this.buyNow(index)
    this.getTotalPrice();
  },
                                               // 计算总价
  getTotalPrice() {
    var arr = wx.getStorageSync('goodlistdata')
    let total = 0;
    let nnm = 0;
    console.log(arr.type.length)
    for (let j = 0; j <arr.type.length; j++){
      for (let i = 0; i < arr.type[j].goods.length; i++) {         // 循环列表得到每个数据
        if (arr.type[j].goods[i].num > 0) {                        // 判断选中才会计算价格
          total += arr.type[j].goods[i].num * arr.type[j].goods[i].currentPrice;   // 所有价格加起来
          nnm += arr.type[j].goods[i].num
        }
      }  
    }
    this.setData({                                                // 最后赋值到data中渲染到页面
      totalPrice: total.toFixed(2),
      z_num: nnm
    });
  },
  go: function (e) {
    console.log(this.data.z_num)
    if (this.data.z_num==0){
      console.log('ooooo')
      wx.showToast({
        title: '请选购商品',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.navigateTo({ url: "../cart2/cart2" })
    }
  },

  buyNow: function (a) {
    console.log(this.data.goodData)
    let goods = this.data.goodData.goods[a];
    let num = goods.num;
    num = (num > 0) ? num : 0;
    //取出购物车商品
    goods = { gid: goods.gid, name: goods.name, pic: goods.pic, currentPrice: goods.currentPrice, num: num, tid: goods.tid,type:goods.type,};
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
      if (goods.num>0){
        allGoods.push(goods);
      }
      
      wx.setStorageSync('shoppingcar', allGoods);
    } catch (m) {
      console.log('立即购买失败!');
    }
    
  },
  
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