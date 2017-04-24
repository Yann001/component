function dealAudio()
{
    $("audio").each(function(){
            //定义一个播放器的html
            var AudioPlayerHtml='<span class="M-Art-AudioPlayer2"><span class="BtnControl"><span class="StatusIco"></span></span><span class="Progress"> <span class="ProgressBar"> <span class="ProgressInnerBar" style="width:0%"> <span class="ProgressPoint"><span class="StatusIco"></span></span> </span> </span> </span> <span class="Time">00:00/00:00</span> </span>';
            
            
            //在当前audio标签后面添加播放器html，同时隐藏该audio标签
            $(this).after(AudioPlayerHtml);
            $(this).hide(); 
            
            
            var audio = $(this)[0];
            var audioPlayer=$(this).parents(".Tk-AudioBox").children(".M-Art-AudioPlayer2");
            console.info(audioPlayer);
            //播放按钮点击事件
            audioPlayer.children(".BtnControl").on('click',function(){
                
                //获取该页面所有audio，并停止播放
                for(i=0;i<$("audio").length;i++){
                    $("audio")[i].pause();
                }
                
                //如果是播放状态，则点击暂停播放，切换按钮到暂停状态
                if($(this).hasClass("Playing")){
                    Pause();
                    $(this).removeClass("Playing");
                }
                //如果是停止状态，则点击继续播放，切换按钮到播放状态，同时将其他audio播放器的播放按钮还原到暂停状态
                else{
                    Play();
                    $(this).parents(".Tk-AudioBox").siblings(".Tk-AudioBox").find(".BtnControl").removeClass("Playing");
                    $(this).addClass("Playing");
                }
            });
            
            
            //播放
            function Play() {
                audio.play();
                TimeSpan();
            } 
            
            //暂停
            function Pause() {
                audio.pause();
            } 
            
            
            //实时更新播放器时间和进度条状态
            function TimeSpan() {
                var ProgressNow = 0;
                setInterval(function () {
                    var ProgressNow = (audio.currentTime / audio.duration) *100;
                    audioPlayer.find(".ProgressInnerBar").css("width", ProgressNow+"%");
                    var currentTime = timeFormat(audio.currentTime);
                    var timeAll = timeFormat(TimeAll());
                    audioPlayer.find(".Time").html(currentTime + "/" + timeAll);
                    
                    //播放完毕后，按钮回到原始状态，同时进度条回到起点，播放停止
                    if(audio.currentTime===audio.duration){
                        audioPlayer.find(".BtnControl").removeClass("Playing");
                        audioPlayer.find(".ProgressInnerBar").css("width","0%");
                        audio.pause();
                    }
                }, 500);
            }  
            
            
            //时间格式化
            function timeFormat(number) {
                var minute = parseInt(number / 60);
                var second = parseInt(number % 60);
                minute = minute >= 10 ? minute : "0" + minute;
                second = second >= 10 ? second : "0" + second;
                return minute + ":" + second;
            } 
            
            //获取总时长
            function TimeAll() {
                return audio.duration; 
            } 
            
            
            //计算进度条宽度和显示时间状态
            function setRangeBar(e){
                var pointX = e.pageX || e.originalEvent.targetTouches[0].pageX;
                var objX=audioPlayer.find(".ProgressBar").offset().left;
                var runnableTrackWidth=(pointX-objX)/audioPlayer.find(".ProgressBar").width()*100;
                var RangeValue=Math.round(runnableTrackWidth);
                if(runnableTrackWidth<=0){
                    audioPlayer.find(".ProgressInnerBar").width("0%");
                    TimeSpan();
                    audio.currentTime=Math.round(RangeValue/100*audio.duration); 
                }
                else if(runnableTrackWidth>0 && runnableTrackWidth<100){
                    audioPlayer.find(".ProgressInnerBar").width(runnableTrackWidth+"%");
                    TimeSpan();
                    audio.currentTime=Math.round(RangeValue/100*audio.duration); 
                }
                else if(runnableTrackWidth>=100){
                    audioPlayer.find(".ProgressInnerBar").width("100%");
                    TimeSpan();
                    audio.currentTime=Math.round(RangeValue/100*audio.duration); 
                }
            }

            
            //点击进度条
            audioPlayer.find(".Progress").on("click",function(e){
                setRangeBar(e);
                e.stopPropagation(e);
            })
            
            //PC拖动进度条滑块
            audioPlayer.find(".ProgressBar .ProgressPoint .StatusIco").mousedown(function(e){
                setRangeBar(e);
                e.stopPropagation(e);
                function relase(){
                    $(window).off("mousemove",setRangeBar);
                    $(window).off("mouseup",relase);
                }
                $(window).on("mousemove",setRangeBar);
                $(window).on("mouseup",relase);
            })
            
            
            //移动端拖动进度条滑块
            audioPlayer.find(".ProgressBar .ProgressPoint .StatusIco").on("touchstart",function(e) {

                setRangeBar(e);
                e.stopPropagation(e);
                function relase(){
                    $(window).off("touchmove", setRangeBar);
                    $(window).off("touchend",relase);
                }
                $(window).on("touchmove",setRangeBar);
                $(window).on("touchend",relase);
              });
            
        })
}