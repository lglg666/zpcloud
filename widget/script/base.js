window.showProgressAnimationType = "fade";
window.showProgressTitle = "努力加载中...";
window.showProgressText = "先喝杯茶...";
window._preconf = "jhcloudappzzz_";
window.version = "1.0"; //接口版本
var _baseKey = {
        downloadKey: "jhcloud_download"
    },
    _docReader;

//权限被禁止 开放全新
function _permissionDenied(msg) {
    H.$confirm(function() {
        if (api.systemType == "ios") {
            api.openApp({
                iosUrl: "app-settings:﻿"
            }, function(ret, err) {
                if (err) {
                    H.$alert("跳转失败，请手动设置!");
                }
            });
        }
    }, function() {}, msg);
}

function _isCloud() {
    return _getPrefs("is_cloud", false);
}
//此方法用于文件下载标识
function _addDownload(id) {
    var downLoadArr = _getCache("download_file");
    if (!downLoadArr) {
        downLoadArr = [];
    }
    downLoadArr.push({
        id: id,
        is_del: false,
        load_time: new Date()
    })
    _setCache("download_file", downLoadArr);
}
//此方法用于获取已下载文件的列表
function _getDownload() {
    return _getCache("download_file");
}
//此方法用于清空已下载的列表
function _clearDownLoad() {
    var downloadArr = [];
    return _setCache("download_file", downloadArr);
}
//用于获取资料库搜索功能的历史记录
function getHistorySearchzl() {
    return _getCache("HistorySearchzlarr");
}
//用于设置资料库搜索功能的历史记录
function setHistorySearchzl(HistorySearchzl) {
    var HistorySearchzlarr = _getCache("HistorySearchzlarr");
    if (!HistorySearchzlarr) {
        HistorySearchzlarr = [];
    }
    var a = HistorySearchzlarr.filter(function(v) {
        return v.key == HistorySearchzl.keyName;
    }).length > 0;
    if (a) {
        console.log("该关键字已存在");
        return false;
    } else {
        HistorySearchzlarr.push({
            key: HistorySearchzl.keyName,
            is_del: false,
            load_time: new Date(),
            type: "ziliaoKey"
        })
        _setCache("HistorySearchzlarr", HistorySearchzlarr);
    }
}
//此方法用于清空所有历史记录列表
function _clearHistorySearchzl() {
    var HistorySearchzlarr = [];
    return _setCache("HistorySearchzlarr", HistorySearchzlarr);
}
//判断是否只含中文，数字和字母
function _isInputTrue(char) {
    var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
    if (reg.test(char)) {
        return true;
    } else {
        return false;
    }
}
//添加下载缓存
function _addDownCache(t, key) {
    var l = _getCache(key, []);
    if (!l) {
        l = [];
    }
    l.splice(0, 0, t);
    _setCache(key, l);
}
var _audioModel;
//打开文件 office
function _openFile(p) {
    if (!_fsModel) {
        _fsModel = api.require('fs');
    }
    var ex = _fsModel.existSync({
        path: p
    });
    if (!ex.exist) {
        H.$toast("文件不存在");
        return;
    } else {}
    var ext = p.substr(p.lastIndexOf(".") + 1);
    //图片或者文档
    if (['gif', 'jpg', 'jpeg', 'bmp', 'png', 'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].indexOf(ext) > -1) {
        if (!_docReader) {
            _docReader = api.require('docReader');
        }
        _docReader.open({
            path: p,
            autorotation: false
        }, function(ret, err) {
            console.log(JSON.stringify(ret));
            if (ret.status) {}
        });
    }
    if (["mp3", "WAV", "OGG", "ASF", "WMA", "MP3PRO", "RM", "REAL", "APE", "MODULE"].indexOf(ext) > -1) {
        if (!_audioModel) {
            _audioModel = api.require('audio');
        }
        _audioModel.play({
            path: p
        }, function(ret, err) {
            if (ret) {
                if (ret.complete) {
                    console.log("播放结束");
                } else {
                    console.log(ret.current);
                }
            } else {
                H.$toast(JSON.stringify(err));
            }
        });
    }
}
var _fsModel;
//执行下载文件  url：网络地址  path：保存文件夹 在download下 name：保存文件名（不带后缀） id：记录id
function _downloadFile(callback, url, type, name, id) {
    var key = _baseKey.downloadKey;
    // if(name.indexOf(".")>-1){
    //     name = name.substr(0,name.lastIndexOf("."));
    // }
    name = utils.removeIllegalChar(name);
    var fname = name + url.substr(url.lastIndexOf("."));
    var caches = _getCache(key, []);
    //console.log(JSON.stringify(caches));
    var exist = caches.find(function(v) {
        return v.id == id & v.type == type
    });
    if (exist != undefined) {
        if (!_fsModel) {
            _fsModel = api.require('fs');
        }
        var ex = _fsModel.existSync({
            path: exist.url
        });
        //如果文件存在就打开文件
        if (ex.exist) {
            _openFile(exist.url);
            return;
        }
    }
    //点击即完成 因为退出页面callback不会执行
    H.$confirm(function() {
        H.$toast("开始下载");
        var isCall = false;
        api.download({
            url: utils.fileUrl() + url,
            savePath: 'fs://download/' + fname,
            report: true,
            cache: true,
            allowResume: true
        }, function(ret, err) {
            // console.log(JSON.stringify(ret));
            // console.log(JSON.stringify(err));
            if (ret.state == 1) {
                setTimeout(function() {
                    H.$toast("下载成功！");
                    _openFile('fs://download/' + fname);
                });
            } else {
                if (ret.state == 0 && !isCall) {
                    isCall = true;
                    utils.isFunction(callback) && callback({
                        path: 'fs://download/' + fname
                    });
                }
                if (ret.state == 2) {
                    H.$alert("文件下载失败");
                }
            }
        });
    }, false, "下载文件？")

}

function _isAPICloud() {
    var that = this;
    if (typeof api !== 'undefined' && typeof api.openWin !== 'undefined') {
        return true;
    } else {
        return false;
    }
}

function _user() {
    return _getPrefs("user");
}
//初始化 _user用户信息
function _initUser(user) {
    _setPrefs("user", user);
}

function _getToken() {
    return _getPrefs("token");
}

function _setToken(token) {
    _setPrefs("token", token);
}

function _setPrefs(key, value) {
    api.setPrefs({
        key: _preconf + key,
        value: JSON.stringify(value)
    });
}

function _getPrefs(key, defaultV) {
    var value = api.getPrefs({
        sync: true,
        key: _preconf + key
    });
    return value ? JSON.parse(value) : (defaultV ? defaultV : "");
}

function _getCache(key, defaultV) {
    var v = H.getStorage(key);
    return v ? v : (defaultV ? defaultV : v);
}

function _setCache(key, value) {
    return H.setStorage(key, value);
}

//获取云服务器上的配置文件
function _getConfig(url, callBack) {
    api.ajax({
        url: url,
        method: "GET",
        cache: false,
        timeout: 20,
        dataType: "text"
    }, function(ret, err) {
        callBack(ret, err);
    });
}

function _initConfig(callback) {
    //获取服务器路径
    // 	var xml = api.readFile({
    //	    sync: true,
    //	    path: 'widget://old/config.xml'
    //	});
    //	//console.log(xml);
    //	var parser=new DOMParser();
    //
    //	//xml = '<?xml version="1.0" encoding="utf-8"?><Para><AjaxPara id="1"><ServerUrl>http://192.168.42.187/ksConfig/config.xml</ServerUrl></AjaxPara><AjaxPara id="2"><DeviceName>IOSy</DeviceName><DeviceVer>7+</DeviceVer></AjaxPara></Para>';
    //	var $xml = parser.parseFromString(xml.toString(),'text/xml');
    //	var configUrl = $xml.querySelector("ServerUrl").innerHTML;
    var parser = new DOMParser();
    var configUrl = "https://www.juhaisoft.net:89/ksConfig/config.xml";

    _getConfig(configUrl, function(ret, err) {
        if (ret) {
            var $ret = parser.parseFromString(ret.toString(), 'text/xml');
            var $device = $($ret).find("Android").find("Version[Value='" + window.version + "']");
            //var $device = $($xml).find("Ios").find("Version[Value='1.0']")
            if (api.systemType == "ios") {
                $device = $($ret).find("Ios").find("Version[Value='" + window.version + "']")
            }
            var serverList = $device.find("Server").find("Item").map(function() {
                return {
                    name: $(this).attr("Name"),
                    url: $(this).text()
                };
            }).toArray();
            var isShowServerSelector = $device.find("IsShowServerSelector").text().toUpperCase() == "TRUE" ? true : false;
            //如果serverUrl已经不再列表中 那么退出登录
            if (serverList.filter(function(v) {
                    return v.url == utils.baseUrl();
                }).length == 0) {
                _initUser("");
                utils.setBaseUrl("");
                if (api.winName != "login_win") {
                    H.$execScript("index", null, "openLogin();");
                }
            }
            H.setStorage("serverConfig", JSON.stringify({
                serverList: serverList,
                isShowServerSelector: isShowServerSelector
            }));
        }
        utils.isFunction(callback) && callback(ret ? true : false);
    });
}

function _getServerConfig() {
    return H.getStorage("serverConfig") ? JSON.parse(H.getStorage("serverConfig")) : "";
}


// url:/PreExam.asmx/GetQDTByQDIDStr data:{}
var _serverConnectAble = true;

//检测服务器连接状态
function _checkConnect(callback) {
    //if(utils.baseUrl()=="") callback(false);return;
    api.ajax({
        url: utils.baseUrl() + 'robots.txt',
        data: {},
        method: "get",
        cache: false,
        timeout: 3,
        dataType: "text"
    }, function(ret, err) {
        callback(ret ? true : false);
    });
}

//只有成功才执行callback  用于一些接口可能部分服务器未更新
function _delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, ""); //去掉所有的html标记
}

