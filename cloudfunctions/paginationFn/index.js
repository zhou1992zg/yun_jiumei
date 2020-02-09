// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let dbName = event.dbName; // 集合名称
  let fieldName = event.fieldName // 排序
  let order = event.order // 排序
  let filter = event.filter ? event.filter : null; // 筛选条件，默认为空 格式 {_id:'adefwefwfw'}
  let pageIndex = event.pageIndex ? event.pageIndex : 1; // 当前第几页，默认为第一页
  let pageSize = event.pageSize ? event.pageSize : 10; // 每页取多少条记录，默认10条
  const countResult = await db.collection(dbName).where(filter).count() // 获取集合中的总记录数
  const total = countResult.total // 得到总记录数
  const totalPage = Math.ceil(total / 10) // 计算需要多少页
  let hasMore; // 提示前端是否还有数据
  if (pageIndex > totalPage || pageIndex == totalPage) {
    hasMore = false;
  } else {
    hasMore = true;
  }

  return db.collection(dbName).where(filter).orderBy(fieldName, order).skip((pageIndex - 1) * pageSize).limit(pageSize).get().then(res => {
    res.hasMore = hasMore;
    return res;
  })
}