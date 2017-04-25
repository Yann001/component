
//LocalStorage
(function () {
    var LS = {
        //localStorage相关封装的方法
        supports_html5_storage: function () {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        },
        SetLocalStorage: function (key, value, validTime) {
            if (!LS.supports_html5_storage()) {
                return false;
            } else {
                //valid time 默认为 20分钟
                if (!validTime) {
                    validTime = 20 * 60 * 1000;
                } else if (validTime == -1) {
                    var item = { validTime: 0, data: value };
                    LS.TryLoaclStorage(key, JSON.stringify(item));
                    return;
                }
                var item = { validTime: new Date().getTime() + validTime, data: value };
                LS.TryLoaclStorage(key, JSON.stringify(item));
            }
        },
        TryLoaclStorage: function (key, value) {
            try {
                window.localStorage.setItem(key, value);
            } catch (e) {
                console.log("window.localStorage if full..........................");
                window.localStorage.clear();
                window.localStorage.setItem(key, value);
            }
        },
        GetLocalStorage: function (key) {
            if (!LS.localStorageExists(key)) return null;
            var item = JSON.parse(window.localStorage.getItem(key));
            if (item.validTime == 0) return item.data;
            if (item.validTime < new Date().getTime()) return null;
            return item.data;
        },
        localStorageExists: function (key) {
            if (LS.supports_html5_storage()) {
                for (var i = 0; i < window.localStorage.length; i++)
                    if (key === window.localStorage.key(i)) return true;
            }
            return false;
        },
        RemoveLocalStorage: function (key) {
            if (LS.supports_html5_storage()) localStorage.removeItem(key);
        },
    }

    window.LS = LS;
})();