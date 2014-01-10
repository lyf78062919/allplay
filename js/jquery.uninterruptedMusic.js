/*!
unInterruptedMusicPlay  v1.0.0
date:2014-01-09
company:jltech.cn
author:General_hb,lyf
*/

$(function(){

	/***********文件地址************/
    //var musicLocation = "http://jltech-phply.y1.027186.cn/123.mp3";   //音乐文件地址
	var musicLocation = "music/123.mp3";	//音乐文件地址
	var flashLocation = "flash/mplay.swf";	//Flash文件地址	
	
	/***********CSS样式************/
	var playId = "playStatus";				//按钮id  若页面中已有该id,则下面样式无效
	var parentNode = "body";				//按钮的父级元素
	var playImg = "images/play.jpg";		//播放按钮图片
	var pauseImg = "images/pause.jpg";		//暂停按钮图片
	var playButtonPosition = {width:'100px', height:'100px', position:'fixed', right:'20px', bottom:'20px', cursor:'pointer'};	//按钮位置		
	
	/***********控件变量************/
	var playStatus = 1;						//播放或暂停
	var mainCurrent = 0;					//音乐播放活动界面
	var playMode = 1;						//播放模式  0:兼容模式播放, 1:Flash播放, 2:HTML5音频播放
	var refreshTime = 300;					//cookie侦测频率
	var flag   = null;
    var timer;
	//选用音乐播放模式
	if(playMode == 0){
		if($.browser.msie && $.browser.version<9){	 
			playMode = 1;
		}else if($.browser.mozilla && musicLocation.slice(musicLocation.length-3) == "mp3"){
			playMode = 1;
		}else{
			playMode = 2;
		}
	}	
	if(playMode == 1){
		$('body').append('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" id="myMusic" width="0" height="0"  align="middle"><param name="allowScriptAccess" value="sameDomain" /><param name="movie" value='+flashLocation+' /><param name="quality" value="high" /><embed src='+flashLocation+' width="0" height="0" quality="high" swLiveConnect=true name="myMusic" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object>');
		setTimeout(loadFlash,1);
	}else if(playMode == 2){
		addAudio();
		var audioId = $("#myMusic")[0];
        audioId.preload = "none";
		initMusicPlay();
	}
	
	function addAudio(){
        var audio = $('<audio id="myMusic" controls="controls"><source src="'+musicLocation+'" type="audio/mpeg"></audio>');
        $('body').append(audio);
	}
	
	//侦测Flash加载状态
	function loadFlash(){
		var loaded;		
		if($.browser.msie){	
			loaded = $("#myMusic")[0].PercentLoaded();
	 	}else if($.browser.safari){
			if(document.embeds['myMusic'].hasOwnProperty("PercentLoaded")){
				loaded = document.embeds['myMusic'].PercentLoaded();
			}
		}else{
	  		loaded = document.embeds['myMusic'].PercentLoaded();
	 	}
	 	if(loaded == 100){
			initMusicPlay();
		}else{
			setTimeout(loadFlash,1);
		}
	}		
	
	//获取按钮坐标
	function getIdPosition(){
		var t = "";
		for(i in playButtonPosition){
			t += i+":"+playButtonPosition[i]+";";
		}
		return t;
	}	
	

    function musicPlay(mode,time,first){
        if(!mode) return;
        var isfirst = first !== undefined?first:false;
        
        if(mode==1){

        }else if(mode==2){
            if(first){
                audioId.load();
                audioId.play();
            }else{
                audioId.load();
                audioId.addEventListener("canplaythrough",function(){ 
                    console.info('exent');
                    audioId.currentTime = time;
                    audioId.play();
                    setCookie('mPlay',1);
                });
            }
        }else{

        }


    }

    function musicPause(mode){
        if(!mode) return;
        if(mode==1){

        }else if(mode==2){
            audioId.pause();
        }else{

        }
    }

    function initMusicCookie(){
        setCookie("mCurrent",1);
        setCookie("mLive",1);
        setCookie("mTime",0);
        setCookie("mPlay",0);
    }

	//初始化Flash或audio
	function initMusicPlay(){
		//添加音乐播放按钮	
		if($(document).find("#"+playId).length ==0){
			$(parentNode).append('<div id='+playId+' style='+getIdPosition()+'><img src='+pauseImg+' style="position:absolute;" alt="play"><img style="display:none;" src='+playImg+' style="position:absolute;" alt="pause"></div>');
		}		


		if(getCookie("mCurrent") === undefined){
            if(playStatus){
    			if(playMode == 1){
    				window.document.myMusic.connectToFlash("1|0|"+musicLocation);
                    setCookie('mPlay',1);
    			}else{
                    musicPlay(playMode,null,true);
    			}	
            }
            initMusicCookie();
            mainCurrent = 1;
		}else{
			if(playMode == 1){
				window.document.myMusic.connectToFlash("1|1|"+musicLocation);
			}else{

			}			
		};		
        getPlayStatus();
	}	
	

    function checkStatus(){

        var mPlay = getCookie("mPlay");
        console.info(mPlay,mainCurrent,playStatus);
        if(playStatus != mPlay){
            playStatus = mPlay;
            $("#playStatus").children().eq(playStatus).hide().siblings().show();
            
                if(mainCurrent){
                    if(Number(playStatus)){
                        if(playMode == 2){
                              audioId.play();
                          }else{
                                console.info("start");
/*                                if(playStatus){            
                                    playStatus = playStatus + "|" + getCookie("mTime");
                                }*/
                                window.document.myMusic.connectToFlash("2|0|"+getCookie('mTime'));
                          }
                    }else{
                         if(playMode == 2){
                             audioId.pause();
                          }else{
                            console.info("pause");
                                window.document.myMusic.connectToFlash("2|1|"+getCookie('mTime'));
                          }
                       
                    }
                }
        }
        setCookie("mLive",1);
    }

	//获取cookie播放状态值
	function getPlayStatus(){
        //console.log(getCookie("mCurrent"),getCookie("mPlay"),getCookie("mTime"),!audioId.paused,playStatus,mainCurrent)
		if(Number(getCookie("mCurrent")) == 0){
			mainCurrent = 1;
            setCookie("mCurrent",1);
			if(playStatus){
				if(playMode == 1){
                      window.document.myMusic.connectToFlash("3|1|"+ getCookie("mTime"));
					//window.document.myMusic.connectToFlash("3|1|" + getCookie("mTime"));
				}else{
					time = getCookie("mTime");
                    musicPlay(playMode,time);
				}				
			}
		}else{
        }
        flag = true;
        checkStatus();
		timer = setTimeout(getPlayStatus,refreshTime);
	}
	
		
	//发送Flash播放暂停状态
	function sendFlashStatus(){
		if(!playStatus){			
			playStatus = playStatus + "|" + getCookie("mTime");
		}
		window.document.myMusic.connectToFlash("2|" + playStatus);
	}
		
	//发送audio播放暂停状态
	function sendAudioStatus(){
		if(playStatus){
			//audioId.pause();
            musicPause(playMode);
			setCookie("mTime",audioId.currentTime);
		}else{
			//audioId.currentTime = getCookie("mTime");
			//musicPlay(playMode)
		}				
		playStatus = (playStatus == 1) ? 0 : 1;
		setCookie("mPlay",playStatus);
	}
	
	//返回Flash值
	window.connectToJs = function(s){
		var t = Number(s.slice(0,1));
        return;
		switch(t){
			case(2)://获取flash播放状态返回值
				playStatus = Number(s.slice(2,3));
				setCookie("mPlay",playStatus);
				if(!playStatus){
					setCookie("mTime",s.slice(4));
				}
				$("#playStatus").children().eq(playStatus).hide().siblings().show();
				break;
				
			case(3)://获取flash播放时间
				setCookie("mTime",Number(s.slice(2)));
				break;				
		}
	}
	
	//点击按钮
	$("#playStatus").click(function(){
        var mPlay = getCookie('mPlay');
        setCookie('mPlay',Math.abs(mPlay-1));
        //$("#playStatus").children().eq(playStatus).hide().siblings().show();
/*		if(!mainCurrent){
			setCookie("mPlay",Number(getCookie("mPlay"))==0?1:0);
		}else{
			if(playMode == 1){
				sendFlashStatus();
			}else{
				sendAudioStatus();
			}	
		}	*/ 		
	})	
	
	//页面刷新
	$(window).bind('beforeunload',function(){
        clearTimeout(timer);
		if(mainCurrent || flag === null){		
			if(playMode == 1){
				window.document.myMusic.connectToFlash("3|0");
			}else{
                var time = audioId.currentTime;
                if(flag !== null && time !== 0){
                     setCookie("mTime",time);
                }
			}

            setCookie("mCurrent",0);
		}

        setCookie("mLive",0);	
	});
		
	//获取cookie值
	function getCookie(c_name){
		var c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1){
			c_start=c_start + c_name.length+1;
			var c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1){
				c_end=document.cookie.length;
			}
			return document.cookie.substring(c_start,c_end);
		}
	}

	//设置cookie
	function setCookie(c_name, value){
 　　　	document.cookie=c_name+ "=" + value;
 　　}	
});