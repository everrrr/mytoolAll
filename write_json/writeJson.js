var fs = require('fs')
var path = require('path')


let nowTime = new Date() //获得当前日期对象
let year = nowTime.getFullYear() //获得当前所在年份
let month = nowTime.getMonth() + 1 //获得当前所在月份
let day = nowTime.getDate() //获得当天在当月中的日期号
var strHours = nowTime.getHours();
var strMinutes = nowTime.getMinutes();
if (day < 10) {
	day = `0${day}`
}
if (month < 10) {
	month = `0${month}`
}
if (strHours >= 0 && strHours <= 9) {
	strHours = "0" + strHours;
}
if (strMinutes >= 0 && strMinutes <= 9) {
	strMinutes = "0" + strMinutes;
}

var currentdate = `${year}:${month}:${day}/${strHours}:${strMinutes}`
console.log(currentdate)
let dataSource = [{
		title: '123',
		date: currentdate,
		content: 'ddddddddddddddddddddddddddddddddddddddddddddddddddddd'
	},
	{
		title: '456',
		date: currentdate,
		content: 'ddddddddddddddddddddddddddddddddddddddddddddddddddddd'
	},
	{
		title: '789',
		date: currentdate,
		content: 'ddddddddddddddddddddddddddddddddddddddddddddddddddddd'
	}

]
const content = JSON.stringify(dataSource, null, "\t");
//写入文件
fs.writeFile("shop.json", content, function(err) {
	if (err) {
		return console.log(err);
	}
	console.log("文件创建成功，地址：" + "shop.json");
});
