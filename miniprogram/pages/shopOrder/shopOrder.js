// miniprogram/pages/shopOrder/shopOrder.js
import {
  formatTime,isOwnEmpty
} from '../../utils/utils';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabData: [{
      title: '全部',
      btnIndex: '1',
      listName: 'stayDelivery'
    }, {
      title: '待付款',
      btnIndex: '1',
      listName: 'stayDelivery'
    }, {
      title: '已付款',
      btnIndex: '0',
      listName: 'stayPayOrder'
    }, {
      title: '已发货',
      btnIndex: '2',
      listName: 'okOrder'
    }, {
      title: '已完成',
      btnIndex: '',
      listName: 'allOrder'
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
    orderLists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const _this = this;
    this.setData({
      systemInfo: wx.getSystemInfoSync()
    });
    //获取订单列表
    _this.getOrderList(0);
  },

  /**
   * 获取订单列表
   * @param {} 
   */
  getOrderList(index) {
    const _this = this;
    const db = wx.cloud.database()
    db.collection("order").where({
      _openid: wx.getStorageSync("PHONE_NUMBER")._openid,
      _payType: index
    }).get({
      success: res => {
        console.log(res.data)
        let data = res.data;
        if(isOwnEmpty(data)){
          data = false;
        }else{
          data.forEach((item, index) => {
            if (item._createtime) {
              data[index]["_createtime"] = formatTime(item._createtime/1000, "Y-M-D h:m:s");
            }
          })
        }
        
        _this.setData({
          orderLists: data
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
    _this.setData({
      tabIndex,
      status: btnIndex,
      listName
    });
    _this.getOrderList(tabIndex);
  },

  detail(e) {
    console.log(e)
    let orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderid=' + orderid,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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