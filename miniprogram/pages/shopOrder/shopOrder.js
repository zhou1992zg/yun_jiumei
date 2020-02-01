// miniprogram/pages/shopOrder/shopOrder.js
import {
  formatTime,
  isOwnEmpty
} from '../../utils/utils';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabData: [{
      title: '全部',
    }, {
      title: '待付款',
    }, {
      title: '待发货',
    }, {
      title: '已发货',
    }, {
      title: '已完成',
    }],
    tabIndex: 0,
    type: 1,
    status: '1',
    page: 1,
    listName: 'stayDelivery',
    dotLoadingHidden: true,
    clickOrderId: '',
    reasonList: ['收货人信息有误', '商品数量或款式需要调整', '有更优惠的购买方式', '商品缺货', '我不想买了', '其他原因'],
    reasonChoose: '',
    upWindowHidden: true,
    hiddenChooseOrderTypeWindow: true,
    navHeight: 0,
    popUpWindowHidden: true,
    loading: true,
    orderLists: [],
    showSkeleton: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    const index = o.index;
    wx.setStorageSync("ORDER_INDEX", index);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const _this = this;
    //获取订单列表
    _this.getOrderList();
  },

  /**
   * 获取订单列表
   * @param {} 
   */
  getOrderList() {
    const _this = this;
    const db = wx.cloud.database()
    let data = {};
    if (wx.getStorageSync("ORDER_INDEX") == 0) {
      data = {
        _openid: wx.getStorageSync("PHONE_NUMBER")._openid,
      }
    } else {
      data = {
        _openid: wx.getStorageSync("PHONE_NUMBER")._openid,
        _payType: Number(wx.getStorageSync("ORDER_INDEX")) - 1
      }
    }
    db.collection("order").where(data).get({
      success: res => {
        console.log(res.data)
        let data = res.data;
        if (isOwnEmpty(data)) {
          data = false;
        } else {
          data.forEach((item, index) => {
            if (item._createtime) {
              data[index]["_createtime"] = formatTime(item._createtime / 1000, "Y-M-D h:m:s");
            }
          })
        }

        _this.setData({
          orderLists: data,
          tabIndex: wx.getStorageSync("ORDER_INDEX"),
          showSkeleton: false
        })
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '获取订单失败了',
        })
      }
    });
  },

  /**
   * 点击订单状态按钮
   */
  tabsClick(e) {
    const _this = this;
    const tabIndex = e.currentTarget.dataset.index;
    const btnIndex = e.currentTarget.dataset.btnindex;
    const listName = e.currentTarget.dataset.listname;
    wx.setStorageSync("ORDER_INDEX", tabIndex);
    _this.setData({
      tabIndex,
      status: btnIndex,
      listName,
    });
    _this.getOrderList();
  },

  detail(e) {
    console.log(e)
    let orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderid=' + orderid,
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})