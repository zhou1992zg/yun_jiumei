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
    console.log(order_id)
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

  callPhoneT(e) {
    let {
      phone
    } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
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
                _orderId: _this.data.order_id
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
    console.log(wx.getStorageSync("PHONE_NUMBER"));
    console.log(order_id);
    wx.showModal({
      title: '提示',
      content: '确认删除此订单？',
      success: function (res) {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection("order").where({
            _orderId: order_id,
            _openid: wx.getStorageSync("PHONE_NUMBER")._openid
          }).remove({
            success: res => {
              console.log(res)
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
    const address = wx.getStorageSync("ADDRESS_DATA");
    let orderId = this.data.order_id;
    let _price = this.data.orderDeta._price;
    wx.showLoading({
      title: '下单成功，支付'
    });
    wx.cloud.callFunction({
      name: 'pay', // 调用pay函数
      data: {
        userinfo: wx.getStorageSync("PHONE_NUMBER"),
        _id: orderId,
        _price: _price,
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
        console.log(code != 200);
        if (code != 200) {
          wx.showModal({
            title: '提示',
            content: '支付失败',
            showCancel: false
          });
          return;
        }
        let fahuoData = {
          "character_string1": {
            "value": orderId
          },
          "thing2": {
            "value": "酒槑-全球甄选酒庄直供"
          },
          "phrase4": {
            "value": "已发货"
          },
          "amount3": {
            "value": _price
          },
          "thing5": {
            "value": address.adds
          }
        }
        wx.requestPayment({
          timeStamp: data.time_stamp,
          nonceStr: data.nonce_str,
          package: `prepay_id=${data.prepay_id}`,
          signType: 'MD5',
          paySign: data.sign,
          success: (res) => {
            console.log(res)
            wx.requestSubscribeMessage({
              tmplIds: ["kUDs8SHJje4imR-6BDn0Zn2NYfEpr8eBRxv1_SA4wvE", "gnHBhNtSkzWjQJ5frFsgWALQmOqGaCFExXTkXk7kKmY", "2SyIdAvJIk85fuTfdGhwnYGm9yuGEZFruexbM-9uO7k"],
              success: res => {
                if (res.errMsg = "requestSubscribeMessage:ok") {
                  wx.cloud.callFunction({
                    name: "subscribe",
                    data: {
                      templateId: "kUDs8SHJje4imR-6BDn0Zn2NYfEpr8eBRxv1_SA4wvE",
                      openId: wx.getStorageSync("PHONE_NUMBER")._openid,
                      data: {
                        order_num: orderId,
                        goods_name: "酒槑-全球甄选酒庄直供",
                        price: '¥' + _price,
                        message: "您的订单将在1-3个工作日邮寄",
                        pay_time: _this.getCurrentDate()
                      }
                    }
                  }).then(res => {
                    console.log(res);
                    _this.changeOrderType(orderId, function () {
                      _this.addSubsribe(orderId, fahuoData)
                      wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 1000
                      });
                      wx.redirectTo({
                        url: '/pages/orderDetail/orderDetail?orderid=' + orderId,
                      })
                    }, function () {
                      console.log('修改订单状态失败了')
                    })

                  }).catch(err => {
                    console.log("订阅消息发送失败")
                    _this.changeOrderType(orderId, function () {
                      _this.addSubsribe(orderId, fahuoData)
                      wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 1000
                      });
                      wx.redirectTo({
                        url: '/pages/orderDetail/orderDetail?orderid=' + orderId,
                      })
                    }, function () {
                      console.log('修改订单状态失败了')
                    })
                  })
                }
              },
              fail: err => {
                console.log(err);
              }
            })
          },
          fail: (res) => {
            console.log(res)
            wx.showToast({
              title: '取消支付',
              icon: 'none'
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/orderDetail/orderDetail?orderid=' + orderId,
              })
            }, 1000)
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

  getCurrentDate: function () {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    var hour = now.getHours(); //得到小时
    var minu = now.getMinutes(); //得到分钟
    var sec = now.getSeconds(); //得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
    return time;
  },

  addSubsribe: function (orderId, data) {
    wx.cloud.callFunction({
      name: 'addSubsribe',
      data: {
        orderId,
        templateId: 'gnHBhNtSkzWjQJ5frFsgWALQmOqGaCFExXTkXk7kKmY',
        data
      },
      complete: res => {
        wx.showToast({
          title: '已订阅发货提醒',
          icon: 'none'
        });
      }
    })
  },

  changeOrderType(order_id, fn, errFn) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'changeOrder',
      // 传给云函数的参数
      data: {
        _orderId: order_id,
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
      _orderId: orderid,
    }).get({
      success: res => {
        console.log(res.data[0])
        let data = res.data[0];
        data["_createtime"] = formatTime(data._createtime / 1000, "Y-M-D h:m:s");
        _this.setData({
          orderDeta: data,
        })
        if (data.address_id != "" || data.address_id || data.address_id != undefined || data.address_id != null) {
          _this.getAddressDeta(data.address_id);
        } else {
          _this.setData({
            showSkeleton: false
          })
        }
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