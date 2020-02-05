// pages/goodsClass/goodsClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classid: 0,
    sel_sort: 1,
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

  getGoodsClassList(index) {
    const _this = this;
    const db = wx.cloud.database();
    db.collection("goods").where({
      _payTypeIndex: String(index)
    }).get({
      success: res => {
        let data = res.data;
        data.forEach((item, index) => {
          item._type = item._type.split('，');
        })
        console.log(data)
        _this.setData({
          goodsClassList: data
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
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },

  selSort(e) {
    let {
      index
    } = e.currentTarget.dataset;
    let type = ""
    this.setData({
      sel_sort: index
    });
    if(index==0){
      type = "stock"
    }else if(index==1){
      type = "amount";
    }else if(index==2){
      type = "price";
    }else if(index==3){
      type = "price";
    }
    this.sort(type)
  },

  sort(type) {
    let arr = this.data.goodsClassList;
    //创建每次循环存储最大值得变量
    let max;
    //遍历数组，默认arr中的某一个元素为最大值，进行逐一比较
    for (let i = 0; i < arr.length; i++) {
      //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
      for (let j = i; j < arr.length; j++) {
        if (arr[i][type] < arr[j][type]) {
          //如果arr[j]大就把此时的值赋值给最大值变量max
          max = arr[j];
          arr[j] = arr[i];
          arr[i] = max;
        }
      }
    }
    this.setData({
      goodsClassList: arr
    })
  }
})