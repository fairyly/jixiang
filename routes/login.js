/**
 * 登入Routes
 */
var crypto = require('crypto');
var Utils = require('../models/utils');

var jixiang = require('../models/base');

var index = function(req,res){
  if(req.method == 'GET'){
    res.render('login',
      {
         title:'吉祥社区'
        ,user : req.session.user
        ,pjax : false
      });
  }else if(req.method == 'POST'){
    //生成口令散列
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    jixiang.getOne({username:req.body.username},'users',function(err,user){
      if(!user){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      if(user.password != password){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      var condition = {};
      condition.query = {
        _id : user._id
      }
      condition.modify={
        '$set' : {
          'logindate' : Date.now()
        }
      };
      jixiang.update(condition,'users',function(err){
        console.log("had logined!");
      });
      req.session.user = user;
      res.json({flg:1,msg:'登入成功!',redirect:'/'});
    });
  }
}

exports.index = index;

/*----------
    admin
 ----------*/
var admin = function(req,res){
  if(req.method == 'GET'){
    res.render('./admin/login',
      {
        title:'吉祥社区管理后台'
         ,user : req.session.admin
      });
  }else if(req.method == 'POST'){
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    jixiang.getOne({username:req.body.username},'admin',function(err,user){
      if(!user){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      if(user.password != password){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      var condition = {};
      condition.query = {
        _id : user._id
      };
      condition.modify = {
        '$set' : {
          'logindate' : Date.now()
        }
      }
      jixiang.update(condition,'admin',function(err){
         console.log('had logined');
      });
      req.session.admin = user;
      res.json({flg:1,msg:'登入成功!',redirect:'/admin'});
    });   
  }
}
exports.admin = admin;