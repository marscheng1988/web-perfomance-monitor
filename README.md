
## 使用
#### npm安装
```javascript
//安装依赖
npm install -S wy-performance-monitor

//使用
import Monitor from 'wy-perfomance-monitor'
let m = new Monitor({
	 //项目名称（必填）
     appId: null,
     // 上报地址（必填）
	 url:"your report address",
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
     //延迟请求resource时间（等待请求完成多久后开始监控）
     resourceDelay: 6000,
     //过滤掉的资源或者请求地址
	 filter:[
		"baidu.com",  //一级域名
		"www.baidu.com",//二级域名
		"http://www.baidu.com/read" //完整链接
	 ] 
})
//增加上传信息
m.add({
	author:'superman'
})

```
#### 页面插入代码
```javascript
    let s = document.createElement("script")
    s.src = "https://res.winbaoxian.com/autoUpload/activity/index_7854ee73401bdf2.js"
    document.body.appendChild(s)
    s.onload = function () {
        let m = new Monitor({
            //项目名称（必填）
            appId: null,
            // 上报地址（必填）
            url:"your report address",
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
            //延迟请求resource时间（等待请求完成多久后开始监控）
            resourceDelay: 6000,
            //过滤掉的资源或者请求地址
            filter:[
                "baidu.com",  //一级域名
                "www.baidu.com", //二级域名
                "http://www.baidu.com/read" //完整链接
            ] 
        })
        //增加上传信息
        m.add({
            author:'superman'
        })
    }

```
