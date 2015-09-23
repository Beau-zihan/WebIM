# WebIM说明
WebIM是一款基于jQuery的一款web即时通讯插件，姑且这么称呼吧。插件最大程度实现了IM的常用功能，除即时通讯的常用功能外，还加入了：消息盒子、窗口抖动、添加删除好友、最近联系人、超时登录界面、网站小秘书、聊天记录、发送频率限制、发送产品、发送名片、发送表情、产品分享、黑名单、举报、收藏、公告、智能网址过滤、消息提醒、修改资料、名片二维码、禁止粘贴、收起联系人列表、推荐好友等30余项改进。全浏览器兼容。
插件调用简单方便，只需在现有的web系统中加入几行代码，理论上可嵌入任何web系统。

2012年项目，已不再维护。

## 截图

![webim](https://github.com/Beau-zihan/WebIM/blob/master/webim-preview.png)

## 配置
<pre>$(function() {
         $(document).FnWebIM({
             autoLogin          :true,       //boolean型，默认是否自动登录，true：自动登录，false：手动登录，默认为true
             msgRefreshTime     :1000,       //number型，消息刷新时间，单位为ms
             friendRefreshTime :10000,      //number型，好友刷新时间，单位为ms
             showSecretary     :true,       //boolean型，默认是否显示小秘书，true：显示，false：不显示，默认为true
             noticeContent     :"唐僧师徒历经千辛万苦，终于见到了佛祖……",        //string型，公告内容 为空时不显示公告
             sendPicture       :true,       //boolean型，是否允许发送图片，true：允许，false：不允许，默认为true
             msgMaxSize        :300,        //number型，单条消息最大允许字符
             msgSound          :false,      //boolean型，是否开启声音提醒，true：开启，false:关闭，默认为true
             defaultWindow     :""          //string型，登录后打开新聊天窗口，此处接收的参数为联系人的uid，否则会出错
         });
    });</pre>

## 详细说明文档
http://www.zi-han.net/case/im/help.html

## 示例
http://www.zi-han.net/developer/721.html

##注意
请在服务器（如localhost）环境下打开
