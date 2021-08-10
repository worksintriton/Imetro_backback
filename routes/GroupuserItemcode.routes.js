var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var chat_catModel = require('./../models/GroupuserdetailModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
     await chat_catModel.create({
         Item_code_id : req.body.Item_code_id || "",
         Department_id : req.body.Department_id || "",
         User_id : req.body.User_id || "",
        },
        function (err, user) {
          console.log(user)
          console.log(err);
        res.json({Status:"Success",Message:"Employee Added successfully", Data : user ,Code:200}); 
    });   
}
catch(e){
  console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
);



router.post('/getlist_id',async function (req, res) {
      await chat_catModel.find({Item_code_id:req.body.Item_code_id}, function (err, UserDetails) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
        res.json({Status:"Success",Message:"User Details", Data : UserDetails ,Code:200});
      }).sort({'createdAt':-1}).populate('Department_id User_id');
})



router.get('/getlist', async function (req, res) {
        await chat_catModel.find({}, function (err, CategoryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(CategoryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Financialyrs", Data : CategoryDetails ,Code:200});
        });
});



router.get('/getlist_fnyr', async function (req, res) {
          let start_yr =  1971;
          let end_yr = 2050
          let years = [];
        for(let a = start_yr ; a < end_yr ; a ++){
          let x = a+2;
          let y = a+1 +" - "+ x;
          years.push(y);
          if(a == end_yr - 1){
            res.json({Status:"Success",Message:"Financialyrs", Data : years ,Code:200});    
          }
        }
});




router.get('/deletes', function (req, res) {
      chat_catModel.remove({}, function (err, user) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.json({Status:"Success",Message:"Financialyrs Deleted all", Data : {} ,Code:200});     
      });
});


router.get('/getlist_dropdown', async function (req, res) {
        await chat_catModel.find({status:'false'}, function (err, CategoryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(CategoryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Financialyrs", Data : CategoryDetails ,Code:200});
        }).sort({createdAt:-1});
});


router.post('/edit', async function (req, res) {
  console.log(req.body);
        await chat_catModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await chat_catModel.findByIdAndRemove(req.body.Employee_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Employee Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;