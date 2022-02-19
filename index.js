require('dotenv').config()
const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
const json = require('koa-json')
const Router = require("@koa/router")
const router = new Router({
    // prefix: "/api_f"
})
const { DataTypes, Sequelize, Op } = require("sequelize")
const { accessLogger, logger } = require('./logger/index')
const serve = require("koa-static")

app.use(async (ctx, next) => {
    // 允许来自所有域名请求
    ctx.set("Access-Control-Allow-Origin", "*");
    // 这样就能只允许 http://localhost:8080 这个域名的请求了
    // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080"); 

    // 设置所允许的HTTP请求方法
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

    // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
    ctx.set("Access-Control-Allow-Headers", "*");

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
    // ctx.set("Access-Control-Expose-Headers", "myData");

    // console.log("ctx. method", ctx.method)
    if (ctx.method === "OPTIONS")
        ctx.status = 200
    await next();
})


const sequelize = new Sequelize({
    host: "127.0.0.1",
    username: "root",
    password: process.env.DB_PASS,
    // password: "",
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
    name: { type: DataTypes.STRING },
    number: { type: DataTypes.NUMBER },
    gameAttend: { type: DataTypes.NUMBER },
    winGames: { type: DataTypes.NUMBER },
    loseGames: { type: DataTypes.NUMBER },
    drawGames: { type: DataTypes.NUMBER },
    winningRate: { type: DataTypes.FLOAT },
    unDefeatedRate: { type: DataTypes.FLOAT },
    personalPoints: { type: DataTypes.NUMBER },

    score: { type: DataTypes.NUMBER },
    assist: { type: DataTypes.NUMBER },
    yellow: { type: DataTypes.NUMBER },
    red: { type: DataTypes.NUMBER },
    red: { type: DataTypes.NUMBER },

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
    score1: {
        type: DataTypes.NUMBER,
    },
    score2: {
        type: DataTypes.NUMBER,
    },
    remark: {
        type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    tableName: 'result'
});

const Score = sequelize.define('Score', {
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
    score: {
        type: DataTypes.NUMBER,
    },
    result_id: {
        type: DataTypes.NUMBER,
    },
    round: {
        type: DataTypes.NUMBER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    tableName: 'score'
});

const Assist = sequelize.define('Assist', {
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
    assist: {
        type: DataTypes.NUMBER,
    },
    result_id: {
        type: DataTypes.NUMBER,
    },
    round: {
        type: DataTypes.NUMBER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    tableName: 'assist'
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
    team: {
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

global.lock = false

router.get("/api.md", serve(__dirname + "/static"))

router.get('/user', async (ctx, next) => {
    console.log("query", ctx.query)
    const size = ctx.query.size || 5
    const page = ctx.query.page || 1
    let where = {
    }
    if (ctx.query.name) {
        where.name = { [Op.substring]: ctx.query.name }
    }
    if (ctx.query.number) {
        where.number = { [Op.substring]: ctx.query.number }
    }
    const order = [['winningRate', 'DESC'], ['gameAttend', 'DESC']]
    ctx.body = {
        code: 200, data: {
            total: await User.count({ where }),
            userList: await User.findAll({ where, order, limit: parseInt(size), offset: parseInt((page - 1) * size) })
        }
    }
    return next()
})

router.post('/user', async (ctx, next) => {
    console.log("body", ctx.request.body)
    const body = ctx.request.body
    let res = await User.findAll({ where: { [Op.or]: [{ name: body.name }, { number: body.number }] } });
    if (res.length == 0) {
        res = await User.create(body);
        ctx.body = { code: 200, data: `success` }
    } else
        ctx.body = { code: 401, data: `name or number dulicate` }
    return next()
})

router.get('/result', async (ctx, next) => {
    console.log("query", ctx.query)
    let where = {}
    if (ctx.query.round)
        where.round = ctx.query.round
    if (ctx.query.date)
        where.date = new Date(ctx.query.date)
    if (ctx.query.captain1_uid)
        where.captain1_uid = ctx.query.captain1_uid
    if (ctx.query.captain2_uid)
        where.captain1_uid = ctx.query.captain2_uid
    if (ctx.query.remark)
        where.remark = { [Op.substring]: ctx.query.remark }
    const order = [['round', 'DESC']]
    ctx.body = {
        code: 200, data: {
            total: await Result.count({ where, order }),
            list: await Result.findAll({ where, order })
        }
    }
})

router.get('/result/:id', async (ctx, next) => {
    console.log("query =================", ctx.request.params.id,)
    if (!ctx.request.params.id) {
        ctx.body = { code: 404, data: `id null` }
        return next()
    }
    const id = ctx.request.params.id
    let result = await Result.findOne({ where: { id } })
    let team = await Team.findAll({ where: { result_id: id } })
    let scoreList = await Score.findAll({ where: { result_id: id } })
    let assistList = await Assist.findAll({ where: { result_id: id } })
    ctx.body = { code: 200, result, team, scoreList, assistList }
})

router.post('/result', async (ctx, next) => {
    console.log("body", ctx.request.body)
    const body = ctx.request.body
    const round = body.round
    let res = await Result.findAll({ where: { round } })
    if (res.length == 0) {
        let resp = await Result.create(body)
        const result_id = resp.id

        //todo: 第一sql插入成功后，第二局sql失败
        let records = []
        if (body.team1 && body.team1.length > 0) {
            if (body.captain1_uid && body.team1.indexOf(body.captain1_uid + "") == -1) {
                body.team1.push(body.captain1_uid)
            }
            for (const user of body.team1) {
                records.push({
                    uid: user,
                    team: 1,
                    captain_uid: body.captain1_uid,
                    result: body.result,
                    result_id,
                })
            }
        }
        if (body.team2 && body.team2.length > 0) {
            if (body.captain2_uid && body.team2.indexOf(body.captain2_uid + "") == -1) {
                body.team2.push(body.captain2_uid)
            }
            for (const user of body.team2) {
                records.push({
                    uid: user,
                    team: 2,
                    captain_uid: body.captain2_uid,
                    result: body.result != "3" ? (body.result == "1" ? 2 : 1) : 3,
                    result_id,
                })
            }
        }
        console.log("records ", records)
        if (records.length > 0) {
            await Team.bulkCreate(records)
        }

        let scoreRecords = []
        if (body.scoreList && body.scoreList.length > 0) {
            for (let r of body.scoreList) {
                scoreRecords.push({ result_id, round, ...r })
            }
            console.log("body.scoreList", scoreRecords)
            if (scoreRecords.length > 0) {
                await Score.bulkCreate(scoreRecords)
            }
        }

        let assistRecords = []
        if (body.assistList && body.assistList.length > 0) {
            for (let r of body.assistList) {
                assistRecords.push({ result_id, round, ...r })
            }
            console.log("body.scoreList", assistRecords)
            if (assistRecords.length > 0) {
                await Assist.bulkCreate(assistRecords)
            }
        }

        ctx.body = { code: 200, data: `success` }
    }
    else
        ctx.body = { code: 401, data: `round dulicate` }
})

router.put('/result', async (ctx, next) => {
    const body = ctx.request.body
    console.log("body", body)
    let res = await Result.findOne({ where: { round: body.round } })
    if (res) {
        const result_id = res.id
        const round = res.round
        await Result.update({ ...body }, { where: { id: res.id } })
        //todo: 直接删除team表数据。然后 新增数据。。。 这里不用考虑 新增0条数据的情况，因为这种场景 是合理的
        let records = await Team.destroy({ where: { result_id } })
        console.log("records------------------------", records)

        records = []
        if (body.team1 && body.team1.length > 0) {
            if (body.captain1_uid && body.team1.indexOf(body.captain1_uid + "") == -1) {
                body.team1.push(body.captain1_uid)
            }
            for (const user of body.team1) {
                records.push({
                    uid: user,
                    team: 1,
                    captain_uid: body.captain1_uid,
                    result: body.result,
                    result_id: res.id,
                })
            }
        }
        if (body.team2 && body.team2.length > 0) {
            if (body.captain2_uid && body.team2.indexOf(body.captain2_uid + "") == -1) {
                body.team2.push(body.captain2_uid)
            }
            for (const user of body.team2) {
                records.push({
                    uid: user,
                    team: 2,
                    captain_uid: body.captain2_uid,
                    result: body.result != "3" ? (body.result == "1" ? 2 : 1) : 3,
                    result_id,
                })
            }
        }
        console.log("records ", records)
        if (records.length > 0) {
            await Team.bulkCreate(records)
        }


        await Score.destroy({ where: { result_id } })
        let scoreRecords = []
        if (body.scoreList && body.scoreList.length > 0) {
            for (let r of body.scoreList) {
                scoreRecords.push({ result_id, round, ...r })
            }
            console.log("body.scoreList", scoreRecords)
            if (scoreRecords.length > 0) {
                await Score.bulkCreate(scoreRecords)
            }
        }

        await Assist.destroy({ where: { result_id } })
        let assistRecords = []
        if (body.assistList && body.assistList.length > 0) {
            for (let r of body.assistList) {
                assistRecords.push({ result_id, round, ...r })
            }
            console.log("body.scoreList", assistRecords)
            if (assistRecords.length > 0) {
                await Assist.bulkCreate(assistRecords)
            }
        }

    }
    ctx.body = { code: 200, data: `success` }

})


/** 各位队友注意了，新赛季延用队长积分晋级制，同时引入个人积分。
    个人积分规则如下：赢球队长6分，赢球队员3分，平球队长5分，平球队员2分，输球队长4分，输球队员1分。
    积分制鼓励大家多出勤，对赛季末各奖项评选以及总决赛报名名额至关重要，希望大家多多参与，队委享有最终解释权。
 */

router.get('/winningRate', async (ctx, next) => {

    console.log("global.lock", global.lock)

    if (!global.lock) {
        global.lock = true
        console.log("global.lock", global.lock)
        const startTime = new Date()
        logger.info("start stat", startTime.toLocaleString())
        const users = await User.findAll()

        try {
            for (let user of users) {
                const uid = user.id

                let res = await Team.findAll({ where: { uid } })

                if (res.length > 0) {

                    let gameAttend = res.length ? res.length : 0

                    let winGames = 0, loseGames = 0, drawGames = 0, personalPoints = 0

                    for (const game of res) {
                        if (game.result === 1) {
                            winGames++
                            personalPoints += 3
                        }
                        else if (game.result === 2) {
                            loseGames++
                            personalPoints += 1
                        }
                        else if (game.result === 3) {
                            drawGames++
                            personalPoints += 2
                        }
                        else
                            console.error(" error: ", uid, ":  ", game.result)

                        if (game.uid === game.captain_uid) {
                            personalPoints += 3
                        }
                    }

                    let winningRate = gameAttend ? winGames / gameAttend : 0
                    let unDefeatedRate = gameAttend ? (winGames + drawGames) / gameAttend : 0

                    let scoreList = await Score.findAll({ where: { uid } })
                    let score = 0
                    for (const s of scoreList){
                        score += s.score
                    }

                    let assistList = await Assist.findAll({ where: { uid } })
                    let assist = 0
                    for (const s of assistList){
                        assist += s.assist
                    }


                    await User.update({
                        ...user, gameAttend, winGames,
                        loseGames,
                        drawGames,
                        winningRate,
                        unDefeatedRate,
                        personalPoints,
                        score,
                        assist
                    }, { where: { id: user.id } })
                }
            }
        } catch (e) {
            console.log("global.lock", global.lock)
            global.lock = false
        }

        const endTime = new Date()
        logger.info("end stat", endTime.toLocaleString())
        logger.info("stat comsumption", endTime.getMilliseconds() - startTime.getMilliseconds)
        global.lock = false
        console.log("global.lock", global.lock)
        ctx.body = { code: 200, data: "process data" }
        return next()
    }

    ctx.body = {
        code: 200, data: "not process data"
    }
})

app.use(router.middleware())

app.on('error', (err, ctx) => {
    logger.error('server error', err, ctx)
})

const port = 8888
app.listen(port, () => {
    console.log(`server start, port ${port}`)
});