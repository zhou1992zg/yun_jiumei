// pages/goodsClass/goodsClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classid: 0,
    sel_sort: 1,
    clickIndex: 0,
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      classid: options.classid
    })
    this.getGoodsClassList();
  },

  getGoodsClassList() {
    const _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const db = wx.cloud.database();
    let index = _this.data.classid;
    let type = _this.data.type;
    let clickIndex = _this.data.clickIndex;
    db.collection("goods").where({
      _payTypeIndex: String(index)
    }).get({
      success: res => {
        let data = res.data;
        data.forEach((item, index) => {
          item._type = item._type.split('，');
        })
        console.log(data)
        if(clickIndex % 2 != 0){
          data.sort(_this.compareBTS(type))
        }else if(clickIndex % 2 == 0){
          data.sort(_this.compareSTB(type))
        }else{
          data.sort(_this.compareBTS(type))
        }
        _this.setData({
          goodsClassList: data
        })
        wx.hideLoading();
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
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },

  selSort(e) {
    let {
      index
    } = e.currentTarget.dataset;
    let type = "";
    let clickIndex = this.data.clickIndex;
    if (index == 1) {
      type = "";
      clickIndex = 0;
    } else if (index == 2) {
      type = "amount";
      clickIndex = 0;
    } else if (index == 3) {
      type = "price";
      clickIndex = clickIndex + 1;
    } else if (index == 4) {
      type = "";
      clickIndex = 0;
    }
    console.log(clickIndex)
    this.setData({
      sel_sort: index,
      type,
      clickIndex,
    })
    this.getGoodsClassList(type)
  },

  /**
   * 从大到小
   * @param {} property 
   */
  compareBTS(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  },

  /**
   * 从小到大
   * @param {} property
   */
  compareSTB(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  }
})