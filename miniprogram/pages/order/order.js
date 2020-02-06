// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsData: [],
    payTypeIndex: 0,
    payTypeArray: ['快递邮寄', '上门自提', '同城寄送'],
    addressData: {},
    postage: 14.5,
  },

  onLoad: function (o) {
    const _this = this;
    const db = wx.cloud.database();
    _this.setData({
      buyGoodsId: o.id || ''
    })
    db.collection("address-list").where({
      _openid: wx.getStorageSync("PHONE_NUMBER")._openid,
    }).get({
      success: res => {
        wx.setStorageSync("ADDRESS_DATA", res.data[0]);
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
    const _this = this;
    _this.getPageLu(function (url) {
      if (url == "pages/goodsDetail/goodsDetail") {
        const db = wx.cloud.database();
        db.collection("goods").where({
          _id: _this.data.buyGoodsId,
        }).get({
          success: res => {
            console.log(res.data)
            let goodsCar = res.data;
            goodsCar[0].count = 1;
            goodsCar[0].selected = true;
            _this.setData({
              addressData: wx.getStorageSync("ADDRESS_DATA"),
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
          addressData: wx.getStorageSync("ADDRESS_DATA"),
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
    // 最后赋值到data中渲染到页面
    this.setData({
      goodsCar: list,
      totalPrice: total.toFixed(2),
    });
  },

  toBuyGoods: function () {
    const _this = this;
    let goods_data = [];
    let orderPrice = 0;
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
      address_id: wx.getStorageSync("ADDRESS_DATA")._id,
      distribution_way: _this.data.payTypeIndex,
      goods_data: goods_data,
      _price: orderPrice
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
        console.log(res.result._id)
        wx.setStorageSync("GOODSCAR", []);
        wx.hideLoading();
        _this.pay(res.result._id, buyData._price);
      }
    })
  },

  // 订单支付
  pay(orderId, _price) {
    const _this = this;
    wx.showLoading({
      title: '下单成功，支付'
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
  }
})