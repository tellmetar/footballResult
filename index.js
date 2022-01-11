const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const json = require('koa-json')
let Router = require('koa-better-router')
let router = Router().loadMethods()
const { DataTypes, Sequelize } = require("sequelize");
const { accessLogger } = require('./logger/index')

app.use(async (ctx, next) => {
    // 允许来自所有域名请求
    ctx.set("Access-Control-Allow-Origin", "*");
    // 这样就能只允许 http://localhost:8080 这个域名的请求了
    // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080"); 

    // 设置所允许的HTTP请求方法
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

    // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");

    // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

    // Content-Type表示具体请求中的媒体类型信息
    ctx.set("Content-Type", "application/json;charset=utf-8");

    // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
    // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
    ctx.set("Access-Control-Allow-Credentials", true);

    // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
    // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
    // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
    ctx.set("Access-Control-Max-Age", 300);

    /*
    CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
        Cache-Control、
        Content-Language、
        Content-Type、
        Expires、
        Last-Modified、
        Pragma。
    */
    // 需要获取其他字段时，使用Access-Control-Expose-Headers，
    // getResponseHeader('myData')可以返回我们所需的值
    //https://www.rails365.net/articles/cors-jin-jie-expose-headers-wu
    ctx.set("Access-Control-Expose-Headers", "myData");
    
    await next();
})


const sequelize = new Sequelize({
    host: "127.0.0.1",
    username: "root",
    password: "111111",
    database: "g",
    dialect: 'mysql',
});

const User = sequelize.define('User', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.NUMBER,
        remark: "id"
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
      tableName: 'user'
  });

const Result = sequelize.define('Result', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.NUMBER,
        remark: "id"
    },
    round: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
    },
    captain1_uid: {
        type: DataTypes.NUMBER,
    },
    captain2_uid: {
        type: DataTypes.NUMBER,
    },
    result: {
        type: DataTypes.NUMBER,
    },
    score: {
        type: DataTypes.STRING,
    },
    remark: {
        type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'result'
});

const Team = sequelize.define('Team', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.NUMBER,
        remark: "id"
    },
    uid: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    captain_uid: {
        type: DataTypes.NUMBER,
    },
    result: {
        type: DataTypes.STRING,
    },
    result_id: {
        type: DataTypes.NUMBER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'team'
});

app.use(koaBody());
app.use(json())
app.use(accessLogger())


router.get('/users', async (ctx, next) => {
    ctx.body = { code: 200, data: await User.findAll()}
    return next()
})

router.post('/users', async (ctx, next) => {
    console.log("body", ctx.request.body)
    const body = ctx.request.body
    let res = await User.findAll({where:{name: body.name}});
    if (res.length == 0) {
        res = await User.create(body);
        ctx.body = { code: 200, data:`success`}
    }
    else
        ctx.body = { code: 401, data:`dulicate`}
    return next()
})


router.get('/results', async(ctx, next) =>{
    ctx.body = { code: 200, data:await Result.findAll()}
    return next()
})

router.post('/results', async (ctx, next) => {
    console.log("body", ctx.request.body)
    const body = ctx.request.body
    let res = await Result.findAll( {where:{round: body.round}})
    if (res.length == 0) {
        let resp = await Result.create(body)
        // let id = await query(`select * from result where round = ${body.round}`)

        records = []
        console.log("body.team1", body.team1)
        console.log("body.team2", body.team2)
        if (!body.team1 || body.team1.length === 0){
            ctx.body = { code: 401, data:`team1 null`}
        }
        if (!body.team2 || body.team2.length === 0){
            ctx.body = { code: 401, data:`team2 null`}
        }
        if (body.team1.indexOf(body.captain1_uid) == -1)
            body.team1.push(body.captain1_uid)
        if (body.team2.indexOf(body.captain2_uid)== -1)
            body.team2.push(body.captain2_uid)

        console.log("body.team1", body.team1)
        console.log("body.team2", body.team2)
        //todo: captain1_uid 是否在team1中
        //todo: 第一sql插入成功后，第二局sql失败
        for (const user of body.team1) {
            records.push({
                uid: user,
                captain_uid: body.captain1_uid,
                result: body.result,
                result_id: resp.getDataValue("id"),
            })
        }
        for (const user of body.team2) {
            records.push({
                uid: user,
                captain_uid: body.captain2_uid,
                result: body.result != 3 ? (body.result ===1 ? 2:1) : 3,
                result_id: resp.getDataValue("id"),
            })
        }

        console.log("records ", records)
        await Team.bulkCreate(records)
        ctx.body = { code: 200, data:`success`}
    }
    else
        ctx.body = { code: 401, data:`dulicate`}
    return next()
})


router.get('/winningRates', async(ctx, next) =>{
    const uid = ctx.query.uid

    console.log("uid  ", uid)

    let res = await Team.findAll({where: {uid}})
    console.log("res", res)

    let gameAttend = res.length

    let winGames  = 0, loseGames  = 0, drawGames = 0
    for (const game of res){
        if (game.result === 1)
            winGames ++
        else if (game.result === 2)
            loseGames ++
        else if (game.result === 3)
            drawGames ++
        else 
            console.error(" error: ", uid, ":  ", game.result)
    } 

    ctx.body = { code: 200, data: {
        uid,
        gameAttend,
        winGames,
        loseGames,
        drawGames,
        winningRate: winGames/gameAttend

    }}
    return next()
})

let api = Router({ prefix: '/api' })

// add `router`'s routes to api router
api.extend(router)


app.use(router.middleware())
app.use(api.middleware())

const port = 3000
app.listen(port, () => {
    console.log(`server start, port ${port}`)
  });