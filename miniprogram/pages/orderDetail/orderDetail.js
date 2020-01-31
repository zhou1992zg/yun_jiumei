// miniprogram/pages/orderDetail/orderDetail.js
import {
  formatTime
} from '../../utils/utils';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order_id = options.orderid;
    this.getOrderDet(order_id);
  },

  callPhone(){
    wx.makePhoneCall({
      phoneNumber: '18111501020',
    })
  },

  getOrderDet(orderid){
    const _this  = this;
    const db = wx.cloud.database()
    db.collection("order").where({
      _id: orderid,
    }).get({
      success: res => {
        console.log(res.data[0])
        let data = res.data[0];
        data["_createtime"] = formatTime(data._createtime/1000, "Y-M-D h:m:s");
        _this.setData({
          orderDeta : res.data[0]
        })
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '获取订单失败',
        })
      }
    });
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