// 广播事件
function _sendEvent(eventName, extra) {
    var _extra = (typeof arguments[1] == "undefined" || arguments[1] == null) ? {} : arguments[1];
    api.sendEvent({
        name: eventName,
        extra: _extra
    });
}
// 监听事件
function _addEventListener(eventName, _call, extra) {
    var _extra = (typeof arguments[2] == "undefined" || arguments[2] == null) ? {} : arguments[2];
    api.addEventListener({
        name: eventName,
        extra: _extra
    }, function(ret, err) {
        if (typeof _call == "function") {
            _call(ret);
        }
    });
}
var _pullRefresh;

function _setDownToRefresh(callback, wrap) {
    var doFun = function() {
        var t = document.querySelector(wrap ? wrap : '.refresh-box');
        if (t == null) {
            t = document.querySelector(wrap ? wrap : 'body');
        }
        _pullRefresh = new auiPullToRefresh({
            container: t,
            "triggerDistance": '200', //下拉高度
            "callback": utils.isFunction(callback) ? callback : function() {} //刷新回调
        });
    }
    if (typeof(auiPullToRefresh) != "undefined") {
        doFun();
    } else {
        utils.loadScript('aui/pull-refresh.js', function() {
            doFun();
        });
    }
}

function _stopRefresh() {
    setTimeout(function() {
        _pullRefresh && _pullRefresh.cancelLoading();
    }, 500)
}
var utils = {};
/*  date  */
utils.Format = function(d, fmt) { //author: meizz
        var o = {
            "M+": d.getMonth() + 1, //月份
            "d+": d.getDate(), //日
            "h+": d.getHours(), //小时
            "m+": d.getMinutes(), //分
            "s+": d.getSeconds(), //秒
            "q+": Math.floor((d.getMonth() + 3) / 3), //季度
            "S": d.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    } //var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
utils.strToDate = function(str) {
        //str = str.replace(/-/gi,"/").replace(/T/gi," ");
        //str = str.replace(/-/g,"/");
        if (!str || str == null) {
            return null
        }
        var darr = str.split(/[-|T|:]/);
        darr[1] = parseInt(darr[1]) - 1;
        return new Date(darr[0], darr[1], darr[2], darr[3], darr[4], darr[5]);
    }
    //数组求和
utils.sumArray = function(arr, key) {
    var ret = 0;
    arr.forEach(function(item) {
        var num = key != void 0 ? item[key] : item;
        ret += parseFloat(num);
    });
    return ret;
}

//去空格   第二个参数为g去所有
utils.Trim = function(str, is_global) {
        var result;
        if (!str) {
            return "";
        }
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global && is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    }
    //去除html标签
utils.text = function(str) {
    return str && str != null ? str.replace(/<\/?.+?>/g, "") : '';
}
utils.textAndImg = function(str) {
    if (!str) return "";
    str = str.replace(/\{FILEURL\}/g, this.fileUrl());
    return str && str != null ? str.replace(/<(?!img)[^<>]*>/ig, '') : '';
}
utils.baseUrl = function() {
    return H.getStorage("serverUrl") ? H.getStorage("serverUrl") : "";
}
utils.fileUrl = function() {
    return H.getStorage("fileUrl") ? H.getStorage("fileUrl") : "";
}
utils.setBaseUrl = function(url) {
  console.log(url);
    H.setStorage("serverUrl", url)
}
utils.setFileUrl = function(url) {
    H.setStorage("fileUrl", url)
}
utils.isFunction = function(func) {
        return func && typeof(func) == "function";
    }
    //移除非法字符
utils.removeIllegalChar = function(str) {
    if (!str) return "";
    return str.replace(/[\s&\|\\\*^%$#@\-]/g, "");
}
utils.newGuid = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
utils.setInterval = function(callback, p) {

}
utils.secondToTime = function(d) {
    var l = [];
    l.push(Math.floor(d / 3600));
    l.push(Math.floor(d / 60));
    l.push(d % 60);
    return l.filter(function(v) {
        return v > 0;
    }).map(function(v) {
        if (v < 10) {
            return "0" + v;
        }
        return v;
    }).join(":");
}
utils.getDateTimeStamp = function(dateStr) {
        return Date.parse(dateStr.replace(/-/gi, "/"));
    }
    //获取几天前，几分钟前
utils.getDateDiff = function(dateTimeStamp) {
    if (!dateTimeStamp) return "";
    dateTimeStamp = this.getDateTimeStamp(dateTimeStamp);
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return "刚刚";
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
}
utils.checkForm = function(form) {
        var $form = $(form);

    }
    //异步加载js
utils.loadScript = function(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others: Firefox, Safari, Chrome, and Opera
        script.onload = function() {
            callback();
        };
    }
    script.src = "../../script/" + url;
    document.body.appendChild(script);
}
utils.getFileIcon = function(file_type) {
    var icon = {
        excel: "#icon-excel",
        pdf: "#icon-pdf",
        ppt: "#icon-ppt",
        img: "#icon-image",
        rar: "#icon-zip",
        zip: "#icon-zip",
        audio: "#icon-mp",
        word: "#icon-world",
    }
    return icon[file_type] ? icon[file_type] : "#icon-other";
}
var _urlConfig = {
    "course/course_detail": {
        title: "课程详情",
        head: "course/course_detail_head.html",
    },
    "source/body": {
        head: "source/head.html",
    },
};

$base = {};
$base.openWin = function(name, param, title, head) {
        conf = _urlConfig[name];
        var url = "../" + name + ".html";
        if (!conf) {
            conf = {};
        }
        if (title) {
            conf.title = title;
        }
        if (head) {
            conf.head = head;
        }
        var headUrl = conf.head ? ("../" + conf.head) : "../common/head.html";
        param = param ? param : {};
        if (_isAPICloud()) {
            param.fromWin = api.winName;
            param.fromFrame = api.frameName;
            var wName = name + "win";
            if (wName == api.winName) {
                wName = wName + "_new";
            }
            H.$openWin(wName, headUrl, {
                url: url,
                name: name + "frm",
                title: conf.title,
                slidBackEnabled: api.systemType == "ios",
                pageParam: param
            })
        } else {
            location.href = url;
        }
    }
    //稍后关闭window  因为当部分动画执行时closeWin操作会失效 所以延迟zhixing
$base.waitToClose = function() {
        setTimeout(function() {
            H.$closeCurrentWin();
        }, 500)
    }
    //显示动画
$base.showLoading = function() {
        H.$openFrame('jiazai', 'widget://html/popup/jiazai.html', null, {
            x: 0,
            y: 0
        });
    }
    //关闭加载动画
$base.closeLoading = function() {
    H.closeFrame("jiazai");
}
$base.showProgress = function(title, text, modal, animationType) {
    var _title = (typeof arguments[0] == "undefined" || arguments[0] == null) ? window.showProgressTitle : arguments[0];
    var _text = (typeof arguments[1] == "undefined" || arguments[1] == null) ? window.showProgressText : arguments[1];
    var _modal = (typeof arguments[2] == "undefined" || arguments[2] == null) ? true : arguments[2];
    var _animationType = (typeof arguments[3] == "undefined" || arguments[3] == null) ? window.showProgressAnimationType : arguments[3];
    api.showProgress({
        style: 'default',
        animationType: _animationType,
        title: _title,
        text: _text,
        modal: _modal
    });
}
$base.hideProgress = function() {
    api.hideProgress();
}
$base.ajax = function(url, data, scallback, ecallback, timeout, returnAll) {
    //console.log(JSON.stringify(data));
    console.log(utils.baseUrl());
  //  H.setStorage("Hospital_ip",utils.baseUrl());
  //  var ip = H.getStorage("Hospital_ip");
    if(utils.baseUrl()!==""){
      api.ajax({
          url: utils.baseUrl() + '' + url,
          data: {
              values: data,
              files : data
          },
          method: "POST",
          cache: false,
          timeout: timeout ? timeout : 20,
          headers: {
              "Accept": "*/*",
              //"Content-Type": "application/json, charset=utf-8",
              // "appid": api.deviceId,
              // "token": _getToken(),
          },
          dataType: "json"
      }, function(ret, err) {

          if (ret) {
              utils.isFunction(scallback) && scallback(ret);
              return;
              // if (returnAll) {
              //     utils.isFunction(scallback) && scallback(ret);
              //     return;
              // }
              // if (ret.status == 1) {
              //     //更新sessionId
              //     if (ret.SessionId) {
              //         var user = _user();
              //         user.SessionId = ret.SessionId;
              //         _initUser(user);
              //     }
              //     utils.isFunction(scallback) && scallback(ret.Result);
              // } else {
              //     //console.log(JSON.stringify(ret));
              //     utils.isFunction(ecallback) && ecallback(ret);
              // }
          } else {
              console.log(JSON.stringify(err));
              //连接服务器失败
              $base.toast(err.msg);
              //（0：连接错误、1：超时、2：授权错误、3：数据类型错误）
              console.log(JSON.stringify(err));
              ecallback(err.msg);
              // if(err.statusCode==0){
              // 	utils.isFunction(ecallback)&&ecallback(-5);
              // }else{
              //   		utils.isFunction(ecallback)&&ecallback(err.msg);
              // }
          }
      });
    }else {
      api.ajax({
          url: "http://lzgryy.juhaisoft.com/Hospital"+ '' + url,
          data: {
              values: data,
              files : data
          },
          method: "POST",
          cache: false,
          timeout: timeout ? timeout : 20,
          headers: {
              "Accept": "*/*",
              //"Content-Type": "application/json, charset=utf-8",
              // "appid": api.deviceId,
              // "token": _getToken(),
          },
          dataType: "json"
      }, function(ret, err) {

          if (ret) {
              utils.isFunction(scallback) && scallback(ret);
              return;
              // if (returnAll) {
              //     utils.isFunction(scallback) && scallback(ret);
              //     return;
              // }
              // if (ret.status == 1) {
              //     //更新sessionId
              //     if (ret.SessionId) {
              //         var user = _user();
              //         user.SessionId = ret.SessionId;
              //         _initUser(user);
              //     }
              //     utils.isFunction(scallback) && scallback(ret.Result);
              // } else {
              //     //console.log(JSON.stringify(ret));
              //     utils.isFunction(ecallback) && ecallback(ret);
              // }
          } else {
              console.log(JSON.stringify(err));
              //连接服务器失败
              $base.toast(err.msg);
              //（0：连接错误、1：超时、2：授权错误、3：数据类型错误）
              console.log(JSON.stringify(err));
              ecallback(err.msg);
              // if(err.statusCode==0){
              // 	utils.isFunction(ecallback)&&ecallback(-5);
              // }else{
              //   		utils.isFunction(ecallback)&&ecallback(err.msg);
              // }
          }
      });
    }
    console.log(utils.baseUrl()+''+url);

}

$base.ajax2 = function(url, data, scallback, ecallback, timeout, returnAll) {
    //console.log(JSON.stringify(data));
    console.log(utils.baseUrl());
  //  H.setStorage("Hospital_ip",utils.baseUrl());
  //  var ip = H.getStorage("Hospital_ip");
    if(utils.baseUrl()!==""){
      api.ajax({
          url: utils.baseUrl() + '' + url,
          data: {
              body: JSON.stringify(data),
              files : data
          },
          method: "POST",
          cache: false,
          timeout: timeout ? timeout : 20,
          headers: {
              "Accept": "*/*",
              //"Content-Type": "application/json, charset=utf-8",
              // "appid": api.deviceId,
              // "token": _getToken(),
          },
          dataType: "json"
      }, function(ret, err) {

          if (ret) {
              utils.isFunction(scallback) && scallback(ret);
              return;
              // if (returnAll) {
              //     utils.isFunction(scallback) && scallback(ret);
              //     return;
              // }
              // if (ret.status == 1) {
              //     //更新sessionId
              //     if (ret.SessionId) {
              //         var user = _user();
              //         user.SessionId = ret.SessionId;
              //         _initUser(user);
              //     }
              //     utils.isFunction(scallback) && scallback(ret.Result);
              // } else {
              //     //console.log(JSON.stringify(ret));
              //     utils.isFunction(ecallback) && ecallback(ret);
              // }
          } else {
              console.log(JSON.stringify(err));
              //连接服务器失败
              $base.toast(err.msg);
              //（0：连接错误、1：超时、2：授权错误、3：数据类型错误）
              console.log(JSON.stringify(err));
              ecallback(err.msg);
              // if(err.statusCode==0){
              // 	utils.isFunction(ecallback)&&ecallback(-5);
              // }else{
              //   		utils.isFunction(ecallback)&&ecallback(err.msg);
              // }
          }
      });
    }else {
      api.ajax({
          url: "http://lzgryy.juhaisoft.com"+ '' + url,
          data: {
              values: data,
              files : data
          },
          method: "POST",
          cache: false,
          timeout: timeout ? timeout : 20,
          headers: {
              "Accept": "*/*",
              //"Content-Type": "application/json, charset=utf-8",
              // "appid": api.deviceId,
              // "token": _getToken(),
          },
          dataType: "json"
      }, function(ret, err) {

          if (ret) {
              utils.isFunction(scallback) && scallback(ret);
              return;
              // if (returnAll) {
              //     utils.isFunction(scallback) && scallback(ret);
              //     return;
              // }
              // if (ret.status == 1) {
              //     //更新sessionId
              //     if (ret.SessionId) {
              //         var user = _user();
              //         user.SessionId = ret.SessionId;
              //         _initUser(user);
              //     }
              //     utils.isFunction(scallback) && scallback(ret.Result);
              // } else {
              //     //console.log(JSON.stringify(ret));
              //     utils.isFunction(ecallback) && ecallback(ret);
              // }
          } else {
              console.log(JSON.stringify(err));
              //连接服务器失败
              $base.toast(err.msg);
              //（0：连接错误、1：超时、2：授权错误、3：数据类型错误）
              console.log(JSON.stringify(err));
              ecallback(err.msg);
              // if(err.statusCode==0){
              // 	utils.isFunction(ecallback)&&ecallback(-5);
              // }else{
              //   		utils.isFunction(ecallback)&&ecallback(err.msg);
              // }
          }
      });
    }
    console.log(utils.baseUrl()+''+url);

}

$base.upload = function(url, data, scallback, ecallback, timeout, returnAll) {
    //console.log(JSON.stringify(data));
    //console.log(utils.baseUrl()+''+url);
    api.ajax({
        url: utils.baseUrl() + '' + url,
        data: {
            files : data
        },
        method: "POST",
        cache: false,
        timeout: timeout ? timeout : 20,
        headers: {
            "Accept": "*/*",
            //"Content-Type": "application/json, charset=utf-8",
            // "appid": api.deviceId,
            // "token": _getToken(),
        },
        dataType: "json"
    }, function(ret, err) {

        if (ret) {
            utils.isFunction(scallback) && scallback(ret);
            return;
            // if (returnAll) {
            //     utils.isFunction(scallback) && scallback(ret);
            //     return;
            // }
            // if (ret.status == 1) {
            //     //更新sessionId
            //     if (ret.SessionId) {
            //         var user = _user();
            //         user.SessionId = ret.SessionId;
            //         _initUser(user);
            //     }
            //     utils.isFunction(scallback) && scallback(ret.Result);
            // } else {
            //     //console.log(JSON.stringify(ret));
            //     utils.isFunction(ecallback) && ecallback(ret);
            // }
        } else {
            console.log(JSON.stringify(err));
            //连接服务器失败
            $base.toast(err.msg);
            //（0：连接错误、1：超时、2：授权错误、3：数据类型错误）
            console.log(JSON.stringify(err));
            ecallback(err.msg);
            // if(err.statusCode==0){
            // 	utils.isFunction(ecallback)&&ecallback(-5);
            // }else{
            //   		utils.isFunction(ecallback)&&ecallback(err.msg);
            // }
        }
    });
}
var _pendingRequests = {};
//提交表单
$base.submit = function(url, data, scall, ecall, msg) {
      console.log(url);
        if (_pendingRequests[url]) {
            console.log("重复提交");
            return;
        } //防止重复提交  目前的方式是不允许在同一页面重复访问同一地址
        msg && $base.showProgress(msg);
        _pendingRequests[url] = true;

        $base.ajax(url, data, function(ret) {
            _pendingRequests[url] = void 0;
            scall(ret);
        }, function(err) {
            _pendingRequests[url] = void 0;
            msg && $base.hideProgress();
            // if (typeof(err) == "object" && (err.Code == -12 || err.Code == -10)) {
            //     $base.openLogin();
            // }
            if (typeof(err) == "object") {
                $base.toast(err.msg ? err.msg : err.Msg);
                utils.isFunction(ecall) && ecall(err.msg ? err.msg : err.Msg);
            } else {
                $base.toast(err);
                utils.isFunction(ecall) && ecall(err);
            }
        });
    }
    //加载数据 成功返回 ret.result值 失败返回err.msg
$base.get = function(url, data, scall, ecall) {
    var doFun = function() {
        $base.ajax(url, data, function(ret) {
            utils.isFunction(scall) && scall(ret);
        }, function(err) {
            //登录过期或被顶号
            // if (api.winName != "main_index" && typeof(err) == "object" && (err.Code == -10 || err.Code == -11 || err.Code == -12)) {
            //     $base.openLogin();
            //     //登录成功后再查询一次
            //     _addEventListener("loginSuccess", function() {
            //         doFun();
            //     })
            // } else {
            //     //如果get失败了  加进失败访问缓存
            //     if (!window._getError) {
            //         window._getError = {};
            //     }
            //     var _ekey = url + JSON.stringify(data);
            //     if (typeof(window._getError[_ekey]) != "function") {
            //         window._getError[_ekey] = doFun;
            //     }
            // }
            if (typeof(err) == "object") {
                $base.toast(err.msg ? err.msg : err.errmsg);
                utils.isFunction(ecall) && ecall(err.msg ? err.msg : err.errmsg);
            } else {
                $base.toast(err);
                utils.isFunction(ecall) && ecall(err);
            }
        });
    }
    doFun();
}

$base.get2 = function(url, data, scall, ecall) {
    var doFun = function() {
        $base.ajax2(url, data, function(ret) {
            utils.isFunction(scall) && scall(ret);
        }, function(err) {
            //登录过期或被顶号
            // if (api.winName != "main_index" && typeof(err) == "object" && (err.Code == -10 || err.Code == -11 || err.Code == -12)) {
            //     $base.openLogin();
            //     //登录成功后再查询一次
            //     _addEventListener("loginSuccess", function() {
            //         doFun();
            //     })
            // } else {
            //     //如果get失败了  加进失败访问缓存
            //     if (!window._getError) {
            //         window._getError = {};
            //     }
            //     var _ekey = url + JSON.stringify(data);
            //     if (typeof(window._getError[_ekey]) != "function") {
            //         window._getError[_ekey] = doFun;
            //     }
            // }
            if (typeof(err) == "object") {
                $base.toast(err.msg ? err.msg : err.errmsg);
                utils.isFunction(ecall) && ecall(err.msg ? err.msg : err.errmsg);
            } else {
                $base.toast(err);
                utils.isFunction(ecall) && ecall(err);
            }
        });
    }
    doFun();
}

//上传文件
$base.commit = function(url, data, scall, ecall, msg) {
        if (_pendingRequests[url]) {
            console.log("重复提交");
            return;
        } //防止重复提交  目前的方式是不允许在同一页面重复访问同一地址
        msg && $base.showProgress(msg);
        _pendingRequests[url] = false;

        $base.upload(url, data, function(ret) {
            _pendingRequests[url] = void 0;
            scall(ret);
        }, function(err) {
            _pendingRequests[url] = void 0;
            msg && $base.hideProgress();
            // if (typeof(err) == "object" && (err.Code == -12 || err.Code == -10)) {
            //     $base.openLogin();
            // }
            if (typeof(err) == "object") {
                $base.toast(err.msg ? err.msg : err.Msg);
                utils.isFunction(ecall) && ecall(err.msg ? err.msg : err.Msg);
            } else {
                $base.toast(err);
                utils.isFunction(ecall) && ecall(err);
            }
        });
    }
$base.getReload = function() {

    if (window._getError) {
        //遍历处理错误的请求
        for (var key in window._getError) {
            console.log("重新访问 key=" + key);
            var func = window._getError[key];
            if (typeof(func) == "function") {
                delete window._getError[key];
                func();
            }
        }
    }
}
$base.toast = function(msg, duration, location) {
        duration = duration != void 0 ? duration : 2000;
        location = location != void 0 ? location : 'center';
        api.toast({
            msg: msg,
            duration: duration,
            location: location
        });
    }
    //打开登录页
$base.openLogin = function(winName) {
        if (H.getStorage("loginIsOpen")) {
            return;
        } else {
            this.openWin("login/login", {
                winName: winName
            }, "", "./login.html");
        }
    }
    //获取题型列表
$base.getTypes = function() {
    return _getCache("types");
}
$base.setTypes = function(v) {
    return _setCache("types", v);
}
$base.addSearchKey = function(key, value) {
        var his = _getCache(key);
        his = his ? his : [];
        var findex = his.indexOf(value);
        if (findex == -1) {
            his.splice(0, 0, value);
            if (his.length > 10) {
                his.splice(his.length - 1, 1);
            }
        } else {
            his.splice(findex, 1);
            his.splice(0, 0, value);
        }
        _setCache(key, his);
    }
    //打开试卷
$base.openExam = function(id, closeSelf, eid) {
    $base.showProgress("加载中", "正在准备题目，请稍后...");
    var data = {
        baseUrl: utils.baseUrl()
    };
    if (eid) {
        data.eid = eid;
    } else {
        data.id = id;
    }
    $base.get("api/exam/getpaper", data, function(ret) {
        $base.hideProgress();
        $base.openWin("common/exam_frm", {
            close_last_win: closeSelf,
            pu: ret.pu,
            title: ret.pu.title,
            reexam_able: ret.reexam_able,
            show_answer: ret.show_answer,
            ans_salt: ret.ans_salt == null ? [] : ret.ans_salt,
            list: ret.list,
            id: id,
            remain_time: ret.remain_time,
            etype: 2
        }, "", "common/exam_head.html");
    }, function() {
        $base.hideProgress();
    })
}

//vue 全局方法
var _Plugin = {
    install: function(Vue, options) {
        // 1. 添加全局方法或属性 https://cn.vuejs.org/v2/guide/plugins.html
        Vue.prototype.utils = utils;
    }
}
try {
    Vue.use(_Plugin);
} catch (e) {}



//判断是不是ios
$base.panduan = function() {
  console.log(api.systemType);
  if(api.systemType == "ios"){
    document.getElementById('header').style.padding="1rem 0 0 0";
  }else{
    // document.getElementById('header').style.background="#4593de";
  }
}

//获取当前时间
function getnewDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
