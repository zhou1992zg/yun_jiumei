// pages/goodsDetail/goodsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carGoodsNum:0,
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
    })
    this.getGoodsDate(options.id);
    this.getCarGoodsNum(wx.getStorageSync("GOODSCAR"),false)
  },

  getGoodsDate(goods_id) {
    const _this = this;
    const db = wx.cloud.database()
    db.collection("goods").where({
      _id: goods_id
    }).get({
      success: res => {
        console.log(res.data[0])
        let data = res.data[0];
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
      goodsCard.push(goodsData);
    }
    console.log(goodsCard);
    wx.showToast({
      title: '加入购物车',
      icon: 'success',
      duration: 2000
    })
    wx.setStorageSync("GOODSCAR", goodsCard);
    this.getCarGoodsNum(goodsCard,true)
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: '18111501020',
    })
  },

  getCarGoodsNum(goodsCard,b) {
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
    if(b){
      setTimeout(function () {
        _this.setData({
          moveImg: false,
        })
      }, 2000)
    }
  },

  toBuy(){
    const _this = this;
    wx.navigateTo({
      url: '/pages/order/order?id='+_this.data.goods_id,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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