// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsData: [],
    payTypeIndex: 2,
    payTypeArray: ['快递邮寄', '上门自提', '同城配送'],
    addressData: {},
    postage: 14.5,
  },

  onLoad: function (o) {
    console.log('onLoad==>');
    const _this = this;
    console.log(wx.getStorageSync("PHONE_NUMBER"))
    _this.setData({
      buyGoodsId: o.id || ''
    })
  },

  /**
   * 判断地址是否在旌阳区
   */
  getAddressJY(addressData) {
    const _this = this;
    console.log(addressData ? addressData.info.indexOf("旌阳区") != -1 ? '同城客人' : '外地客人' : false);
    _this.setData({
      addressJyq: addressData ? addressData.info.indexOf("旌阳区") != -1 : false
    })
  },

  onHide: function () {
    console.log('onHide');
    wx.removeStorageSync('ADDRESS_DATA')
  },

  isKong: function (data) {
    if (Object.keys(data).length === 0) {
      return true; //如果为空，返回false
    }
    return false;
  },

  onShow: function () {
    const _this = this;
    const db = wx.cloud.database();
    let addressData = wx.getStorageSync("ADDRESS_DATA");
    console.log(_this.isKong(addressData))
    console.log(wx.getStorageSync("ADDRESS_DATA"))
    if (_this.isKong(addressData)) {
      console.log('hahah')
      db.collection("address-list").where({
        _openid: wx.getStorageSync("PHONE_NUMBER")._openid,
      }).get({
        success: res => {
          //显示默认的地址
          const addressList = res.data;
          if (addressList.length == 0) {
            return;
          }
          let chooseAddress = {};
          console.log(addressList);
          addressList.forEach((item, index) => {
            if (item.isdefault == 1) {
              chooseAddress = item;
            }
          });
          console.log(addressList);
          if (_this.isKong(chooseAddress)) {
            wx.showToast({
              title: '没有默认地址可用',
              icon: 'none',
            })
            return;
          }
          wx.setStorageSync("ADDRESS_DATA", chooseAddress);
          wx.showToast({
            title: '使用默认地址',
            icon: 'success',
          })
          _this.setData({
            addressData: chooseAddress
          });
          addressData = chooseAddress;
          _this.getAddressJY(chooseAddress);
        },
        fail: err => {
          wx.showToast({
            icon: "none",
            title: '获取地址失败',
          })
        }
      });
    } else {
      wx.showToast({
        title: '指定使用该地址',
        icon: 'success',
      })
      _this.setData({
        addressData
      });
      _this.getAddressJY(addressData);
    }
    _this.getPageLu(function (url) {
      if (url == "pages/goodsDetail/goodsDetail") {
        db.collection("goods").where({
          _id: _this.data.buyGoodsId,
        }).get({
          success: res => {
            console.log(res.data)
            let goodsCar = res.data;
            goodsCar[0].count = 1;
            goodsCar[0].selected = true;
            _this.setData({
              goodsData: wx.getStorageSync("ORDERINFO"),
              goodsCar
            })
            _this.totalPrice();
          },
          fail: err => {
            wx.showToast({
              icon: "none",
              title: '获取直购商品失败',
            })
          }
        });
      } else {
        _this.setData({
          goodsData: wx.getStorageSync("ORDERINFO"),
          goodsCar: wx.getStorageSync("GOODSCAR")
        })
        _this.totalPrice();
      }
    });
  },

  //获取上个页面路径
  getPageLu: function (fn) {
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 2]; //获取当前页面的对象
    let url = currentPage.route; //当前页面url
    console.log(url)
    fn && fn(url);
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

  // 查询邮费
  getYouFei() {
    wx.cloud.callFunction({
      name: 'http', // 调用pay函数
      data: {
        "originalsStreet": "上海-上海市-长宁区",
        "originalsaddress": "上海-上海市-长宁区",
        "sendDateTime": "2018-08-07 11:00:03",
        "totalVolume": 0.001,
        "totalWeight": 500,
        "logisticCompanyID": "DEPPON"
      }, // 支付金额
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        console.log(res);
      }
    });
  },

  toaddressPage() {
    wx.navigateTo({
      url: '/pages/address/address',
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
    console.log(list)
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      if (list[i].selected) {
        // 所有价格加起来 count_money
        total += list[i].count * list[i].price;
      }
    }
    // 同城满100免配送费
    let poorPrice = 100 - total;
    if (poorPrice <= 0) {
      poorPrice = 0;
    };
    // 最后赋值到data中渲染到页面
    this.setData({
      poorPrice: poorPrice.toFixed(2),
      goodsCar: list,
      totalPrice: total.toFixed(2),
    });
  },

  toBuyGoods: function () {
    const _this = this;
    let goods_data = [];
    let orderPrice = 0;
    // 如果是同城配送和快递配送 必须选择地址
    if (_this.data.payTypeIndex == 0 || _this.data.payTypeIndex == 2) {
      if (_this.isKong(wx.getStorageSync("ADDRESS_DATA"))) {
        wx.showToast({
          title: '您还未填写收货地址',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    _this.data.goodsCar.forEach((item) => {
      console.log(item)
      orderPrice = orderPrice + Number(item.price) * Number(item.count);
      let goods_list = {
        goods_id: item.goods_id,
        goods_url: item._shareList[0].fileID,
        price: item.price,
        count: item.count,
        goods_name: item.goods_name
      }
      goods_data.push(goods_list);
    });

    let buyData = {
      address_id: _this.data.payTypeIndex == 1 ? "" : _this.data.addressData._id,
      distribution_way: _this.data.payTypeIndex,
      goods_data: goods_data,
      _price: orderPrice,
      _freeBPostage: _this.data.addressJyq && orderPrice >= 100, // 判断是否是同城 订单是否满100
    };
    _this.addOrder(buyData);
  },

  // 下单
  addOrder(buyData) {
    const _this = this;
    wx.showLoading({
      title: '下单中'
    });
    wx.cloud.callFunction({
      name: 'order',
      data: {
        buyData
      },
      complete: res => {
        console.log(res)
        wx.setStorageSync("GOODSCAR", []);
        wx.hideLoading();
        _this.pay(res.result._orderId, buyData._price);
      }
    })
  },

  // 订单支付
  pay(orderId, _price) {
    const _this = this;
    const address = wx.getStorageSync("ADDRESS_DATA");
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
  }
})