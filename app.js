const express = require('express');
const app = express();
const router = express.Router();
const phantom = require('phantom');
const cheerio = require('cheerio');


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


/* GET home page. */
app.get('/test', function (req, res, next) {
    res.header('Content-Type', 'application/json');
    let sitepage = null; //创建网页对象实例
    let phInstance = null; //创建phantomj实例对象
    phantom.create()
        .then(instance => {
            phInstance = instance;
            return instance.createPage();
        })
        .then(page => {
            sitepage = page;
            return page.open('https://www.taijumi.cc/taijuplay/1463-1-4/');
        })
        .then(status => {
            console.info(status); //获取结果状态
            return sitepage.property('content'); //获取相应的属性内容
        })
        .then(content => { 
            
            const $ = cheerio.load(content);  //解析输出的结果内容
            var foo = sitepage.evaluate(function() {
             return document.play;
            });
            const jsonResult = [foo];
            $('#fed-play-iframe').each((i, item) => {  //抓取符合条件的a标签的链接地址
                const href = $(item).attr('src');
                // if (new RegExp(/http[s]?:\/\/.*/).test(href)) {
                    
                // }
                jsonResult.push(href);
            });
            sitepage.close();
            phInstance.exit();
            res.json(jsonResult);
        })
        .catch(error => {
            console.log(error);
            phInstance.exit();
            res.json({status: false});
        });
});

// module.exports = router;

app.listen(8084, ()=>{
    console.log(`8084端口号启动`)
})