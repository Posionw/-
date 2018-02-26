// page/component/new-pages/cart/cart.js
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    obj:{
        name:"hello"
    }
  },
  onShow() {
    var that=this;
    wx.getStorage({
      key: 'shoppingcar',
      success: function(res) {
        console.log(res.data)
        var bb = res.data
        that.setData({
          hasList: true,
          carts:bb
        })
      }
    })
    
    // this.setData({
    //   hasList: true,
    //   carts:[
    //     {id:1,title:'新鲜芹菜 半斤',image:'/image/s5.png',num:4,price:0.01,selected:true},
    //     {id:2,title:'素米 500g',image:'/image/s6.png',num:1,price:0.03,selected:true}
    //   ]
    // });
    this.getTotalPrice();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index,1);
    this.setData({
      carts: carts
    });
    if(!carts.length){
      this.setData({
        hasList: false
      });
    }else{
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

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
    // const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    // let num = carts[index].num;
    // num = num + 1;
    // carts[index].num = num;
    // this.setData({
    //   carts: carts
    // });
    // this.getTotalPrice();


    const current = e.currentTarget.dataset.current;
    const index = e.currentTarget.dataset.index;
    const gid = e.currentTarget.dataset.gid;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    // 修改存缓存
    var arr = wx.getStorageSync('goodlistdata')
    console.log(arr.type)
    // console.log(goods)
    for (var i in arr.type) {
      console.log(i)
      if (arr.type[i].tid == current) {
        for (var j in arr.type[i].goods) {
          if (arr.type[i].goods[j].gid == gid) {
            arr.type[i].goods[j].num = carts[index].num
          }
        }

        // console.log(goods)
      }
    }
    wx.setStorageSync('goodlistdata', arr)
    // this.buyNow(index)
    this.buyNow(index)
    this.getTotalPrice();





  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    // const index = e.currentTarget.dataset.index;
    // const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    // let num = carts[index].num;
    // if(num <= 1){
    //   return false;
    // }
    // num = num - 1;
    // carts[index].num = num;
    // this.setData({
    //   carts: carts
    // });
    // this.getTotalPrice();

    const current = e.currentTarget.dataset.current;
    const index = e.currentTarget.dataset.index;
    const gid = e.currentTarget.dataset.gid;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    // num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    console.log(gid)
    // 修改存缓存
    var arr = wx.getStorageSync('goodlistdata')
    console.log(arr.type)
    // console.log(goods)
    for (var i in arr.type) {
      console.log(i)
      if (arr.type[i].tid == current) {
        for(var j in arr.type[i].goods){
          if(arr.type[i].goods[j].gid==gid){
            arr.type[i].goods[j].num = carts[index].num
          }
        }
        
        // console.log(goods)
      }
    }
    wx.setStorageSync('goodlistdata', arr)
    this.buyNow(index)
    this.getTotalPrice();


  },
  
  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].currentPrice;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  buyNow: function (a) {
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
          // console.log('1')

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