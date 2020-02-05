// miniprogram/pages/orderDetail/orderDetail.js
import {
  formatTime
} from '../../utils/utils';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton: true
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
   * 打开地图
   */
  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: 31.107237, //要去的纬度-地址
          longitude: 104.392375, //要去的经度-地址
          name: "酒槑 18111501020",
          address: '四川省德阳市文杰莱茵广场1层3号'
        })
      }
    })
  },

  /**
   * 确定收货
   */
  orderOk() {
    const _this = this;
    wx.showModal({
      title: '提示',
      content: '请确定收到商品',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          wx.cloud.callFunction({
            // 云函数名称
            name: 'updateDate',
            // 传给云函数的参数
            data: {
              e: {
                _payType: 3
              },
              d: {
                _id: _this.data.order_id
              },
              c: 'order'
            },
            success: function (res) {
              wx.hideLoading()
              wx.showToast({
                title: '谢谢您的光临！',
                icon: 'success',
                duration: 3000
              })
              _this.getOrderDet(_this.data.order_id);
            },
            fail: function (err) {
              console.log(err)
              wx.hideLoading()
              wx.showToast({
                title: '出错了',
                duration: 2000
              })
            }
          })
        }
      }
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
    const _this = this;
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
            _this.changeOrderType(orderId, function () {
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
            }, function () {
              wx.showToast({
                title: '支付失败，稍后重试',
                icon: 'success',
                duration: 1000
              });
            })
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

  changeOrderType(order_id, fn, errFn) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'changeOrder',
      // 传给云函数的参数
      data: {
        order_id: order_id,
        type: 1
      },
      success: function (res) {
        fn && fn(res)
      },
      fail: function (err) {
        errFn && errFn(res)
      }
    })
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
          orderDeta: data
        })
        this.getAddressDeta(data.address_id);
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '获取订单失败',
        })
      }
    });
  },

  getAddressDeta(address_id) {
    const _this = this;
    const db = wx.cloud.database()
    db.collection("address-list").where({
      _id: address_id,
    }).get({
      success: res => {
        console.log(res.data[0])
        let data = res.data[0];
        _this.setData({
          addressDeta: data,
          showSkeleton: false
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