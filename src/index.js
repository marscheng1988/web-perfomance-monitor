import AK from './hookajax'

function webMonitor(options = {}) {
    /* -----------------------初始化工具配置--------------------------------------*/
    let opt = {
        //项目名称（必填）
        appId: null,
        // 上报地址（必填）
        url: 'http://localhost:3001',
        // 是否上报页面性能数据
        isPage: true,
        // 是否上报ajax性能数据
        isAjax: true,
        // 是否上报页面资源数据
        isResource: true,
        // 监控警告线，超过即上报
        limitDutration: 3000,
        // 网络状况
        network: null,
        //延迟请求resource时间（等待请求完成）
        resourceDelay:6000
    }
    opt = Object.assign(opt, options);

    /* -----------------------全局配置-------------------------------------- */
    // resourceTime资源时间
    let resourceTime = 0;
    // onreadystatechange请求的XML信息
    let urlXMLArr = [];
    // onload的xml请求信息
    let urlOnload = [];
    // 页面ajax数量
    let ajaxLength = 0
    // 页面是否有ajax请求
    let haveAjax = false;

    let timer10, timer11, timer12;
    let ajaxMsg = [];
    let userAgent = navigator.userAgent;
    let networkType = "WIFI" //1-WIFI,2-2G,3-3G,4-4G,0-OFFLINE
    // 拦截ajax
    AK.hookAjax({
        onreadystatechange: function (xhr) {
            if (xhr.readyState === 4) {
                urlXMLArr.push(0); // 标记接收的请求数
                if (urlXMLArr.length === ajaxLength && opt.isAjax) {
                    if (!urlOnload.length) {
                        clearTimeout(timer10)
                        timer10 = setTimeout(() => {
                            console.log('ajaxhook  onreadystatechange ')
                            ajaxLength = 0
                            ReportData();
                        }, 200)
                    }
                }
            }
        },
        onerror: function () {
        },
        //jQurey的ajax会用到onload
        onload: function (xhr) {
            urlOnload.push(0);
            console.log(urlOnload.length + '---' + ajaxLength)
            if (urlOnload.length === ajaxLength && opt.isAjax) {
                clearTimeout(timer11)
                timer11 = setTimeout(() => {
                    console.log('ajaxhook onload ')
                    ajaxLength = 0
                    ReportData();
                }, 200)
            }
        },
        open: function (arg, xhr) {
            console.log("openXHR")
            if (arg[1].indexOf('http://localhost') != -1) return;
            ajaxMsg.push(arg)
            haveAjax = true;
            if (ajaxLength === 0) performance.clearResourceTimings();
            ajaxLength = ajaxLength + 1; // 标记发出的请求数
        }
    })

    // 绑定onload事件
    window.addEventListener("load", function () {
        if (!haveAjax) {
            clearTimeout(timer12)
            timer12 = setTimeout(() => {
                // console.log('window onload ')
                // console.log(performance.getEntries())
                // performance.clearResourceTimings()
                ReportData()
            }, opt.resourceDelay)
        }
    }, true);

    /* -----------------------页面性能数据-------------------------------------- */
    let timing = performance.timing
    // DNS解析时间
    let dnsTime = timing.domainLookupEnd - timing.domainLookupStart || 0
    //TCP建立时间
    let tcpTime = timing.connectEnd - timing.connectStart || 0
    // 白屏时间
    let whiteTime = timing.domLoading - timing.navigationStart || 0
    //dom渲染完成时间
    let domTime = timing.domContentLoadedEventEnd - timing.navigationStart || 0
    //页面onload时间
    let loadTime = timing.loadEventEnd - timing.navigationStart || 0
    // 页面准备时间
    let readyTime = timing.fetchStart - timing.navigationStart || 0
    // 页面重定向时间
    let redirectTime = timing.redirectEnd - timing.redirectStart || 0
    // unload时间
    let unloadTime = timing.unloadEventEnd - timing.unloadEventStart || 0
    //request请求耗时
    let requestTime = timing.responseEnd - timing.requestStart || 0
    //页面解析dom耗时
    let analysisDomTime = timing.domComplete - timing.domInteractive || 0

    /* -----------------------数据上报---------------------------------------------*/
    function ReportData() {
        ajaxLength = 0
        urlXMLArr = []
        urlOnload = []
        ajaxMsg = []
        haveAjax = false
        networkType = "WIFI"

        let singleReport = false
        let appId = opt.appId || null;
        if (!appId) return;

        /* -----------------------统计网络状况数据--------------------------------------*/

        function networkStates() {

            let ua = navigator.userAgent
            //app环境外部传入
            if (opt.network){
                networkType = opt.network;
                return
            }
            //离线
            if (!navigator.onLine){
                networkType = "OFFLINE"
                return
            }
            //可以通过API获取
            if (navigator.connection && (navigator.connection.effectiveType || navigator.connection.type)) {
                networkType = navigator.connection.effectiveType || navigator.connection.type
            }
            //通过GA获取
            else if (/NetType/.test(ua)) {
                var type = ua.match(/NetType\/(\S*)/);
                networkType = type[1];
            } else {
                networkType = "WIFI"
            }
        }
        // 开始上报
        function reportMain() {
            /*---------------------------------资源列表的监控---------------------------------*/
            if (!window.performance && !window.performance.getEntries) return false;
            resourceTime = 0
            if (opt.isResource){
                let resource = performance.getEntriesByType('resource')
                console.log(resource)
                resource.forEach((item) => {
                    //总耗时
                    resourceTime += item.duration
                    //单个资源耗时
                    let costTime = item.responseEnd - item.fetchStart
                    if (costTime > opt.limitDutration) {
                        singleReport = true
                        fetchOrigin(costTime, item.name, 'time')
                    }
                    //fetch传输内容 大于1M
                    if (item.transferSize && item.transferSize > 1024 * 1024) {
                        fetchOrigin(item.transferSize, item.name, 'size')
                    }
                })
            }


            /*---------------------------------页面性能的监控-----------------------------------*/
            if (opt.isPage) {
                let pageTimes = {
                    dnsTime: dnsTime,
                    tcpTime: tcpTime,
                    whiteTime: whiteTime,
                    domTime: domTime,
                    loadTime: loadTime,
                    readyTime: readyTime,
                    redirectTime: redirectTime,
                    unloadTime: unloadTime,
                    requestTime: requestTime,
                    analysisDomTime: analysisDomTime,
                    allResourceTime: resourceTime,
                }
                for (let key in pageTimes) {
                    let costTime = Number(pageTimes[key])
                    if (costTime > opt.limitDutration) {
                        if (key === 'allResourceTime' && singleReport) return
                        //页面时间有超过限制时间的上报
                        fetchOrigin(costTime, key, 'page')
                    }
                }
            }

            /*---------------------------------fetchOrigin-----------------------------------*/
            function fetchOrigin(value, resource,type) {
                //判断网络状况
                networkStates()
                networkType = networkType.toUpperCase()
                //网络状况好的情况，才会上报
                if (networkType === "WIFI" || networkType === "4G") {
                    let params = {
                        appId: appId,
                        markPage: markUv(),
                        markUser: markUser(),
                        url: encodeURIComponent(location.href),
                        resourceName: resource,
                        userAgent: userAgent,
                    }
                    let arg = type === 'time' ? 'costTime' : type === 'size' ? 'size' : 'pageData'
                    params[arg] = value
                    // 上报ajax
                    let _xhr_ = new XMLHttpRequest()
                    _xhr_.open("POST", `${opt.url}`, true)
                    _xhr_.withCredentials = true;
                    _xhr_.timeout = 60000;
                    _xhr_.onreadystatechange = function (res) {
                        console.log(res)
                    }
                    _xhr_.send(JSON.stringify(params))
                }
            }
        }
        reportMain()
    }
    // 获得markpage
    function markUser() {
        let markUser = sessionStorage.getItem('ps_markUser') || '';
        if (!markUser) {
            markUser = randomString();
            sessionStorage.setItem('ps_markUser', markUser);
        }
        return markUser;
    }
    // 获得Uv
    function markUv() {
        const date = new Date();
        let markUv = localStorage.getItem('ps_markUv') || '';
        const datatime = localStorage.getItem('ps_markUvTime') || '';
        const today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' 23:59:59';
        if ((!markUv && !datatime) || (date.getTime() > datatime * 1)) {
            markUv = randomString();
            localStorage.setItem('ps_markUv', markUv);
            localStorage.setItem('ps_markUvTime', new Date(today).getTime());
        }
        return markUv;
    }

    function randomString(len) {
        len = len || 10;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd + new Date().getTime();
    }
}

if (typeof require === 'function' && typeof exports === "object" && typeof module === "object") {
    module.exports = webMonitor

} else {
    window.webMonitor = webMonitor
}
