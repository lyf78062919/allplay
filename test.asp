<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
    <title>无标题</title>
</head>
<body>
<audio controls="controls" id="myMusic"><source type="audio/mpeg" src="http://jltech-phply.y1.027186.cn/123.mp3"></source></audio>
<script>

var str = "10";
alert(str[0]);

eventTester = function(e){  
    audio.addEventListener(e,function(){  
        console.log((new Date()).getTime(),e);  
        audio.currentTime = 250;
        audio.play();
    });  
}  


document.cookie="a=1";
document.cookie="b=2";



    audio = document.getElementById('myMusic');

eventTester("canplaythrough");

function checkStatus(){
    audio.currentTime = 250;
    console.info(audio.readyState);

}

function play(){
    audio.load();
    //console.info(audio.buffered);
    //audio.currentTime = 250;
    //audio.play();
    
    //setInterval("console.info(audio.buffered.end(0))",300);
}

audio.preload = "none";
//setInterval(checkStatus,300);
    console.info(audio.preload);
    //audio.currentTime = 1;


    //audio.pause();
</script>

<button value="播放" onclick="play()" >播放</button>
</body>
</html>