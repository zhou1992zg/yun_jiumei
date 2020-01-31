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
    this.setData({
      order_id: order_id
    })
    this.getOrderDet(order_id);
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: '18111501020',
    })
  },

  /**
   * 物流
   */
  getLogistics() {
    wx.showToast({
      title: '功能开发中',
    })
  },

  /**
   * 删除订单
   */
  deleteOrder() {
    const _this = this;
    const order_id = _this.data.order_id;
    wx.showModal({
      title: '提示',
      content: '确认删除此订单？',
      success: function (res) {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection("order").where({
            _id: order_id
          }).remove({
            success: res => {
              wx.showToast({
                title: '删除成功',
                duration: 1000
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            },
            fail: err => {
              wx.showToast({
                title: '删除失败',
              })
            }
          })
        }
      }
    })
  },

  // 订单支付
  pay() {
    let orderId = this.data.order_id;
    let _price = this.data.orderDeta._price;
    wx.showLoading({
      title: '支付中'
    });
    wx.cloud.callFunction({
      name: 'pay', // 调用pay函数
      data: {
        _id: orderId,
        _price: _price
      }, // 支付金额
      success: (res) => {
        wx.hideLoading();
        const {
          result
        } = res;
        const {
          code,
          data
        } = result;
        if (code !== 0) {
          wx.showModal({
            title: '提示',
            content: '支付失败',
            showCancel: false
          });
          return;
        }
        console.log(data);
        wx.requestPayment({
          timeStamp: data.time_stamp,
          nonceStr: data.nonce_str,
          package: `prepay_id=${data.prepay_id}`,
          signType: 'MD5',
          paySign: data.sign,
          success: (res) => {
            console.log(res)

            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/orderDetail/orderDetail?orderid=' + orderId,
              })
            }, 1000)
          },
          fail: (res) => {
            console.log(res)
            wx.showToast({
              title: '取消支付',
              icon: 'none'
            });
          }
        });
      },
      fail: (res) => {
        wx.hideLoading();
        console.log('FAIL');
        console.log(res);
      }
    });
  },



  getOrderDet(orderid) {
    const _this = this;
    const db = wx.cloud.database()
    db.collection("order").where({
      _id: orderid,
    }).get({
      success: res => {
        console.log(res.data[0])
        let data = res.data[0];
        data["_createtime"] = formatTime(data._createtime / 1000, "Y-M-D h:m:s");
        _this.setData({
          orderDeta: res.data[0]
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