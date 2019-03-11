let express = require("express");
let ejs = require('ejs');
let butts = express();
let redis = require("redis")
var bodyParser = require('body-parser');
let client = redis.createClient({
    port: 10974,
    url:"//redis-10974.c114.us-east-1-4.ec2.cloud.redislabs.com",
    password: "jimmy"
});
let {promisify} = require('util');
const getRecs = promisify(client.hget).bind(client);
const getLists = promisify(client.lrange).bind(client);
const pushItem = promisify(client.rpush).bind(client);
const setRecs = promisify(client.hset).bind(client);


butts.set('view engine', 'ejs');
client.flushdb(); // wipes the db at startup 
butts.use(bodyParser.urlencoded({ extended: false }))


client.on("error", function (err) {
    console.log("Error " + err);
});


client.hset(3000, "numberofRecs", 3, redis.print);
client.rpush("itemID", [1,2,3]);
client.rpush("itemName", ["HamHocks","blargh","Jimmy"]);
client.rpush("itemDesc", ["Hammock made of ham.","nooooooo","johnson" ]);




butts.get('/', async (req,res) => {     
    let jimmy = await getRecs(3000, "numberofRecs");
    let itemID = await getLists("itemID",0,jimmy);
    let itemName = await getLists("itemName",0,jimmy);
    let itemDesc = await getLists("itemDesc",0,jimmy);

    console.log(jimmy + itemID + itemName + itemDesc);
    res.render('index', {
        recs:jimmy,
        itemID:itemID,
        itemName:itemName,
        itemDesc:itemDesc
    });
});

butts.get('/add', async (req,res) => {
    res.render('add');
});

butts.post('/add', async (req,res) => {
    let jimmy = await getRecs(3000, "numberofRecs");
    let temp = await setRecs(3000, "numberofRecs",parseInt(jimmy)+1);
    let itemName = req.body.itemName;
    console.log(itemName);
    let itemDesc = req.body.itemDesc;
    console.log(itemDesc);
    temp = await pushItem("itemID",parseInt(jimmy)+1);
    temp = await pushItem("itemName",itemName);
    temp = await pushItem("itemDesc",itemDesc);
    res.redirect('/');
});



//index
/*
butts.get('/', async (req,res) => {  
    let timmy = client.hget(3000, async function (err, obj){
        const recs = obj.numberofRecs;
        console.log(recs);
    let bimmy= client.lrange("itemID",1,recs, async function(err,itemID){
         let simmy = client.lrange("itemName",1,recs, async function(err,itemName){
              let flimmy = client.lrange("itemDesc",1,recs, async function(err,itemDesc){       
      
            res.render('index', {
                recs:recs,
                itemID:itemID,
                itemName:itemName,
                itemDesc:itemDesc,
            })       
        });
    });   
    });
});     
});
*/
//client.hgetall(1) 




butts.listen(3000);

