// pages/goodsDetail/goodsDetail.js
let myTimer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carGoodsNum: 0,
    currentNum: 0,
    moveImg: false,
    countdownText: "结束",
    isOver: false,
    countdown: {
      dd: "0",
      hh: "00",
      mm: "00",
      ss: "00"
    }
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
    this.getCarGoodsNum(wx.getStorageSync("GOODSCAR"), false);
    this.getPageStyle();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(myTimer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(myTimer);
  },

  getPageStyle: function () {
    const _this = this;
    const db = wx.cloud.database()
    db.collection("page-style").where({
      _id: "Z9ddEpXv8y6W3H1Wy3hocbOHDOy79f0Wcuna2fENKI4yQuXT"
    }).get({
      success: res => {
        const pageStyle = res.data[0].pageStyle;
        console.log(pageStyle)
        _this.setData({
          content: pageStyle.content,
          fontColor: pageStyle.fontColor,
          bgColor: pageStyle.bgColor,
          radioChecked: pageStyle.radioChecked
        });
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '获取banner失败',
        })
      }
    });
  },

  closeBtn() {
    wx.setStorageSync("SHAREBOX", true)
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
        data.amount_100 = parseInt(data.amount / 100);
        if (data.delivery_time) {
          data.delivery_time = _this.getDateTime(data.delivery_time / 1000, "Y年MM月dd日")
        }
        console.log(data)
        _this.setData({
          goodsDate: data
        });
        _this.countDown(data.countdown_KS, data.countdown_JS);
      },
      fail: err => {
        console.log(err)
        console.log("获取商品详情失败");
      }
    });
  },

  countDown(countdown_KS, countdown_JS) {
    const _this = this;
    var timestamp = Date.parse(new Date());
    let countdownText = "";
    myTimer = setInterval(function () {
      timestamp = timestamp + 1000;
      let millisecond = 0;
      let isOver = false;
      if (timestamp < countdown_KS) {
        console.log("距开始")
        countdownText = "开始";
        isOver = false;
        millisecond = countdown_KS - timestamp;
      } else if (countdown_KS <= timestamp && timestamp < countdown_JS) {
        console.log("距结束")
        countdownText = "结束";
        isOver = false;
        millisecond = countdown_JS - timestamp;
      } else if (timestamp >= countdown_JS) {
        isOver = true;
        clearInterval(myTimer);
      }
      let dd = Math.floor(millisecond / 86400000);
      let hh = Math.floor((millisecond / 3600000) % 24);
      let mm = Math.floor((millisecond / 60000) % 60);
      let ss = Math.floor((millisecond / 1000) % 60);
      hh = hh < 10 ? "0" + hh : hh;
      mm = mm < 10 ? "0" + mm : mm;
      ss = ss < 10 ? "0" + ss : ss;
      _this.setData({
        countdownText,
        isOver,
        countdown: {
          dd: dd,
          hh: hh,
          mm: mm,
          ss: ss
        }
      })
    }, 1000)
  },

  getDateTime(timestamp, format) {
    const date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const o = {
      'Y+': date.getFullYear(),
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
      }
    }
    return format;
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
    if (!wx.getStorageSync("PHONE_NUMBER")) {
      var pages = getCurrentPages(); //获取加载的页面
      var currentPage = pages[pages.length - 1]; //获取当前页面的对象
      var url = currentPage.route; //当前页面url
      let urlId = encodeURIComponent(url + '?id=' + _this.data.goods_id);
      console.log(urlId)
      wx.navigateTo({
        url: '../login/login' + "?url=" + urlId,
      });
      return;
    }
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