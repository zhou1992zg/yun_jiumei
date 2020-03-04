// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

const orderCollection = db.collection("order");


// 云函数入口函数
exports.main = async (event, context) => {
  const curTime = Date.now();
  const orderId = `${event.userInfo.openId.substr(-5)}-${curTime}`;
  let orderData = event.buyData;
  orderData['_orderId'] = orderId;
  orderData['_openid'] = event.userInfo.openId;
  orderData['_payType'] = 0; //0=待付款，1=已付款，2=已发货，3=待评价
  orderData['_createtime'] = curTime; //0=待付款，1=已付款，2=已发货，3=待评价
  return await orderCollection.add({
    data: orderData,
  }).then(res=>{
    console.log(res);
    return {
      _orderId:orderId,
    }
  });
}