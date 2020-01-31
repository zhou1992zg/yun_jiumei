const promise = handler => () =>
    new Promise((resolve, reject) => {
        handler({ success: resolve, fail: reject });
    });

function p(s) {
    return s < 10 ? '0' + s : s;
}

function formatTime(number, format) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 格式化时间
 * @param timestamp
 * @returns {string}
 */
function timestampToTime(timestamp) {
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const date = new Date(timestamp * 1000);
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    const D = p(date.getDate()) + '日';
    return M + D;
}

/**
 * 图片懒加载
 * @param {*} diaryList 线美日记JSON数据
 * @param {*} windowHeight 设备可是高度
 * @param {*} fn 回调函数
 */
function showImg(diaryList, windowHeight, fn) {
    let query = wx.createSelectorQuery();
    let scrollIndexs = [];
    for (let i = 0; i <= diaryList.length; i++) {
        scrollIndexs.push('#diaryList' + i);
    };
    query.selectAll(JSON.stringify(scrollIndexs).replace("[", "").replace("]", "").replace(/\"/g, '')).boundingClientRect().exec(function(res) {
        res[0].forEach((item, index) => {
            if (item.top <= windowHeight * 0.9) {
                diaryList[index].showImg = true // 根据下标改变状态
            }
        })
        return fn && fn(diaryList);
    });
}

/**
 * 判断对象是否为空
 * @param {*} obj 传入对象
 */
function isOwnEmpty(obj) {
    for (let name in obj) {
        if (obj.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
}

function TimeDown(countDownNum, fn) {
    const _this = this;
    // let countDownNum = 6000;
    let timer = setInterval(function() {
        var hours = parseInt((countDownNum % (60 * 60 * 24)) / (60 * 60));
        var minutes = parseInt((countDownNum % (60 * 60)) / (60));
        var seconds = (countDownNum % 60);
        hours = hours < 10 ? ('0' + hours) : hours;
        minutes = minutes < 10 ? ('0' + minutes) : minutes;
        seconds = seconds < 10 && seconds >= 1 ? ('0' + seconds) : seconds;
        let countTime = {
            timeText: hours + "时" + minutes + "分" + seconds + "秒",
            timeNum: countDownNum,
        }
        if (countDownNum == 0) {
            clearInterval(timer);
            countTime = {
                timeText: "00小时00分00秒",
                timeNum: 0,
            }
        }
        fn && fn(countTime);
        countDownNum--;
    }, 1000)
}

function html_decode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br\/>/g, "\n");
    return s;
}

module.exports = {
    html_decode: html_decode,
    TimeDown: TimeDown,
    formatTime: formatTime,
    isOwnEmpty: isOwnEmpty,
    showImg: showImg,
    promise: promise,
    timestampToTime: timestampToTime
}