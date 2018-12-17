

## 这个项目的目的 (希望达到的效果)
>* 发现单个大资源文件(慢加载），并上报
>* 发现超时请求接口，并上报
>* 发现白屏过长的页面，并上报
>* 发现卡死的页面（死循环），并上报

## 监控指标[配合网络监控指标]

- 白屏时间
- 首屏时间
- 统计用户可操作时间
- 总下载时间
- DNS解析、TCP链接、静态资源下载

## 监控方式
### 页面统计，通过接口上报
>通过浏览器perfomance接口获取各项数据,计算各项指标，发送服务端，后台表格预览

**浏览器对象可提供统计接口**
![timing](http://fex.baidu.com/img/build-performance-monitor-in-7-days/timing.png)

### 现有工具进行网站分析
>现有工具网站： 谷歌（https://developers.google.com/speed/pagespeed/insights/）
,Site-Perf（http://sitespeed.me/en/tracer/506785425）

## 开发方向

- 开发性能统计js公共代码，页面引入
- 开发性能统计后台，统计异常页面
- 开发网站性能后台，可以预览所有上线网站实时情况
---
## 着手
对于统计网页的各项指标，引入外部资源统计其实并无多大意义。在外部资源加载完之前，js获取不到任何数据。事实上，浏览器已经提供了获取各项数据指标的接口
---
## 统计项目
- 设备网络状况（navigator，有环境兼容问题） 
![caniuse](//media.winbaoxian.com/autoUpload/activity/WX20181211-1346272x_43c1cc719b75e7b.png)
- Navigation Timeing Api（只能在chrome浏览器实现）

---
#### navigator.connection
```javascript
 //获取网络状态
    let connection = navigator.connection || navigator.mozConnection ||navigator.webkitConnection;
    var type = connection.effectiveType;
```
```javascript
//检查网络状态变更
let connection = navigator.connection || navigator.mozConnection ||navigator.webkitConnection;
let type = connection.effectiveType;
        function changeHandler(e) {
            alert(type)
        }
        // Register for event changes: 
        navigator.connection.onchange = changeHandler; 
```

#### downlink
```javascript
var downLink = NetworkInformation.downlink
```
> downlink 是 NetworkInformation 接口的一个只读属性，返回以Mb/s为单位的有效带宽，并保留该值为25kb/s的最接近的整数倍。该值基于最近监测的保持活跃连接的应用层吞吐量，排除了到私有地址空间的连接。当缺少最近的带宽测量数据时，该属性由底层连接技术属性决定。

#### 微信/QQ ua
```javascript

/*
 * 微信ua  
 */
Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 MicroMessenger/6.5.12 NetType/WIFI Language/zh_CN
/*
 * QQua
 */
Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 QQ/7.1.5.428 V1_IPH_SQ_7.1.5_1_APP_A Pixel/750 Core/UIWebView NetType/WIFI QBWebViewType/1



if(/NetType/.test(ua)){
    var type = ua.match(/NetType\/(\S*)/);
    network_state = type[1];
}
```
#### appbridge API获取
暂无


---

### Performance API 接口浏览器兼容
![compatibility](//media.winbaoxian.com/autoUpload/activity/performance_API_c8816dd80f34c23.png)

**Performance接口方法(通过window.performance获得)**
>performance.getEntries()  //基于给定的 filter 返回一个 PerformanceEntry 对象的列表。
>Performance.now() //返回一个表示从性能测量时刻开始经过的毫秒数 DOMHighResTimeStamp


---

**window.performance.timing 中有关时间节点的属性，按照先后顺序**(值都是一个无符号long long 型的毫秒数)
[PerformanceTiming](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming)
`navigationStart`   ，表征了从同一个浏览器上下文的上一个文档卸载(unload）结束时的UNIX时间戳。如果没有上一个文档，这个值会和PerformanceTiming.fetchStart相同

`unloadEventStart`  >表征了unload事件抛出时的UNIX时间戳。如果没有上一个文档，or if the previous document, or one of the needed redirects, is not of the same origin, 这个值会返回0.

`unloadEventEnd`    >表征了unload事件处理完成时的UNIX时间戳。如果没有上一个文档，or if the previous document, or one of the needed redirects, is not of the same origin, 这个值会返回0.

`redirectStart`     >表征了第一个HTTP重定向开始时的UNIX时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0.

`redirectEnd`       >表征了最后一个HTTP重定向完成时（也就是说是HTTP响应的最后一个比特直接被收到的时间）的UNIX时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0.

`fetchStart`        >表征了浏览器准备好使用HTTP请求来获取(fetch)文档的UNIX时间戳。这个时间点会在检查任何应用缓存之前

`domainLookupStart` >表征了域名查询开始的UNIX时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和 PerformanceTiming.fetchStart一致。

`domainLookupEnd`   >表征了域名查询结束的UNIX时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和 PerformanceTiming.fetchStart一致。

`connectStart`      >返回HTTP请求开始向服务器发送时的Unix毫秒时间戳。如果使用持久连接（persistent connection），则返回值等同于fetchStart属性的值。

`connectEnd`        >返回浏览器与服务器之间的连接建立时的Unix毫秒时间戳。如果建立的是持久连接，则返回值等同于fetchStart属性的值。连接建立指的是所有握手和认证过程全部结束。

`secureConnectionStart`  >返回浏览器与服务器开始安全链接的握手时的Unix毫秒时间戳。如果当前网页不要求安全连接，则返回0。

`requestStart`      >返回浏览器向服务器发出HTTP请求时（或开始读取本地缓存时）的Unix毫秒时间戳。

`responseStart`      返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的Unix毫秒时间戳。如果传输层在开始请求之后失败并且连接被重开，该属性将会被数制成新的请求的相对应的发起时间。

`responseEnd`        >返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的Unix毫秒时间戳。

`domLoading`         >返回当前网页DOM结构开始解析时（即Document.readyState属性变为“loading”、相应的 readystatechange事件触发时）的Unix毫秒时间戳。

`domInteractive`     >返回当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange事件触发时）的Unix毫秒时间戳。

`domContentLoadedEventStart`    >返回当解析器发送DOMContentLoaded 事件，即所有需要被执行的脚本已经被解析时的Unix毫秒时间戳。

`domContentLoadedEventEnd`     >返回当所有需要立即执行的脚本已经被执行（不论执行顺序）时的Unix毫秒时间戳。

`domComplete`         >返回当前文档解析完成，即Document.readyState 变为 'complete'且相对应的readystatechange 被触发时的Unix毫秒时间戳。

`loadEventStart`      >返回该文档下，load事件被发送时的Unix毫秒时间戳。如果这个事件还未被发送，它的值将会是0

`loadEventEnd`        >返回当load事件结束，即加载事件完成时的Unix毫秒时间戳。如果这个事件还未被发送，或者尚未完成，它的值将会是0.
```javascript
    let timing = performance.timing,
      readyStart = timing.fetchStart - timing.navigationStart, //准备新页面时间耗时
      redirectTime = timing.redirectEnd - timing.redirectStart, //redirect 重定向耗时
      appcacheTime = timing.domainLookupStart - timing.fetchStart, //Appcache 耗时
      unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart, //unload 前文档耗时
      lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart, //DNS 查询耗时
      connectTime = timing.connectEnd - timing.connectStart, //TCP连接耗时
      requestTime = timing.responseEnd - timing.requestStart, //request请求耗时
      initDomTreeTime = timing.domInteractive - timing.responseEnd, //请求完毕至DOM加载
      domReadyTime = timing.domComplete - timing.domInteractive, //解析DOM树耗时
      loadEventTime = timing.loadEventEnd - timing.loadEventStart, //load事件耗时
      loadTime = timing.loadEventEnd - timing.navigationStart; //加载时间耗时

```
**window.performance.navigation.type：0，1，2，255**

Constant|Value|Description
---|:--:|---:
TYPE_NAVIGATE|0|导航开始于点击链接、或者在用户代理中输入 URL、或者表单提交、或者通过除下表中TYPE_RELOAD 和 TYPE_BACK_FORWARD 的脚本初始化操作。
TYPE_RELOAD|1|通过刷新操作或者 location.reload() 方法导航。
TYPE_BACK_FORWARD|2|通过历史遍历操作导航。
TYPE_UNDEFINED|255|其他非以上类型的导航


**window.performance.navigation.redirectCount 表示到达最终页面前，重定向的次数**


---

PS: 
之前的思路被打破： 
如果仅仅统计浏览器计算的下载时间，那网络状况不好的用户永远都会上报； 
如果统计资源的大小，那么有大资源需求的网站永远在优化名单里。况且还可能包含了已经做了延迟加载、后台预加载优化的网站。 
so，只监控浏览器对于资源的下载时间或者只监控资源大小并没有实质的意义。 

时间指标： 
1.针对script执行时间、对于浏览器内存消耗较大的执行文件，进行监控和上报 
2.网络状况良好的情况下，下载时间过长的资源上报 
3.网络状况良好的情况下，ajax请求的时间过长上报

---

体积指标： 
文件体积过大的资源上报（找出大文件） 

## 调整 
统计指标： 
> 网络状况良好情况下，下载时间大于${可配置时间}的资源上报（找出有问题的请求资源链接） 
> 文件体积过大${可配置大小}的资源上报（找出大文件） 
> 网络状况良好的情况下，ajax请求时间大于${可配置时间}秒上报
> 针对script执行时间、对于浏览器内存消耗较大的执行文件，进行监控和上报 【?】

[TODO]:如何统计引入script脚本的执行时间？ 
初步猜想： 
浏览器的performanceAPI是没有提供相关的脚本执行时间， 
因为js是单线程语言，资源下载跟js解析执行不是在一个线程里。按照先下载完先执行的原则，等到统计代码进入浏览器的 解析线程以后，之前的script都已经跑完[?]，无法统计到具体的时间 

**不同体积的script包，下载时间固然会很不一样，但是相同体积的包，不同的代码，解析速度却有着天壤之别，这让统计陷入了僵局，如果仅仅只能统计下载时间和包体积，那么对于用户体验中影响较大的解析速度的监控，就成了漏网之鱼**

虽然html4有defer，html5有async,会使得脚本执行时间错乱和不可控，但是页面的window.onload和监听“DOMContentLoaded”事件，可以统计页面的白屏时间（domLoading之前）和可操作时间（一般来讲 domComplete-dom结构加载完毕的时间，便是我们的用户可操作时间）来监控页面异常，用排除法来找出执行耗时过长的脚本

### 对于全局ajax的请求时间监控
重写XmlHttpRequest,增加hooks，在返回时获取页面新增的请求，上报请求时间过长的resource

### 浏览器对于img图片的处理
图片资源的加载优先级一般排在html，css,js等资源后面，会根据距离屏幕的位置确定不同的优先级，但是不影响页面继续加载。但是页面的window.onload会包含图片加载在内

### 浏览器对于音频/视频媒体文件的处理
在浏览器解析到音频、视频资源后，异步进行下载，等到开始下载之后，并不会等待资源的canplay，会异步完成load