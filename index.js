const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const json = require('koa-json')
let Router = require('koa-better-router')
let router = Router().loadMethods()
const { DataTypes, Sequelize } = require("sequelize");
const { accessLogger } = require('./logger/index')

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