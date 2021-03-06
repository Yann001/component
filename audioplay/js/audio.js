var H5LocalStorage = {
    isSupport: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            console.log('Your device is not supports lacalStorage.')
            return false;
        }
    },
    isExist: function(key) {
        if (this.isSupport()) {
            for (var i = 0; i < window.localStorage.length; i++)
                if (key === window.localStorage.key(i)) return true;
        }
        return false;
    },
    setLocalStorage: function(key, value) {
        if(!this.isSupport()) {
            return false;
        }
        else {
            try {
                window.localStorage.setItem(key, value);
            } catch (e) {
                console.log("window.localStorage if full......");
                window.localStorage.clear();
                window.localStorage.setItem(key, value);
            }
        }
    },
    getLocalStorage: function(key) {
        if(this.isExist(key)) {
            return JSON.stringify(window.localStorage.getItem(key));
        } 
        else {
            return null;
        }
    },
    removeLocalStorage: function(key) {
        if(this.isExist()) {
            window.localStorage.removeItem(key);
            return true;
        }
        else {
            return false;
        }
    }
}
//音频播放
/*
function TkAudio(src, audioBoxId) {    
    console.log("******************************")
    console.log("audioSrc: " + src);
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
    //audioSrc1 = "http://admintk.100xuexi.com/Plug/Ueditor/net/upload/2016-10-14/604ca9ed-c0ce-4779-8196-120a5d5f4ac3.mp3"
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
        //---------------- 设置初始进度开始 -------------
        // 开启定时器存储 播放状态
        var saveAudioStateTimer = setInterval(function() {
            var audioInfoObj = {
                audioSrc: tkAudio.src,
                playedTime: currentTime,
                playState: tkAudio.paused ? "pause" : "play"
            };
            //H5LocalStorage.removeLocalStorage("audio_info");
            H5LocalStorage.setLocalStorage("audio_info", JSON.stringify(audioInfoObj));
        }, 200);
        if(H5LocalStorage.getLocalStorage("audio_info") !== null && tkAudio.src === JSON.parse(H5LocalStorage.getLocalStorage("audio_info")).audioSrc) {            
            var obj = JSON.parse(H5LocalStorage.getLocalStorage("audio_info"));
            tkAudio.currentTime = obj.playedTime;
            if (obj.playState === "play") {
                tkAudio.play();
            }
        }

        //---------------- 设置初始进度结束 -------------
        //播放事件监听
        tkAudio.addEventListener("canplaythrough", canPlay, false);
        function canPlay() {
            console.log("audio can play");
            progressLump.className = "progressLump play";
            //addListenTouch(); //歌曲加载之后才可以拖动进度条
            totalTime = tkAudio.duration;
            refreshTime(totalTime, "totalTime");
            tkAudio.removeEventListener("canplaythrough", canPlay, false);
        }
        // yxy改
        // 监听 点击事件（切换状态）
        progressLump.addEventListener("click", changeAudioState, false);

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
    initAudio();


    //开始音频播放
    function playAudio() {
        if (tkAudio && progressLump) {            
            progressLump.className = "progressLump pause";
            tkAudio.play();
            moveScrollbar();
            refreshTime(currentTime, "currentTime");

            clearInterval(setIntervalFun);
            setIntervalFun = setInterval(function () {
                currentTime = tkAudio.currentTime;
                moveScrollbar();
                refreshTime(currentTime, "currentTime");
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
            tkAudio.currentTime = 0.0;
            Audioinfo.removeChild(tkAudio);
            clearInterval(setIntervalFun);
        }
    }

    //点击暂停播放
    function changeAudioState() {
        if (progressLump.className.indexOf("play") > -1) {
            playAudio();//开始播放
        } else {
            pauseAudio();//暂停
        }
    }

    // 移动滚动条滑动
    function moveScrollbar() {
        var percent = "0";
        if (totalTime > 0) {
            percent = currentTime / totalTime;
        }
        percent = percent > 1 ? 1 : percent;
        percent = percent * 100 + "%";
        progressLump.style.left = percent;
        progressPlay.style.width = percent;
    }

    // 刷新播放时间
    function refreshTime(time, timePlace) {
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
    //
    //
    //
    var audioPlayer = $(".Audioinfo");
    var audio = audioPlayer.find("audio")[0];
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
    function refreshState() {
        clearInterval(setIntervalFun);        
        var refreshStateInterval = setInterval(function () {
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
            refreshState();
        }
        else if(runnableTrackWidth > 0 && runnableTrackWidth < 100) {
            audio.currentTime = Math.round(RangeValue / 100 * audio.duration); 
            currentTime = audio.currentTime;
            refreshState();
        }
        else if(runnableTrackWidth >= 100){
            audio.currentTime = Math.round(RangeValue / 100 * audio.duration);   
            currentTime = audio.currentTime;
            refreshState();         
        }
    }

    //PC拖动进度条滑块
    // audioPlayer.find(".progressLump").mousedown(function(e){
    //     //var isPause = audio.paused;
    //     //pauseAudio();//暂停
    //     setRangeBar(e);
    //     e.stopPropagation(e);        
    //     function relase(){
    //         $(window).off("mousemove",setRangeBar);
    //         $(window).off("mouseup",relase);
    //     }
    //     $(window).on("mousemove",setRangeBar);
    //     $(window).on("mouseup",relase);
    //     // if(!isPause) {
    //     //     playAudio();//开始播放            
    //     // }
    // })

    // yxy改 添加
    var downFlag = false;
    audioPlayer.find(".audioProgress").mousemove(function(e) {
        if(downFlag) {
            var isPause = audio.paused;
            pauseAudio();//暂停
            setRangeBar(e);
            if(!isPause){
                playAudio();//开始播放
            }         
        }
    });
    audioPlayer.find(".audioProgress").mousedown(function() {
        downFlag = true;
    });
    audioPlayer.mouseup(function() {
        // 要不要为整个文档注册mouseup事件？？？
        downFlag = false;
    });

    //移动端拖动进度条滑块
    // audioPlayer.find(".progressLump").on("touchstart",function(e) {

    //     //setRangeBar(e);
    //     e.stopPropagation(e);
    //     function relase(){
    //         $(window).off("touchmove", setRangeBar);
    //         $(window).off("touchend",relase);
    //     }
    //     $(window).on("touchmove",setRangeBar);
    //     $(window).on("touchend",relase);
    // });
    //var downFlag = false;
    audioPlayer.find(".audioProgress").on("touchmove", function(e) {
        if(downFlag) {
            //var isPause = audio.paused;
            //pauseAudio();//暂停
            setRangeBar(e);
            // if(!isPause){
            //     playAudio();//开始播放
            // }         
        }
    });
    audioPlayer.find(".audioProgress").on("touchstart", function() {
        downFlag = true;
    });
    audioPlayer.on("touchend", function() {
        downFlag = false;
    });
    // ------------------------------

    return {
        initAudio: initAudio,
        playAudio: playAudio,
        pauseAudio: pauseAudio,
        stopAudio: stopAudio,
    }
}
*/
// --------------------------------
//音频播放
function TkAudio(src,audioBoxId) {
    console.log("**********TkAudio is executed*************")
    console.log("audioSrc: " + src);
    console.log(audioBoxId);
    //var Audioinfo = document.getElementById(audioBoxId);
    var Audioinfo = $('#' + audioBoxId);
    var btnControl = null, 
        progress = null, 
        progressInnerBar = null, 
        tkAudio = null, 
        audioSrc = null;
    var audio = null,
        totalTime = 0,
        currentTime = 0;
    var playTimer = null;
    var audioHistory = window.localStorage.getItem('audioHistory') ? JSON.parse(window.localStorage.getItem('audioHistory')) : null;
    if (src) {
        audioSrc = src;
    }
    //audioSrc = "http://admintk.100xuexi.com/Plug/Ueditor/net/upload/2014-01-19/46431f4e-3ba2-47b7-9e44-5a4dce22b022.mp3";

    //创建音频DOM
    function createAudioDiv() {
        if (Audioinfo.children().length <= 0) {
            // var html = '         <div class="audioProgress">';
            // html += '                 <div class="progressTotal"></div>';
            // html += '                   <div class="progressPlay" id="progressPlay"></div>';
            // html += '                 <div class="progressLump" id="progressLump">';
            // html += '                     <div class="audioIcoOut">';
            // html += '                         <div class="audioIco"></div>';
            // html += '                     </div>';
            // html += '                  </div>';
            // html += '              </div>';
            // html += '              <div class="audioTime">';
            // html += '                  <div class="timeInfo" name="Tips">';
            // html += '                      <span id="currentTime">00:00</span>/<span id="totalTime">00:00</span>';
            // html += '                  </div>';
            // html += '              </div>';
            var html = '    <span class="M-Art-AudioPlayer2">';
            html += '           <span class="BtnControl" id="btnControl">';
            html += '               <span class="StatusIco"></span>';
            html += '           </span>';
            html += '           <span class="Progress" id="progress">';
            html += '               <span class="ProgressBar">';
            html += '                   <span class="ProgressInnerBar" id="progressInnerBar" style="width: 0%;">';
            html += '                       <span class="ProgressPoint">';
            html += '                           <span class="StatusIco"></span>';
            html += '                       </span>';
            html += '                   </span>';
            html += '               </span>';
            html += '           </span>';
            html += '           <span class="Time">';
            html += '               <span id="currentTime">00:00</span>/<span id="totalTime">00:00</span>';
            html += '           </span>'
            html += '       </span>'
            Audioinfo.html(html);
        }
        btnControl = Audioinfo.find('#btnControl');
        progress = Audioinfo.find('#progress');
        progressInnerBar = Audioinfo.find('#progressInnerBar');
    }

    //音频初始化
    (function initAudio() {
        if (!audioSrc) return false;
        createAudioDiv();
        var tkAudioList = Audioinfo.find('audio');
        if (tkAudioList.length > 0) {
            for (var i = 0, i1 = tkAudioList.length; i < i1; i++) {
                tkAudioList[i].remove();
            }
        }

        tkAudio = $('<audio>');
        tkAudio.attr('src',audioSrc);
        Audioinfo.append(tkAudio);
        Audioinfo.css('display','block');
        btnControl.addClass('Pauseing');
        audio = Audioinfo.find('audio')[0];
        audio.load();

        if(audioHistory){
            if(audioSrc === audioHistory.audio_src) {
                console.log('相同音频');
                audio.currentTime = parseInt(audioHistory.audio_played);
                currentTime = audio.currentTime;
                if(audioHistory.audio_state === 'play') {
                    playAudio();
                }
            }
            else{
                console.log('不同音频');
                currentTime = audio.currentTime;               
            }
        }
        
        
        // 音频加载完成事件监听
        tkAudio.bind("canplaythrough", canPlay);

        btnControl.bind('click', function(e) {
            e.stopPropagation();
            if (btnControl.attr('class').indexOf("Playing") > -1) {
                pauseAudio();//暂停
            } else {
                playAudio();//开始播放                
            }
        });
        tkAudio.bind("ended", function () {
            btnControl.removeClass('Playing');
            clearInterval(playTimer);
            audio.currentTime = 0;
            currentTime = 0;
            moveScrollbar();
            refreshTime(currentTime, "currentTime");
        });
        function canPlay() {
            console.log("audio can play");
            totalTime = audio.duration;
            refreshTime(totalTime, "totalTime");
            tkAudio.unbind("canplaythrough", canPlay);
            // 阻止事件冒泡
            return false;
        }
    })();    

    // 滑动滚动条
    function moveScrollbar() {
        var percent = "0";
        if (totalTime > 0) {
            percent = currentTime / totalTime;
        }
        percent = percent > 1 ? 1 : percent;
        percent = percent < 0 ? 0 : percent;
        percent = percent * 100 + "%";
        progressInnerBar.css('width',percent);
    }

    // 刷新播放时间
    function refreshTime(time, timePlaceId) {
        var timePlace = Audioinfo.find('#' + timePlaceId);
        time = Math.round(time);
        //分
        var minute = time / 60;
        var minutes = parseInt(minute);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        //秒
        var second = time % 60;
        seconds = parseInt(second);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        var allTime = minutes  + ':' + seconds + '';
        timePlace.text(allTime);
    }

    // 播放音频     
    function playAudio() {
        if(tkAudio && progress) {
            btnControl.addClass('Playing');
            audio.play();
            moveScrollbar();
            refreshTime(currentTime, "currentTime");
            playTimer = setInterval(function() {
                console.log('The audio is playing...')
                currentTime = audio.currentTime;
                moveScrollbar();
                refreshTime(currentTime, "currentTime");
            }, 1000);
        }
    }

    // 暂停音频
    function pauseAudio() {
        if(tkAudio && progress) {
            btnControl.removeClass('Playing');
            audio.pause();
            clearInterval(playTimer);
        }
    }

    // 停止音频
    function stopAudio() {
        if (tkAudio) {
            // 保存当前音频状态
            // ----------------
            var currentAudioStateObj = {
                audio_src: audio.src,
                audio_played: audio.currentTime,
                audio_duration: audio.duration,
                audio_state:audio.paused ? 'pause' : 'play'
            }
            window.localStorage.removeItem('audioHistory', JSON.stringify(currentAudioStateObj));
            window.localStorage.setItem('audioHistory', JSON.stringify(currentAudioStateObj));
            // ----------------
            btnControl.removeClass('Playing');
            clearInterval(playTimer);
            audio.pause();
            audio.currentTime = 0.0;
            currentTime = 0
            moveScrollbar();
            refreshTime(currentTime, "currentTime");
            Audioinfo.children().remove();
        }
    }    

    //点击进度条
    Audioinfo.find(".ProgressBar").on("click",function(e){
        setRangeBar(e);
        e.stopPropagation(e);
    })
    
    //PC拖动进度条滑块
    Audioinfo.find(".ProgressBar .ProgressPoint .StatusIco").on('mousedown', function(e){
        setRangeBar(e);
        e.stopPropagation(e);
        function relase(){
            $(window).off("mousemove",setRangeBar);
            $(window).off("mouseup",relase);
        }
        $(window).on("mousemove",setRangeBar);
        $(window).on("mouseup",relase);
    });

    //移动端拖动进度条滑块
    Audioinfo.find(".ProgressBar .ProgressPoint .StatusIco").on("touchstart",function(e) {        
        e.stopPropagation(e);
        setRangeBar(e);
        function relase(){
            $(window).off("touchmove", setRangeBar);
            $(window).off("touchend",relase);
        }
        $(window).on("touchmove",setRangeBar);
        $(window).on("touchend",relase);
    });

    //更新播放器时间和进度条进度
    function refreshState(currentTime) {        
        moveScrollbar();
        refreshTime(currentTime, 'currentTime');
    } 

    // 拖放设置音频当前时间
    function setRangeBar(e) {
        var pointX = e.pageX || e.originalEvent.targetTouches[0].pageX;
        var objX = progress.offset().left;
        var runnableTrackWidth = (pointX - objX) / progress.width() * 100;
        var RangeValue = Math.round(runnableTrackWidth);
        if(runnableTrackWidth <= 0) {          
            audio.currentTime = 0; 
            currentTime = audio.currentTime;
            refreshState(currentTime);
        }
        else if(runnableTrackWidth > 0 && runnableTrackWidth < 100) {
            audio.currentTime = Math.round(RangeValue / 100 * audio.duration); 
            currentTime = audio.currentTime;
            refreshState(currentTime);
        }
        else if(runnableTrackWidth >= 100) {
            audio.currentTime = 100;   
            currentTime = audio.currentTime;
            refreshState(currentTime);         
        }
        return false;
    }

    return {
        playAudio: playAudio,
        pauseAudio: pauseAudio,
        stopAudio: stopAudio,
    }
    
}
// --------------------------------