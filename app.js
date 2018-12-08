



var id = 93560724;//网页id


var http = require('http')
var url = 'http://www.dianping.com/shop/'+id
var cheerio = require('cheerio');
var fs = require("fs");
var request = require('request');

http.get(url,function(res){
	var html = ''
	res.on("data",function(data){
        html += data
    })

	res.on('end',function(){
        var courseData = filterChapters(html)
        courseData.forEach(function(itme){
            var srcs = itme.chaptersrc
            var name = itme.chapterTitle
            downloadFile(srcs,'./img/'+id+name+'.jpg',function(){
                console.log(name+'下载完毕');
            });
        })
	})
	
}).on('error',function(){
	console.log('获取出错！')
})

//解析处理数据
function filterChapters(html){
    var $ = cheerio.load(html)
    var chapters = $('.official-gallery .mid-out .mid-in img')
    var courseData = []	
    chapters.each(function(itme){
		 var chapter = $(this)
         var Title = chapter.attr("alt")
         var src = chapter.attr("data-lazyload")
         if(src.indexOf('png')==-1){
            var srcs= src.split('.jpg');
            var chapterData={	
                chapterTitle:Title,
                chaptersrc:srcs[0].replace('//','http://')+'.jpg'
            }
        }else{
            var srcs= src.split('.png');
            var chapterData={	
                chapterTitle:Title,
                chaptersrc:srcs[0]+'.png'
            }
        }
         courseData.push(chapterData)
    })
	return courseData
}


//下载
function downloadFile(uri,filename,callback){
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback); 
}