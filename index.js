const express = require('express')

const app = express()

// 引入跨域模块
app.use(require('cors')())
// 引入中间件模块
app.use(express.json({ limit: '2100000kb' }))

// require('./plugins/db')(app)
require('./routes/admin')(app)

app.listen(3800, () => {
    console.log('服务器链接成功')
})
