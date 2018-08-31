
function _navInit(frameParams){
	var _self = {};

	var fOpen = function(i, b) {
        var p = frameParams[i];
        if (p.type == 'frame') {
            if (p.isinit) {
				if(p.head) H.$setFrameStatus( p.name+"_frm",!b);
                H.$setFrameStatus(p.name, !b)
            } else {
                if (b) {
                    setTimeout(function () {
						if(p.head){
							H.openFrame({
		                        name: p.name+"_frm",
		                        url: p.head,
		                        bounces: false,
		                        rect: {
		                            x: 0,
		                            y: 0,
		                            w: 'auto',
		                            h: api.winHeight - H.offset("footer").h
		                        },
		                        vScrollBarEnabled: false
		                    })
						}
						H.openFrame({
	                        name: p.name,
	                        url: p.url,
	                        bounces: false,
	                        rect: {
	                            x: 0,
	                            y: H.offset("header").t + H.offset("header").h,
	                            w: 'auto',
	                            h: api.winHeight - H.offset("header").t - H.offset("header").h - H.offset("footer").h
	                        },
	                        vScrollBarEnabled: false
	                    })
                    },100)
                    p.isinit = true;
                }
            }
        }
        //framegroup
        if (p.type == 'frame_group') {
            if (b) {
                if (!p.isinit) {
                    setTimeout(function() {
						//先打开frame头
						if(p.url){
							H.openFrame({
		                        name: p.name+"_frm",
		                        url: p.url,
		                        bounces: false,
		                        rect: {
		                            x: 0,
		                            y: 0,
		                            w: 'auto',
		                            h: api.winHeight - H.offset("footer").h
		                        },
		                        vScrollBarEnabled: false
		                    })
						}
                        H.$openFrameGroupWithNav(function(ret) {
                            utils.isFunction(p.callback)&&p.callback(ret.index);
                        }, "header", {
                            name: p.name,
                            frames: p.frames
                        }, "footer")
						p.isinit = true;
						utils.isFunction(p.oninit)&&p.oninit();
                    }, 100)
                }
            }
			if(p.url) H.$setFrameStatus( p.name+"_frm",!b);
            H.$setFrameGroupStatus(p.name, !b)
        }
		//原生framegroup  模式缺陷  只能固定宽度
        if (p.type == 'nav') {
            if (p.isinit) {
				H.$setFrameStatus( p.name+"_frm",!b);
                H.$setFrameGroupStatus(p.name, !b);
                // if (b) {
                //     navigationBar.show({
                //         id: p.navid
                //     });
                // } else {
                //     navigationBar.hide({
                //         id: p.navid
                //     });
                // }
            } else {
                if (b) {
                    setTimeout(function() {
						//先打开一个frame 这样渲染效果更好
						H.openFrame({
	                        name: p.name+"_frm",
	                        url: p.url,
	                        bounces: false,
	                        rect: {
	                            x: 0,
	                            y: 0,
	                            w: 'auto',
	                            h: api.winHeight - H.offset("footer").h
	                        },
	                        vScrollBarEnabled: false
	                    })
						navigationBar.open({
						    rect: {
								x: H.offset(p.target).l,
								y: H.offset(p.target).t,
								w: H.offset(p.target).w,
								h: H.offset(p.target).h,
						    },
						    styles: p.styles,
						    items: p.items,
							selectedIndex: 1,
       						fixedOn:  p.name+"_frm",
							id: p.name
						}, function(ret, err) {
							switch (ret.eventType) {
                                case 'show':
                                    p.navid = ret.id;
                                    break;
                                case 'click':
                                    H.$setFrameGroupIndex(p.name, ret.index)
                                    break;
                            }
						});
                        H.$openFrameGroupWithNav(function(ret) {
							navigationBar.setSelected({
							    id: p.name,
							    index: ret.index,
							    selected: true
							}, function(ret) {
							});
                        }, "header", {
                            name: p.name,
                            frames: p.frames
                        }, "footer")
                    }, 100)
                    p.isinit = true;
                }
            }
        }
    }
	var showTab =function (index) {
		$("#footer .aui-bar-tab-item").eq(index).addClass('aui-active').siblings().removeClass("aui-active");
		$("#footer .aui-bar-tab-item").each(function () {
			var $this = $(this);
			var $icon = $this.find("[toggle-icon]");
			var icons = utils.Trim($icon.attr("toggle-icon"),'g').split("|");
			if($this.hasClass("aui-active")){
				$icon.addClass(icons[1]).removeClass(icons[0]);
			}else{
				$icon.addClass(icons[0]).removeClass(icons[1]);
			}
		})
	}
	_self.frChange = function(t) {
        var p = frameParams[t];
        if (currentIndex == t) {
            return;
        }
        if ($(".header-content[data-name='" + p.name + "']").length > 0) {
            $(".header-content[data-name='" + p.name + "']").show().siblings(".header-content").hide();
        }else{
			$(".header-content").hide();
		}
		showTab(t);
        frameParams.forEach(function(v, i) {
            if (i == t) {
                fOpen(i, true)
            } else {
                fOpen(i, false)
            }
        })
    }
	return _self;
}

