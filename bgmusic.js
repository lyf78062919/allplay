$(function(){
	$('body').append('<audio id="mPlayMusic" loop=-1><source src="123.mp3" type="audio/mpeg"></audio>');
	var t,m,
	n = 1,
	mbox = document.getElementById("mPlayMusic");
	//console.log(document.cookie)
	document.getElementById("mPlayMusic").autoplay=false;	
 	if( document.cookie.split(';')[0].split('=')[1] != 0 && document.cookie.split(';')[0].split('=')[1] != 1 ){
		document.cookie = "mCurrent=1";
		document.cookie = "mTime=0";
		mbox.play();
	}
	
	setTimeout(init,300);	
	
	function init(){
		if(document.cookie.split(';')[0].split('=')[1] == 0){
			mbox.currentTime = document.cookie.split(';')[1].split('=')[1];
			document.cookie = "mCurrent=1";
			document.cookie = "mTime=0";	
			mbox.play();		
		}
	}
	
	$(window).on("focus", function(){
		n=1;
		t = setTimeout(addListener,300);
	});	
	
	function addListener(){console.log(n,document.cookie)
		if(n){			
		  if(document.cookie.split(';')[0].split('=')[1] == 0){
			  mbox.currentTime = document.cookie.split(';')[1].split('=')[1];
			  document.cookie = "mCurrent=1";
			  document.cookie = "mTime=" + document.cookie.split(';')[1].split('=')[1];	
			  mbox.play();									
		  }		
		  t = setTimeout(addListener,300);	
		}
	}
		
	$(window).on("blur", function(){
		n=0;
		document.cookie = "mCurrent=0";
		document.cookie = "mTime=" + mbox.currentTime;
		clearTimeout(t);
		mbox.pause();	
	});	
	
	
	$(window).on('beforeunload',function(){
		document.cookie = "mCurrent=0";
		document.cookie = "mTime=" + mbox.currentTime;	
	});	
})