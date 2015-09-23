;(function($){
    $.fn.extend({
        //将可选择的变量传递给方法
        FnWebIM: function(options) {
            //设置默认值并用逗号隔开
            var defaults = {
                autoLogin          :true,      //boolean型，默认是否自动登录，true：自动登录，false：手动登录，默认为true
                msgRefreshTime    :1000,       //number型，消息刷新时间，单位为ms
                friendRefreshTime :10000,     //number型，好友刷新时间，单位为ms
                showSecretary     :true,      //boolean型，默认是否显示小秘书，true：显示，false：不显示，默认为true
                noticeContent     :"",        //string型，公告内容 为空时不显示公告
                sendPicture       :true,      //boolean型，是否允许发送图片，true：允许，false：不允许，默认为true
                msgMaxSize        :300,        //number型，单条消息最大允许字符
                msgSound           :true,      //是否开启声音提醒
                defaultWindow     :""         //string型，登录后打开新聊天窗口，从用户点击的链接接收参数
            }
            var options =  $.extend(defaults, options);
            return this.each(function() {
                //显示fn_imbar
                $("body").append('<div id="fn_imbar" class="im_login"><span>在线交流工具<b title="3条未读消息">3</b></span></div><div id="fn_imbox"></div>');

                $("#fn_imbar.im_login").click(function(){
                    $(this).attr("class","im_loading").find("span").html("登录中，请稍后…");
                    /************************联系人面板****************************/
                    $.ajax({url:"ajax/im_contact.html",dataType:"html",success:loginIM,error:loginError});
                    function loginIM(data){
                        //显示联系人面板
                        $("#fn_imbox").html(data).show();
                        //装配联系人数据
                        Friends();
                        $("#fn_imbar").hide();
                        $("#fn_imbox .im_top h4").toggle(function(){//收起联系人面板
                            $("#fn_imbox").animate({height: 30}, 800);
                            $("#fn_imbox .im_bottombar ul").hide();
                        },function(){//展开联系人面板
                            $("#fn_imbox").animate({height: 360}, 800);
                        });

                        //修改资料
                        $("#fn_imbox .im_top a.modify").click(function(){
                            $.ajax({url:"ajax/msgbox.html",dataType:"html",success:function(data){
                                art.dialog({title:"消息盒子",padding:0,content:data,ok:function(){}});
                                $("#im_msgboxs").jscroll();
                                $("dl.im_msgbox dd.im_msginfo").click(function(){
                                    var uid=$(this).attr("uid");
                                    $.ajax({url:"ajax/im_window.html",dataType:"html",success:function(data){
                                        var uid=$(this).attr("uid");
                                        $.getJSON("ajax/userinfo.php?uid="+uid,function(json){
                                            //打开新窗口
                                            openWindow(json[0].cid,json[0].UID,json[0].isOnline,json[0].UserAvatar,json[0].cname,json[0].UserName,data);
                                        });
                                    },error:function(XMLHttpRequest, textStatus, errorThrown){
                                        message("对不起，聊天窗口加载失败！ CODE:"+XMLHttpRequest.status);
                                    }});
                                });
                                $("dl.im_msgbox dt, dl.im_msgbox .msg_contact").click(function(){
                                    card($(this).attr("uid"));
                                });
                            },error:function(XMLHttpRequest, textStatus, errorThrown){
                                message("消息窗口加载失败，请重试！CODE:"+XMLHttpRequest.status);
                            }});
                        });


                        //好友分组
                        $("#fn_imbox .im_contents h4").click(function(){
                            $(this).attr("class","im_group_expansion").siblings("h4").attr("class","im_group_away").siblings(".im_group_contacts").hide();
                            $(this).next(".im_group_contacts").show().jscroll();//显示滚动条
                        });
                        //好友搜索
                        $("#fn_imbox .im_bottombar input").focus(function(){
                            if($(this).val()=="查找联系人"){
                                $(this).val("");
                            }
                            //$(this).die().live('keyup',function(){
                            //    var contactNum=$(this).parents("#fn_imbox").find(".im_contact span").size(),
                            //         searchTxt=$(this).val();
                            //    if(contactNum!=0 && $.trim(searchTxt).length!=0){
                            //        for(var i=0;i<contactNum;i++){
                            //            var contactName=$(this).parents("#fn_imbox").find(".im_contact span").eq(i).text();
                            //            if(contactName.indexOf(searchTxt)!=-1){
                            //               $(this).parents("#fn_imbox").find(".im_contact span").eq(i).parents(".im_contact").hide();
                            //           }
                            //        }
                            //    }
                            //});
                        }).blur(function(){
                                if($(this).val()==""){
                                    $(this).val("查找联系人");
                                }
                            });
                        //设置选项
                        $("#fn_imbox .im_bottombar span").toggle(function(){
                            $(this).addClass("current").parent().find("ul").fadeIn();
                        },function(){
                            $(this).removeClass("current").parent().find("ul").hide();
                        });
//                            $("#fn_imbox .im_bottombar li.selected:not('.smssub')").click(function(){
//                                if($(this).hasClass("current")){
//                                    $(this).removeClass("current");
//                                }
//                                else{
//                                    $(this).addClass("current");
//                                }
//                                //提交用户设置数据
//                            });
//                        $("#fn_imbox .im_bottombar li.smssub").click(function(){
//                            art.alert("您还没有开通短信小秘书功能，请先开通。 <a href='#' target='_blank'>开通&gt;</a> ");
//                        });
                        $("#fn_imbox .im_bottombar li.setting").click(function(){
                            modify();
                        });
                        $("#fn_imbox .im_bottombar li.backlist").click(function(){
                            $.ajax({url:"ajax/friends.html",dataType:"html",success:function(data){
                                art.dialog({title:"查看黑名单",padding:0,content:data,ok:function(){

                                }});
                                $(".im_friendsbox").jscroll();
                                $(".im_friendsbox dt, .im_friendname").click(function(){
                                    card($(this).attr("uid"));
                                });
                                $("a.im_addcontact").click(function(){
                                    $(this).parents("dl").fadeOut();
                                    message("好友添加成功！");
                                });
                            },error:function(XMLHttpRequest, textStatus, errorThrown){
                                message("黑名单面板加载失败，请重试！CODE:"+XMLHttpRequest.status);
                            }});
                        });
                        $("#fn_imbox .im_bottombar li.friends").click(function(){
                            $.ajax({url:"ajax/friends.html",dataType:"html",success:function(data){
                                art.dialog({title:"推荐好友",padding:0,content:data,ok:function(){

                                }});
                                $(".im_friendsbox").jscroll();
                                $(".im_friendsbox dt, .im_friendname").click(function(){
                                    card($(this).attr("uid"));
                                });
                                $("a.im_addcontact").click(function(){
                                    Friends();
                                    $(this).parents("dl").fadeOut();
                                    message("好友添加成功！");
                                });
                            },error:function(XMLHttpRequest, textStatus, errorThrown){
                                message("推荐好友面板加载失败，请重试！CODE:"+XMLHttpRequest.status);
                            }});
                        });
                        $("#fn_imbox .im_bottombar li.loginout").click(function(){
                            art.confirm("您确定要退出本次登录吗？",function(){
                                loginTimeOut();
                                message("注销成功！");

                            },function(){

                            });
                        });
                        //会话超时
                        function loginTimeOut(){
                            $.ajax({url:"ajax/login.html",dataType:"html",success:function(data){
                                art.dialog({title:"会话超时，请重新登录！",content:data,okValue:"登录",ok:function(){
                                    message("登录成功！");
                                },cancel:function(){
                                    message("登录已取消！");
                                }});
                            },error:function(XMLHttpRequest, textStatus, errorThrown){
                                message("登录面板获取失败！CODE:"+XMLHttpRequest.status);
                            }});
                        }
                        //加载聊天窗口
                        $.ajax({url:"ajax/im_window.html",dataType:"html",success:function(data){
                            if(options.defaultWindow!=""){
                                $.getJSON("ajax/userinfo.php?uid="+options.defaultWindow,function(json){
                                    //打开新窗口
                                    openWindow(json[0].cid,json[0].UID,json[0].isOnline,json[0].UserAvatar,json[0].cname,json[0].UserName,data);
                                });
                            }
                            $(".im_contact").click(function(){
                                //选中联系人
                                $(".im_contact").removeClass("current");
                                $(this).addClass("current");
                                //清除消息提示
                                $(this).find("b").remove();
                                //阻止全选
                                this.onselectstart=function(){return false};
                                var uid=$(this).attr("uid");
                                $.getJSON("ajax/userinfo.php?uid="+uid,function(json){
                                    //打开新窗口
                                    openWindow(json[0].cid,json[0].UID,json[0].isOnline,json[0].UserAvatar,json[0].cname,json[0].UserName,data);
                                });
                                //清除消息提示
                                if($(".im_contents").has("b").length==0){
                                    noMsg();
                                }
                            });
                        },error:function(XMLHttpRequest, textStatus, errorThrown){
                            message("对不起，聊天窗口加载失败！ CODE:"+XMLHttpRequest.status);
                        }});
                    }
                    function loginError(XMLHttpRequest, textStatus, errorThrown){
                        art.alert("登录超时，请重新登录！ CODE:"+XMLHttpRequest.status,function(){loginTimeOut();});
                    }
                    /****装配联系人数据****/
                    function Friends(){
                        $("#imRencentContacts,#imFriends").html("");
                        //凡纳小秘书
                        if(options.showSecretary){
                            $("#imFriends").append('<div class="im_contact online"  uid=""><i><img src="../img/avatar_s-sys.png" width="30" height="30" /><sup></sup></i><span>凡纳小秘书</span><a href="#" target="_blank"></a></div>');
                        }
                        $.getJSON("ajax/friends.php",function(json){
                            for(var i=0;i<json[0].RencentContacts.length;i++){
                                $("#imRencentContacts").append('<div class="im_contact '+json[0].RencentContacts[i].o+'" uid="'+json[0].RencentContacts[i].uid+'"><i><img src="'+json[0].RencentContacts[i].a+'" width="30" height="30" /><sup></sup></i><span>'+json[0].RencentContacts[i].n+'</span><a href="'+json[0].RencentContacts[i].h+'" target="_blank"></a></div>');
                                if(json[0].RencentContacts[i].m!=0){
                                    $("#imRencentContacts .im_contact:eq("+i+")").find("span").append("<b></b>");
                                }
                            }

                            for(var i=0;i<json[0].Friends.length;i++){
                                $("#imFriends").append('<div class="im_contact '+json[0].Friends[i].o+'" uid="'+json[0].Friends[i].uid+'"><i><img src="'+json[0].Friends[i].a+'" width="30" height="30" /><sup></sup></i><span>'+json[0].Friends[i].n+'</span><a href="'+json[0].Friends[i].h+'" target="_blank"></a></div>');
                                if(json[0].RencentContacts[i].m!=0){
                                    $("#imFriends .im_contact:eq("+i+")").find("span").append("<b></b>");
                                }
                            }
                            var Scroll=function(){$(".im_contacts").jscroll();}//显示滚动条
                            Scroll();
                            $("#imRencentContacts").prev("h4").find("i").html("("+json[0].RencentContactsOnline+"/"+json[0].RencentContacts.length+")");
                            $("#imFriends").prev("h4").find("i").html("("+json[0].FriendsOnline+"/"+json[0].Friends.length+")");
                            if(json[0].RencentContactsOnline!=0&&json[0].FriendsOnline!=0){
                               newMsg();//新消息提醒
                            }
                        });

                    }
                    /****打开新聊天窗口****/
                    function openWindow(cid,uid,o,a,n,c,m){
                        var t='<div class="im_contactinfobar"><a class="im_avatar" '+o+' href="javascript:;" uid="'+uid+'"><img src="'+a+'"  width="50" height="50" /></a><span class="im_contactinfo"><a class="im_contactcompany" href="javascript:;" cid="'+cid+'">'+n+'</a> - <a class="im_contact"  id="contactcard" href="javascript:;" uid="'+uid+'">'+c+'</a><a class="im_addcontact" id="imcontact"  href="javascript:;" title="添加好友">&nbsp;</a></span></div>';
                        //关闭上一个聊天窗口
                        art.dialog({id:"msgWindow"}).close();
                        //创建新聊天窗口
                        art.dialog({id:"msgWindow",padding:"0",lock:false,title:t,content:m});
                        //显示公告内容
                        if(options.noticeContent!=""){
                            $(".im_chats .im_morechats").before('<div class="im_notice"><span>'+options.noticeContent+'</span><a href="javascript:;" class="im_notice_close"></a></div>');
                        }
                        //操作当前聊天窗口
                        operatewindow();
                        //加载聊天记录
                        msgList();
                    }
                    /****加载聊天记录****/
                    function msgList(){
                        $.getJSON("ajax/chats.php",function(json){
                            $.each(json,function(i){
                                if(json[i].T=="0"){
                                    $(".im_chats .im_chat_content:last").after('<div class="im_chat_content"><i>'+json[i].D+'</i><div class="im_chat_txt">'+json[i].M+'</div></div>');
                                }
                                else if(json[i].T=="1"){
                                    $(".im_chats .im_chat_content:last").after('<div class="im_chat_content myself"><i>'+json[i].D+'</i><div class="im_chat_txt">'+json[i].M+'</div></div>');
                                }

                            });
                            //滚动条显示
                            $(".im_chats").jscroll();
                            //滚动条显示->聊天记录中有图片的情况
                            var imgSize=$(".im_chats img").size();
                            $(".im_chats img").load(function(){
                                if(!--imgSize){
                                    $(".im_chats").jscroll();
                                }
                            })
                        });
                    }
                    /****聊天窗口选项****/
                    function operatewindow(){
                        //表情面板
                        $(".im_face").click(function(){
                            var _this=$(this).parent().find("#im_face");
                            _this.show();
                            $.ajax({url:"ajax/im_face.html",success:function(data){
                                _this.html(data).find(".im_faceclose,.im_faceico a").click(function(){
                                    $("#im_face").hide();
                                });
                                _this.find(".im_faceico a").click(function(){
                                    //取到表情代码  $(this).attr("code")
                                    $("#im_window .im_send_msg").html($("#im_window .im_send_msg").html()+$(this).html()).click();
                                });
                            },dataType:"html",error:function(XMLHttpRequest, textStatus, errorThrown){
                                message("表情面板获取失败，请重试！CODE:"+XMLHttpRequest.status)
                            }});
                        });
                        //发送图片
                        if(options.sendPicture=false){
                            $(".im_upload_pic").remove();
                        }
                        $(".im_upload_pic").click(function(){
                            art.alert("需要用jQuery Ajax上传插件。");
                        });
                        //发送抖动
                        var lastshakeTime;
                        $(".im_shake").click(function(){
                            var shakeTime=new Date().getTime();
                            if(typeof lastshakeTime=="undefined"){
                                sendShake();
                                lastshakeTime=shakeTime;
                            }
                            else{
                                if((shakeTime-lastshakeTime)>=10000){
                                    sendShake();
                                }
                                else{
                                    message("喝杯茶休息下吧，您的操作太频繁了！");
                                }
                                lastshakeTime=shakeTime;
                            }

                        });
                        //发送产品
                        $(".im_product").click(function(){
                            art.prompt('请输入您的在凡纳网的产品网址 (<a href="javascript:;" title="① 打开您想要发送的的产品页面，\n② 复制地址栏里的地址粘贴到下面文本框即可。\n注意：必须为凡纳网的产品地址">?</a>)：', function (value) {
                                var fnURL=new RegExp(/^http:\/\/[A-Za-z0-9|_|-]*.?fanna.com.cn\/(productdetails|p)_[0-9]*[.htmls]/);
                                if(fnURL.test(value)==true){
                                    var pid=value.substring((value.lastIndexOf('_')+1),value.lastIndexOf("."));
                                    /*************************加载产品信息************************/
                                    $.ajax({url:"ajax/product.html?pid="+pid,dataType:"html",success:function(data){
                                        $(".im_chats .im_chat_content:last").after('<div class="im_chat_content myself"><i>'+msgTime+'</i><div class="im_chat_txt" style="min-height:90px"><em>您发送了一件产品给对方……</em>'+data+'</div></div>');
                                        $(".im_chats").jscroll({Bar:{Pos:"bottom"}});
                                        //此处提价用户消息至服务器 msgTime+data

                                        $("a.im_product_favorites").click(function(){
                                            message("收藏成功！");
                                            $(this).remove();
                                        });
                                        $("a.im_product_share").click(function(){
                                            $.ajax({url:"ajax/share.html",dataType:"html",success:function(data){
                                                art.dialog({title:"分享到：",content:data,ok:function(){}});
                                            },error:function(XMLHttpRequest, textStatus, errorThrown){
                                                message("分享内容面板加载失败，请重试！CODE"+XMLHttpRequest.status);
                                            }});
                                        });
                                    },error:function(XMLHttpRequest, textStatus, errorThrown){
                                        message("产品信息获取失败，请重试！CODE:"+XMLHttpRequest.status);
                                    }});
                                }
                                else{
                                    this.shake().title("您输入的网址有误，请重新输入！");
                                    return false;
                                }
                            }, '如：http://www.fanna.com.cn/productdetails_00000000.htmls');
                        });
                        //发送名片
                        $(".im_card").click(function(){
                            $.ajax({url:"ajax/card.html",success:function(data){
                                art.dialog({content:data,title:"名片预览",okValue:"发送名片",ok:function(){
                                    $(".im_chats .im_chat_content:last").after('<div class="im_chat_content myself"><i>'+msgTime+'</i><div class="im_chat_txt" style="min-height:90px"><em>您发送了自己的名片给对方……</em><div class="im_mycard">'+data+'<p><a href="javascript:;" class="cc atocard">收藏到名片夹</a><a href="javascript:;" class="cc aqrcode">添加到手机通讯录</a></p></div></div></div>');
                                    $(".im_chats").jscroll({Bar:{Pos:"bottom"}});
                                    //提交数据
                                    message("名片发送成功！");
                                    $("a.atocard").click(function(){
                                        message("收藏成功！");
                                        $(this).remove();
                                    });
                                    $("a.aqrcode").click(function(){
                                        cardQRcode($(".im_contactcard"));
                                    });
                                },button:[{value:"修改名片",callback:function(){
                                    modify();
                                    return false;
                                }}]});
                            },dataType:"html",error:function(XMLHttpRequest, textStatus, errorThrown){
                                message("名片信息获取失败，请重试！CODE:"+XMLHttpRequest.status);
                            }});

                        });
                        //更多设置
                        $("a.im_moreoperates").click(function(){
                            $(".im_moreoperate").animate({height:"28px",marginTop:"-28px"},400);
                            $("a.im_abacklist").click(function(){
                                art.confirm("您确定要将该好友加入黑名单吗？",function(){
                                    message("您已经将该好友加入了黑名单！");
                                },function(){})
                            });
                            $("a.im_areport").click(function(){
                                art.confirm("您确定要举报该好友吗？",function(){
                                    art.dialog({title:"请填写举报原因：",padding:"0",content:"<iframe width='400' scrolling='no' height='215' src='ajax/report.html' frameborder='0'></iframe> ",ok:function(){
                                        //提交数据
                                        message("举报成功，我们会尽快核实");
                                    },cancel:function(){

                                    }});
                                },function(){})
                            });
                            $("a.im_aemptyrecords").click(function(){
                                art.confirm("您确定清空与该好友的聊天记录吗？",function(){
                                    //清空聊天记录
                                    $.post('ajax/chats.php', function(data) {
                                        //重新加载聊天内容
                                        $(".im_chats .im_chat_content:gt(0)").remove();
                                        msgList();
                                    });
                                },function(){})
                            });
                        });
                        $(".im_moreoperate .im_aclose,.im_send_msg").click(function(){
                            $(".im_moreoperate").animate({height:0,marginTop:"0"},200);
                        });
                        //发送留言
                        $("#im_window .im_send_msg").die().live("focus",function(){
                            $(document).die().live("keypress",function(e){
                                if(e.ctrlKey && e.which == 13 || e.which == 10) {
                                    sendMsg();
                                }
                            });
                        });
                        $("#im_window .im_sendmsg_btn").click(function(){
                            sendMsg();
                        });

                        //公司信息面板
                        $(".im_contactcompany").click(function(){
                            $.ajax({url:"ajax/companyinfo.html?"+$(this).attr("cid"),dataType:"html",success:function(data){
                                $(".im_contactinfos").html(data).jscroll();
                                $(".im_companyFav").click(function(){
                                    message("收藏成功！");
                                    $(this).parent().html("已收藏");
                                });
                            },error:function(XMLHttpRequest, textStatus, errorThrown){
                                message("公司信息获取失败，请重试！CODE"+XMLHttpRequest.status);
                            }});
                            $("#im_contactinfo").show();
                            $("#im_contactinfo .d-close").click(function(){
                                $("#im_contactinfo").hide();
                            });
                        });
                        //联系人名片
                        $("#contactcard,.im_avatar").click(function(){
                            card($(this).attr("uid"));
                        });
                        //关闭主窗体
                        $("#im_body .im_close,#im_body .im_minimize").click(function(){
                            $("#im_window").hide();
                        });
                        //关闭公告
                        $("a.im_notice_close").click(function(){
                            $(this).parent().hide();
                            $(".im_chats").jscroll();
                        });
                        //查看聊天记录
                        $(".im_morechats").click(function(){
                            //加载聊天记录
                            msgList();
                            $(".im_chats").jscroll();
                        });
                        //添加好友
                        $("#imcontact").click(function(){
                            if($(this).hasClass("im_addcontact")){
                                art.confirm('您确定要将对方添加为好友吗？', function () {
                                    //提交数据并刷新联系人列表
                                    Friends();
                                    $("#imcontact").attr({"class":"im_removecontact","title":"删除好友"});
                                    message("添加好友成功！");
                                },function(){});
                            }
                            else{
                                art.confirm('您确定要将对方从好友列表中删除吗？', function () {
                                    //提交数据并刷新联系人列表
                                    Friends();
                                    $("#imcontact").attr({"class":"im_addcontact","title":"加为好友"});
                                    message("删除好友成功！");
                                },function(){});
                            }

                        });
                    }
                    /****发送窗口抖动****/
                    function sendShake(){
                        art.dialog.get("msgWindow").shake();
                        $(".im_chats .im_chat_content:last").after('<div class="im_chat_content myself"><i>'+msgTime+'</i><div class="im_chat_txt"><em>您发送了一个抖动窗口…</em></div></div>');
                        $(".im_chats").jscroll({Bar:{Pos:"bottom"}});
                    }
                    /****发送消息****/
                    function sendMsg(){
                        //消息发送
                        var msgContent=$("#im_window .im_send_msg");
                        if(msgContent.html().length!=0&&msgContent.html().length<options.msgMaxSize){
                            $(".im_chats .im_chat_content:last").after('<div class="im_chat_content myself"><i>'+msgTime+'</i><div class="im_chat_txt">'+msgContent.html()+'</div></div>');
                            $(".im_chats").jscroll({Bar:{Pos:"bottom"}});
                            urlFilter();
                            msgContent.html("").click();
                            //此处提价用户消息至服务器
                        }
                        else if(msgContent.html().length==0){
                            message("对不起，消息不能为空！");
                            msgContent.click();
                        }
                        else{
                            message("对不起，您输入的字数超过限制！");
                        }
                    }
                    /****网址过滤****/
                    function urlFilter(){
                        var msgRecord = $(".im_chats .im_chat_content:last"),urls;
                        try{
                            urls=msgRecord.html().match(/http:\/\/[A-Za-z0-9|_|-]*.?fanna.com.cn\/[0-9a-z_!~*'().;?:@&=+$,%#-]*/gi);
                            for(var i=0;i<urls.length;i++){
                                msgRecord.html(msgRecord.html().replace(urls[i], '<a class="fn_url" href="'+urls[i]+'" target="_blank" title="凡纳网官方网站，没有安全风险">'+urls[i]+'</a>'));
                            }
                        }catch(ex){}
                    }
                    /****消息发送时间，可能需要改为服务器时间****/
                    var msgTime=msgDate();
                    function msgDate(){
                        //系统时间，需改为服务器时间
                        var msgDate= new Date();
                        return (parseInt(msgDate.getMonth())+1)+"-"+msgDate.getDate()+" "+msgDate.getHours()+":"+msgDate.getMinutes()+":"+msgDate.getSeconds();
                    }
                    /****新消息提示****/
                    function newMsg(){
                        $("#fn_imbox .im_top h4").addClass("im_newmsg");
                        if(options.msgSound){
                            $("body").append('<object type="application/x-shockwave-flash" data="sound/msg.swf" width="10" height="10" id="newMessage" style="overflow: hidden;"><param name="movie" value="sound/msg.swf" /></object>');
                            setTimeout(function(){$("#newMessage").remove()},3000);
                        }
                    }
                    /****清除新消息提示****/
                    function noMsg(){
                        $("#fn_imbox .im_top h4").removeClass("im_newmsg");
                    }
                    /****修改资料****/
                    function modify(){
                        $.ajax({url:"ajax/set.html",dataType:"html",success:function(data){
                            art.dialog({title:"修改我的资料：",content:data,okValue:"提交修改",cancelValue:"取消",
                                ok:function(){
                                    message("资料修改成功！");
                                },cancel:function(){

                                }});
                        },error:function(XMLHttpRequest, textStatus, errorThrown){
                            message("设置面板加载失败！CODE:"+XMLHttpRequest.status);
                        }});

                    }
                    /****用户名片****/
                    function card(uid){
                        $.ajax({url:"ajax/card.html?uid="+uid,dataType:"html",success:function(data){
                            art.dialog({content:data,title:false,okValue:"收藏该名片",ok:function(){
                                message("收藏成功！您可以从“我的名片夹”查看该名片。</a>");
                            },button:[{value:"添加到手机通讯录",callback:function(){
                                cardQRcode($(".im_contactcard"));
                                return false;
                            }}]});
                        },error:function(XMLHttpRequest, textStatus, errorThrown){
                            message("名片信息获取失败，请重试！CODE:"+XMLHttpRequest.status);
                        }});
                    }
                    /****名片二维码****/
                    function cardQRcode(pNode){
                        var QRcode={
                            Name:pNode.find("dt b").text(),
                            Title:pNode.find("dt i").text(),
                            Department:pNode.find("dt span").text(),
                            Company:$("").text(),//公司名称
                            Zipcode:pNode.find(".zipcode i").text(),
                            Phone:pNode.find(".phone i").text(),
                            Fax:pNode.find(".fax i").text(),
                            Mobile:pNode.find(".mobile i").text(),
                            WebSite:pNode.find(".website i").text()
                        }
                        var QRcodeURL="http://www.mayacode.com/api.php?uid=1&from=maya&v=1&f=1&t=1&sid=01&Name="+QRcode.Name+"&Title="+QRcode.Title+"&Department="+QRcode.Department+"&Company="+QRcode.Company+"&Zipcode="+QRcode.Zipcode+"&Phone="+QRcode.Phone+"&Fax="+QRcode.Fax+"&Mobile="+QRcode.Mobile+"&WebSite="+QRcode.WebSite;
                        var Qrcode="<img src="+window.encodeURI(QRcodeURL)+" style='margin:-20px -25px' height='306' width='306' />";
                        art.dialog({title:false,content:Qrcode});
                    }
                    /****全局信息提示****/
                    function message(c){
                        art.dialog({time: 2000,padding:0,title:false,lock:false,content:"<div class='im_infos'><p>"+c+"</p></div>",cancel:false});
                    }
                });
                if(options.autoLogin||options.defaultWindow!=""){ $("#fn_imbar.im_login").click();}
            });
        }
    });

})(jQuery);
/****禁止粘贴****/
function msgPaste(){
    art.dialog({time: 2000,padding:0,title:false,lock:false,content:"<div class='im_infos'><p>为营造一个良好的网络环境，暂不允许粘贴！</p></div>",cancel:false});
}



