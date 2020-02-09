// pages/goodsClass/goodsClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classid: 0,
    sel_sort: 1,
    clickIndex: 0,
    type: '',
    hasMore: true,
    pageIndex: 1,
    goodsClassList: [],
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
    let index = _this.data.classid;
    let type = _this.data.fieldName;
    console.log(type)
    let clickIndex = _this.data.clickIndex;
    let order = '';
    if (clickIndex == 0) {
      order = 'desc';
    } else if (clickIndex % 2 != 0) {
      order = 'desc'
    } else if (clickIndex % 2 == 0) {
      order = 'asc'
    }

    console.log('data==>', {
      dbName: 'goods',
      pageIndex: _this.data.pageIndex,
      pageSize: 10,
      fieldName: type,
      order: order,
      filter: {
        _payTypeIndex: String(index)
      }
    })
    wx.cloud.callFunction({
      name: 'paginationFn',
      data: {
        dbName: 'goods',
        pageIndex: _this.data.pageIndex,
        pageSize: 0,
        fieldName: type,
        order: order,
        filter: {
          _payTypeIndex: String(index)
        }
      }
    }).then(res => {
      console.log(res);
      let data = res.result.data;
      console.log(data)
      data.forEach((item, index) => {
        console.log(item)
        item._type = item._type.split('，');
      })
      let goodsClassList = _this.data.goodsClassList.concat(data);
      console.log(goodsClassList)
      console.log(data)

      _this.setData({
        goodsClassList: goodsClassList,
        hasMore: res.result.hasMore
      })
      wx.hideLoading();
      if (!_this.data.goodsClassList.length || _this.data.goodsClassList.length == 0) {
        wx.showToast({
          title: '暂无商品，敬请期待',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })
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
      type = undefined;
      clickIndex = 0;
    } else if (index == 2) {
      type = "amount";
      clickIndex = 0;
    } else if (index == 3) {
      type = "price";
      clickIndex = clickIndex + 1;
    } else if (index == 4) {
      type = undefined;
      clickIndex = 0;
    }
    console.log(clickIndex)
    this.setData({
      sel_sort: index,
      fieldName: type,
      clickIndex,
      pageIndex: 1,
      goodsClassList: []
    })
    this.getGoodsClassList(type)
  },

  /**
   * 从大到小
   * @param {} property 
   */
  // compareBTS(property) {
  //   return function (a, b) {
  //     var value1 = a[property];
  //     var value2 = b[property];
  //     return value2 - value1;
  //   }
  // },

  /**
   * 从小到大
   * @param {} property
   */
  // compareSTB(property) {
  //   return function (a, b) {
  //     var value1 = a[property];
  //     var value2 = b[property];
  //     return value1 - value2;
  //   }
  // },

  onReachBottom() {
    const _this = this;
    if (!_this.data.hasMore) {
      return;
    }
    console.log('继续加载》');
    _this.setData({
      pageIndex: _this.data.pageIndex + 1
    });
    console.log(_this.data.pageIndex);
    _this.getGoodsClassList();
  }
})