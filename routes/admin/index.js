// 定义服务器中的路由
module.exports = app => {
    const express = require('express')
    const router = express.Router()

    const con = require('../../plugins/db')

    //导入加密模块
    const crypto = require("crypto");

    // 创建数据库threeIdea
    // let sql = 'CREATE DATABASE threeIdea'
    // con.query(sql, (err, result) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log(result)
    //         res.send('数据库创建成功')
    //     }
    // })

    // 封装创建数据函数 insert
    function insert(addSql, addSqlParams) {
        con.query(addSql, addSqlParams)
    }

    // ---------------------------HR data-------------------------------
    //创建数据Hr
    router.post('/Hr', (req, res) => {
        // 新建存放HR名单的表格
        // let strSql1 = 'CREATE TABLE `HrPersonList` (`id`  int ZEROFILL NOT NULL AUTO_INCREMENT ,`authorId`  varchar(255) NULL ,`author`  varchar(255) NULL ,`department`  varchar(255) NULL,`division`  varchar(255) NULL ,PRIMARY KEY (`id`) );';

        // con.query(strSql1, (err, result) => {
        //     console.log(err)
        //     console.log(result)
        // });

        // 插入数据函数
        ; (() => {
            var arr = req.body.HrData
            try {
                for (let w of arr) {
                    let addSql = `insert into hrpersonList (authorId, author, department, division) values (?,?,?,?) `
                    let addSqlParams = [w.authorId, w.author, w.department, w.division]
                    insert(addSql, addSqlParams)
                }
                res.send('200')
            } catch (err) {
                console.log(`Error: ${err}`)
                res.send('500')
            }
        })()
    })

    // 获取HR数据
    // 新数组存放部门名称和人数汇总
    router.get('/Hr', async (req, res) => {
        try {
            let strSql = 'select * from hrpersonList'
            con.query(strSql, (err, result) => {
                console.log(err)
                // console.log(result)
                // 发送hr人员名单数组
                // res.json(result)

                // --------------------------------------------
                // 处理hr初始数据 提取各部门人数数组hrDivArr

                // 封装数组的 部门名称 去重函数 unique
                function unique(item) {
                    var newArr = []
                    for (var i = 0; i < item.length; i++) {
                        // 检测新数组newArr中有无旧数组arr对象的division
                        if (newArr.indexOf(item[i].division) === -1) {
                            newArr.push(item[i].division)
                        }
                    }
                    return newArr
                }
                // 调用函数获得含有部门名称的数组
                let uniqueDivArr = unique(result)
                // console.log(uniqueDivArr)

                // 新数组存放部门名称和人数汇总
                let hrDivArr = []
                for (let index = 0; index < uniqueDivArr.length; index++) {
                    let sum = 0
                    let total = 0
                    result.forEach(item => {
                        total = total + 1
                        if (item.division === uniqueDivArr[index]) {
                            sum = sum + 1
                        }
                    })
                    let object = {}
                    object = {
                        division: uniqueDivArr[index],
                        personCount: sum,
                        SealCount: total,
                    }
                    hrDivArr.push(object)
                }
                for (var i = 0; i < hrDivArr.length; i++) {
                    var num1 = hrDivArr[i].division.indexOf('OP MD-4')
                    var num2 = hrDivArr[i].division.indexOf('LP EC')
                    var num3 = hrDivArr[i].division.indexOf('WA')
                    var num4 = hrDivArr[i].division.indexOf('SI EP CN')

                    if (num1 !== -1 || num2 !== -1 || num3 !== -1 || num4 !== -1) {
                        // console.log(i)
                        hrDivArr.splice(i, 1)
                    }
                }
                // console.log(hrDivArr)

                // 把处理后的部门数组发送到前端
                res.json(hrDivArr)
            })
            // res.send('200')
        } catch (err) {
            console.log(`Error: ${err}`)
            res.send('500')
        }
    })

    // ------------------------------Month data---------------------------------------
    // 创建数据Month
    router.post('/Month', async (req, res) => {
        // 新建存放month名单的表格
        // let strSql2 =
        //     'CREATE TABLE `Month3iList` (`id`  int ZEROFILL NOT NULL AUTO_INCREMENT ,`quantity`  varchar(255) NULL ,`ideaId`  varchar(255) NULL ,`ideaTitle`  longtext NOT NULL,`problem`  longtext NOT NULL ,`solution`  longtext NOT NULL ,`benifits`  longtext NOT NULL ,`author`  varchar(255) NULL ,`authorId`  varchar(255) NULL ,`division`  varchar(255) NULL ,`department`  varchar(255) NULL ,`category`  varchar(255) NULL ,`rewardType`  varchar(255) NULL ,`rewardAmount`  varchar(255) NULL ,`decisionMaker`  varchar(255) NULL ,`confirmedTime`  varchar(255) NULL ,PRIMARY KEY (`id`) );'

        // con.query(strSql2, (err, result) => {
        //     console.log(err)
        //     console.log(result)
        // });

        // 插入month数据函数
        ; (() => {
            var monthArr = req.body.monthData
            // console.log(monthArr)

            // 比对hr数据库里的部门 & 科室，填入year3iList数据库
            let hrPersonArr = []
            let strSql0 = 'select * from hrpersonList'
            con.query(strSql0, (err, result) => {
                console.log(err)
                hrPersonArr = result
                for (var i = 0; i < monthArr.length; i++) {
                    hrPersonArr.forEach(item => {
                        if (monthArr[i].authorId == item.authorId) {
                            monthArr[i].division = item.division
                            monthArr[i].department = item.department
                        }
                    })
                }
                try {
                    for (let w of monthArr) {
                        let addSql = `insert into Month3iList (quantity, ideaId, ideaTitle, problem, solution, benifits, author, authorId, division, department, category, rewardType, rewardAmount, decisionMaker, confirmedTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `
                        let addSqlParams = [w.quantity, w.ideaId, w.ideaTitle, w.problem, w.solution, w.benifits, w.author, w.authorId, w.division, w.department, w.category, w.rewardType, w.rewardAmount, w.decisionMaker, w.confirmedTime]
                        insert(addSql, addSqlParams)
                    }
                    res.send('200')
                } catch (err) {
                    console.log(`Error: ${err}`)
                    res.send('500')
                }
            })
        })()
    })

    // 获取数据Month
    router.get('/Month', async (req, res) => {
        try {
            let strSql = 'select * from month3ilist'
            con.query(strSql, (err, result) => {
                console.log(err)
                // console.log(result)
                // 发送hr人员名单数组
                res.json(result)
            })
            // res.send('200')

            // let strSql1 = 'select * from selectSheet'
            // con.query(strSql1, (err, result) => {
            //     console.log(err)
            //     console.log(result)
            //     // 发送hr人员名单数组
            //     res.json(result)
            // })
        } catch (err) {
            console.log(`Error: ${err}`)
            res.send('500')
        }
    })

    // 处理后得到monthDivAwardArr 奖金图表2
    router.get('/MonthAwardType', async (req, res) => {
        try {
            let strSql = 'select * from month3ilist'
            con.query(strSql, (err, result) => {
                console.log(err)
                // console.log(result)
                // 发送hr人员名单数组
                // res.json(result)
                // 3. sheet3 循环 amountType 得到LA AFI EVA 金额数据
                let awardTypeArr = ['AFI', 'LA', 'EVA']
                let monthDivAwardArr = []
                for (var i = 0; i < awardTypeArr.length; i++) {
                    let count3i = 0
                    let amount = 0
                    let average = 0
                    let count3iTotal = 0
                    let amountTotal = 0
                    result.forEach(item => {
                        if (item.rewardType == awardTypeArr[i]) {
                            count3i += parseFloat(item.quantity)
                            amount += parseFloat(item.rewardAmount)
                        }
                        count3i = Math.round(count3i)
                        amount = Math.round(amount)
                        count3iTotal += parseFloat(item.quantity)
                        amountTotal += parseFloat(item.rewardAmount)
                        if (awardTypeArr[i] == 'Total') {
                            count3i = Math.round(count3iTotal)
                            amount = Math.round(amountTotal)
                        }
                    })
                    average = Math.round(amount / count3i)
                    let totalObj = {
                        AwardType: awardTypeArr[i],
                        Count3i: count3i,
                        Amount: amount,
                        Average: average,
                    }
                    monthDivAwardArr.push(totalObj)
                }
                // console.log(monthDivAwardArr)
                res.json(monthDivAwardArr)
            })
            // res.send('200')
        } catch (err) {
            console.log(`Error: ${err}`)
            res.send('500')
        }
    })

    // -----------------------------------Month select--------------------------------------
    // 创建数据monthSelect
    router.post('/MonthSelect', async (req, res) => {
        // 新建monthSelect表格
        // let strSql4 = 'CREATE TABLE `selectSheet` (`id`  int ZEROFILL NOT NULL AUTO_INCREMENT ,`monthSelect` int(4) not null,PRIMARY KEY (`id`) );'

        // con.query(strSql4, (err, result) => {
        //     console.log(err)
        //     console.log(result)
        // });

        // 插入monthSelect数据函数
        ; (async () => {
            var monthSelect = req.body.monthSelect
            // console.log(monthSelect)

            // 插入monthSelect
            // 插入数据
            let strSql5 = 'insert into selectSheet (monthSelect) values (?)'
            con.query(strSql5, monthSelect, (err, result) => {
                console.log(err)
                // console.log(result)
            })
        })()
    })

    // 获取数据MonthSelect
    router.get('/MonthSelect', async (req, res) => {
        try {
            let strSql1 = 'select * from selectSheet'
            con.query(strSql1, (err, result) => {
                console.log(err)
                // console.log(result)
                // 发送月份选择数组
                res.json(result)
            })
        } catch (err) {
            console.log(`Error: ${err}`)
            res.send('500')
        }
    })

    // ------------------------------Year data---------------------------------------
    // 创建数据Year
    router.post('/Year', async (req, res) => {
        // 新建存放year名单的表格
        // let strSql3 = 'CREATE TABLE `Year3iList` (`id`  int ZEROFILL NOT NULL AUTO_INCREMENT ,`quantity`  varchar(255) NULL ,`ideaId`  varchar(255) NULL ,`ideaTitle`  longtext NOT NULL,`problem`  longtext NOT NULL ,`solution`  longtext NOT NULL ,`benifits`  longtext NOT NULL ,`author`  varchar(255) NULL ,`authorId`  varchar(255) NULL ,`division`  varchar(255) NULL ,`department`  varchar(255) NULL ,`category`  varchar(255) NULL ,`rewardType`  varchar(255) NULL ,`rewardAmount`  varchar(255) NULL ,`decisionMaker`  varchar(255) NULL ,`confirmedTime` varchar(255) NULL ,PRIMARY KEY (`id`) );'

        // con.query(strSql3, (err, result) => {
        //     console.log(err)
        //     console.log(result)
        // });

        // 插入数据函数
        ; (() => {
            var arr = req.body.yearData
            // 比对hr数据库里的部门 & 科室，填入year3iList数据库
            let hrPersonArr = []
            let strSql = 'select * from hrpersonList'
            con.query(strSql, (err, result) => {
                hrPersonArr = result
                for (var i = 0; i < arr.length; i++) {
                    hrPersonArr.forEach(item => {
                        if (arr[i].authorId == item.authorId) {
                            arr[i].division = item.division
                            arr[i].department = item.department
                        }
                    })
                }
                try {
                    for (let w of arr) {
                        let addSql = `insert into Year3iList (quantity, ideaId, ideaTitle, problem, solution, benifits, author, authorId, division, department, category, rewardType, rewardAmount, decisionMaker, confirmedTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `
                        let addSqlParams = [w.quantity, w.ideaId, w.ideaTitle, w.problem, w.solution, w.benifits, w.author, w.authorId, w.division, w.department, w.category, w.rewardType, w.rewardAmount, w.decisionMaker, w.confirmedTime]
                        insert(addSql, addSqlParams)
                    }
                    res.send('200')
                } catch (err) {
                    console.log(`Error: ${err}`)
                    res.send('500')
                }
            })
        })()
    })

    // 获取数据year
    router.get('/Year', async (req, res) => {
        try {
            let strSql = 'select * from year3ilist'
            con.query(strSql, (err, result) => {
                console.log(err)
                // console.log(result)
                // 发送hr人员名单数组
                res.json(result)
            })
            // res.send('200')
        } catch (err) {
            console.log(`Error: ${err}`)
            res.send('500')
        }
    })

    // 处理后得到yearDivAwardArr 奖金图表5
    router.get('/YearAwardType', async (req, res) => {
        try {
            let strSql = 'select * from year3ilist'
            con.query(strSql, (err, result) => {
                console.log(err)
                // console.log(result)
                // 发送hr人员名单数组
                // res.json(result)
                // 3. sheet3 循环 amountType 得到LA AFI EVA 金额数据
                let awardTypeArr = ['AFI', 'LA', 'EVA']
                let yearDivAwardArr = []
                for (var i = 0; i < awardTypeArr.length; i++) {
                    let count3i = 0
                    let amount = 0
                    let average = 0
                    let count3iTotal = 0
                    let amountTotal = 0
                    result.forEach(item => {
                        if (item.rewardType == awardTypeArr[i]) {
                            count3i += parseFloat(item.quantity)
                            amount += parseFloat(item.rewardAmount)
                        }
                        count3i = Math.round(count3i)
                        amount = Math.round(amount)
                        count3iTotal += parseFloat(item.quantity)
                        amountTotal += parseFloat(item.rewardAmount)
                        if (awardTypeArr[i] == 'Total') {
                            count3i = Math.round(count3iTotal)
                            amount = Math.round(amountTotal)
                        }
                    })
                    average = Math.round(amount / count3i)
                    let totalObj = {
                        AwardType: awardTypeArr[i],
                        Count3i: count3i,
                        Amount: amount,
                        Average: average,
                    }
                    yearDivAwardArr.push(totalObj)
                }
                // console.log(yearDivAwardArr)
                res.json(yearDivAwardArr)
            })
        } catch (err) {
            console.log(`Error: ${err}`)
            res.send('500')
        }
    })
    // ------------------------------LA review data---------------------------------------
    // 创建数据 Review
    router.post('/Review', async (req, res) => {
        // 新建存放year名单的表格
        // let strSql8 =
        //     'CREATE TABLE `LaReviewList` (`id`  int ZEROFILL NOT NULL AUTO_INCREMENT ,`quantity`  varchar(255) NULL ,`ideaId`  varchar(255) NULL unique,`ideaTitle`  longtext NOT NULL,`problem`  longtext NOT NULL ,`solution`  longtext NOT NULL ,`benifits`  longtext NOT NULL ,`author`  varchar(255) NULL ,`authorId`  varchar(255) NULL ,`division`  varchar(255) NULL ,`department`  varchar(255) NULL ,`category`  varchar(255) NULL ,`rewardType`  varchar(255) NULL ,`rewardAmount`  varchar(255) NULL ,`decisionMaker`  varchar(255) NULL ,`confirmedTime` varchar(255) NULL ,PRIMARY KEY (`id`) );'

        // con.query(strSql8, (err, result) => {
        //     console.log(err)
        //     console.log(result)
        // })

        // 插入数据函数
        ; (() => {
            var arr = req.body.LaReviewData
            console.log(arr)
            try {
                for (let w of arr) {
                    let addSql = `insert into LaReviewList (quantity, ideaId, ideaTitle, problem, solution, benifits, author, authorId, division, department, category, rewardType, rewardAmount, decisionMaker, confirmedTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `
                    let addSqlParams = [w.quantity, w.ideaId, w.ideaTitle, w.problem, w.solution, w.benifits, w.author, w.authorId, w.division, w.department, w.category, w.rewardType, w.rewardAmount, w.decisionMaker, w.confirmedTime]
                    insert(addSql, addSqlParams)
                }
                res.send('200')
            } catch (err) {
                console.log(`Error: ${err}`)
                res.send('500')
            }

            // 比对hr数据库里的部门 & 科室，填入 year3iList 数据库
            // let hrPersonArr = []
            // let strSql = 'select * from hrpersonList'
            // con.query(strSql, (err, result) => {
            //     hrPersonArr = result
            //     for (var i = 0; i < arr.length; i++) {
            //         hrPersonArr.forEach(item => {
            //             if (arr[i].authorId == item.authorId) {
            //                 arr[i].division = item.division
            //                 arr[i].department = item.department
            //             }
            //         })
            //     }
            //     try {
            //         for (let w of arr) {
            //             let addSql = `insert into LaReviewList (quantity, ideaId, ideaTitle, problem, solution, benifits, author, authorId, division, department, category, rewardType, rewardAmount, decisionMaker, confirmedTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `
            //             let addSqlParams = [w.quantity, w.ideaId, w.ideaTitle, w.problem, w.solution, w.benifits, w.author, w.authorId, w.division, w.department, w.category, w.rewardType, w.rewardAmount, w.decisionMaker, w.confirmedTime]
            //             insert(addSql, addSqlParams)
            //         }
            //         res.send('200')
            //     } catch (err) {
            //         console.log(`Error: ${err}`)
            //         res.send('500')
            //     }
            // })
        })()
    })

    // 获取数据 Review
    router.get('/Review', async (req, res) => {
        try {
            let strSql = 'select * from LaReviewList'
            con.query(strSql, (err, result) => {
                console.log(err)
                // console.log(result)
                // 发送数组
                res.json(result)
            })
        } catch (err) {
            console.log(`Error: ${err}`)
            res.send('500')
        }
    })


    // 服务器中的login注册页面
    // router.post('/loginpage/api/register', async (req, res) => {
    //     // 新建users表格
    //     // let strSql7 = 'CREATE TABLE `users` (`id`  int ZEROFILL NOT NULL AUTO_INCREMENT ,`username` varchar(255) NULL unique,`password` varchar(255) NULL ,PRIMARY KEY (`id`) );'

    //     // con.query(strSql7, (err, result) => {
    //     //     console.log(err)
    //     //     console.log(result)
    //     // });


    //     // 插入 user 数据
    //     (async () => {
    //         var userObj = req.body.user
    //         console.log(userObj.username)
    //         var arr = [];
    //         arr.push(userObj)

    //         // res.json(userObj)

    //         // 插入 userObj 数据到数据库
    //         // try {
    //         //     for (let w of arr) {
    //         //         let addSql = `insert into users (username, password) values (?,?) `
    //         //         let addSqlParams = [w.username, w.password]
    //         //         insert(addSql, addSqlParams)
    //         //     }
    //         //     res.send('200')
    //         // } catch (err) {
    //         //     console.log(`Error: ${err}`)
    //         //     res.send('500')
    //         // }
    //     })()
    // })

    router.post("/loginpage/api/register", (req, res) => {
        let userObj = req.body.user
        let name = userObj.username;
        let password = userObj.password;
        
        let strSql = 'select * from users'
        con.query(strSql, (err, result) => {
            console.log(err)
            console.log(result)
            for(var i =0;i< result.length; i++){
                if(name == result[i].username && password == result[i].password){
                    // console.log("验证通过");
                    res.send('200')
                }
            }
        })

        // let md5 = crypto.createHash("md5");
        // let newPas = md5.update(password).digest("hex");
        // con.query("select * from users where name = ?", [name], (err, data) => {
        //     // console.log(data[0].password);
        //     if (err) {
        //         res.send("发生错误");
        //     }
        //     if (data) {
        //         if (data.password === newPas) {
        //             res.send("登录成功");
        //         } else {
        //             res.send("用户名或密码错误");
        //         }
        //     }
        // })
    })

    // 服务器中的login接口调试页面
    router.get('/loginpage/api/users', async (req, res) => {
        try {
            let strSql = 'select * from users'
            con.query(strSql, (err, result) => {
                console.log(err)
                // console.log(result)
                // 发送数组
                res.json(result)
            })
        } catch (err) {
            console.log(`Error: ${err}`)
            res.send('500')
        }
    })

    app.use('/admin/api', router)
}
