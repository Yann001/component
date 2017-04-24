//计算进度条宽度和显示时间状态
var audioPlayer = $("#audioInfo");
var audio = $("audio")[0];
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
//实时更新播放器时间和进度条状态
function TimeSpan() {
    var ProgressNow = 0;
    setInterval(function () {
        var ProgressNow = (audio.currentTime / audio.duration) *100;
        audioPlayer.find(".progressPlay").css("width", ProgressNow+"%");
        audioPlayer.find(".progressLump").css("left", ProgressNow+"%");
        var currentTime = timeFormat(audio.currentTime);
        var timeAll = timeFormat(TimeAll());
        //audioPlayer.find(".Time").html(currentTime + "/" + timeAll);
        
        //播放完毕后，按钮回到原始状态，同时进度条回到起点，播放停止
        if(audio.currentTime===audio.duration){
            audioPlayer.find(".BtnControl").removeClass("Playing");
            audioPlayer.find(".ProgressInnerBar").css("width","0%");
            audio.pause();
        }
    }, 500);
} 
function setRangeBar(e){
    var pointX = e.pageX || e.originalEvent.targetTouches[0].pageX;
    var objX=audioPlayer.find(".audioProgress").offset().left;
    var runnableTrackWidth=(pointX-objX)/audioPlayer.find(".audioProgress").width()*100;
    var RangeValue=Math.round(runnableTrackWidth);
    if(runnableTrackWidth<=0){
        audioPlayer.find(".progressPlay").width("0%");
        TimeSpan();
        audio.currentTime=Math.round(RangeValue/100*audio.duration); 
    }
    else if(runnableTrackWidth>0 && runnableTrackWidth<100){
        audioPlayer.find(".progressPlay").width(runnableTrackWidth+"%");
        TimeSpan();
        audio.currentTime=Math.round(RangeValue/100*audio.duration); 
    }
    else if(runnableTrackWidth>=100){
        audioPlayer.find(".progressPlay").width("100%");
        TimeSpan();
        audio.currentTime=Math.round(RangeValue/100*audio.duration); 
    }
}
//点击进度条
audioPlayer.find(".progressLump").on("click",function(e){
    setRangeBar(e);
    e.stopPropagation(e);
})

//PC拖动进度条滑块
audioPlayer.find(".progressLump").mousedown(function(e){
    pauseAudio();//暂停
    setRangeBar(e);
    e.stopPropagation(e);
    playAudio();//开始播放
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