function submit_answer(){
		var arr 				=			[];
		var paperinfo 	=			H.getStorage('paperinfo');
		var notfilled   =     false;
		for(var i in paperinfo.paper_info){
					for(var j in paperinfo.paper_info[i].question){
							if(paperinfo.paper_info[i].question[j].useranswer == ''){
										notfilled = true;
										break;
							}
							arr.push({
										paper_id:paperinfo.paper_info[i].question[j].paper_id,
										paperquestion_id:paperinfo.paper_info[i].question[j].id,
										user_answer:paperinfo.paper_info[i].question[j].useranswer,
										score:paperinfo.paper_info[i].question[j].score,
							});
					}
		}
		if(!notfilled){
					var address = "/Hospital/index.php/api/ys/examination";
					var ajaxData = {
							token 	: H.getStorage('token'),
							action	: 'submit',
							data		:	JSON.stringify(arr)
					};

					$base.submit(address, ajaxData, function(ret) {
							console.log(JSON.stringify(ret));
							if(ret.status == 1){
										//提交成功
										H.setStorage('paperinfo',null);
										H.setStorage('questionindex',null);
										//关掉相关的窗口
										api.closeToWin({
												name: 'main'
										});
							}else{
										$base.toast('提交失败,请联系工程师解决这个问题');
							}
					}, function(err) {
							console.log(err);
					});
		}else{
				$base.toast('你有尚未填写的项目!')
		}
}

function submit_answer2(){
	for (da in vm.list) {
			for (item in vm.list[da].question) {
					// console.log(JSON.stringify(vm.list[da].question[item]));
					var temp = {
							paper_id: vm.list[da].question[item].paper_id,
							paperquestion_id: vm.list[da].question[item].id,
							user_answer: vm.list[da].question[item].useranswer,
							//是选择题就判断得分，不是选择题就默认零分
							score: ["5", "6", "8", "10"].indexOf > -1 ? 0 : (vm.list[da].question[item].useranswer == vm.list[da].question[item].answer ? vm.list[da].question[item].score : 0),
					};
					console.log(JSON.stringify(temp));
					// console.log(JSON.stringify(this.Answer));
					vm.Answer.push(temp);
			}
	}
	var address = "/Hospital/index.php/api/ys/examination";
	var token = H.getStorage('token');
	var ajaxData = {
			token: token,
			action: 'submit',
			data: vm.Answer,
	};
	$base.submit(address, ajaxData, function(ret) {
			if (ret.status == 1) {
					$base.toast(ret.errmsg);
					setTimeout(function() {
							api.closeWin({});
							api.sendEvent({
									name: 'kaoshi',
									extra: {
											hong: true
									}
							});
					}, 800)
			} else {
					$base.toast(ret.errmsg);
			}
	}, function(err) {
			console.log(JSON.stringify(err));
	});

}

function addscript() {
		var script= document.createElement('script');
		script.type= 'text/javascript';
		var ip =  H.getStorage("ip");
		script.src=ip+'./Hospital/index.php/api/config/index';
		$.getScript(script.src);
}
