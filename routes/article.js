var express = require('express');
var router = express.Router();
// 引入连接数据库的方法
const querySql = require('../db/index')

/* 新增博客接⼝ */
router.post('/add', async(req, res, next) => {
  // 获取标题和内容及分类
  let {title,content,classname01,classname02,classname03} = req.body
  // 获取经过了 expressJwt拦截token后得到的username
  let {username} = req.user

  try {
    // 根据用户名获取用户id
    let result = await querySql('select id from user where username = ?', [username])
    let user_id = result[0].id

    if(!classname01){
      // 如果当前的类名为空
      var cid01 = null;
      var className_01 = null;
   }else if(await querySql('select classify_id from classify where classname = ?', [classname01]) == false ){
    //  如果数据库里的分类表没有找到req的分类名，说明当前req的classname是一个新的分类名称，则将分类名称插入分类表
    await querySql('insert into classify(classname)values(?)',[classname01])
    //  再次获取分类id和分类名称
    var cid01 =  await querySql('select classify_id from classify where classname = ?', [classname01])
    cid01 = cid01[0].classify_id
    var className_01 =  await querySql('select classname from classify where classname = ?', [classname01])
    className_01 = className_01[0].classname
   }else {
      // 否则说明数据库已经有了这个分类名称，则 获取 该分类id和分类名称
      var cid01 =  await querySql('select classify_id from classify where classname = ?', [classname01])
      cid01 = cid01[0].classify_id
      var className_01 =  await querySql('select classname from classify where classname = ?', [classname01])
      className_01 = className_01[0].classname
   }

 
   if(!classname02){
    // 如果当前的类名为空
      var cid02 = null;
      var className_02 = null;
  }else if(await querySql('select classify_id from classify where classname = ?', [classname02]) == false ){
    //  如果数据库里的分类表没有找到req的分类名，说明当前req的classname是一个新的分类名称，则将分类名称插入分类表
    await querySql('insert into classify(classname)values(?)',[classname02])
    //  再次获取分类id和分类名称
    var cid02 =  await querySql('select classify_id from classify where classname = ?', [classname02])
    cid02 = cid02[0].classify_id
    var className_02 =  await querySql('select classname from classify where classname = ?', [classname02])
    className_02 = className_02[0].classname
  }else {
      // 否则说明数据库已经有了这个分类名称，则 获取 该分类id和分类名称
      var cid02 =  await querySql('select classify_id from classify where classname = ?', [classname02])
      cid02 = cid02[0].classify_id
      var className_02 =  await querySql('select classname from classify where classname = ?', [classname02])
      className_02 = className_02[0].classname
  }


 if(!classname03){
    // 如果当前的类名为空
    var cid03 = null;
    var className_03 = null;
  }else if(await querySql('select classify_id from classify where classname = ?', [classname03]) == false ){
  //  如果数据库里的分类表没有找到req的分类名，说明当前req的classname是一个新的分类名称，则将分类名称插入分类表
  await querySql('insert into classify(classname)values(?)',[classname03])
  //  再次获取分类id和分类名称
  var cid03 =  await querySql('select classify_id from classify where classname = ?', [classname03])
  cid03 = cid03[0].classify_id
  var className_03 =  await querySql('select classname from classify where classname = ?', [classname03])
  className_03 = className_03[0].classname
  }else {
    // 否则说明数据库已经有了这个分类名称，则 获取 该分类id和分类名称
    var cid03 =  await querySql('select classify_id from classify where classname = ?', [classname03])
    cid03 = cid03[0].classify_id
    var className_03 =  await querySql('select classname from classify where classname = ?', [classname03])
    className_03 = className_03[0].classname
  }


    // 将标题和内容和作者以及文章分类id和分类名称插入数据库
    await querySql(`insert into article(title,content,user_id,
      classify_id01,classify_id02,classify_id03,
      class_name01,class_name02,class_name03,
      create_time)values(?,?,?,?,?,?,?,?,?,NOW())`
    ,[title,content,user_id,
      cid01,cid02,cid03,
      className_01,className_02,className_03
    ])

    res.send({code:0,msg:'新增成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  }
 });

// 获取全部博客列表接⼝
router.get('/allList', async(req, res, next) => {
  try {

    //DATE_FORMAT(create_time,"%Y-%m-%d%H:%i:%s") AS create_time 格式化时间
    let sql = 'select id,title,content,class_name01,class_name02,class_name03,DATE_FORMAT(create_time,"%Y-%m-%d%H:%i:%s") AS create_time from article'
    let result = await querySql(sql)
    
    res.send({code:0,msg:'获取成功',data:result})
  }catch(e){
    console.log(e)
    next(e)
  }
 });

// 获取单篇博客分类列表接⼝
router.get('/classify/single', async(req, res, next) => {
  try {
    let {classify_id01,classify_id02,classify_id03} = req.body
    let sql = 'select classname from classify where classify_id = ?'
      let classname01 = await querySql(sql,[classify_id01])
      let classname02 = await querySql(sql,[classify_id02])
      let classname03 = await querySql(sql,[classify_id03])
    res.send({code:0,msg:'获取单篇博客分类成功',data:{classname01,classname02,classname03}})
  }catch(e){
    console.log(e)
    next(e)
  }
 });

//  // 获取单个分类列表接⼝
// router.get('/Singleclassify', async(req, res, next) => {
//   try {
    
//     let {classify_id} = req.query
//     console.log(classify_id);
//     let sql = 'select classname from classify where classify_id = ?'
//       let classname = await querySql(sql,[classify_id])
//     res.send({code:0,msg:'获取单个标签分类成功',data:{classname}})
//   }catch(e){
//     console.log(e)
//     next(e)
//   }
//  });



// 获取全部博客分类接口
router.get('/classify', async(req, res, next) => {
  try {
    let sql = 'select classify_id,classname from classify'
    let result = await querySql(sql)
    res.send({code:0,msg:'获取博客分类成功',data:result})
  }catch(e){
    console.log(e)
    next(e)
  }
 });


 // 获取博客详情接⼝
router.get('/detail', async(req, res, next) => {
  let article_id = req.query.article_id
  try {
    // 根据文章id查询相关数据
    let sql = 'select id,title,content,class_name01,classify_id01,class_name02,classify_id02,class_name03,classify_id03,DATE_FORMAT(create_time,"%Y-%m-%d%H:%i:%s") AS create_time from article where id = ?'
    let result = await querySql(sql,[article_id])
    res.send({code:0,msg:'获取成功',data:result[0]})
  }catch(e){
    console.log(e)
    next(e)
  }
 });

 // 获取我的博客列表接⼝
router.get('/myList', async(req, res, next) => {
  // expressJwt拦截token 后得到的username
    let {username} = req.user
  try {
    // 根据用户名查找用户id
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql,[username])
    let user_id = user[0].id
    // 根据用户id查找文章 (也就是查找当前作者的文章,包括文章id,标题，内容)
    let sql = 'select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d%H:%i:%s") AS create_time from article where user_id = ?'
    let result = await querySql(sql,[user_id])
    // 将找到的结果返回到前端
    res.send({code:0,msg:'获取成功',data:result})
  }catch(e){
    console.log(e)
    next(e)
  }
 });

// 更新文章接⼝
router.post('/update', async(req, res, next) => {
  let {article_id,title,content,
    classname01,classname02,classname03,
    classid_01,classid_02,classid_03
  } = req.body

  // console.log(classname01,classname02,classname03);

  try {
    // 通过文章id修改文章对应的标题和内容
    let sql = 'update article set title = ?,content = ?,class_name01 = ?,class_name02 = ?,class_name03 = ? where id = ?'
    await querySql(sql,[title,content,classname01,classname02,classname03,article_id])

    // 通过 类id 修改类名表里的数据
    console.log("xx");
    console.log(await querySql('select classname from classify where classname = ?',[classname01]));


    if(await querySql('select classname from classify where classname = ?',[classname01]) == false){
      let sql2 = 'update classify set classname = ? where classify_id = ?'
      await querySql(sql2,[classname01,classid_01])
    }

    if(await querySql('select classname from classify where classname = ?',[classname02]) == false){
    let sql3 = 'update classify set classname = ? where classify_id = ?'
    await querySql(sql3,[classname02,classid_02])
    }

    if(await querySql('select classname from classify where classname = ?',[classname03]) == false){
    let sql4 = 'update classify set classname = ? where classify_id = ?'
    await querySql(sql4,[classname03,classid_03])
    }
    res.send({code:0,msg:'更新成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  }
 });
module.exports = router;
