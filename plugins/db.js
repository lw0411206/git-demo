let mysql = require('mysql')
// let options = {
//     host: '172.16.50.56',
//     port: '3306',
//     user: 'root',
//     password: 'z0047ymr',
//     database: 'threeIdea',
// }
let options = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'threeIdea',
}

// 创建与数据库的连接
let con = mysql.createConnection(options)
// exports.conne = con;

// // 导入hrdata
// var m = require('./hrdata');

con.connect(err => {
    if (err) {
        // 如果建立连接错误则报错
        console.log(err)
    } else {
        console.log('连接数据库成功')
    }
})

module.exports = con
