let express = require('express');
let app = express();
let dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 1000;
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.LiveMongo;
let bodyParser = require('body-parser')
let db;

//middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.get('/',(req,res) => {
    res.send('Hii from Express')
})

// list of product type
app.get('/productType',(req,res)=>{
    db.collection('productType').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
// list of product data
app.get('/productdata',(req,res)=>{
    db.collection('productdata').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// order
app.get('/orders',(req,res)=>{
    //let email = req.query.email
    let email = req.query.email;
    let query = {}
    if(email){
        //query={email:email}
        query={email}
    }else{
        query={}
    }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
// Update order
app.put('/updateOrder/:id',(req,res) => {
    let oid = Number(req.params.id);
    db.collection('orders').updateOne(
        {id:oid},
        {
            $set:{
                "status":req.body.status,
                "bank_name":req.body.bank_name,
                "date":req.body.date
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Order Updated')
    })
})
// delete order
app.delete('/deleteOrder/:id',(req,res) => {
    let _id = mongo.ObjectId(req.params.id);
    db.collection('orders').remove({_id},(err,result) => {
            if(err) throw err;
            res.send('Order Deleted')
    })
})

// user data
app.get('/usersdata',(req,res)=>{
    //let email = req.query.email
    let user_name = req.query.name;
    let query = {}
    if(user_name){
        //query={email:email}
        query={user_name}
    }else{
        query={}
    }
    db.collection('usersdata').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//placeorder
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('Order Placed')
    })
})

//product menu
app.post('/productdata',(req,res) => {
    if(Array.isArray(req.body.id)){
        db.collection('productdata').find({product_id:{$in:req.body.id}}).toArray((err,result) => {
            if(err) throw err;
            res.send(result)
        })
    }else{
        res.send('Invalid Input')
    }
    
})
// list of sellers 1 
//app.get('/sellers',(req,res)=>{
//   db.collection('sellers').find().toArray((err,result) => {
//        if(err) throw err;
//       res.send(result)
//    })
//})

// // list of sellers 2  param
// app.get('/sellers/:stateId',(req,res)=>{
//     let stateId = Number(req.params.stateId)
//     db.collection('sellers').find({state_id:stateId}).toArray((err,result) => {
//         if(err) throw err;
//         res.send(result)
//     })
// })

// // list of sellers 3 query param
// app.get('/sellers',(req,res)=>{
//     let stateId = Number(req.query.stateId)
//    let query = {}
//     if(stateId){
//        query = {state_id:stateId}
//     }else{
//        query = {}
//     }
//     db.collection('sellers').find(query).toArray((err,result) => {
//         if(err) throw err;
//         res.send(result)
//   })
// })

 // // list of sellers 3 for nested data
 app.get('/sellers',(req,res)=>{
    let stateId = Number(req.query.stateId)
    let productType = Number(req.query.productType)
    let query = {}
    if(stateId){
       query = {state_id:stateId}
    }else if(productType){
       query = {"productType.productType_id":productType}
    }else{
       query = {}
    }
    db.collection('sellers').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
   })
})









// filter
app.get('/filter/:productId',(req,res) => {
    let query = {};
    let productId = Number(req.params.productId);
    let electricalId = Number(req.query.electricalId);

   if(electricalId){
       query={
           "productTypes.product_id":productId,
            "electrical.electrical_id":electricalId
        }
    }else{
        query={
            "productTypes.product_id":productId,
        }
    }
    db.collection('sellers').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// cost filter
//app.get('/filter/:productId',(req,res) => {
   // let query = {};
   // let productId = Number(req.params.productId);
   // let electricalId = Number(req.query.electricalId);
   // let lcost = Number(req.query.lcost);
   // let hcost = Number(req.query.hcost);
  

   // if(hcost && lcost ){

   //     query={
   //         "productTypes.product_id":productId,
   //         $and:[{cost:{$gt:lcost,$lt:hcost}}]
   //     }
   // }
   // else if(electricalId){
  //      query={
   //         "productTypes.product_id":productId,
   //         "electrical.electrical_id":electricalId
   //     }
   // }else{
   //     query={
   //         "productTypes.product_id":productId,
   //     }
   // }
   // db.collection('sellers').find(query).toArray((err,result) => {
   //     if(err) throw err;
   //     res.send(result)
   // })
//})






// list of location
app.get('/location',(req,res)=>{
    db.collection('location').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
//})

//connection with db
MongoClient.connect(mongoUrl,(err,client) => {
    if(err) console.log('Error while connecting');
    db = client.db('project1');
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })

})