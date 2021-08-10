var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var financialyrsModel = require('./../models/financialyrsModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
     var employeeitemcodes = await financialyrsModel.findOne({Financialyrs:req.body.Financialyrs});
     console.log(employeeitemcodes);
     if(employeeitemcodes == null){
     await financialyrsModel.create({
         Financialyrs : req.body.Financialyrs || "",
         status : req.body.status || 'false'
        },
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Financialyrs Added successfully", Data : user ,Code:200}); 
    });   
       } else{
        res.json({Status:"Failed",Message:"This Financialyrs already Created", Data : {} ,Code:404}); 
       }
}
catch(e){
  console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
);


router.get('/getlist', async function (req, res) {
        await financialyrsModel.find({}, function (err, CategoryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(CategoryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Financialyrs", Data : CategoryDetails ,Code:200});
        }).sort({createdAt:-1});
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
      financialyrsModel.remove({}, function (err, user) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.json({Status:"Success",Message:"Financialyrs Deleted all", Data : {} ,Code:200});     
      });
});


router.get('/getlist_dropdown', async function (req, res) {
        await financialyrsModel.find({status:'false'}, function (err, CategoryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(CategoryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Financialyrs", Data : CategoryDetails ,Code:200});
        }).sort({createdAt:-1});
});


router.post('/edit', async function (req, res) {
  console.log(req.body);
        await financialyrsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await financialyrsModel.findByIdAndRemove(req.body.id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Financialyrs Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;