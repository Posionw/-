// app.js
var goodlistdata = {}; //网上
// var util = require('../../common/common.js')
// var goodlistdata = require('/page/good/good.js'); //本地
App({
  data:{
    // goodData: {},
    code:'',
    personInfo:'',
    ctzq:{}
  },
  d: {
    hostUrl: 'https://cy.bingzhiyue.cn/index.php',
    hostImg: 'http://img.ynjmzb.net',
    hostVideo: 'http://zhubaotong-file.oss-cn-beijing.aliyuncs.com',
    userId: 1,
    appId: "wx881b0d39859e358b",
    appKey: "072c064333b7dddb6e0e8a8e23b035b8",
    ceshiUrl: 'https://cy.bingzhiyue.cn/index.php',
    
  },
  onShow:function(){
    var that = this;
    // console.log(goodlistdata)
    //网上
    wx.request({
      url: that.d.hostUrl +'/api/Cate/all', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        var goodlistdata = res.data
        wx.setStorageSync('goodlistdata', goodlistdata);
      }
    });
    wx.request({
      url: that.d.hostUrl + '/api/index/info',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        var sdxq = res.data
        wx.setStorageSync('sdxq', sdxq);
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
      }
    })
  
    

    
    
    //本地数据
    // wx.setStorageSync('goodlistdata', goodlistdata);
  },
  getUserInfo:function (cb) {
    var that = this
      if (this.globalData.personInfo) {
      typeof cb == "function" && cb(this.globalData.personInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.personInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.personInfo)
            }
          })
        }
      })
    }
  },
  onLaunch: function () {
    var that =this
    // var code
    wx.login({
      //获取code
      success: function (res) {
        var code1 = res.code //返回code
        // console.log(code)
        getsessionkeys(code1)
      }
    })
    function getsessionkeys(a) {
      wx.request({
        url: that.d.hostUrl + '/Api/Login/getsessionkeys?code=' + a,
        data: {

        },
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res)
          var openid = res.data.openid
        }
      })
    }
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //login
    this.getUserInfo();
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      // 调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code;
          //get wx user simple info
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo);
              //get user sessionKey
              //get sessionKey
              that.getUserSessionKey(code);
              console.log(res)
            }
          });
        }
      });
    }
  },

  getUserSessionKey: function (code) {
    var that = this;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/getsessionkeys',
      method: 'post',
      data: {
        code: code
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        console.log(res)   
        var data = res.data;
        if (data.status == 0) {
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
        }

        that.globalData.userInfo['sessionId'] = data.session_key;
        that.globalData.userInfo['openid'] = data.openid;
        that.onLoginUser();
      },
      fail: function (e) {
        wx.showToast({
          title: '登录成功',
          duration: 2000
        });
      },
    });
  },
  onLoginUser: function () {
    var that = this;
    var user = that.globalData.userInfo;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/authlogin',
      method: 'post',
      data: {
        SessionId: user.sessionId,
        gender: user.gender,
        province: user.province,
        NickName: user.nickName,
        HeadUrl: user.avatarUrl,
        openid: user.openid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.arr;
        var status = res.data.status;
        if (status != 1) {
          wx.showToast({
            title: res.data.err,
            duration: 3000
          });
          return false;
        }
        that.globalData.userInfo['id'] = data.ID;
        that.globalData.userInfo['NickName'] = data.NickName;
        that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
        var userId = data.ID;
        if (!userId) {
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }
        that.d.userId = userId;
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });
  },
  // getOrBindTelPhone: function (returnUrl) {
  //   var user = this.globalData.userInfo;
  //   if (!user.tel) {
  //     wx.navigateTo({
  //       url: 'pages/binding/binding'
  //     });
  //   }
  // },

  globalData: {
    userInfo: null
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }

});





