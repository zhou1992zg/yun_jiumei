// 云函数入口文件
const cloud = require('wx-server-sdk')

const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const newTime = Date.parse(new Date());
  //post
  let data = {
    "params": JSON.parse(decodeURIComponent(encodeURIComponent(JSON.stringify(event)))),
    "digest": JSON.stringify(JSON.parse(decodeURIComponent(encodeURIComponent(JSON.stringify(event))))) + '09d6a10b21d9f0227698b2a6e07ff0c9' + String(newTime),
    "timestamp": newTime,
    "companyCode": "EWBDYSQCDTDJDDJZ"
  }

  const post_options = {
    method: 'POST',
    url: 'http://dpsanbox.deppon.com/sandbox-web/standard-order/queryPriceTime.action',
    body: JSON.stringify(JSON.parse(decodeURIComponent(encodeURIComponent(JSON.stringify(data))))),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    json: true
  };

  //获取post请求数据

  const post_res = await rp(post_options);

  return {
    post_res
  }
}