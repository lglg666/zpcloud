
/*!
 * 框架名称：AHelper.js
 * 框架作者：新生帝(JsonLei)
 * 编写日期：2015年12月01日
 * 版权所有：中山赢友网络科技有限公司
 * 企业官网：http://www.winu.net
 * 开源协议：GPL v2 License
 * 框架描述：APICloud操作库，一切从简，只为了更懒！
 * 讨论群区：一起改变中国IT教育 18863883
 * 文档地址：http://www.kancloud.cn/winu/ahelper
 * 开源地址：http://git.oschina.net/winu.net/AHelper.js
 */

;
! function(win) {
    "use strict";

    // 全局模块
    var modules = {};

    // 公共类库
    var $$com = {
        // 去掉前后空格
        // @str：字符串
        trim: function(str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        // 判断是否为null，或者为空
        // @str：字符串
        isNullOrEmpty: function(str) {
            return (str == null || str == undefined || $$com.trim(str) == "") ? true : false;
        },
        // 判断是否为null，或者undefined
        // @str：字符串
        isNullOrUndefined: function(str) {
            return (str == null || str == undefined) ? true : false;
        },
        // 拓展对象
        // @baseObj：需要拓展的对象
        // @extObj：需要拓展的属性集合
        extend: function(baseObj, extObj) {
            var inheritObj = baseObj;
            for (var i in extObj) {
                inheritObj[i] = extObj[i];
            }
            return inheritObj;
        },
        // 获取文件拓展名
        // @fileName：文件名
        getFileExt: function(fileName) {
            return fileName.substring(fileName.lastIndexOf('.') + 1);
        },
        // 滚动到文档底部
        scrollToDocButton: function() {
            document.getElementsByTagName('body')[0].scrollTop = document.getElementsByTagName('body')[0].scrollHeight;
        },
        // 根据出生日期获取年龄
        // @birthday：出生日期
        getAgeForBirthDay: function(birthday) {
            var r = birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (r == null)
                return false;
            var d = new Date(r[1], r[3] - 1, r[4]);
            if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
                var Y = new Date().getFullYear();
                return (Y - r[1]);
            }
            return 0;
        },
        // 判断是否是数值
        // @str：字符串
        isNumber: function(str) {
            return !isNaN(str);
        },
        // 判断是否是正小数
        // @str：字符串
        isPlusDecimal: function(str) {
            return (/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/).test(str);
        },
        // 判断是否是日期格式
        // @str：字符串
        isDate: function(str) {
            return (/^(?:(?:1[6-9]|[2-9][0-9])[0-9]{2}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:(?:1[6-9]|[2-9][0-9])(?:0[48]|[2468][048]|[13579][26])|(?:16|[2468][048]|[3579][26])00)([-/.]?)0?2\2(?:29))(\s+([01][0-9]:|2[0-3]:)?[0-5][0-9]:[0-5][0-9])?$/).text(str);
        },
        // 获取当前时间并格式化
        // @dateSeparator：日期分隔符
        // @timeSeparator：时间分隔符
        // @isShowTime：是否显示时间
        // @datetime：自定义日期格式
        getNowDateFormat: function(dateSeparator, timeSeparator, isShowTime, datetime) {
            dateSeparator = $$com.isNullOrEmpty(dateSeparator) ? "-" : dateSeparator;
            timeSeparator = $$com.isNullOrEmpty(timeSeparator) ? ":" : timeSeparator;
            isShowTime = (typeof arguments[2] != 'boolean') ? true : arguments[2];

            var now = datetime ? datetime : new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var seconds = now.getSeconds();

            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (date >= 0 && date <= 9) {
                date = "0" + date;
            }
            var _date = year + dateSeparator + month + dateSeparator + date;
            var _time = hours + timeSeparator + minutes + timeSeparator + seconds;

            return isShowTime ? (_date + " " + _time) : _date;
        },
        // 将PHP时间戳转换为时间格式
        // @timestamp：PHP格式时间戳
        // @isShowTime：是否显示时间
        transPHPTimestamp: function(timestamp, isShowTime) {
            isShowTime = (typeof arguments[1] != 'boolean') ? true : arguments[1];
            var datetime = new Date(timestamp * 1000);
            $$com.getNowDateFormat('-', ':', isShowTime, datetime);
        },
        // 将Javascript时间戳转换为时间格式
        // @timestamp：时间戳
        // @isShowTime：是否显示时间
        transJsTimestamp: function(timestamp, isShowTime) {
            isShowTime = (typeof arguments[1] != 'boolean') ? true : arguments[1];
            var datetime = new Date(timestamp);
            $$com.getNowDateFormat('-', ':', isShowTime, datetime);
        },
        // 判断是否是方法
        // @func：方法句柄
        isFunction: function(func) {
            return (typeof func == "function");
        },
        // 判断是否是json对象
        // @obj：对象
        isObject: function(obj) {
            return (typeof obj == "object" && obj != null && obj != undefined);
        },
        // 判断是否是数组
        // @arr：数组对象
        isArray: function(arr) {
            return toString.apply(arr) === '[object Array]';
        },
        // 生成唯一字符串
        newGuid: function() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        // 去除数组从重复项
        // @arr：数组对象
        unique: function(arr) {
            if (!$$com.isArray(arr)) {
                return arr;
            }
            var result = [],
                hash = {};
            for (var i = 0, elem;
                (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }
    };
    // ######################################## 完美分割线 #############################################
    // APICloud 自带api.js
    (function(window) {
        var u = {};

        // 判断是否是安卓平台
        var isAndroid = (/android/gi).test(navigator.appVersion);

        // 设置本地存储
        var uzStorage = function() {
            var ls = window.localStorage;
            if (isAndroid) {
                ls = os.localStorage();
            }
            return ls;
        };
        // 初始化api.ajax参数
        // @url：url地址
        // @data：数据
        // @fuSuc：执行成功回调函数
        // @dataType：回调函数返回格式
        function parseArguments(url, data, fnSuc, dataType) {
            if (typeof(data) == 'function') {
                dataType = fnSuc;
                fnSuc = data;
                data = undefined;
            }
            if (typeof(fnSuc) != 'function') {
                dataType = fnSuc;
                fnSuc = undefined;
            }
            return {
                url: url,
                data: data,
                fnSuc: fnSuc,
                dataType: dataType
            };
        }

        // 去掉字符串首尾空格
        // @str：字符串
        u.trim = function(str) {
            if (String.prototype.trim) {
                return str == null ? "" : String.prototype.trim.call(str);
            } else {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            }
        };
        // 去掉字符串所有空格
        // @str：字符串
        u.trimAll = function(str) {
            return str.replace(/\s*/g, '');
        };
        // 判断对象是否是一个元素
        // @obj：对象
        u.isElement = function(obj) {
            return !!(obj && obj.nodeType == 1);
        };
        // 判断对象是否是数组
        // @obj：对象
        u.isArray = function(obj) {
            if (Array.isArray) {
                return Array.isArray(obj);
            } else {
                return obj instanceof Array;
            }
        };
        // 判断对象是否是空对象
        // @obj：对象
        u.isEmptyObject = function(obj) {
            if (JSON.stringify(obj) === '{}') {
                return true;
            }
            return false;
        };
        // 为DOM元素绑定事件
        // @el：DOM元素
        // @name：事件名称
        // @fn：事件处理函数
        // @useCapture：是否捕获事件
        u.addEvt = function(el, name, fn, useCapture) {
            if (!u.isElement(el)) {
                console.warn('$api.addEvt Function need el param, el param must be DOM Element');
                return;
            }
            useCapture = useCapture || false;
            if (el.addEventListener) {
                el.addEventListener(name, fn, useCapture);
            }
        };
        // 为DOM元素移除事件
        // @el：DOM元素
        // @name：事件名称
        // @fn：事件处理函数
        // @useCapture：是否捕获事件
        u.rmEvt = function(el, name, fn, useCapture) {
            if (!u.isElement(el)) {
                console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
                return;
            }
            useCapture = useCapture || false;
            if (el.removeEventListener) {
                el.removeEventListener(name, fn, useCapture);
            }
        };
        // 为DOM绑定事件，但该事件只执行一次
        // @el：DOM元素
        // @name：事件名称
        // @fn：事件处理函数
        // @useCapture：是否捕获事件
        u.one = function(el, name, fn, useCapture) {
            if (!u.isElement(el)) {
                console.warn('$api.one Function need el param, el param must be DOM Element');
                return;
            }
            useCapture = useCapture || false;
            var that = this;
            var cb = function() {
                fn && fn();
                that.rmEvt(el, name, cb, useCapture);
            };
            that.addEvt(el, name, cb, useCapture);
        };
        // 选择第一个匹配的DOM元素
        // @el：DOM元素
        // @selector：CSS选择器
        u.dom = function(el, selector) {
            if (arguments.length === 1 && typeof arguments[0] == 'string') {
                if (document.querySelector) {
                    return document.querySelector(arguments[0]);
                }
            } else if (arguments.length === 2) {
                if (el.querySelector) {
                    return el.querySelector(selector);
                }
            }
        };
        // 选择所有匹配的DOM元素
        // @el：DOM元素
        // @selector：CSS选择器
        u.domAll = function(el, selector) {
            if (arguments.length === 1 && typeof arguments[0] == 'string') {
                if (document.querySelectorAll) {
                    return document.querySelectorAll(arguments[0]);
                }
            } else if (arguments.length === 2) {
                if (el.querySelectorAll) {
                    return el.querySelectorAll(selector);
                }
            }
        };
        // 根据ID选择DOM元素
        // @id：ID
        u.byId = function(id) {
            return document.getElementById(id);
        };
        // 选择DOM元素的第一个子元素
        // @el：DOM元素
        // @selector：CSS选择器
        u.first = function(el, selector) {
            if (arguments.length === 1) {
                if (!u.isElement(el)) {
                    console.warn('$api.first Function need el param, el param must be DOM Element');
                    return;
                }
                return el.children[0];
            }
            if (arguments.length === 2) {
                return this.dom(el, selector + ':first-child');
            }
        };
        // 选择DOM元素最后一个子元素
        // @el：DOM元素
        // @selector：CSS选择器
        u.last = function(el, selector) {
            if (arguments.length === 1) {
                if (!u.isElement(el)) {
                    console.warn('$api.last Function need el param, el param must be DOM Element');
                    return;
                }
                var children = el.children;
                return children[children.length - 1];
            }
            if (arguments.length === 2) {
                return this.dom(el, selector + ':last-child');
            }
        };
        // 选择第几个元素
        // @el：DOM元素
        // @index：索引
        u.eq = function(el, index) {
            return this.dom(el, ':nth-child(' + index + ')');
        };
        // 排除选择器中指定元素的子元素
        // @el：DOM元素
        // @selector：CSS选择器
        u.not = function(el, selector) {
            return this.domAll(el, ':not(' + selector + ')');
        };
        // 获取相邻的上一个兄弟元素
        // @el：DOM元素
        u.prev = function(el) {
            if (!u.isElement(el)) {
                console.warn('$api.prev Function need el param, el param must be DOM Element');
                return;
            }
            var node = el.previousSibling;
            if (node.nodeType && node.nodeType === 3) {
                node = node.previousSibling;
                return node;
            }
        };
        // 获取相邻的下一个兄弟元素
        // @el：DOM元素
        u.next = function(el) {
            if (!u.isElement(el)) {
                console.warn('$api.next Function need el param, el param must be DOM Element');
                return;
            }
            var node = el.nextSibling;
            if (node.nodeType && node.nodeType === 3) {
                node = node.nextSibling;
                return node;
            }
        };
        // 根据选择器匹配最近的父元素
        // @el：DOM元素
        // @selector：CSS选择器
        u.closest = function(el, selector) {
            if (!u.isElement(el)) {
                console.warn('$api.closest Function need el param, el param must be DOM Element');
                return;
            }
            var doms, targetDom;
            var isSame = function(doms, el) {
                var i = 0,
                    len = doms.length;
                for (i; i < len; i++) {
                    if (doms[i].isEqualNode(el)) {
                        return doms[i];
                    }
                }
                return false;
            };
            var traversal = function(el, selector) {
                doms = u.domAll(el.parentNode, selector);
                targetDom = isSame(doms, el);
                while (!targetDom) {
                    el = el.parentNode;
                    if (el != null && el.nodeType == el.DOCUMENT_NODE) {
                        return false;
                    }
                    traversal(el, selector);
                }

                return targetDom;
            };

            return traversal(el, selector);
        };
        // 判断某一个元素是否包含目标元素
        // @parent：判断某一个元素是否包含目标元素
        // @el：DOM元素
        u.contains = function(parent, el) {
            var mark = false;
            if (el === parent) {
                mark = true;
                return mark;
            } else {
                do {
                    el = el.parentNode;
                    if (el === parent) {
                        mark = true;
                        return mark;
                    }
                } while (el === document.body || el === document.documentElement);

                return mark;
            }

        };
        // 移除DOM元素
        // @el：DOM元素
        u.remove = function(el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        };
        // 获取或设置DOM元素的属性
        // @el：DOM元素
        // @name：属性名
        // @value：属性值
        u.attr = function(el, name, value) {
            if (!u.isElement(el)) {
                console.warn('$api.attr Function need el param, el param must be DOM Element');
                return;
            }
            if (arguments.length == 2) {
                return el.getAttribute(name);
            } else if (arguments.length == 3) {
                el.setAttribute(name, value);
                return el;
            }
        };
        // 移除DOM元素的属性
        // @el：DOM元素
        // @name：属性名
        u.removeAttr = function(el, name) {
            if (!u.isElement(el)) {
                console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
                return;
            }
            if (arguments.length === 2) {
                el.removeAttribute(name);
            }
        };
        // DOM元素是否含有某个className
        // @el：DOM元素
        // @cls：class名
        u.hasCls = function(el, cls) {
            if (!u.isElement(el)) {
                console.warn('$api.hasCls Function need el param, el param must be DOM Element');
                return;
            }
            if (el.className.indexOf(cls) > -1) {
                return true;
            } else {
                return false;
            }
        };
        // 为DOM元素增加className
        // @el：DOM元素
        // @cls：class名
        u.addCls = function(el, cls) {
            if (!u.isElement(el)) {
                console.warn('$api.addCls Function need el param, el param must be DOM Element');
                return;
            }
            if ('classList' in el) {
                el.classList.add(cls);
            } else {
                var preCls = el.className;
                var newCls = preCls + ' ' + cls;
                el.className = newCls;
            }
            return el;
        };
        // 移除指定的className
        // @el：DOM元素
        // @cls：class名
        u.removeCls = function(el, cls) {
            if (!u.isElement(el)) {
                console.warn('$api.removeCls Function need el param, el param must be DOM Element');
                return;
            }
            if ('classList' in el) {
                el.classList.remove(cls);
            } else {
                var preCls = el.className;
                var newCls = preCls.replace(cls, '');
                el.className = newCls;
            }
            return el;
        };
        // 切换指定的className
        // @el：DOM元素
        // @cls：class名
        u.toggleCls = function(el, cls) {
            if (!u.isElement(el)) {
                console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
                return;
            }
            if ('classList' in el) {
                el.classList.toggle(cls);
            } else {
                if (u.hasCls(el, cls)) {
                    u.removeCls(el, cls);
                } else {
                    u.addCls(el, cls);
                }
            }
            return el;
        };
        // 获取或设置常用 Form 表单元素的 value 值
        // @el：DOM元素
        // @val：想设置的value值
        u.val = function(el, val) {
            if (!u.isElement(el)) {
                console.warn('$api.val Function need el param, el param must be DOM Element');
                return;
            }
            if (arguments.length === 1) {
                switch (el.tagName) {
                    case 'SELECT':
                        var value = el.options[el.selectedIndex].value;
                        return value;
                        break;
                    case 'INPUT':
                        return el.value;
                        break;
                    case 'TEXTAREA':
                        return el.value;
                        break;
                }
            }
            if (arguments.length === 2) {
                switch (el.tagName) {
                    case 'SELECT':
                        el.options[el.selectedIndex].value = val;
                        return el;
                        break;
                    case 'INPUT':
                        el.value = val;
                        return el;
                        break;
                    case 'TEXTAREA':
                        el.value = val;
                        return el;
                        break;
                }
            }

        };
        // 在DOM元素内部，首个子元素前插入HTML字符串
        // @el：DOM元素
        // @html：HTML字符串
        u.prepend = function(el, html) {
            if (!u.isElement(el)) {
                console.warn('$api.prepend Function need el param, el param must be DOM Element');
                return;
            }
            el.insertAdjacentHTML('afterbegin', html);
            return el;
        };
        // 在DOM元素内部，最后一个子元素后面插入HTML字符串
        // @el：DOM元素
        // @html：HTML字符串
        u.append = function(el, html) {
            if (!u.isElement(el)) {
                console.warn('$api.append Function need el param, el param must be DOM Element');
                return;
            }
            el.insertAdjacentHTML('beforeend', html);
            return el;
        };
        // 在DOM元素前面插入HTML字符串
        // @el：DOM元素
        // @html：HTML字符串
        u.before = function(el, html) {
            if (!u.isElement(el)) {
                console.warn('$api.before Function need el param, el param must be DOM Element');
                return;
            }
            el.insertAdjacentHTML('beforebegin', html);
            return el;
        };
        // 在DOM元素后面插入HTML字符串
        // @el：DOM元素
        // @html：HTML字符串
        u.after = function(el, html) {
            if (!u.isElement(el)) {
                console.warn('$api.after Function need el param, el param must be DOM Element');
                return;
            }
            el.insertAdjacentHTML('afterend', html);
            return el;
        };
        // 获取或设置DOM元素的innerHTML
        // @el：DOM元素
        // @html：HTML字符串
        u.html = function(el, html) {
            if (!u.isElement(el)) {
                console.warn('$api.html Function need el param, el param must be DOM Element');
                return;
            }
            if (arguments.length === 1) {
                return el.innerHTML;
            } else if (arguments.length === 2) {
                el.innerHTML = html;
                return el;
            }
        };
        // 设置或者获取元素的文本内容
        // @el：DOM元素
        // @txt：文本内容
        u.text = function(el, txt) {
            if (!u.isElement(el)) {
                console.warn('$api.text Function need el param, el param must be DOM Element');
                return;
            }
            if (arguments.length === 1) {
                return el.textContent;
            } else if (arguments.length === 2) {
                el.textContent = txt;
                return el;
            }
        };
        // 获取元素在页面中的位置与宽高，(此为距离页面左侧及顶端的位置，并非距离窗口的位置)
        // @el：DOM元素
        u.offset = function(el) {
            if (!u.isElement(el)) {
                console.warn('$api.offset Function need el param, el param must be DOM Element');
                return;
            }
            var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

            var rect = el.getBoundingClientRect();
            return {
                l: rect.left + sl,
                t: rect.top + st,
                w: el.offsetWidth,
                h: el.offsetHeight
            };
        };
        // 设置所传入的DOM元素的样式，可传入多条样式
        // @el：DOM元素
        // @css：想要设置的CSS样式
        u.css = function(el, css) {
            if (!u.isElement(el)) {
                console.warn('$api.css Function need el param, el param must be DOM Element');
                return;
            }
            if (typeof css == 'string' && css.indexOf(':') > 0) {
                el.style && (el.style.cssText += ';' + css);
            }
        };
        // 获取指定DOM元素的指定属性的完整的值，如800px
        // @el：DOM元素
        // @prop：css属性
        u.cssVal = function(el, prop) {
            if (!u.isElement(el)) {
                console.warn('$api.cssVal Function need el param, el param must be DOM Element');
                return;
            }
            if (arguments.length === 2) {
                var computedStyle = window.getComputedStyle(el, null);
                return computedStyle.getPropertyValue(prop);
            }
        };
        // json对象转字符串
        // @json：json对象
        u.jsonToStr = function(json) {
            if (typeof json === 'object') {
                return JSON && JSON.stringify(json);
            }
        };
        // 字符串转json对象
        // @str：字符串
        u.strToJson = function(str) {
            if (typeof str === 'string') {
                return JSON && JSON.parse(str);
            }
        };
        // 设置localStorage数据
        // @key：键
        // @value：值
        u.setStorage = function(key, value) {
            if (arguments.length === 2) {
                var v = value;
                if (typeof v == 'object') {
                    v = JSON.stringify(v);
                    v = 'obj-' + v;
                } else {
                    v = 'str-' + v;
                }
                var ls = uzStorage();
                if (ls) {
                    ls.setItem(key, v);
                }
            }
        };
        // 获取localStorage数据
        // @key：键
        u.getStorage = function(key) {
            var ls = uzStorage();
            if (ls) {
                var v = ls.getItem(key);
                if (!v) {
                    return;
                }
                if (v.indexOf('obj-') === 0) {
                    v = v.slice(4);
                    return JSON.parse(v);
                } else if (v.indexOf('str-') === 0) {
                    return v.slice(4);
                }
            }
        };
        // 移除localStorage数据
        // @key：键
        u.rmStorage = function(key) {
            var ls = uzStorage();
            if (ls && key) {
                ls.removeItem(key);
            }
        };
        // 清空所有localStorage数据
        // @key：键
        u.clearStorage = function() {
            var ls = uzStorage();
            if (ls) {
                ls.clear();
            }
        };
        // 适配iOS7+系统状态栏，为传入的DOM元素增加20px的上内边距
        // @el：DOM元素
        u.fixIos7Bar = function(el) {
            if (!u.isElement(el)) {
                console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
                return;
            }
            var strDM = api.systemType;
            if (strDM == 'ios') {
                var strSV = api.systemVersion;
                var numSV = parseInt(strSV, 10);
                var fullScreen = api.fullScreen;
                var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
                if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                    el.style.paddingTop = '20px';
                }
            }
        };
        // 适配iOS7+、Android4.4+系统状态栏，为传入的DOM元素增加适当的上内边距，避免header与状态栏重叠
        // @el：DOM元素
        u.fixStatusBar = function(el) {
            if (!u.isElement(el)) {
                console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
                return;
            }
            var sysType = api.systemType;
            if (sysType == 'ios') {
                u.fixIos7Bar(el);
            } else if (sysType == 'android') {
                var ver = api.systemVersion;
                ver = parseFloat(ver);
                if (ver >= 4.4) {
                    el.style.paddingTop = '25px';
                }
            }
        };
        // 延时提示框
        // @title：标题
        // @text：内容
        // @time：延迟时间
        u.toast = function(title, text, time) {
            var opts = {};
            var show = function(opts, time) {
                api.showProgress(opts);
                setTimeout(function() {
                    api.hideProgress();
                }, time);
            };
            if (arguments.length === 1) {
                var time = time || 500;
                if (typeof title === 'number') {
                    time = title;
                } else {
                    opts.title = title + '';
                }
                show(opts, time);
            } else if (arguments.length === 2) {
                var time = time || 500;
                var text = text;
                if (typeof text === "number") {
                    var tmp = text;
                    time = tmp;
                    text = null;
                }
                if (title) {
                    opts.title = title;
                }
                if (text) {
                    opts.text = text;
                }
                show(opts, time);
            }
            if (title) {
                opts.title = title;
            }
            if (text) {
                opts.text = text;
            }
            time = time || 500;
            show(opts, time);
        };
        // api.ajax()方法的post方式简写
        u.post = function( /*url,data,fnSuc,dataType*/ ) {
            var argsToJson = parseArguments.apply(null, arguments);
            var json = {};
            var fnSuc = argsToJson.fnSuc;
            argsToJson.url && (json.url = argsToJson.url);
            argsToJson.data && (json.data = argsToJson.data);
            if (argsToJson.dataType) {
                var type = argsToJson.dataType.toLowerCase();
                if (type == 'text' || type == 'json') {
                    json.dataType = type;
                }
            } else {
                json.dataType = 'json';
            }
            json.method = 'post';
            api.ajax(json, function(ret, err) {
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            });
        };
        // api.ajax()方法的get方式简写
        u.get = function( /*url,fnSuc,dataType*/ ) {
            var argsToJson = parseArguments.apply(null, arguments);
            var json = {};
            var fnSuc = argsToJson.fnSuc;
            argsToJson.url && (json.url = argsToJson.url);
            //argsToJson.data && (json.data = argsToJson.data);
            if (argsToJson.dataType) {
                var type = argsToJson.dataType.toLowerCase();
                if (type == 'text' || type == 'json') {
                    json.dataType = type;
                }
            } else {
                json.dataType = 'text';
            }
            json.method = 'get';
            api.ajax(json, function(ret, err) {
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            });
        };
        /*end*/
        window.$$api = u;
    })(win);

    // ######################################## 完美分割线 #############################################
    // APICloud 默认配置对象
    var defaultsOption = {
        alert: {
            title: '请输入正确的分数',
            msg: '',
            buttons: ['确定']
        },
        confirm: {
            title: '炬海考试',
            msg: '选择您要的操作类型',
            buttons: ['确定', '取消']
        },
        prompt: {
            title: '炬海考试',
            msg: '请输入内容后点击确定按钮',
            text: '',
            type: 'text',
            buttons: ['确定', '取消']
        },
        actionSheet: {
            title: '选择您要的操作类型',
            cancelTitle: '取 消',
            //destructiveTitle : '删 除',
            buttons: ['按钮一', '按钮二', '按钮三'],
            style: {
                layerColor: 'rgba(0,0,0,0.4)',
                itemNormalColor: '#F1F1F1',
                itemPressColor: '#E6E6E6',
                fontNormalColor: '#007AFF',
                fontPressColor: '#0060F0',
                titleFontColor: '#8F8F8F'
            }
        },
        showProgress: {
            style: 'default',
            animationType: 'zoom',
            title: '努力加载中...',
            text: '先喝杯茶...',
            modal: true
        },
        toast: {
            msg: '炬海考试',
            duration: 2000,
            location: 'bottom'
        },
        setRefreshHeaderInfo: {
            visible: true,
            loadingImg: 'widget://image/refresh.png',
            bgColor: '#f1f1f1',
            textColor: '#999',
            textDown: '下拉刷新...',
            textUp: '松开刷新...',
            textTime: '最后更新：' + $$com.getNowDateFormat(),
            textLoading: '加载中...',
            showTime: true
        },
        getPicture: {
            sourceType: 'album',
            encodingType: 'jpg',
            mediaValue: 'pic',
            destinationType: 'url',
            allowEdit: true,
            quality: 80,
            saveToPhotoAlbum: false
        },
        openWin: {
            name: $$com.newGuid(),
            url: '',
            pageParam: {},
            bounces: false,
            bgColor: 'rgba(0,0,0,0)',
            scrollToTop: true,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            scaleEnabled: false,
            slidBackEnabled: false,
            animation: {
                type: "movein",
                subType: "from_right",
                duration: 300
            },
            delay: 300,
            opaque: false,
            showProgress: true,
            reload: true,
            allowEdit: true,
            softInputMode: 'auto'
        },
        closeWin: {
            animation: {
                type: "movein",
                subType: "from_left",
                duration: 300
            }
        },
        closeToWin: {
            name: 'root',
            animation: {
                type: "movein",
                subType: "from_left",
                duration: 300
            }
        },
        openFrame: {
            name: $$com.newGuid(),
            url: '',
            pageParam: {},
            bounces: false,
            bgColor: 'rgba(244, 245, 249,0)',
            scrollToTop: true,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            scaleEnabled: false,
            showProgress: false,
            reload: false,
            allowEdit: true,
            softInputMode: 'auto',
            rect: {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                marginLeft: 0,
                marginTop: 0,
                marginBottom: 0,
                marginRight: 0
            }
        },
        ajax: {
            url: '',
            tag: $$com.newGuid(),
            method: 'get',
            cache: false,
            timeout: 30,
            dataType: 'json',
            charset: 'utf-8',
            headers: {},
            report: false,
            returnAll: false,
            data: {}
        },
        execScript: {
            name: 'root',
            frameName: $$com.newGuid(),
            script: 'function ______winu(){}();'
        },
        openFrameGroup: {
            name: $$com.newGuid(),
            url: '',
            background: 'rgba(244, 245, 249,1)',
            scrollEnabled: true,
            rect: {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                marginLeft: 0,
                marginTop: 0,
                marginBottom: 0,
                marginRight: 0
            },
            index: 0,
            preload: 1,
            frames: []
        },
        setFrameGroupIndex: {
            name: $$com.newGuid(),
            index: 0,
            scroll: true
        },
        openSlidLayout: {
            type: 'left',
            leftEdge: 80,
            slidPaneStyle: {
                leftEdge: 80,
                leftScale: 1.0
            },
            fixedPane: {}, // 左边菜单frame
            slidPane: {} // 主要内容frame
        },
        openApp: {
            appParam: {
                paras: ''
            },
            iosUrl: 'http://www.winu.net/',
            androidPkg: 'android.intent.action.VIEW',
            mimeType: 'text/html',
            uri: 'http://www.winu.net'
        },
        imageCache: {
            url: '',
            policy: 'default',
            thumbnail: true
        },
        download: {
            url: 'http://www.winu.net/a.jpg',
            savePath: '',
            report: true,
            cache: true,
            allowResume: true
        },
        notification: {
            vibrate: [500, 500],
            sound: 'default',
            light: false,
            notify: {
                updateCurrent: true,
                extra: ''
            }
        },
        call: {
            type: 'tel_prompt',
            number: '18676265646'
        },
        sms: {
            numbers: ['18676265646'],
            text: '大家好，我叫新生帝。'
        },
        mail: {
            recipients: ['winu@winu.net'], // 收件人
            subject: '我给您发送了一个邮件',
            body: '你好，我叫新生帝。',
            attachments: [], // 附件
        },
        openPicker: {
            type: 'date_time',
            title: '选择时间'
        }
    };

    // ######################################## 完美分割线 #############################################

    // APICloud类库
    var $$apicloud = {
        // 开辟新的内存空间，返回新的引用地址对象
        // @obj：对象
        returnNewMemoryObj: function(obj) {
            return $$api.strToJson(JSON.stringify(obj));
        },
        // 获取偏移量
        // @selectorId：元素ID属性
        offset: function(selectorId) {
            if ($$com.isNullOrEmpty(selectorId)) {
                return {
                    w: 0,
                    h: 0,
                    l: 0,
                    t: 0
                };
            }
            var element = $$api.byId(selectorId);
            if (element) {
                return $$api.offset(element)
            } else {
                return {
                    w: 0,
                    h: 0,
                    l: 0,
                    t: 0
                };
            }
        },
        // 判断是否是IOS系统
        isIOS: function() {
            return api.systemType == "ios";
        },
        // alert弹窗
        // @callback：回调函数
        // @options：配置对象，可以是字符串或者对象
        alert: function(callback, options) {
            var o = defaultsOption.alert;
            if (typeof options == 'string') {
                o.msg = options;
            } else {
                // 拓展对象
                o = options || {};
                o = $$com.extend(defaultsOption.alert, o);
            }

            if ($$com.isObject(o.msg)) {
                o.msg = JSON.stringify(o.msg);
            }
            api.alert(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速alert弹窗
        // @msg：需要弹窗显示的消息
        $alert: function(msg) {
            $$apicloud.alert(null, {
                msg: msg
            });
        },
        // 选择对话框
        // @callback：回调函数
        // @options：配置对象
        confirm: function(callback, options) {
            var o = defaultsOption.confirm;
            if (typeof options == 'string') {
                o.msg = options;
            } else {
                // 拓展对象
                o = options || {};
                o = $$com.extend(defaultsOption.confirm, o);
            }

            api.confirm(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret);
                }
            });
        },
        // 快速confirm对话框
        // @yesFunc：点击确定执行函数
        // @cancelFunc：点击取消执行函数
        // @msg：需要弹窗显示的消息
        $confirm: function(yesFunc, cancelFunc, msg) {
            msg = msg ? msg : defaultsOption.confirm.msg;

            $$apicloud.confirm(function(ret, err) {
                if (ret.buttonIndex == 1) {
                    if ($$com.isFunction(yesFunc)) {
                        yesFunc();
                    }
                } else if (ret.buttonIndex == 2) {
                    if ($$com.isFunction(cancelFunc)) {
                        cancelFunc();
                    }
                } else {}
            }, {
                msg: msg
            });
        },
        // 输入对话框
        // @callback：回调函数
        // @options：配置对象
        prompt: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.prompt, o);

            api.prompt(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速输入对话框
        // @yesFunc：点击确定执行函数
        // @cancelFunc：点击取消执行函数
        // @msg：需要弹窗显示的消息
        // @inputType：输入框类型，取值范围（text、password、number、email、url）
        $prompt: function(yesFunc, cancelFunc, msg, inputType) {
            msg = msg ? msg : defaultsOption.prompt.msg;
            inputType = inputType ? inputType : defaultsOption.prompt.type;

            $$apicloud.prompt(function(ret, err) {
                if (ret.buttonIndex == 1) {
                    if ($$com.isFunction(yesFunc)) {
                        yesFunc(ret.text);
                    }
                } else if (ret.buttonIndex == 2) {
                    if ($$com.isFunction(cancelFunc)) {
                        cancelFunc();
                    }
                } else {}
            }, {
                msg: msg,
                type: inputType
            });
        },
        // 底部弹出对话框
        // @callback：回调函数
        // @options：配置对象
        actionSheet: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.actionSheet, o);

            api.actionSheet(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 显示加载窗
        // @options：配置对象
        showProgress: function(options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.showProgress, o);

            api.showProgress(o);
        },
        // 快速显示加载窗
        $showProgress: function() {
            $$apicloud.showProgress();
        },
        // 隐藏加载框
        hideProgress: function() {
            api.hideProgress();
        },
        // 快速隐藏加载框
        $hideProgress: function() {
            $$apicloud.hideProgress();
        },
        // 提示框
        // @callback：回调函数
        // @options：配置对象
        toast: function(callback, options) {
            var o = defaultsOption.toast;
            if (typeof options == 'string') {
                o.msg = options;
            } else {
                // 拓展对象
                o = options || {};
                o = $$com.extend(defaultsOption.toast, o);
            }

            if ($$com.isObject(o.msg)) {
                o.msg = JSON.stringify(o.msg);
            }

            api.toast(o);

            setTimeout(function() {
                if ($$com.isFunction(callback)) {
                    callback();
                }
            }, o.duration);
        },
        // 快速显示提示框
        // @msg：提示消息
        $toast: function(msg) {
            $$apicloud.toast(null, {
                msg: msg
            });
        },
        // 下拉刷新
        // @callback：回调函数
        // @options：配置对象
        setRefreshHeaderInfo: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.setRefreshHeaderInfo, o);

            api.setRefreshHeaderInfo(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速下拉刷新
        // @callback：回调函数
        $dropdownToRefresh: function(callback) {
            $$apicloud.setRefreshHeaderInfo(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 设置为自动下拉
        refreshHeaderLoading: function() {
            api.refreshHeaderLoading();
        },
        // 快速自动下拉加载
        $setAutoDropdownToRefresh: function() {
            $$apicloud.refreshHeaderLoading();
        },
        // 恢复下拉状态
        refreshHeaderLoadDone: function() {
            api.refreshHeaderLoadDone();
        },
        // 快速恢复下拉为正常状态
        $recoverDropdownToNormal: function() {
            $$apicloud.refreshHeaderLoadDone();
        },
        // 打开相册
        // @callback：回调函数
        // @options：配置对象
        getPicture: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.getPicture, o);

            api.getPicture(o, function(ret, err) {
                if (ret) {
                    if ($$com.isFunction(callback)) {
                        callback(ret, err);
                    }
                } else {
                    $$apicloud.alert(null, {
                        msg: err
                    });
                }
            });
        },
        // 快速打开获取相册
        // @callback：回调函数
        // @options：配置对象
        // @isActionSheet：选择类型，布尔值
        $getPicture: function(callback, options, isActionSheet) {
            isActionSheet = (typeof arguments[2] != 'boolean') ? true : arguments[2];
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.getPicture, o);

            // 判断是否需要底部弹窗
            if (isActionSheet) {
                $$apicloud.actionSheet(function(ret, err) {
                    if (ret.buttonIndex == 3) {
                        return;
                    }
                    if (ret.buttonIndex == 1) {
                        o.sourceType = "camera";
                    }
                    $$apicloud.getPicture(callback, o);
                }, {
                    title: "选择图片来源",
                    buttons: ["优雅自拍", "相册收藏"]
                });
            } else {
                $$apicloud.confirm(function(ret, err) {
                    if (ret.buttonIndex == 3) {
                        return;
                    }
                    if (ret.buttonIndex == 1) {
                        o.sourceType = "camera";
                    }

                    $$apicloud.getPicture(callback, o);
                }, {
                    title: "选择图片来源",
                    msg: "您想要从哪里选取图片？",
                    buttons: ["优雅自拍", "相册收藏", "取消"]
                });
            }
        },
        // 打开Window窗口
        // @options：配置对象
        // @isInit：标识是否已经初始化
        openWin: function(options, isInit) {
            isInit = typeof isInit == 'boolean' ? isInit : false;
            if (!isInit) {
                // 拓展对象
                defaultsOption.openWin.pageParam = api.pageParam;
                defaultsOption.openWin.delay = 0;
                defaultsOption.openWin.slidBackEnabled = options.slidBackEnabled != false && $$apicloud.isIOS() ? true : false;
                //defaultsOption.openWin.delay = $$apicloud.isIOS() ? 0 : 300;
            }
            var o = options || {};
            o = $$com.extend(defaultsOption.openWin, o);

            api.openWin(o);
        },
        // 快速创建并打开Window（默认全屏）
        // @winName：window名称
        // @winUrl：window地址
        // @pageParam：参数
        $openWin: function(winName, winUrl, pageParam) {
            pageParam = pageParam ? pageParam : api.pageParam;
            $$apicloud.openWin({
                name: winName,
                url: winUrl,
                pageParam: pageParam
            });
        },
        // 关闭window窗口
        // @callback：回调函数
        // @options：配置对象
        closeWin: function(options) {
            if (options) {
                // 拓展对象
                var o = options || {};
                o = $$com.extend(defaultsOption.closeWin, o);
                api.closeWin(o);
            } else {
                api.closeWin();
            }
        },
        // 快速关闭当前window
        $closeCurrentWin: function() {
            api.closeWin();
        },
        // 关闭当前window，并打开指定窗口。
        // @options：配置对象，可以是字符串或者对象
        closeToWin: function(options) {
            var o = defaultsOption.closeToWin;
            if (typeof options == 'string') {
                o.name = options;
            } else {
                // 拓展对象
                o = options || {};
                o = $$com.extend(defaultsOption.closeToWin, o);
            }

            api.closeToWin(o);
        },
        // 快速关闭当前window，并打开指定窗口。
        // @winName：需要关闭并打开的窗口名称
        $closeCurrentToWin: function(winName) {
            winName = winName ? winName : 'root';

            // 只有当前窗口不等于传入窗口名称才关闭
            if (api.winName != winName) {
                $$apicloud.closeToWin(winName);
            }
        },
        // 设置window属性
        // @options：配置对象
        setWinAttr: function(options) {
            // 拓展对象
            var o = options || {};
            api.setWinAttr(o);
        },
        // 快速设置状态栏
        // @callback：回调函数，并返回头部值
        // @headerId：导航栏Id
        $fixStatusBar: function(callback, headerId) {
            var header = $$api.byId(headerId);
            if (header) {
                var systemType = api.systemType;
                var systemVersion = parseFloat(api.systemVersion);
                if ($$apicloud.isIOS()) {
                    //$$api.fixIos7Bar(header);
                } else if (systemType == 'android') {
                    if (systemVersion >= 4.4) {
                        //header.style.paddingTop = '25px';//修改为在样式中添加
                    } else {
                        //header.style.paddingTop = '0';//4.4以下不支持
                        //$$api.addCls(header,"no-padding");
                    }
                }

                if ($$com.isFunction(callback)) {
                    var offset = $$apicloud.offset(headerId);
                    callback(offset);
                }
            } else {
                console.wran('传入导航ID有误');
            }
        },
        // 打开Frame窗口
        // @options：配置对象
        // @isInit：标识是否已经完成初始化
        openFrame: function(options, isInit) {
            isInit = typeof isInit == 'boolean' ? isInit : false;
            if (!isInit) {
                // 拓展对象
                defaultsOption.openFrame.pageParam = api.pageParam;
                defaultsOption.openFrame.rect.w = api.winWidth;
                defaultsOption.openFrame.rect.h = api.winHeight;
            }
            var o = options || {};
            o = $$com.extend(defaultsOption.openFrame, o);
            o.rect = $$com.extend(o.rect, options.rect || {});

            api.openFrame(o);
        },
        // 快速创建并打开Frame对象(不带导航，默认和window一样大小)
        // @frameName：frame名称
        // @frameUrl：frame地址
        // @pageParam：参数
        // @rect：区域
        $openFrame: function(frameName, frameUrl, pageParam, rect, bounces) {
            bounces = typeof bounces == "boolean" ? bounces : false;
            pageParam = pageParam ? pageParam : api.pageParam;

            $$apicloud.openFrame({
                name: frameName,
                url: frameUrl,
                pageParam: pageParam,
                rect: rect,
                bounces: bounces
            });
        },
        // 快速创建并打开Frame对象(带导航)
        // @headerId：导航选择器ID
        // @options：配置对象
        // @footerId：底部选择器ID
        $openFrameWithNav: function(headerId, options, footerId) {
            $$apicloud.$fixStatusBar(function(offset) {
                var o = options || {};
                o = $$com.extend(defaultsOption.openFrame, o);

                var footerOffset = $$apicloud.offset(footerId);
                if (!options.rect) {
                    o.rect.x = offset.l;
                    o.rect.h = api.winHeight - offset.h - footerOffset.h;
                    o.rect.w = api.winWidth;
                }
                o.rect.y = offset.h;
                o.bounces = o.bounces != false && $$apicloud.isIOS() ? true : false;
                $$apicloud.openFrame(o, true);
                //安卓手机左滑后退
                if (api.systemType == "android") { //edit by zl
                    setTimeout(function() {
                        ///$$apicloud.$execScript(null,o.name,"_swiperBack()");
                    }, 2000)
                }
            }, headerId);
        },
        // 关闭Frame
        // @frameName：窗体名称
        closeFrame: function(frameName) {
            api.closeFrame({
                name: frameName ? frameName : api.frameName
            });
        },
        // 快速关闭当前Frame
        $closeCurrentFrame: function() {
            $$apicloud.closeFrame(api.frameName);
        },
        // 设置Frame属性
        // @options：配置对象
        setFrameAttr: function(options) {
            // 拓展对象
            var o = options || {};
            api.setFrameAttr(o);
        },
        // 设置窗体显示隐藏状态
        // @frameName：框架名称
        // @isHidden：是否隐藏
        setFrameStatus: function(frameName, isHidden) {
            isHidden = (typeof arguments[1] != 'boolean') ? false : arguments[1];
            $$apicloud.setFrameAttr({
                name: frameName,
                hidden: isHidden
            });
        },
        // 快速设置窗体显示隐藏状态
        // @frameName：框架名称
        // @isHidden：是否隐藏
        $setFrameStatus: function(frameName, isHidden) {
            $$apicloud.setFrameStatus(frameName, isHidden);
        },
        // 打开FrameGroup窗口组
        // @callback：回调函数
        // @options：配置对象
        // @isInit：标识是否已经初始化
        openFrameGroup: function(callback, options, isInit) {
            isInit = typeof isInit == 'boolean' ? isInit : false;
            if (!isInit) {
                // 拓展对象
                defaultsOption.openFrameGroup.rect.w = api.winWidth;
                defaultsOption.openFrameGroup.rect.h = api.winHeight;
            }

            var o = options || {};
            o = $$com.extend(defaultsOption.openFrameGroup, o);
            o.rect = $$com.extend(o.rect, options.rect || {});

            if (o && o.frames && o.frames.length > 0) {
                // 设置默认参数
                defaultsOption.openFrame.pageParam = api.pageParam;

                for (var i = 0; i < o.frames.length; i++) {
                    var frame = (o.frames)[i];
                    frame = $$com.extend(defaultsOption.openFrame, frame);
                    frame = $$apicloud.returnNewMemoryObj(frame);
                    // 移除rect属性
                    delete frame['rect'];
                    // 避免内存地址分配问题
                    o.frames[i] = frame;
                }

                api.openFrameGroup(o, function(ret, err) {
                    if ($$com.isFunction(callback)) {
                        callback(ret, err);
                    }
                });
            }
        },
        // 快速创建并打开frameGroup（不带导航）
        // @callback：回调函数
        // @groupName：窗口组名称
        // @frames：窗口组frame集合
        // @index：默认索引
        $openFrameGroup: function(callback, groupName, frames, index) {
            frames = frames ? frames : [];

            index = typeof index == "number" ? index : 0;
            if (index > frames.length - 1)
                index = frames.length - 1;

            $$apicloud.openFrameGroup(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, {
                name: groupName,
                frames: frames,
                index: index
            });
        },
        // 快速创建并打开FrameGroup对象(带导航)
        // @callback：回调函数
        // @headerId：导航选择器ID
        // @options：配置对象
        // @footerId：底部选择器ID
        $openFrameGroupWithNav: function(callback, headerId, options, footerId) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.openFrameGroup, o);

            $$apicloud.$fixStatusBar(function(offset) {
                var footerOffset = $$apicloud.offset(footerId);
                if (!options.rect) {
                    o.rect.x = offset.l;
                    o.rect.h = api.winHeight - offset.h - footerOffset.h;
                    o.rect.w = api.winWidth;
                }
                o.rect.y = offset.h;

                $$apicloud.openFrameGroup(function(ret, err) {
                    if ($$com.isFunction(callback)) {
                        callback(ret, err);
                    }
                }, o, true);
            }, headerId);
        },
        // 关闭窗口组
        // @frameGroupName：窗口组名称
        closeFrameGroup: function(frameGroupName) {
            api.closeFrameGroup({
                name: frameGroupName
            });
        },
        // 设置窗口组属性
        // @options：配置对象
        setFrameGroupAttr: function(options) {
            // 拓展对象
            var o = options || {};
            api.setFrameGroupAttr(o);
        },
        // 设置窗口组显示隐藏状态
        // @groupName：窗口组名
        // @isHidden：是否隐藏
        // @isHidden：是否隐藏
        setFrameGroupStatus: function(groupName, isHidden) {
            isHidden = (typeof arguments[1] != 'boolean') ? false : arguments[1];
            $$apicloud.setFrameGroupAttr({
                hidden: isHidden,
                name: groupName
            });
        },
        // 快速设置窗口组显示隐藏状态
        // @groupName：窗口组名
        // @isHidden：是否隐藏
        // @isHidden：是否隐藏
        $setFrameGroupStatus: function(groupName, isHidden) {
            $$apicloud.setFrameGroupStatus(groupName, isHidden);
        },
        // 设置窗口组的显示索引
        // @options：配置对象或者显示索引
        setFrameGroupIndex: function(options) {
            var o = defaultsOption.setFrameGroupIndex;
            if (typeof options == 'number') {
                o.index = options;
            } else {
                // 拓展对象
                o = options || {};
                o = $$com.extend(defaultsOption.setFrameGroupIndex, o);
            }

            api.setFrameGroupIndex(o);
        },
        // 快速设置窗口组的显示索引
        // @groupName：窗口组名称
        // @index：索引
        // @scroll：是否滑动切换
        $setFrameGroupIndex: function(groupName, index, scroll) {
            index = typeof index == "number" ? index : 0;
            scroll = typeof scroll == "boolean" ? scroll : true;

            $$apicloud.setFrameGroupIndex({
                name: groupName,
                index: index,
                scroll: scroll
            });
        },
        // 创建并打开侧滑菜单
        // @callback：回调函数
        // @options：配置对象
        openSlidLayout: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.openSlidLayout, o);

            // 设置默认参数
            defaultsOption.openFrame.pageParam = api.pageParam;
            // 移除默认frame的rect属性
            var _o = defaultsOption.openFrame;
            _o = $$com.extend(defaultsOption.openSlidLayout.fixedPane, o.fixedPane);
            _o = $$apicloud.returnNewMemoryObj(_o);
            var _o2 = defaultsOption.openFrame;
            _o2 = $$com.extend(defaultsOption.openSlidLayout.slidPane, o.slidPane);
            _o2 = $$apicloud.returnNewMemoryObj(_o2);
            // 移除区域
            delete _o['rect'];
            delete _o2['rect'];

            // 避免内存地址分配问题
            o.fixedPane = _o;
            o.slidPane = _o2;

            api.openSlidLayout(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });

        },
        // 快速创建并打开侧滑菜单
        // @callback：回调函数
        // @fixedPane：左边菜单frame
        // @slidPane：主要内容frame
        $openSlidLayout: function(callback, fixedPane, slidPane) {
            fixedPane = fixedPane ? fixedPane : {};
            slidPane = slidPane ? slidPane : {};

            $$apicloud.openSlidLayout(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, {
                fixedPane: fixedPane,
                slidPane: slidPane
            });
        },
        // 调整frame到前面
        // 打开侧滑
        // @type：侧滑类型
        openSlidPane: function(type) {
            type = type ? type : 'left';
            api.openSlidPane({
                type: type
            });
        },
        // 收起侧滑
        closeSlidPane: function() {
            api.closeSlidPane();
        },
        // 锁住侧滑
        lockSlidPane: function() {
            api.lockSlidPane();
        },
        // 释放侧滑
        unlockSlidPane: function() {
            api.unlockSlidPane();
        },
        // @from：当前的frame名称
        // @to：目标frame名称
        bringFrameToFront: function(from, to) {
            api.bringFrameToFront({
                from: from,
                to: to
            });
        },
        // 快速调整当前frame到最前面
        $bringFrameToFront: function() {
            $$apicloud.bringFrameToFront(api.frameName);
        },
        // 快速获取窗体传过来的参数
        $getPageParam: function() {
            return api.pageParam;
        },
        // ajax异步请求
        // @callback：回调函数
        // @options：配置对象
        ajax: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.ajax, o);

            api.ajax(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 取消异步请求
        // @tag：请求标识
        cancelAjax: function(tag) {
            api.cancelAjax({
                tag: tag
            });
        },
        // 快速取消异步请求
        // @tag：请求标识
        $cancelAjax: function(tag) {
            $$apicloud.cancelAjax(tag);
        },
        // 快速ajax异步请求
        // @callback：回调函数
        // @url：请求地址
        // @method：请求方法
        // @dataType：返回类型
        // @data：传输数据
        // @headers：请求头
        $ajax: function(callback, url, method, dataType, data, headers) {
            method = method ? method : 'get';
            dataType = dataType ? dataType : 'json';
            data = data ? data : {};
            headers = headers ? headers : {};

            $$apicloud.ajax(callback, {
                url: url,
                method: method,
                dataType: dataType,
                data: data,
                headers: headers
            });
        },
        // 设置偏好设置
        // @callback：回调函数
        // @key：键
        // @value：值
        setPrefs: function(callback, key, value) {
            api.setPrefs({
                key: key,
                value: value
            }, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速设置偏好设置
        // @callback：回调函数
        // @key：键
        // @value：值
        $setPrefs: function(callback, key, value) {
            $$apicloud.setPrefs(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, key, value);
        },
        // 获取偏好设置
        // @callback：回调函数
        // @key：键
        getPrefs: function(callback, key) {
            api.getPrefs({
                key: key
            }, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速获取偏好设置
        // @callback：回调函数
        // @key：键
        $getPrefs: function(callback, key) {
            $$apicloud.getPrefs(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, key);
        },
        // 移除偏好设置
        // @callback：回调函数
        // @key：键
        removePrefs: function(callback, key) {
            api.removePrefs({
                key: key
            }, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速移除偏好设置
        // @callback：回调函数
        // @key：键
        $removePrefs: function(callback, key) {
            $$apicloud.removePrefs(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, key);
        },
        // 清除缓存
        // @callback：回调函数
        clearCache: function(callback) {
            api.clearCache(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速清除缓存
        // @callback：回调函数
        $clearCache: function(callback) {
            $$apicloud.clearCache(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 设置存储数据
        // @key：键
        // @value：值
        setStorage: function(key, value) {
            $$api.setStorage(key, value);
        },
        // 快速设置存储数据
        // @key：键
        // @value：值
        $setStorage: function(key, value) {
            $$apicloud.setStorage(key, value);
        },
        // 获取存储数据
        // @key：键
        getStorage: function(key) {
            return $$api.getStorage(key);
        },
        // 快速获取存储数据
        // @key：键
        $getStorage: function(key) {
            $$apicloud.getStorage(key);
        },
        // 移除存储数据
        // @key：键
        removeStorage: function(key) {
            return $$api.rmStorage(key);
        },
        // 快速移除存储数据
        // @key：键
        $removeStorage: function(key) {
            $$apicloud.removeStorage(key);
        },
        // 清除所有存储数据
        clearStorage: function() {
            $$api.clearStorage();
        },
        // 快速清除所有存储数据
        $clearStorage: function() {
            $$apicloud.clearStorage();
        },
        // 广播事件
        // @eventName：事件名称
        // @eventData：广播数据
        sendEvent: function(eventName, eventData) {
            api.sendEvent({
                name: eventName,
                extra: eventData
            });
        },
        // 快速广播事件
        // @eventName：事件名称
        // @eventData：广播数据
        $sendEvent: function(eventName, eventData) {
            eventData = eventData ? eventData : '';

            $$apicloud.sendEvent(eventName, eventData);
        },
        // 监听事件
        // @callback：回调函数
        // @eventName：事件名称
        // @eventData：监听数据
        addEventListener: function(callback, eventName, eventData) {
            eventData = eventData ? eventData : {};
            api.addEventListener({
                name: eventName,
                extra: eventData
            }, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速监听事件
        // @callback：回调函数
        // @eventName：事件名称
        // @eventData：监听数据
        $addEventListener: function(callback, eventName, eventData) {
            eventData = eventData ? eventData : {};

            $$apicloud.addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, eventName, eventData);
        },
        // 移除监听事件
        // @eventName：事件名称
        removeEventListener: function(eventName) {
            api.removeEventListener({
                name: eventName
            });
        },
        // 快速移除监听事件
        // @eventName：事件名称
        $removeEventListener: function(eventName) {
            $$apicloud.removeEventListener(eventName);
        },
        // 快速操作，双击退出APP
        // @todo：退出之前执行函数
        $dblclickToCloseApp: function(todo) {
            var mkeyTime = "";
            $$apicloud.addEventListener(function(ret, err) {
                if (!mkeyTime || (new Date().getTime() - mkeyTime) > 2000) {
                    mkeyTime = new Date().getTime();
                    $$apicloud.toast(function() {}, {
                        msg: '再按一次退出' + api.appName,
                        duration: 2000
                    });
                } else {
                    if ($$com.isFunction(todo)) {
                        todo();
                    }

                    setTimeout(function() {
                        api.closeWidget({
                            silent: true
                        });
                    }, 1000);
                }
            }, 'keyback');
        },
        // 上拉加载
        // @callback：回调函数
        // @eventData：监听数据
        scrollToBottom: function(callback, eventDate) {
            api.addEventListener({
                name: 'scrolltobottom',
                extra: {
                    threshold: 100 //设置距离底部多少距离时触发，默认值为0，数字类型
                }
            }, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback();
                }
            });
            //			$$apicloud.addEventListener(function(ret, err) {
            //				if ($$com.isFunction(callback)) {
            //					callback();
            //				}
            //			}, 'scrolltobottom', eventDate);
        },
        // 快速上拉加载
        // @callback：回调函数
        $dropupToAppend: function(callback) {
            $$apicloud.scrollToBottom(function() {
                if ($$com.isFunction(callback)) {
                    callback();
                }
            }, {
                threshold: 30
            })
        },
        // 执行跨窗体、window脚本
        // @options：配置对象
        execScript: function(options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.execScript, o);

            api.execScript(o);
        },
        // 快速执行跨窗体、window脚本
        // @options：配置对象
        $execScript: function(winName, frameName, scripts) {
            winName = winName ? winName : api.winName;
            if (frameName) {
                api.execScript({
                    name: winName,
                    frameName: frameName,
                    script: scripts
                });
            } else {
                api.execScript({
                    name: winName,
                    script: scripts
                });
            }
        },
        // 打开时间选择器
        // @callback：回调函数
        // @options：配置对象
        openPicker: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.openPicker, o);

            api.openPicker(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速打开时间选择器
        // @callback：回调函数
        // @type：选择器类型，支持时间，日期，时间和日期
        // @dateDefaultValue：默认选中值
        // @pickerTitle：选择器标题
        $openPicker: function(callback, type, dateDefaultValue, pickerTitle) {
            $$apicloud.openPicker(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, {
                type: type,
                date: dateDefaultValue,
                title: pickerTitle
            });
        },
        // 打开手机上其他的APP，默认打开浏览器
        // @callback：回调函数
        // @options：配置对象
        openApp: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.openApp, o);

            api.openApp(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 缓存图片
        // @callback：回调函数
        // @options：配置对象或图片地址
        imageCache: function(callback, options) {
            var o = defaultsOption.imageCache;
            if (typeof options == 'string') {
                o.url = options;
            } else {
                // 拓展对象
                o = options || {};
                o = $$com.extend(defaultsOption.imageCache, o);
            }

            api.imageCache(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速缓存图片
        // @callback：回调函数
        // @imgUrl：图片地址
        $imageCache: function(callback, imgUrl) {
            $$apicloud.imageCache(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, imgUrl);
        },
        // 读取本地文本文件
        // @callback：回调函数
        // @path：文件本地地址
        readFile: function(callback, path) {
            api.readFile({
                path: path
            }, function(ret, err) {
                if (ret.status) {
                    if ($$com.isFunction(callback)) {
                        callback(ret, err);
                    }
                } else {
                    $$apicloud.alert(null, {
                        msg: err
                    });
                }
            });
        },
        // 快速读取本地文本文件
        // @callback：回调函数
        // @path：文件本地地址
        $readFile: function(callback, path) {
            $$apicloud.readFile(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, path);
        },
        // 写入本地文本文件
        // @callback：回调函数
        // @path：文件本地地址
        // @data：写入数据
        // @isAppend是否追加
        writeFile: function(callback, path, data, isAppend) {
            data = data ? data : '';
            isAppend = (typeof arguments[3] != 'boolean') ? false : arguments[3];

            api.writeFile({
                path: path,
                data: data,
                append: isAppend
            }, function(ret, err) {
                if (ret.status) {
                    if ($$com.isFunction(callback)) {
                        callback(ret, err);
                    }
                } else {
                    $$apicloud.alert(null, {
                        msg: err
                    });
                }
            });
        },
        // 快速写入本地文本文件
        // @callback：回调函数
        // @path：文件本地地址
        // @data：写入数据
        // @isAppend是否追加
        $writeFile: function(callback, path, data, isAppend) {
            data = data ? data : '';
            isAppend = (typeof arguments[3] != 'boolean') ? false : arguments[3];

            $$apicloud.writeFile(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, path, data, isAppend);
        },
        // 获取加密数组
        // @callback：回调函数
        // @key：key.xml中的key
        loadSecureValue: function(callback, key) {
            api.loadSecureValue({
                key: key
            }, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 下载文件
        // @callback：回调函数
        // @options：配置文件或者下载地址
        download: function(callback, options) {
            // 拓展对象
            defaultsOption.download.savePath = api.cacheDir + "/" + $$com.getNowDateFormat(null, null, false) + "/" + $$com.newGuid() + "." + $$com.getFileExt(typeof(options) == "string" ? options : options.url);
            var o = defaultsOption.download;
            if (typeof options == 'string') {
                o.url = options;
            } else {
                // 拓展对象
                o = options || {};
                o = $$com.extend(defaultsOption.download, o);
            }
            api.download(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 取消下载
        // @url：下载地址
        cancelDownload: function(url) {
            api.cancelDownload({
                url: url
            });
        },
        // 快速取消下载
        // @url：下载地址
        $cancelDownload: function(url) {
            url = url ? url : defaultsOption.download.url;

            $$apicloud.cancelDownload(url);
        },
        // 快速下载
        // @callback回调函数
        // @url：下载地址
        // @savePath：保存地址
        $download: function(callback, url, savePath) {
            url = url ? url : defaultsOption.download.url;
            savePath = savePath ? savePath : defaultsOption.download.savePath;

            $$apicloud.download(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, {
                url: url,
                savePath: savePath
            });
        },
        // 向用户发出震动、声音提示、灯光闪烁、状态栏消息等通知，以及闹钟功能
        // @callback：回调函数
        // @options：配置数组
        notification: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.notification, o);

            api.notification(o, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 取消本应用弹出到状态栏的某个或所有通知
        // @id：弹出到状态栏通知的id
        cancelNotification: function(id) {
            id = typeof id == "number" ? id : -1;
            api.cancelNotification({
                id: id
            });
        },
        // 拨打电话
        // @options：配置数组或者电话号码
        call: function(options) {
            var o = defaultsOption.call;
            if (typeof options == 'string') {
                o.number = options;
            } else {
                // 拓展对象
                o = options || {};
                o = $$com.extend(defaultsOption.call, o);
            }

            api.call(o);
        },
        // 发送信息
        // @callback：回调函数
        // options：配置数组
        sms: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.sms, o);

            // 判断options.numbers是否是字符串
            if (typeof o.numbers == "string") {
                var numbers = [];
                numbers.push(o.numbers);

                o.numbers = numbers;
            }

            api.sms(o, function(ret, err) {
                if (ret.status) {
                    if ($$com.isFunction(callback)) {
                        callback(ret, err);
                    }
                } else {
                    $$apicloud.alert(null, {
                        msg: err
                    });
                }
            });
        },
        // 发送邮件
        // @callback：回调函数
        // options：配置数组
        mail: function(callback, options) {
            // 拓展对象
            var o = options || {};
            o = $$com.extend(defaultsOption.mail, o);

            // 判断options.numbers是否是字符串
            if (typeof o.recipients == "string") {
                var recipients = [];
                recipients.push(o.recipients);

                o.recipients = recipients;
            }

            api.mail(o, function(ret, err) {
                if (ret.status) {
                    if ($$com.isFunction(callback)) {
                        callback(ret, err);
                    }
                } else {
                    $$apicloud.alert(null, {
                        msg: '发送失败'
                    });
                }
            });
        },
        // 打开通讯录
        // @callback：回调函数
        openContacts: function(callback) {
            api.openContacts(function(ret, err) {
                if (ret.status) {
                    if ($$com.isFunction(callback)) {
                        callback(ret, err);
                    }
                } else {
                    $$apicloud.alert(null, {
                        msg: err
                    });
                }
            });
        },
        // 设置全屏
        // @isFullScreen：是否全屏
        setFullScreen: function(isFullScreen) {
            isFullScreen = (typeof arguments[0] != 'boolean') ? false : arguments[0];

            api.setFullScreen({
                fullScreen: isFullScreen
            });
        },
        // 设置屏幕旋转方向
        // @orientation:方向
        setScreenOrientation: function(orientation) {
            api.setScreenOrientation({
                orientation: orientation
            });
        },
        // 设置是否禁止屏幕休眠
        // @isKeepScreenOn：是否禁止休眠
        setKeepScreenOn: function(isKeepScreenOn) {
            isKeepScreenOn = (typeof arguments[0] != 'boolean') ? false : arguments[0];

            api.setKeepScreenOn({
                keepOn: isKeepScreenOn
            });
        },
        // 回到桌面
        toLauncher: function() {
            if (!$$apicloud.isIOS()) {
                api.toLauncher();
            }
        },
        // 设置应用图标右上角数字
        // @number：角标数字
        setAppIconBadge: function(number) {
            number = typeof number == "number" ? number : 0;

            api.setAppIconBadge({
                badge: number
            });
        },
        // 快速让手机震动
        // @isShowMusic：是否响应声音
        $shock: function(isShowMusic) {
            isShowMusic == typeof isShowMusic == "boolean" ? isShowMusic : false;
            $$apicloud.notification(null, {
                vibrate: [300, 500],
                sound: isShowMusic ? 'default' : '',
                light: false
            });
        },
        // 保存保存图片和视频到系统相册
        // @callback：回调函数
        // @path：本地文件路径，支持fs://、widget://等文件路径协议，必须带有扩展名
        saveMediaToAlbum: function(callback, path) {
            api.saveMediaToAlbum({
                path: path
            }, function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速保存保存图片和视频到系统相册
        // @path：本地文件路径，支持fs://、widget://等文件路径协议，必须带有扩展名
        $saveMediaToAlbum: function(path) {
            $$apicloud.saveMediaToAlbum(function(ret, err) {
                if (ret.status) {
                    $$apicloud.toast("保存成功！");
                } else {
                    $$apicloud.toast("保存出错！");
                }
            }, path);
        },
        // 录音
        // @path：录音文件保存目录
        startRecord: function(path) {
            // 录用默认保存目录
            var savePath = api.cacheDir + "/" + $$com.getNowDateFormat(null, null, false) + "/";
            // 录音默认保存文件名
            var saveName = $$com.newGuid() + ".amr";

            path = path ? path : savePath + saveName;
            api.startRecord({
                path: path
            });
        },
        // 快速录音
        $startRecord: function() {
            $$apicloud.startRecord();
        },
        // 停止录音
        // @callback：回调函数
        stopRecord: function(callback) {
            api.stopRecord(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 快速停止录音
        // @callback：回调函数
        $stopRecord: function(callback) {
            $$apicloud.stopRecord(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            });
        },
        // 播放音频
        // @callback：回调函数
        // @path：录音地址
        startPlay: function(callback, path) {
            api.startPlay({
                path: path
            }, function() {
                if ($$com.isFunction(callback)) {
                    callback();
                }
            });
        },
        // 快速播放音频
        // @callback：回调函数
        // @path：录音地址
        $startPlay: function(callback, path) {
            $$apicloud.startPlay(function() {
                if ($$com.isFunction(callback)) {
                    callback();
                }
            }, path);
        },
        // 停止播放
        stopPlay: function() {
            api.stopPlay();
        },
        // 快速停止播放
        $stopPlay: function() {
            $$apicloud.stopPlay();
        },
        // 打开系统视频播放器，支持本地，网络视频
        // @url：视频地址
        openVideo: function(url) {
            api.openVideo({
                url: url
            });
        },
        // 快速打开系统视频播放器，支持本地，网络视频
        // @url：视频地址
        $openVideo: function(url) {
            $$apicloud.openVideo(url);
        },
        // apiready加载完毕事件
        // @callback：加载完毕执行函数
        ready: function(callback) { // edit　by zl
            if ($$com.isFunction(callback)) {
                win.apiready = function() { //$$api.domAll('body', '.aui-bar').addCls(el, cls);;(header,"no-padding");
                    // console.log(api.systemType);
										H.$
                    var domHeader = $$api.byId('header');
                    if ($$apicloud.systemType == 'android') {
                        if (parseFloat($$api.systemVersion) >= 4.4) {
                            $$api.addCls(domHeader, "aui-padded-t-2rem");
                        } else {
                            $$api.addCls(domHeader, "aui-padded-0");
                        }
                    } else {
                        $$api.addCls(domHeader, "aui-padded-t-1rem");
                    }
                    callback();

                }
            }
        },
        // 引入apicloud第三方模块
        // @moduleName：模块名称
        require: function(moduleName) {
            return api.require(moduleName);
        },
        $require: function(mds) {
            // 判断modules是否是字符串
            if (typeof mds == "string") {
                // 判断是否包含 ","
                if (mds.indexOf(',') > -1) {
                    var mos = mds.split(',');
                    if (mos.length > 0) {
                        for (var i = 0; i < mos.length; i++) {
                            if (mos[i]) {
                                modules[mos[i]] = $$apicloud.require(mos[i]);
                            }
                        }
                    }
                } else {
                    modules[mds] = $$apicloud.require(mds);
                }
            } else if ($$com.isArray(mds)) {
                if (mds.length > 0) {
                    for (var i = 0; i < mds.length; i++) {
                        if (mds[i]) {
                            modules[mds[i]] = $$apicloud.require(mds[i]);
                        }
                    }
                }
            } else {
                modules[mds] = $$apicloud.require(mds);
            }
        },
        // ##########################################事件###############################################
        // 快速监听本应用被其他应用调起来时触发事件
        // @callback：回调函数
        $appintent: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'appintent');
        },
        // 快速监听设备电池电量低事件
        // @callback：回调函数
        $batterylow: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'batterylow');
        },
        // 快速监听设备电池状态改变事件，如电量变化或正在充电
        // @callback：回调函数
        $batterystatus: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'batterystatus');
        },
        // 快速监听设备back键被点击事件，仅Android平台有效
        // @callback：回调函数
        $keyback: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'keyback');
        },
        // 快速监听设备menu键被点击事件，仅Android平台有效
        // @callback：回调函数
        $keymenu: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'keymenu');
        },
        // 快速监听设备断开网络的事件
        // @callback：回调函数
        $offline: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'offline');
        },
        // 快速监听设备连接到网络的事件
        // @callback：回调函数
        $online: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'online');
        },
        // 快速监听应用进入后台事件
        // @callback：回调函数
        $pause: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'pause');
        },
        // 快速监听应用从后台回到前台事件
        // @callback：回调函数
        $resume: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'resume');
        },
        // 快速监听Window或者Frame页面滑动到底部事件
        // @callback：回调函数
        // @threshold：设置距离底部多少距离时触发，默认值为0，数字类型
        $scrolltobottom: function(callback, threshold) {
            threshold = typeof threshold == "number" ? Math.abs(threshold) : 0;

            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'scrolltobottom', {
                threshold: threshold
            });
        },
        // 快速监听设备摇动事件，设置该监听后，当前APP将立即开启摇动检测功能。
        // @callback：回调函数
        $shake: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'shake');
        },
        // 快速监听Window或者Frame的页面全局向下轻扫事件
        // @callback：回调函数
        $swipedown: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'swipedown');
        },
        // 快速监听Window或者Frame的页面全局向左轻扫事件
        // @callback：回调函数
        $swipeleft: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'swipeleft');
        },
        // 快速监听Window或者Frame的页面全局向右轻扫事件
        // @callback：回调函数
        $swiperight: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'swiperight');
        },
        // 快速监听Window或者Frame的页面全局向上轻扫事件
        // @callback：回调函数
        $swipeup: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'swipeup');
        },
        // 快速监听Window或者Frame的页面全局单击事件，监听该事件后，点击window或者frame的任意位置，都将收到tap回调。
        // @callback：回调函数
        $tap: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'tap');
        },
        // 快速监听Window显示到屏幕的事件，收到viewappear事件回调，即标识当前Window已经动画结束，并且完全显示到屏幕上。该事件的作用对象为Window，Frame的显示不会收到事件。
        // @callback：回调函数
        $viewappear: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'viewappear');
        },
        // 快速监听Window离开屏幕的事件，字符串类型。收到viewdisappear事件回调，即标识当前Window已经动画结束，并且完全从屏幕上移除。该事件的作用对象为Window，Frame的显示不会收到事件。
        // @callback：回调函数
        $viewdisappear: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'viewdisappear');
        },
        // 快速监听状态栏通知被用户点击后的回调
        // @callback：回调函数
        $noticeclicked: function(callback) {
            H.$addEventListener(function(ret, err) {
                if ($$com.isFunction(callback)) {
                    callback(ret, err);
                }
            }, 'noticeclicked');
        },
        // 快速监听云修复使用静默修复时，更新完毕事件。可通过监听此事件来通知用户做是否强制重启应用等操作或者提示，以使更新生效
        // @callback：回调函数
        $smartupdatefinish: function(callback) {
                H.$addEventListener(function(ret, err) {
                    if ($$com.isFunction(callback)) {
                        callback(ret, err);
                    }
                }, 'smartupdatefinish');
            }
            // ##########################################事件###############################################
    };
    // ######################################## 完美分割线 #############################################
    // 全局占位符标识
    $$apicloud.$tppl_flag = ['[:', ':]'];
    // 模板引擎核心方法
    var $$tppl = function(tpl, data) {
        var fn = function(d) {
            var i, k = [],
                v = [];
            for (i in d) {
                k.push(i);
                v.push(d[i]);
            };
            return (new Function(k, fn.$)).apply(d, v);
        };
        if (!fn.$) {
            var tpls = tpl.replace(/[\r\n]/g, "").split($$apicloud.$tppl_flag[0]);
            // log(tpls);
            fn.$ = "var $=''";
            for (var t in tpls) {
                var p = tpls[t].split($$apicloud.$tppl_flag[1]);
                if (t != 0) {
                    fn.$ += '=' == p[0].charAt(0) ? "+(" + p[0].substr(1) + ")" : ";" + p[0] + "$=$"
                }
                fn.$ += "+'" + p[p.length - 1].replace(/\'/g, "\\'") + "'"
            }
            fn.$ += ";return $;";
            // log(fn.$);
        }
        return data ? fn(data) : fn;
    };

    // 核心函数
    win.H = $$apicloud, win.H.$apicloud = $$apicloud;
    win.H.$com = $$com;
    win.H.$api = $$api;
    win.H.$tppl = $$tppl;
    win.H.$v = '1.1.2';
    win.H.$module = modules;

}(window);
