// miniprogram/pages/shopOrder/shopOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabData: [{ title: '全部', btnIndex: '1', listName: 'stayDelivery' }, { title: '待付款', btnIndex: '1', listName: 'stayDelivery' }, { title: '已付款', btnIndex: '0', listName: 'stayPayOrder' }, { title: '已发货', btnIndex: '2', listName: 'okOrder' }, { title: '待评价', btnIndex: '', listName: 'allOrder' }],
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
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      systemInfo: wx.getSystemInfoSync()
    })
  },

  /**
   * 点击订单状态按钮
   */
  tabsClick(e) {
    const _this = this;
    const tabIndex = e.currentTarget.dataset.index;
    const btnIndex = e.currentTarget.dataset.btnindex;
    const listName = e.currentTarget.dataset.listname;
    _this.setData({ tabIndex, status: btnIndex, listName });
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