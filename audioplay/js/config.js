//音频播放
function TkAudio(src,audioBoxId) {
    console.log("******************************")
    console.log(src);
    console.log(audioBoxId);
    var Audioinfo = document.getElementById(audioBoxId);
    var progressLump = null, progressPlay = null, tkAudio = null, audioSrc = null;
    var totalTime = 0;
    var currentTime = 0;
    var setIntervalFun = null;
    if (src) {
        audioSrc = src;
    }
    //audioSrc = "http://admintk.100xuexi.com/Plug/Ueditor/net/upload/2014-01-19/46431f4e-3ba2-47b7-9e44-5a4dce22b022.mp3";

    //创建音频DOM
    function createAudioDiv() {
        if (Audioinfo.childNodes.length <= 0) {
            var html = '         <div class="audioProgress">';
            html += '                 <div class="progressTotal"></div>';
            html += '                   <div class="progressPlay" id="progressPlay"></div>';
            html += '                 <div class="progressLump" id="progressLump">';
            html += '                     <div class="audioIcoOut">';
            html += '                         <div class="audioIco"></div>';
            html += '                     </div>';
            html += '                  </div>';
            html += '              </div>';
            html += '              <div class="audioTime">';
            html += '                  <div class="timeInfo" name="Tips">';
            html += '                      <span id="currentTime">00:00</span>/<span id="totalTime">00:00</span>';
            html += '                  </div>';
            html += '              </div>';

            Audioinfo.innerHTML = html;
            //progressLump = document.getElementById("progressLump");
            //progressLump.removeEventListener("click", audioClicks, false);
            //progressLump.addEventListener("click", audioClicks, false);
        }
        progressLump = document.getElementById("progressLump");
        progressPlay = document.getElementById("progressPlay");
        progressLump.style.left = "0%";
        progressPlay.style.width = "0%";
    }

    //音频初始化
    function initAudio() {
        if (!audioSrc) return false;
        createAudioDiv();
        var tkAudioList = Audioinfo.getElementsByTagName("audio");
        if (tkAudioList.length > 0) {
            for (var i = 0, i1 = tkAudioList.length; i < i1; i++) {
                Audioinfo.removeChild(tkAudioList[i]);
            }
        }

        tkAudio = document.createElement("audio");
        tkAudio.src = audioSrc;
        Audioinfo.appendChild(tkAudio);
        Audioinfo.style.display = "block";

        tkAudio.load();
        progressLump.className = "progressLump load";
        currentTime = tkAudio.currentTime;
        //播放事件监听
        tkAudio.addEventListener("canplaythrough", canPlay, false);
         function canPlay() {
            console.log("audio can play");
            progressLump.className = "progressLump play";
            //addListenTouch(); //歌曲加载之后才可以拖动进度条
            totalTime = tkAudio.duration;
            timeChange(totalTime, "totalTime");
            tkAudio.removeEventListener("canplaythrough", canPlay, false);
         }
        // yxy改
        // 监听 点击事件（切换状态）
        progressLump.addEventListener("click", audioClicks, false);

        //监听暂停
        tkAudio.addEventListener("pause", function () {
            console.log("audio pauseing");
            progressLump.className = "progressLump play";
            if (tkAudio.currentTime == tkAudio.duration) {
                //tkAudio.currentTime = 0; //连续播放
            }
        }, false);

        //监听播放
        tkAudio.addEventListener("play", function () {
            console.log("audio playing");
            progressLump.className = "progressLump pause";
        }, false);

        //监听结束
        tkAudio.addEventListener("ended", function () {
            clearInterval(setIntervalFun);
            currentTime = 0;
            // yxy改：播放结束后复原播放状态
            tkAudio.currentTime = 0;
            progressLump.style.left = "0%";
            progressPlay.style.width = "0%";            
            progressLump.className = "progressLump play";
        }, false);
    }

    createAudioDiv();
    initAudio();

    //开始音频播放
    function playAudio() {
        if (tkAudio && progressLump) {
            dragMove();
            progressLump.className = "progressLump pause";
            tkAudio.play();

            clearInterval(setIntervalFun);
            setIntervalFun = setInterval(function () {
                currentTime = tkAudio.currentTime;
                dragMove();
            }, 1000);
        }
    }

    //暂停音频播放
    function pauseAudio() {
        if (tkAudio && progressLump) {
            progressLump.className = "progressLump play";
            tkAudio.pause();
            clearInterval(setIntervalFun);
        }
    }

    //停止音频播放
    function stopAudio() {
        if (tkAudio) {
            tkAudio.pause();
            Audioinfo.removeChild(tkAudio);
            clearInterval(setIntervalFun);
        }
    }

    //点击暂停播放
    function audioClicks() {
        if (progressLump.className.indexOf("play") > -1) {
            playAudio();//开始播放
        } else {
            pauseAudio();//暂停
        }
    }

    //滚动条滑动
    function dragMove() {
        var percent = "0";
        if (totalTime > 0) {
            percent = currentTime / totalTime;
        }
        percent = percent > 1 ? 1 : percent;
        percent = percent * 100 + "%";
        progressLump.style.left = percent;
        progressPlay.style.width = percent;
        timeChange(currentTime, "currentTime");
    }

    //播放时间
    function timeChange(time, timePlace) {
        var timePlace = document.getElementById(timePlace);
        time = Math.round(time);
        //分钟
        var minute = time / 60;
        var minutes = parseInt(minute);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        //秒
        var second = time % 60;
        seconds = parseInt(second);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var allTime = "" + minutes + "" + ":" + "" + seconds + ""
        timePlace.innerHTML = allTime;
    }

    //----------------------------------
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
        setInterval(function () {
            var ProgressNow = 0;
            var currentTime = audio.currentTime;
            var totalTime = audio.duration;
            var ProgressNow = (currentTime / totalTime) * 100;
            audioPlayer.find(".progressPlay").css("width", ProgressNow + "%");
            audioPlayer.find(".progressLump").css("left", ProgressNow + "%");    
            audioPlayer.find("#currentTime").text(timeFormat(currentTime));
            audioPlayer.find("#totalTime").text(timeFormat(totalTime));
            
            //播放完毕后，按钮回到原始状态，同时进度条回到起点，播放停止
            // if(audio.currentTime===audio.duration){
            //     audioPlayer.find(".BtnControl").removeClass("Playing");
            //     audioPlayer.find(".ProgressInnerBar").css("width","0%");
            //     audio.pause();
            // }
        }, 100);
    } 

    function setRangeBar(e) {
        var audioProgress = audioPlayer.find(".audioProgress");
        var progressPlay = audioPlayer.find(".progressPlay");
        var progressLump = audioPlayer.find(".progressLump");
        var pointX = e.pageX || e.originalEvent.targetTouches[0].pageX;
        var objX = audioProgress.offset().left;
        var runnableTrackWidth = (pointX - objX) / audioProgress.width() * 100;
        var RangeValue = Math.round(runnableTrackWidth);
        if(runnableTrackWidth <= 0) {          
            audio.currentTime = Math.round(RangeValue / 100 * audio.duration); 
            currentTime = audio.currentTime;
            TimeSpan();
        }
        else if(runnableTrackWidth > 0 && runnableTrackWidth < 100) {
            audio.currentTime = Math.round(RangeValue / 100 * audio.duration); 
            currentTime = audio.currentTime;
            TimeSpan();
        }
        else if(runnableTrackWidth >= 100){
            audio.currentTime = Math.round(RangeValue / 100 * audio.duration);   
            currentTime = audio.currentTime;
            TimeSpan();         
        }
    }

    //PC拖动进度条滑块
    audioPlayer.find(".progressLump").mousedown(function(e){
        //var isPause = audio.paused;
        //pauseAudio();//暂停
        setRangeBar(e);
        e.stopPropagation(e);        
        function relase(){
            $(window).off("mousemove",setRangeBar);
            $(window).off("mouseup",relase);
        }
        $(window).on("mousemove",setRangeBar);
        $(window).on("mouseup",relase);
        // if(!isPause) {
        //     playAudio();//开始播放            
        // }
    })

    // yxy改 添加
    // var downFlag = false;
    // audioPlayer.find(".audioProgress").mousemove(function(e) {
    //     if(downFlag) {
    //         var isPause = audio.paused;
    //         pauseAudio();//暂停
    //         setRangeBar(e);
    //         if(!isPause){
    //             playAudio();//开始播放
    //         }         
    //     }
    // });
    // audioPlayer.find(".audioProgress").mousedown(function() {
    //     downFlag = true;
    // });
    // audioPlayer.mouseup(function() {
    //     // 要不要为整个文档注册mouseup事件？？？
    //     downFlag = false;
    // });

    //移动端拖动进度条滑块
    audioPlayer.find(".progressLump").on("touchstart",function(e) {

        //setRangeBar(e);
        e.stopPropagation(e);
        function relase(){
            $(window).off("touchmove", setRangeBar);
            $(window).off("touchend",relase);
        }
        $(window).on("touchmove",setRangeBar);
        $(window).on("touchend",relase);
    });
    // ------------------------------

    return {
        initAudio: initAudio,
        playAudio: playAudio,
        pauseAudio: pauseAudio,
        stopAudio: stopAudio,
    }
}