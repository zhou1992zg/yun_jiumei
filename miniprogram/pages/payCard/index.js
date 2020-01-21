Page({

  /**
   * 页面的初始数据
   */
  data: {
    carisShow: false, //购物车是否有商品
    isChecked: true, //全选状态设置
    isEdit: true, //是否编辑状态
    isSettlementRed: true, //红色结算按钮状态
    isSettlement: false, //红色结算按钮状态
    idDeteleRed: false, //红色删除按钮
    idDetel: false, //灰色删除按钮
    isSelect: false, //是否为编辑状态
    goodsCar: [], //用来接收接口返回数据
    orderinfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 编辑事件
  editGood: function () {
    this.setData({
      isEdit: false,
      isSelect: true,
      isSettlementRed: false,
      isSettlement: false,
      idDeteleRed: true,
      idDetel: false
    });
  },
  // 完成事件
  editComplete: function () {
    this.setData({
      isEdit: true,
      isSettlementRed: true,
      isSettlement: false,
      idDeteleRed: false,
      idDetel: false
    });
  },
  // 全选事件
  checkAll: function () {
    let isChecked = this.data.isChecked; //获取全选状态
    let isSettlementRed = this.data.isSettlementRed; //获取红色结算按钮的状态
    let isSettlement = this.data.isSettlement; //获取灰色结算按钮的状态
    isChecked = !isChecked;
    isSettlementRed = !isSettlementRed;
    isSettlement = !isSettlement;
    let list = this.data.goodsCar;
    if (this.data.isSelect) {
      // 设置全选状态
      for (let i = 0; i < list.length; i++) {
        list[i].selected = isChecked;
        // 判断是否全选中
        if (list[i].selected) {
          this.data.isChecked = false;
          isSettlementRed = false;
          isSettlement = false;
        }
      }
      this.setData({
        isChecked: isChecked,
        goodsCar: list,
        isSettlementRed: isSettlementRed, //隐藏红色结算
        isSettlement: isSettlement, //显示灰色结算
        idDeteleRed: true,
        idDetel: false
      });
    } else {
      // 设置全选状态
      for (let i = 0; i < list.length; i++) {
        list[i].selected = isChecked;
        // 判断是否全选中
        if (list[i].selected) {
          console.log(1)
          this.data.isChecked = false;
          isSettlementRed = true;
          isSettlement = false;
        }
      }
      this.setData({
        isChecked: isChecked,
        goodsCar: list,
        isSettlementRed: isSettlementRed, //隐藏红色结算
        isSettlement: isSettlement, //显示灰色结算
        idDeteleRed: false,
        idDetel: false
      });
    }

    this.totalPrice();
  },
  //单选事件
  selectShop: function (e) {
    let _this = this;
    // 获取当前选项的索引
    let index = e.currentTarget.dataset.index;
    // 获取商品列表
    let list = this.data.goodsCar;
    // 默认全选
    this.data.isChecked = true;
    // 操作当前选项
    list[index].selected = !list[index].selected;
    var isUncheck = true;
    // 当前为删除操作状态时
    if (this.data.isSelect) {
      for (var i = list.length - 1; i >= 0; i--) {
        // 判断是否全选中
        if (!list[i].selected) {
          this.data.isChecked = false;
        }
        //判断是否全没选
        else if (list[i].selected) {
          isUncheck = false;
        }
      }
      this.setData({
        goodsCar: list,
        isChecked: false,
        isSettlement: false,
        isSettlementRed: false,
        idDeteleRed: !isUncheck,
        idDetel: isUncheck
      })
    } else {
      for (var i = list.length - 1; i >= 0; i--) {
        // 判断是否全选中
        if (!list[i].selected) {
          this.data.isChecked = false;
        }
        //判断是否全没选
        else if (list[i].selected) {
          this.data.isSettlementRed = true; //红色结算按钮状态
          this.data.isSettlement = false; //灰色结算按钮状态
          this.data.idDeteleRed = false; //红色删除按钮
          this.data.idDetel = false; //灰色删除按钮
          isUncheck = false;
        }
      }
      // 重新渲染数据
      this.setData({
        goodsCar: list,
        isChecked: this.data.isChecked,
        isSettlement: isUncheck,
        isSettlementRed: !isUncheck
      })
    }
    console.log(this.data.goodsCar)
    this.totalPrice();
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
      totalPrice: total.toFixed(2)
    });
  },
  // 批量删除
  deteleMore: function () {
    var _this = this;
    let list = this.data.goodsCar;
    wx.showModal({
      title: '提示',
      content: '确认删除这些商品吗',
      success: function (res) {
        if (res.confirm) {
          for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].selected) {
              list.splice(i, 1);
              _this.setData({
                goodsCar: list
              });
              // 如果数据为空
              if (!list.length) {
                _this.setData({
                  carisShow: true
                });
              } else {
                // 调用金额渲染数据
                _this.totalPrice();
              }
            } else {
              console.log(res);
            }
          }
        }
      }
    })

  },
  //删除单个商品
  deteleGood: function (e) {
    var that = this;
    // 获取索引
    const index = e.currentTarget.dataset.index;
    // 获取商品列表数据
    let list = this.data.goodsCar;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function (res) {
        if (res.confirm) {
          // 删除索引从1
          list.splice(index, 1);
          // 页面渲染数据
          that.setData({
            goodsCar: list
          });
          // 如果数据为空
          if (!list.length) {
            that.setData({
              carisShow: true
            });
          } else {
            // 调用金额渲染数据
            that.totalPrice();
          }
        } else {
          console.log(res);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  // 结算生成订单
  goOrder: function () {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认生成订单？',
      success: function (res) {
        if (res.confirm) {
          // 携带订单信息生成订单
          let list = _this.data.goodsCar;
          let nlist = [];
          for (let i = 0; i < list.length; i++) {
            if (list[i].selected) {
              nlist.push(list[i]);
            }
          }
          _this.data.orderinfo = nlist; //将订单的信息传给API.js
          wx.setStorageSync("ORDERINFO", nlist);
          wx.navigateTo({
            url: '/pages/order/order'
          })
        } else {
          console.log(res);
        }
      }
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
    if (!wx.getStorageSync("PHONE_NUMBER")) {
      var pages = getCurrentPages(); //获取加载的页面
      var currentPage = pages[pages.length - 1]; //获取当前页面的对象
      var url = currentPage.route; //当前页面url
      console.log(url)
      wx.navigateTo({
        url: '../login/login' + "?url=" + url,
      });
      return;
    }
    this.data.goodsCar = wx.getStorageSync("GOODSCAR");
    this.totalPrice();
  },
})