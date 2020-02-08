/**
 * 开单商品列表**/
let app = getApp();
const utils = require('../../utils/util');
const Dialog = require('../../components/tty-ui/dialog/dialog');
const multi = utils.floatOpration.multi;
const add = utils.floatOpration.add;
Page({
  data: {
    procurement: true, // 开单页数据
    pageTotalNum: 0, // 购物篮商品数量
    pageTotalMoney: 0, // 购物篮商品价格
    basePageTotalNum: 0, // 手动输入时的基础总数
    typeData: [], // 列表数据
    useData: [], // 过度数据
    goodsData: [], // 购物篮商品列表
    showSkeleton: true //骨架屏显示隐藏
  },
  onLoad() {
    this.getData()
  },
  async getData() {
    const _this = this;
    const db = wx.cloud.database();
    let typeData = [];
    await db.collection("goods").where({
      _payTypeIndex: "0"
    }).get({
      success: res => {
        let data = res.data;
        console.log('goodsList0==>', data);
        let goodsList = {
          goods_category_one_id: "221310651891449856",
          goods_category_two_length: data.length,
          goods_class_image:"cloud://jiumei-yz5qq.6a69-jiumei-yz5qq-1301137644/WechatIMG219.jpeg",
          goods_category_one_name: "红葡萄酒",
          goods_category_two: [{
            goods_category_two_id: "221310651891449857",
            goods_category_two_name: "红葡萄酒",
            goods: data
          }]
        }
        typeData[0] = goodsList;
      },
      fail: err => {
        console.log("获取商品分类0失败");
      }
    });
    await db.collection("goods").where({
      _payTypeIndex: "1"
    }).get({
      success: res => {
        let data = res.data;
        console.log('goodsList1==>', data);
        let goodsList = {
          goods_category_one_id: "221310651891449858",
          goods_category_two_length: data.length,
          goods_class_image:"cloud://jiumei-yz5qq.6a69-jiumei-yz5qq-1301137644/WechatIMG221.jpeg",
          goods_category_one_name: "白葡萄酒",
          goods_category_two: [{
            goods_category_two_id: "221310651891459857",
            goods_category_two_name: "白葡萄酒",
            goods: data
          }]
        }
        typeData[1] = goodsList;
      },
      fail: err => {
        console.log("获取商品分类1失败");
      }
    });
    await db.collection("goods").where({
      _payTypeIndex: "2"
    }).get({
      success: res => {
        let data = res.data;
        console.log('goodsList2==>', data);
        let goodsList = {
          goods_category_one_id: "221310651896449858",
          goods_category_two_length: data.length,
          goods_class_image:"cloud://jiumei-yz5qq.6a69-jiumei-yz5qq-1301137644/WechatIMG223.jpeg",
          goods_category_one_name: "甜葡萄酒",
          goods_category_two: [{
            goods_category_two_id: "221310651891449857",
            goods_category_two_name: "甜葡萄酒",
            goods: data
          }]
        }
        typeData[2] = goodsList;
      },
      fail: err => {
        console.log("获取商品分类2失败");
      }
    });
    await db.collection("goods").where({
      _payTypeIndex: "3"
    }).get({
      success: res => {
        let data = res.data;
        console.log('goodsList3==>', data);
        let goodsList = {
          goods_category_one_id: "221310651896449860",
          goods_category_two_length: data.length,
          goods_class_image:"cloud://jiumei-yz5qq.6a69-jiumei-yz5qq-1301137644/WechatIMG226.jpeg",
          goods_category_one_name: "起泡酒",
          goods_category_two: [{
            goods_category_two_id: "221310651891449857",
            goods_category_two_name: "起泡酒",
            goods: data
          }]
        }
        typeData[3] = goodsList;
      },
      fail: err => {
        console.log("获取商品分类3失败");
      }
    });
    await db.collection("goods").where({
      _payTypeIndex: "4"
    }).get({
      success: res => {
        let data = res.data;
        console.log('goodsList4==>', data);
        let goodsList = {
          goods_category_one_id: "221310651896449862",
          goods_category_two_length: data.length,
          goods_class_image:"cloud://jiumei-yz5qq.6a69-jiumei-yz5qq-1301137644/WechatIMG228.jpeg",
          goods_category_one_name: "百元畅饮",
          goods_category_two: [{
            goods_category_two_id: "221310651891449857",
            goods_category_two_name: "百元畅饮",
            goods: data
          }]
        }
        typeData[4] = goodsList;
      },
      fail: err => {
        console.log("获取商品分类4失败");
      }
    });
    await db.collection("goods").where({
      _payTypeIndex: "5"
    }).get({
      success: res => {
        let data = res.data;
        console.log('goodsList5==>', data);
        let goodsList = {
          goods_category_one_id: "221310651896449864",
          goods_category_two_length: data.length,
          goods_class_image:"cloud://jiumei-yz5qq.6a69-jiumei-yz5qq-1301137644/WechatIMG230.jpeg",
          goods_category_one_name: "人气爆款",
          goods_category_two: [{
            goods_category_two_id: "221310651891449857",
            goods_category_two_name: "人气爆款",
            goods: data
          }]
        }
        typeData[5] = goodsList;
      },
      fail: err => {
        console.log("获取商品分类5失败");
      }
    });
    await db.collection("goods").where({
      _payTypeIndex: "6"
    }).get({
      success: res => {
        let data = res.data;
        console.log('goodsList6==>', data);
        let goodsList = {
          goods_category_one_id: "221310651896449866",
          goods_category_two_length: data.length,
          goods_class_image:"cloud://jiumei-yz5qq.6a69-jiumei-yz5qq-1301137644/WechatIMG232.jpeg",
          goods_category_one_name: "精品酒具",
          goods_category_two: [{
            goods_category_two_id: "221310651891449857",
            goods_category_two_name: "精品酒具",
            goods: data
          }]
        }
        typeData[6] = goodsList;
      },
      fail: err => {
        console.log("获取商品分类6失败");
      }
    });
    await db.collection("goods").where({
      _payTypeIndex: "7"
    }).get({
      success: res => {
        let data = res.data;
        console.log('goodsList7==>', data);
        let goodsList = {
          goods_category_one_id: "221310651896449868",
          goods_category_two_length: data.length,
          goods_class_image:"cloud://jiumei-yz5qq.6a69-jiumei-yz5qq-1301137644/WechatIMG234.jpeg",
          goods_category_one_name: "店主优选",
          goods_category_two: [{
            goods_category_two_id: "221310651891449857",
            goods_category_two_name: "店主优选",
            goods: data
          }]
        }
        typeData[7] = goodsList;
      },
      fail: err => {
        console.log("获取商品分类7失败");
      }
    });
    setTimeout(function () {
      _this.setData({
        typeData,
        showSkeleton: false
      })
    }, 3000)
  },

  // 重置购物篮数据
  resetBasket(basketData) {
    this.setData({
      goodsData: basketData.goods,
      pageTotalMoney: basketData.pageMoney,
      pageTotalNum: basketData.pageNum,
    })
    this.dealWithAddData()
  },
  /*数据提取*/
  dataSet(res) {
    let useData = [];
    res.forEach((item, i) => {
      item.goods_category_two.forEach((itemTwo, j) => {
        itemTwo.goods.length && itemTwo.goods.forEach((itemThr, k) => {
          itemThr.typeOneIndex = i;
          itemThr.typeTwoIndex = j;
          itemThr.goodsIndex = k;
          useData.push(itemThr);
        })
      })
    })
    this.setData({
      useData: useData
    })
  },
  /*重新对应购物框数据和页面数据*/
  dealWithAddData() {
    let goodsData = this.data.goodsData;
    let data = this.data.typeData;
    let useData = this.data.useData;
    for (let i = 0; i < goodsData.length; i++) {
      let goodsId = goodsData[i].goods_id;
      for (let j = 0; j < useData.length; j++) {
        if (goodsId === useData[j].goods_id) {
          goodsData[i].typeOneIndex = useData[j].typeOneIndex;
          goodsData[i].typeTwoIndex = useData[j].typeTwoIndex;
          goodsData[i].goodsIndex = useData[j].goodsIndex;
          useData[j].count = goodsData[i].count;
          data[useData[j].typeOneIndex].goods_category_two[useData[j].typeTwoIndex].goods[useData[j].goodsIndex].count = goodsData[i].count;
        }
      }
    }
    this.setData({
      goodsData: goodsData,
      typeData: data
    });
  },
  /*购物框添加事件*/
  basketEvent(e) {
    if (e.detail.action === 'getNum') {
      this.setData({ // 获取计算基数
        basePageTotalNum: this.data.pageTotalNum - e.detail.num
      });
      return
    }
    let {
      totalNum, // 商品选择的数量
      goodsId, // 修改商品时对应的商品id
      action // 操作行为
    } = e.detail;
    let {
      typeData, // 列表数据
      goodsData, // 购物篮数据
      pageTotalNum // 页面商品总数
    } = this.data;

    if (action === 'plus') {
      pageTotalNum++;
    } else if (action === 'minus') {
      pageTotalNum--;
    } else if (action === 'change') {
      pageTotalNum = this.data.basePageTotalNum + totalNum;
    }
    if (pageTotalNum < 0) {
      pageTotalNum = 0;
    }
    for (let i = 0; i < goodsData.length; i++) {
      if (goodsData[i].goods_id === goodsId) {
        // 获取索引，处理列表商品数量
        let typeOneIndex = goodsData[i].typeOneIndex;
        let typeTwoIndex = goodsData[i].typeTwoIndex;
        let goodsIndex = goodsData[i].goodsIndex;
        let count = 0;

        if (action === 'plus') {
          goodsData[i].count++;
          count = goodsData[i].count
        } else if (action === 'minus') {
          goodsData[i].count--;
          count = goodsData[i].count
          if (goodsData[i].count <= 0) {
            goodsData[i].count = 0;
            goodsData.splice(i, 1);
          }
        } else if (action === 'change') {
          if (totalNum <= 0) {
            goodsData[i].count = 0;
          } else {
            goodsData[i].count = totalNum;
          }
          count = goodsData[i].count
          // 失去焦点，数量为0，删除
        } else if (action === 'blur' && goodsData[i].count === 0) {
          count = goodsData[i].count
          goodsData.splice(i, 1);
        }
        typeData[typeOneIndex].goods_category_two[typeTwoIndex].goods[goodsIndex].count = count;
        break
      }
    }

    this.setData({
      goodsData,
      typeData,
      pageTotalNum,
      basePageTotalNum: pageTotalNum - totalNum
    });
    this.calculateMoney(goodsData); // 计算总金额
  },

  viewDetailFunc(e) {
    let {
      id
    } = e.detail;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + id
    })
  },
  
  /*商品列表添加事件*/
  contentEvent(e) {
    let {
      totalNum,
      action,
      typeOneIndex,
      typeTwoIndex,
      goodsIndex
    } = e.detail;
    if (action === 'getNum' || action === 'blur') {
      this.setData({ // 获取总基数
        basePageTotalNum: this.data.pageTotalNum - e.detail.num
      });
      return
    }
    if (action === 'overStock') {
      Dialog({
        message: '该商品库存不够啦~',
        confirmButtonText: '我知道了',
        selector: '#tty-dialog-msg'
      }).then(() => {});
      return
    }
    this.addGoods(totalNum, action, typeOneIndex, typeTwoIndex, goodsIndex);
  },
  /*添加商品*/
  addGoods(totalNum, action, typeOneIndex, typeTwoIndex, goodsIndex) {
    let {
      typeData,
      goodsData,
      pageTotalNum
    } = this.data;
    let goods = typeData[typeOneIndex].goods_category_two[typeTwoIndex].goods[goodsIndex];
    typeData[typeOneIndex].goods_category_two[typeTwoIndex].goods[goodsIndex].count = totalNum;
    if (action === 'plus') {
      pageTotalNum++; // 商品总数
    } else if (action === 'minus') {
      pageTotalNum--;
    } else if (action === 'change') {
      pageTotalNum = this.data.basePageTotalNum + totalNum;
    }
    if (pageTotalNum < 0) {
      pageTotalNum = 0;
      return
    }
    goods.count = totalNum;
    goods.typeOneIndex = typeOneIndex;
    goods.typeTwoIndex = typeTwoIndex;
    goods.goodsIndex = goodsIndex;
    if (totalNum === 1 && action === 'plus') { // 购物篮里没有，则新增
      goodsData.unshift(goods);
    } else {
      if (goodsData.includes(goods)) { // 如果购物篮中已有商品，在原有基础上加1
        let index = goodsData.indexOf(goods)
        totalNum === 0 ? goodsData.splice(index, 1) : goodsData[index].count = totalNum;
      } else { // 如果购物篮中没有，则添加（针对手动修改）
        goodsData.unshift(goods);
      }
    }

    this.setData({
      goodsData,
      typeData,
      pageTotalNum,
      basePageTotalNum: pageTotalNum - totalNum
    });
    this.calculateMoney(goodsData);
  },
  /*计算价格*/
  calculateMoney(goodsData) {
    let pageTotalMoney = 0;
    let price = 0;
    for (let i = 0; i < goodsData.length; i++) {
      price = Number(goodsData[i].price);
      pageTotalMoney = add(pageTotalMoney, multi(price, goodsData[i].count));
    }
    this.setData({
      pageTotalMoney: pageTotalMoney
    });
  },
  /*清除购物框*/
  clearAll() {
    let data = this.data.typeData;
    let goodsData = this.data.goodsData;
    let typeOneIndex, typeTwoIndex, goodsIndex;
    for (let i = 0; i < goodsData.length; i++) {
      typeOneIndex = goodsData[i].typeOneIndex;
      typeTwoIndex = goodsData[i].typeTwoIndex;
      goodsIndex = goodsData[i].goodsIndex;
      data[typeOneIndex].goods_category_two[typeTwoIndex].goods[goodsIndex].count = 0;
    }

    this.setData({
      typeData: data,
      goodsData: [],
      pageTotalNum: 0,
      pageTotalMoney: 0,
      basePageTotalNum: 0
    });
  },
  /*去结账*/
  confirm() {
    let orderGoods = this.data.goodsData;
    if (orderGoods.length <= 0) {
      wx.showToast({
        title: '购物篮是空的哟！',
        icon: 'none',
        duration: 2000
      });
      return
    }
    this.setData({
      addStatus: 3
    });
    app.globalData.buyerInfo.orderGoods = orderGoods;
    app.globalData.orderSucceed = 0
    wx.navigateTo({
      url: '../confirm-order/confirm-order'
    })
  }
});