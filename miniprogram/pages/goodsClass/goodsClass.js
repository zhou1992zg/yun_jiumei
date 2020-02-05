// pages/goodsClass/goodsClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classid:0,
    sel_sort:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title,
    })
    let classid = options.classid;
    this.getGoodsClassList(classid);
  },

  getGoodsClassList(index){
    const _this = this;
    const db = wx.cloud.database();
    db.collection("goods").where({
      _payTypeIndex: String(index)
    }).get({
      success: res => {
        let data = res.data;
        data.forEach((item,index)=>{
          item._type = item._type.split('，');
        })
        console.log(data)
        _this.setData({
          goodsClassList:data
        })
      },
      fail: err => {
        console.log(`获取${{index}}失败`);
      }
    });
  },

  viewDetailFunc(e) {
    let {
      id
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id='+id
    })
  },
})