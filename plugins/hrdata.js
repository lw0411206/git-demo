// 引入db文件，目的为链接db中导出的conne函数
var conne = require('./db').conne;

function hrDataCal() {
    console.log('hrdata处理函数导出');
}
// console.log(conne);

module.exports = hrDataCal



