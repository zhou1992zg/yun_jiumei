// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderinfo: [],
    payTypeIndex: 0,
    payTypeArray: ['快递邮寄', '上门自提', '同城急送 ·（即送费）'],
    addressData: {},
    postage: 14.5
  },

  onLoad: function () {
    const db = wx.cloud.database()
    db.collection("address-list").where({
      _openid: wx.getStorageSync("PHONE_NUMBER")._openid,
    }).get({
      success: res => {
        wx.setStorageSync("ADDRESS_DATA", res.data[0])
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '获取地址失败',
        })
      }
    });
  },

  onShow: function () {
    this.setData({
      addressData: wx.getStorageSync("ADDRESS_DATA"),
      orderinfo: wx.getStorageSync("ORDERINFO"),
      goodsCar: wx.getStorageSync("GOODSCAR")
    })
    this.totalPrice();
  },

  toaddressPage() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  toAddAddressPage() {
    wx.navigateTo({
      url: '/pages/add_address/add_address',
    })
  },

  bindPickerChange(e) {
    console.log(e)
    this.setData({
      payTypeIndex: e.detail.value
    })
  },

  stepperEvent: function (e) {
    if (e.detail.action == "plus") {
      this.addNum(e.detail.goodsIndex);
    } else if (e.detail.action == "minus") {
      this.subNum(e.detail.goodsIndex);
    } else if (e.detail.action == "change") {
      console.log(e.detail.goodsIndex)
      console.log(e.detail.totalNum)
      this.changeGoodsNum(e.detail.goodsIndex, e.detail.totalNum)
    }
  },
  //输入数量
  changeGoodsNum: function (index, totalNum) {
    let list = this.data.goodsCar;
    // 获取商品数量
    list[index].count = totalNum;

    this.setData({
      goodsCar: list
    });
    wx.setStorageSync("ORDERINFO", list)
    this.totalPrice();
  },
  //减少数量
  subNum: function (index) {
    // 获取点击的索引
    // 获取商品数据
    let list = this.data.goodsCar;
    // 获取商品数量
    let num = list[index].count;
    // 点击递减
    num = num - 1;
    list[index].count = num;
    console.log(list);
    // 重新渲染 ---显示新的数量
    this.setData({
      goodsCar: list
    });
    wx.setStorageSync("ORDERINFO", list)
    this.totalPrice();
  },
  //增加数量
  addNum: function (index) {
    // 获取点击的索引
    // 获取商品数据
    let list = this.data.goodsCar;
    // 获取商品数量
    let num = list[index].count;
    // 点击递增
    num = num + 1;
    list[index].count = num;
    console.log(list);
    // 重新渲染 ---显示新的数量
    this.setData({
      goodsCar: list
    });
    wx.setStorageSync("ORDERINFO", list)
    this.totalPrice();
  },
  // 计算金额
  totalPrice: function () {
    let list = this.data.goodsCar;
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      if (list[i].selected) {
        // 所有价格加起来 count_money
        total += list[i].count * list[i].price;
      }
    }
    // 最后赋值到data中渲染到页面
    this.setData({
      goodsCar: list,
      totalPrice: total.toFixed(2),
      allPrice: (Number(total.toFixed(2)) + Number(this.data.postage)).toFixed(2)
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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

  }
})