// 云函数入口文件
const cloud = require('wx-server-sdk')

const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const options = {
    method: 'GET',
    url: "https://api.weixin.qq.com/cgi-bin/token",
    qs: {
      grant_type: "client_credential",
      appid: "wx954b3b0e52f62cdd",
      secret: "5d8619befe13bf921c608a6232a82769"
    },
    json: true,
  };

  let res = await rp(options);
  console.log(res)
  let token = res.access_token;
  let body = {
    "touser": event.openId,
    "template_id": event.templateId,
    "data": {
      "character_string8": {
        "value": event.data.order_num
      },
      "thing2": {
        "value": event.data.goods_name
      },
      "amount9": {
        "value": event.data.price
      },
      "thing7": {
        "value": event.data.message
      },
      "date5": {
        "value": event.data.pay_time
      }
    },
  };

  console.log(body)

  let options2 = {
    method: "POST",
    url: "https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=" + token,
    body: body,
    json: true,
    encoding: null
  };

  var tmp = rp(options2);

  return await tmp;
}