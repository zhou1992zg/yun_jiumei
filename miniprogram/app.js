//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'jiumei-yz5qq',
        traceUser: true,
      })
    }
    wx.login({
      success (res) {
        if (res.code) {
          wx.setStorageSync("SESSIONCODE",res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    wx.setStorageSync("GOODSCAR",[{
      amount: 0,
      base_unit_id: "221310149857512422",
      base_unit_name: "把",
      count: 4,
      goodsIndex: 1,
      goods_id: "258168407131147072",
      goods_name: "【西班牙DO级红酒 网红人气酒 原跑瓶进口】 小红帽干红葡萄酒",
      goods_spec: "",
      price: 38,
      stock: 40,
      typeOneIndex: 1,
      typeTwoIndex: 0,
      url: "../../static/banner_err.png",
      selected: true
    }, {
      amount: 3.5,
      base_unit_id: "221310649857212422",
      base_unit_name: "克",
      count: 1,
      goodsIndex: 0,
      goods_id: "258168407638147072",
      goods_name: "【西班牙DO级红酒 网红人气酒 原跑瓶进口】 小红帽干红葡萄酒",
      goods_spec: "",
      price: 3.5,
      stock: 24,
      typeOneIndex: 0,
      typeTwoIndex: 2,
      url: "../../static/banner_err.png",
      selected: true
    }, {
      amount: 3.5,
      base_unit_id: "221310649857212422",
      base_unit_name: "克",
      count: 1,
      goodsIndex: 0,
      goods_id: "258168407638147072",
      goods_name: "【西班牙DO级红酒 网红人气酒 原跑瓶进口】 小红帽干红葡萄酒",
      goods_spec: "",
      price: 0.01,
      stock: 24,
      typeOneIndex: 0,
      typeTwoIndex: 2,
      url: "../../static/banner_err.png",
      selected: true
    }])
    this.globalData = {}
  }
})
