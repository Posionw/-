

  Page({
    
  data: {
    items: [                                                    //人数信息
      { name: '1', value: '1人',select: '1'},
      { name: '2', value: '2人', select: '2'},
      { name: '3', value: '3人', select: '3'},
      { name: '4', value: '4人', select: '4'},
      { name: '5', value: '5人', select: '5'},
      { name: '6', value: '6人', select: '6'},
      { name: '7', value: '7人', select: '7' },
      { name: '8', value: '8人', select: '8' },
      { name: '9', value: '9人', select: '9' },
      { name: '10', value: '10人', select: '10' },
      { name: '11-15', value: '11-15人', select: '11-15' },
      { name: '15-', value: '15人以上', select: '15-' },
  ],
    catalogSelect: 0,
    userName:'',                                                  //人数
    zid:'',                                                       //座位id
    ctzq:{}                                                       //店铺信息
  },
  onShow:function(){
    var that=this;
    var sdxq = wx.getStorageSync('sdxq')                          //获取店铺信息
    that.setData({
      ctzq: sdxq                                                  //重新赋值商铺信息
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      zid: e.detail.value                                         // 座位id
    })
  },
  chooseCatalog: function (data) {
    var that = this;
    that.setData({
      catalogSelect: data.currentTarget.dataset.select            //把选中值放入判断值
    })
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value                                    //赋值人数id
    })
  },
  loginBtnClick: function (e) {
    console.log("用户名：" + this.data.userName);                   
    console.log("用户名：" + this.data.zid );
    var that=this;
    if (this.data.userName != '' && that.data.zid !=''){ 
      var a =  Number(this.data.userName)
      console.log(a)
      if (a>0){

              //选择人数与座位号
      wx.navigateTo({ url: "../liebiao2/liebiao2?id=" + this.data.userName + "&cid=" + that.data.zid})
      wx.setStorageSync('person_num', that.data.zid )
      wx.setStorageSync('zuowei_num', that.data.userName)
      } else{
        wx.showToast({
          title: '请输入数字',
          icon: 'loading',
          duration: 2000
        })
      }
    } else if (this.data.userName != '' && that.data.zid == ''){  //未选择人数选择座位号
      wx.showToast({
        title: '请选择就餐人数',
        icon: 'loading',
        duration: 2000
      }) 
    } else if (this.data.userName == '' && that.data.zid != '') {  //未选择座位号选择人数
      wx.showToast({
        title: '请选择桌位号',
        icon: 'loading',
        duration: 2000
      })
    } else if (this.data.userName == '' && that.data.zid == '') {  //未选择座位号未选择人数
      wx.showToast({
        title: '选择桌位号人数',
        icon: 'loading',
        duration: 2000
      })
    }
  },
  saoma:function(){
    if (this.data.zid == ''){
      wx.showToast({
        title: '请先选择人数',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.scanCode({
      success: (res) => {
        console.log(res)
        console.log(res.result)
        var a = res.result
        wx.showToast({
          title: a,
          icon: 'success',
          duration: 2000
        })
        wx.setStorageSync('person_num', this.data.zid)
        // wx.setStorageSync('zuowei_num', a)
        wx.navigateTo({ url: "../liebiao2/liebiao2"})
      }
    })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '美食',
      path: 'page/component/diancan/diancan',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})
