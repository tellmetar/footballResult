请求参数：
    Content-Type: application/json


正确返回:
{
    "code": 200,
    "data": 
}

错误：
{
    "code": 401,
    "data": "dulicate"
}



GET /users?name=lo

```json
{
    "code": 200,
    "data": [
        {
            "id": 2,
            "name": "lyf",
            "createdAt": "2022-01-11",
            "updatedAt": "2022-01-11"
        },
        {
            "id": 3,
            "name": "long",
            "createdAt": "2022-01-11",
            "updatedAt": "2022-01-11"
        },
        {
            "id": 4,
            "name": "ak",
            "createdAt": "2022-01-11",
            "updatedAt": "2022-01-11"
        },
        {
            "id": 5,
            "name": "jason",
            "createdAt": "2022-01-11",
            "updatedAt": "2022-01-11"
        },
        {
            "id": 6,
            "name": "檀",
            "createdAt": "2022-01-11",
            "updatedAt": "2022-01-11"
        },
        {
            "id": 7,
            "name": "toto",
            "createdAt": "2022-01-11",
            "updatedAt": "2022-01-11"
        }
    ]
}
```


POST /users
{
    "name": "longlong"  //名字 必填
}

{
    "code": 200,
    "data": "success"
}


POST /results
```json
{
    "round": 7,         //第几轮，必填
    "date": "2022-1-12",//比赛日期
    "captain1_uid": 2,  //队长1的id，必填
    "captain2_uid": 3,  //队长2的uid，必填
    "result": 3,        //1为captain1_uid赢，2为captain2_uid，3为平，必填
    "score": "9:8",     //比分
    "remark": "hhhhh",  //备注
    "team1": [          //队伍1的 参赛人员，可以不包括队长，必填
        4,
        5
    ],
    "team2": [
        6,
        7
    ]
}
```


GET /results?round=1&date=2021-1-12&captain1_uid=2&
    captain1_uid=1&remark=hh

```json
{
    "code": 200,
    "data": [
        {
            "id": 14,
            "round": 1,
            "date": "2022-01-10",
            "captain1_uid": 2,
            "captain2_uid": 3,
            "result": 1,
            "score": "9:8",
            "remark": "hhhhh",
            "createdAt": "2022-01-11",
            "updatedAt": "2022-01-11"
        },
        {
            "id": 15,
            "round": 2,
            "date": "2022-01-11",
            "captain1_uid": 2,
            "captain2_uid": 3,
            "result": 1,
            "score": "9:8",
            "remark": "hhhhh",
            "createdAt": "2022-01-11",
            "updatedAt": "2022-01-11"
        }
    ]
}
```


GET /winningRates?uid=4
```json
{
    "code": 200,
    "data": {
        "uid": "4",
        "gameAttend": 5,    //参赛场次
        "winGames": 3,      //获胜场次
        "loseGames": 1,     //失利场次
        "drawGames": 1,     //平局场次
        "winningRate": 0.6, //胜率
        "personalPoints": 1 //个人积分
    }
}
```