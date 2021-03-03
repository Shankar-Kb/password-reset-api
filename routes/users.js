var express = require('express');
var router = express.Router();
const { createJWT, authenticate } = require('./tokens');
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
//const dbUrl = "mongodb+srv://ShankarKb:mongodb@cluster0.w8xxl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbUrl = "mongodb://localhost:27017";

router.post("/forgot-password", async(req, res)=>{

  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db(dbUrl);

    let user = await db.collection("users").findOne({email:req.body.email})

    if(user){
      const token = createJWT({ id:user._id })
      //console.log(token)
      res.json({
          message:"Password change initiated",
          token
      })
    }else{
      res.json({message:"This email does not exist"})
    }

  } catch (error) {
    console.log(error);
  }
})

router.post("/change-password", [authenticate], async(req, res)=>{

  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db(dbUrl);

    let user = await db.collection("users").findOne({email:req.body.email})

    if(user){
      const token = createJWT({ id:user._id })
      //console.log(token)
      res.json({
          message:"Password change initiated, use the token to verify the password reset",
          token
      })
    }else{
      res.json({message:"This email does not exist"})
    }

  } catch (error) {
    console.log(error);
  }
})


router.post("/login", async(req,res)=>{

    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(dbUrl);

        // finding user record in db
        let user = await db.collection("users").findOne({email:req.body.email});
        // console.log(user)
        
        if (user) {
            // compare password
            // if both are similar allow user
            let result = await bcryptjs.compare(req.body.password,user.password);
            console.log(result)
            if(result){
                const token = createJWT({id:user._id});
                console.log(token)
                res.json({
                    message:"allow",
                    token
                })
            }else{
                res.json({
                    message:" provided details are not correct"
                })
            }
        } else {
            res.json({
                message:" No record available"
            })
        }
    } catch (error) {
        res.json({error});
    }
 })

router.post("/register", async(req,res) => {

  try {
      let client = await mongoClient.connect(dbUrl);
      let db = client.db(dbUrl);

      // finding user record in db
      let user = await db.collection("users").findOne({email:req.body.email})
      //console.log(user);
      
      if (!user) {
        let salt = await bcryptjs.genSaltSync(10);
        let hash = await bcryptjs.hashSync(req.body.password, salt);
        await db.collection("users").insertOne({name:req.body.name, email:req.body.email, password:hash});
        client.close();
        res.json({ message: "Account is created" });
          
      }else{
        client.close();
        res.json({ message:"Email already exists" });
      }
      
    }
    catch (error) {
      res.json({error});
    }
})

 module.exports = router;