let express = require('express');
let router = express.Router();
// 引入连接数据库的方法
const querySql = require('../db/index')


/* 发布评论接口 */
router.post('/publish', async (req, res, next) => {
  // 获取评论的内容和文章id
  let { content, article_id, parent_cm_id, reply_nickname, reply_user_id } = req.body;
  // 获取当前用户名称
  let { username } = req.user

  try {
    // 根据用户名称查用户的id,头像和昵称
    let user = await querySql('select id,head_img,nickname from user where username = ?', [username]);
    let { id: user_id, head_img, nickname } = user[0]
    // 把 user_id,article_id,cmcontent,nickname,head_img,create_time 插入到 评论表
    let sql = `insert into 
    comment(user_id,article_id,cmcontent,nickname,head_img,parent_cm_id,reply_nickname,reply_user_id,create_time) 
    values(?,?,?,?,?,?,?,?,NOW())`
    await querySql(sql, [user_id, article_id, content, nickname, head_img, parent_cm_id, reply_nickname, reply_user_id])
    res.send({ code: 0, msg: '发表成功', data: null })
  } catch (e) {
    console.log(e);
    // 把错误交给错误中间件处理
    next(e)
  }
});



//获取评论列表接口
router.get('/list', async (req, res, next) => {
  let { article_id, list, offset } = req.query
  try {
    // 根据文章id查找对应的id,头像，昵称，评论，评论时间
    let sql = `select id,head_img,nickname,user_id,cmcontent,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time 
    from comment where article_id = ?  && parent_cm_id = ? ORDER BY create_time DESC  LIMIT ${list} OFFSET ${offset};
    `
    let result = await querySql(sql, [article_id, -1]);

    let sql2 = `select parent_cm_id,reply_nickname,user_id, reply_user_id, id,head_img,nickname,cmcontent,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time 
    from comment where article_id = ?  && parent_cm_id != ? ;
    `
    let result2 = await querySql(sql2, [article_id, -1]);

    // 将非顶层评论推到顶层评论的子评论里面
    result.forEach((item) => {
      let arry = [];
      result2.forEach(items => {
        if (items.parent_cm_id === item.id) {
          arry.push(items)
        }
      })
      item.son = arry;
    })
    res.send({ code: 0, msg: '成功', data: result })
  } catch (e) {
    console.log(e)
    next(e)
  }
})
//获取评论列表数量
router.get('/listCount', async (req, res, next) => {
  let { article_id } = req.query
  try {
    let sql = `select * FROM comment WHERE article_id = ? && parent_cm_id = ?`;
    let result = await querySql(sql, [article_id, -1]);
    res.send({ code: 0, msg: '成功', count: result.length })
  } catch (e) {
    console.log(e)
    next(e)
  }
})

// 删除评论接口
router.post('/delete', async (req, res, next) => {
  let { comment_id } = req.body
  try {
    let sql = 'delete from comment where id = ?'
    let result = await querySql(sql, [comment_id])
    res.send({ code: 0, msg: '删除成功', data: null })
  } catch (e) {
    console.log(e)
    next(e)
  }
});
module.exports = router;
