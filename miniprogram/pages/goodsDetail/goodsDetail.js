// pages/goodsDetail/goodsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carGoodsNum: 0,
    currentNum: 0,
    moveImg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      goods_id: options.id,
      hideShareBox: wx.getStorageSync("SHAREBOX")
    })
    this.getGoodsDate(options.id);
    this.getCarGoodsNum(wx.getStorageSync("GOODSCAR"), false)
  },

  closeBtn(){
    wx.setStorageSync("SHAREBOX",true)
    this.setData({
      hideShareBox: wx.getStorageSync("SHAREBOX")
    })
  },

  getGoodsDate(goods_id) {
    const _this = this;
    const db = wx.cloud.database()
    db.collection("goods").where({
      _id: goods_id
    }).get({
      success: res => {
        let data = res.data[0];
        data._type = data._type.split('，');
        data.amount_100 = parseInt(data.amount/100)
        console.log(data)
        _this.setData({
          goodsDate: data
        })
      },
      fail: err => {
        console.log(err)
        console.log("获取商品详情失败");
      }
    });
  },

  toBuyCard() {
    const _this = this;
    let goodsData = _this.data.goodsDate;
    let goodsCard = wx.getStorageSync("GOODSCAR");
    let hasGoods = false;
    goodsCard.forEach((item, index) => {
      if (item._id == goodsData._id) {
        item.count + 1;
        hasGoods = true;
      }
    })
    if (!hasGoods) {
      goodsData.count = 1;
      goodsData.selected = true;
      goodsCard.push(goodsData);
    }
    console.log(goodsCard);
    wx.showToast({
      title: '加入购物车',
      icon: 'success',
      duration: 2000
    })
    wx.setStorageSync("GOODSCAR", goodsCard);
    this.getCarGoodsNum(goodsCard, true)
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: '18111501020',
    })
  },

  getCarGoodsNum(goodsCard, b) {
    const _this = this;
    let carGoodsNum = 0;
    if (goodsCard.length > 0) {
      goodsCard.forEach((item, index) => {
        carGoodsNum = carGoodsNum + item.count;
      })
    }
    _this.setData({
      moveImg: b,
      carGoodsNum
    })
    if (b) {
      setTimeout(function () {
        _this.setData({
          moveImg: false,
        })
      }, 2000)
    }
  },

  toBuy() {
    const _this = this;
    wx.navigateTo({
      url: '/pages/order/order?id=' + _this.data.goods_id,
    })
  },

  toIndex() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },

  toCard() {
    wx.switchTab({
      url: "/pages/payCard/index"
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const _this = this;

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: _this.data.goodsDate.goods_name,
      path: `/pages/goodsDetail/goodsDetail?id=${_this.data.goods_id}`,
      imageUrl: _this.data.goodsDate._shareList[0].fileID
    }
  }
})