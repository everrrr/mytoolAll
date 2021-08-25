

//加载地图,定义地图事件
var map
var dadian
var daxiaodian
var setPoint //停车场打点函数
var setPoint_road //道路打点
var setClickPoint //小点打点
loadJsComlete(function () {
    layer.load(2)
    map = initMap("mapdiv", {
        center: [120.590504, 31.305415],
        zoom: 10,
        logo: false,
        isKeyboardNavigation: true,
        showLabels: true,
    }); //初始化地图

    addtools(map, {
        backgroundColor: "red",
        fontColor: "blue",
        mapping: false,
    });

    map.setMapCursor("pointer");
    inputBoxSearch(map, "search_map", "search_btn", "close_btn"); //地图、搜索框inputID/搜索按钮ID、清空按钮ID
    //加载图层
    dadian = new GraphicsLayer()
    daxiaodian = new GraphicsLayer()
    map.addLayer(dadian)
    map.addLayer(daxiaodian)



    //停车场打点
    setPoint = function (url, img_name, type) {
        map.infoWindow.hide()
        let pngs = new PictureMarkerSymbol(img_name, 26, 26)
        //console.log(url)
        dadian.clear()
        daxiaodian.clear()
        publicAjaxRequest(url, "", type).done(function (res) {
            if (res.code == 200) {
                let data = res.data
                let loc
                //console.log(res)
                data.forEach(element => {
                    let queryId = {
                        qid: element.wybh
                    }
                    let point = new Point(element.jd, element.wd)
                    let pt_gh = new Graphic(point, pngs, queryId)
                    dadian.add(pt_gh)
                    map.setZoom(13)
                    layer.closeAll('loading')
                    loc = [element.jd, element.wd]
                })
                //console.log(loc)
                map.centerAt(loc)
            }
        })
    }





    //道路打点
    setPoint_road = function (url, type) {
        map.infoWindow.hide()
        let pngs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([230, 106, 207]), 1), new Color([230, 106, 207, 0.1]))
        dadian.clear()
        daxiaodian.clear()
        layer.load(2)
        publicAjaxRequest(url, "", type).done(function (res) {
            if (res.code == 200) {
                let data = res.data
                let dl_zb
                let loc
                data.forEach(element => {
                    dl_zb = JSON.parse(element.dl_zb)
                    let poly = new Polygon(dl_zb)
                    let pt_gh = new Graphic(poly, pngs)
                    dadian.add(pt_gh)
                    map.setZoom(13)
                    layer.closeAll('loading')
                    loc = dl_zb
                })
                map.centerAt(loc[0])

            }
        })

    }



    //小类点打点
    setClickPoint = function (id, imgName) {
        map.infoWindow.hide()
        let pngs = new PictureMarkerSymbol(imgName, 26, 26)
        //console.log(id)
        dadian.clear()
        daxiaodian.clear()
        let areaName = $('#select_data_box').find('option:selected').text()
        //let url = jsptPath + `/search/execute.action?apiId=ff20210803154725&param=${getNowDate(date_temp)},${areaName},(${id})`
        let url = jsptPath + `/search/execute.action`
        const param = {
            apiId: 'ff20210803154725',
            param: `${getNowDate(date_temp)},${areaName},(${id})`
        }
        publicAjaxRequest(url, param, 'GET').done(function (res) {
            //console.log(res)
            //let loc
            if (res.code == 200) {
                let data = res.data
                data.forEach(element => {
                    let queryId = {
                        qid: element.id
                    }
                    let point = new Point(element.lng, element.lat)
                    let pt_gh = new Graphic(point, pngs, queryId)
                    daxiaodian.add(pt_gh)
                    map.setZoom(13)
                    layer.closeAll('loading')
                    //loc = [element.lng, element.lat]
                })
                //map.centerAt(loc)
            } else {
                layer.msg('error:' + res.msg)
            }
        })
    }






    //点位点击事件
    dadian.on('click', function (e) {
        //console.log(e)
        map.infoWindow.hide()
        let id = e.graphic.attributes.qid
        let pot = [e.graphic.geometry.x, e.graphic.geometry.y]
        let str = ""
        let url = jsptPath + `/search/execute.action?apiId=ff20210803195429&param=${id}`
        publicAjaxRequest(url, "", 'GET').done(function (res) {
            if (res.code == 200) {
                //console.log('打点详情')
                //console.log(res)
                let data = res.data[0]
                //console.log(data)
                // "<ul class='pop_ul'><li>所属区域<span>" +
                //     formatStr(obj.cq) +
                //     "</span></li><li>地址:<span>" +
                //     formatStr(obj.dz)
                str = `
                    <ul id="layer_map">
                        <li>停车场编号:<span>${data.ssdt_tccbh}</span></li>
                        <li>停车场名字:<span>${data.ssdt_name}</span></li>
                        <li>所属城区:<span>${data.ssdt_sscq}</span></li>
                        <li>地址:<span>${data.ssdt_dz}</span></li>
                        <li>区镇:<span>${data.ssdt_qz}</span></li>
                        <li>地磁数:<span>${data.ssdt_dcs}</span></li>
                        <li>停车场描述:<span>${data.ssdt_tccms}</span></li>
                        <li>总车位:<span>${data.ssdt_czw}</span></li>
                        <li>剩余车位:<span>${data.ssdt_sycw}</span></li>
                        <li>停车场基础类型:<span>${data.ssdt_lx}</span></li>
                        <li>停车场子类型:<span>${data.ssdt_zlx}</span></li>
                    </ul>
                `
            } else {
                layer.msg(res.msg)
            }
            map.infoWindow.setTitle("详情");
            map.infoWindow.setContent(str);
            map.infoWindow.show(e.mapPoint);
            map.centerAt(pot)
        })
    })

    daxiaodian.on('click', function (e) {
        //console.log('测试ing')
        //console.log(e)
        let pot = [e.graphic.geometry.x, e.graphic.geometry.y]
        map.infoWindow.hide()
        let id = e.graphic.attributes.qid
        let str = ""
        let url = jsptPath + `/search/execute.action`
        const param = {
            apiId: 'ff20201020143618',
            param: id
        }
        publicAjaxRequest(url, param, 'GET').done(function (res) {
            if (res.code == 200) {
                //console.log('打点详情')
                //console.log(res)
                let data = res.data[0]
                //console.log(data)
                str = `
                    <ul id="layer_map">
                        <li>城区:<span>${data.cq}</span></li>
                        <li>编号:<span>${data.bh}</span></li>
                        <li>街道:<span>${data.jd}</span></li>
                        <li>事部件类型:<span>${data.sbj}</span></li>
                        <li>地址信息:<span>${data.dzxx}</span></li>
                        <li>案卷大类:<span>${data.dl}</span></li>
                        <li>案卷小类:<span>${data.xl}</span></li>
                        <li>立案时间:<span>${data.sbjbm}</span></li>
                        <li>社区编号:<span>${data.sq}</span></li>
                        <li>唯一编号:<span>${data.wybh}</span></li>
                        
                    </ul>
                `
            } else {
                layer.msg(res.msg)
            }
            map.infoWindow.setTitle("详情");
            map.infoWindow.setContent(str);
            map.infoWindow.show(e.mapPoint);
            map.centerAt(pot)
        })
    })
    //定义下拉事件
    // form.on('select(select_data_box_1)', function(data){
    //     console.log(1)
    //     dadian.clear()
    //     renderTableData()
    //     renderBaseData(platformPath + '/zdwtzxjd/getZdwtzxjdTyData', "POST")
    // })
    layer.closeAll('loading')
});






//给地图点位，增加详情信息
// $('.base_data .top_box .block_one').on('click', function () {

//     $(this).addClass('block_one_active')
//     $(this).siblings('.block_second').removeClass('block_second_active')
//     $(this).siblings('.block_third').removeClass('block_third_active')
//     $(this).siblings('.block_forth').removeClass('block_forth_active')


// })


// $('.base_data .top_box .block_second').on('click', function () {
//     $(this).addClass('block_second_active')
//     $(this).siblings('.block_one').removeClass('block_one_active')
//     $(this).siblings('.block_third').removeClass('block_third_active')
//     $(this).siblings('.block_forth').removeClass('block_forth_active')
// })



$('.base_data .top_box .block_third').on('click', function () {
    $(this).addClass('block_third_active')
    $(this).siblings('.block_second').removeClass('block_second_active')
    $(this).siblings('.block_one').removeClass('block_one_active')
    $(this).siblings('.block_forth').removeClass('block_forth_active')
    let areaName = $('#select_data_box').find('option:selected').text()

    let url = jsptPath + `/search/execute.action?apiId=ff20210227211650&param='${areaName}'`
    setPoint_road(url, 'GET')

})


$('.base_data .top_box .block_forth').on('click', function () {
    $(this).addClass('block_forth_active')
    $(this).siblings('.block_second').removeClass('block_second_active')
    $(this).siblings('.block_third').removeClass('block_third_active')
    $(this).siblings('.block_one').removeClass('block_one_active')
    let areaName = $('#select_data_box').find('option:selected').text()
    let url = jsptPath + `/search/execute.action?apiId=ff20210803165946&param=${areaName}`
    setPoint(url, './image/tcc_nav_1.png', "POST")

})





//搜索点击事件
$('#btn_getData').on('click', function () {
    renderTableData()
    renderBaseData(platformPath + '/zdwtzxjd/getZdwtzxjdTyData', "POST")
    let areaName = $('#select_data_box').find('option:selected').text()
    $('.block_one').removeClass('block_one_active')
    $('.block_forth').removeClass('block_forth_active')
    renderWorkSuggest(areaName, pageId)
    dadian.clear()
    daxiaodian.clear()
    map.setZoom(10)
})




//获得当前年，月，日范围日期
function getNowDate(time_str) {
    const nowTime = new Date() //获得当前日期对象
    let year = nowTime.getFullYear() //获得当前所在年份
    let month = nowTime.getMonth() + 1 //获得当前所在月份
    let day = nowTime.getDate() + 1 //获得当天在当月中的日期号
    if (day < 10) {
        day = `0${day}`
    }
    if (month < 10) {
        month = `0${month}`
    }
    let strYear = `${year}-01-01 00:00:00,${year}-12-31 23:59:59` //当年范围
    let strDay = `${year}-${month}-${day} 00:00:00,${year}-${month}-${day} 23:59:59` //当日范围
    //当月判断
    let LastDay = new Date(year, month, 0).getDate() //获得当月的最后以添
    let strMonth = `${year}-${month}-01 00:00:00,${year}-${month}-${LastDay} 23:59:59` //当日范围
    if (time_str == 'day') {
        return strDay
    } else if (time_str == 'month') {
        return strMonth
    } else if (time_str == 'year') {
        return strYear
    }
}




//数据表格渲染
function renderTableData() {
    getTableData(platformPath + '/zdwtzxjd/getZdwtzxjdTyData', '#table_data1', 'day', "POST")
    getTableData(platformPath + '/zdwtzxjd/getZdwtzxjdTyData', '#table_data2', 'month', "POST")
    getTableData(platformPath + '/zdwtzxjd/getZdwtzxjdTyData', '#table_data3', 'year', "POST")
}



//渲染基础数据选项
function renderBaseData(url, type) {
    let areaName = $('#select_data_box').find('option:selected').text()
    let param = {
        dataType: 2,
        name: '道路,停车场',
        sscq: areaName,
        timeType: "day"
    }
    publicAjaxRequest(url, param, type).done(function (res) {
        //console.log(res)
        let data = res.obj.maparea
        let datas = res.obj.datas
        if (res.code == 200) {
            $('#region_area').text(data.mj)
            $('#resident_population').text(data.rs)
            datas.forEach(element => {
                if (element.name == "道路") {
                    $('#road_data').text(element.cout)
                } else if (element.name == "停车场") {
                    $('#parking_lot').text(element.cout)
                }
            })
        }
    })
}






//基础数据底部表格渲染
function getTableData(url, elem, timeType, type) {
    let areaName = $('#select_data_box').find('option:selected').text()
    let param = {
        dataType: 0,
        name: '私搭乱建,机动车乱停放,非机动车乱停放',
        sscq: areaName,
        timeType: timeType
    }
    publicAjaxRequest(url, param, type).done(function (res) {

        let data = res.obj.datas
        let imgName = ""
        //console.log(res)
        if (res.code == 200) {
            let str = ""
            let idCode = ""
            data.forEach(element => {
                if (element.name == '私搭乱建') {
                    idCode = 21020101
                    imgName = './image/ldlj_nav_1.png'
                } else if (element.name == '机动车乱停放') {
                    idCode = 21020409
                    imgName = './image/jdcltf_nav_1.png'
                } else if (element.name == '非机动车乱停放') {
                    idCode = 21020410
                    imgName = './image/fjdcltf_nav_1.png'
                }
                str += `
                        <tr>
                            <td colspan="2">${element.name}</td>
                            <td colspan="1">${element.cout}</td>
                            <td colspan="2">${element.avgCout}</td>
                            <td colspan="1"><img src="./image/blue_nav.png" alt="" class="small_pot" onclick="setClickPoint(${idCode},'${imgName}')"></td>
                        </tr>
                        `

            })
            $(elem).find('table tbody').empty().append(str)

        }
    })

}


// test()
// function test() {
//     console.log(1111)
//     $.ajax({
//         url: jsptPath + `/search/execute.action?apiId=ff20201020143618&param=2059253`,
//         type: 'GET',
//         // url: platformPath + "/tAssessmentObj/getAssObjList",
//         // type: 'POST',
//         headers: {
//             Authorization: window.localStorage.getItem("token")
//         },
//         success: function (res) {
//             console.log('小类点')
//             console.log(res)
//         }
//     })
// }


$(".switching").on("click", ".shrink_btn", function () {
    let bs = $(this).attr("cid")
    if (bs == "0") {
        $(".Distributebtn").animate({
            width: "43px"
        }, 200);
        $(".shrink_btn").animate({
            marginLeft: "0"
        }, 200);
        $(".Distributebtn span").hide();
        $(this).attr("cid", "1")
    } else if (bs == "1") {
        $(".Distributebtn").animate({
            width: "80px"
        }, 200);
        $(".shrink_btn").animate({
            marginLeft: "-40px"
        }, 300);
        $(".Distributebtn span").show();
        $(this).attr("cid", "0")
    }
})


$(".Distributebtn").on("click", "span", function () {
    layer.open({
        type: 1, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: "派发",
        btn: ['派发', '取消'], //按钮
        area: ['60%', "auto"], //窗体尺寸
        content: $(".layer_pf"), //内容
        moveType: 1, //拖拽模式，0或者1
        shadeClose: false, //是否点击遮罩关闭
        resize: false, // 是否允许拉伸

        btn1: function () {

            let dispatchId = user.userId;
            let dispatchIdName = user.username;
            let receiveId = $(".bmry").attr("cid");

            let receiveIdName = $(".bmry").val();
            let taskDispatch = $(".pfyj").val();
            let taskName = $(".dcrwmc").val();
            let taskProposalContent = $(".pfgzjy").text();
            let zdId = $(".dclb").attr("cid");
            let data = {
                dispatchId: dispatchId,
                dispatchIdName: dispatchIdName,
                receiveId: receiveId,
                receiveIdName: receiveIdName,
                taskDispatch: taskDispatch,
                taskName: taskName,
                taskProposalContent: taskProposalContent,
                zdId: zdId

            }

            publicAjaxRequest(platformPath + "/dbInspectorTask/addDbInspectorTask", data, "POST").done(function (res) {
                if (res.code == 200) {
                    layer.msg(res.msg)
                    let xxx = setTimeout(function () {
                        layer.closeAll();
                    }, 1000);
                } else if (res.code == 500) {
                    layer.msg(res.msg)

                }
            })
            layer.closeAll();
        },
        btn2: function () {

            layer.closeAll();
        },
        success: function (layero, index) {
            let areaName = $('#select_data_box').find('option:selected').text()
            renderWorkSuggest(areaName, pageId)
            $(".dclb").text(pageName)
            $(".dclb").attr("cid", pageId);
        },
        end: function (layero, index) {
            $(".layer_pf").hide()
        }
    });

})
$(".editbtn").on("click", "span", function () {
    let areaName = $('#select_data_box').find('option:selected').text()
    layer.open({
        type: 1, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: "编辑",
        btn: ['确认', '取消'], //按钮
        area: ['40%', "auto"], //窗体尺寸
        content: $(".layer_bj"), //内容
        moveType: 1, //拖拽模式，0或者1
        shadeClose: false, //是否点击遮罩关闭
        resize: false, // 是否允许拉伸

        btn1: function () {
            const proposalContent = $('#editWorkSuggest').val()

            const url = platformPath + '/dbWorkProposal/updateDbWorkProposal'
            const param = {
                proposalContent: proposalContent,
                sscq: areaName,
                zdId: pageId //有序

            }
            publicAjaxRequest(url, param, 'POST').done(function (res) {
                if (res.code == 200) {
                    layer.msg('编辑成功')

                } else {
                    layer.msg('编辑失败')
                }
            })
            let xxx = setTimeout(function () {
                layer.closeAll();
            }, 1000);
        },
        btn2: function () {

            layer.closeAll();
        },
        success: function (layero, index) {
            renderWorkSuggest(areaName, pageId)


        },
        end: function (layero, index) {
            $(".layer_bj").hide()
            renderWorkSuggest(areaName, pageId)
        }
    });

})
// var map;
// loadJsComlete(function () {
//     map = initMap("mapdiv", {
//         center: [120.590504, 31.305415],
//         zoom: 10,
//         logo: false,
//         isKeyboardNavigation: true,
//         showLabels: true,
//     }); //初始化地图

//     addtools(map, {
//         backgroundColor: "red",
//         fontColor: "blue",
//         mapping: false,
//     });
//     map.setMapCursor("pointer");
//     inputBoxSearch(map, "search_map", "search_btn", "close_btn"); //地图、搜索框inputID/搜索按钮ID、清空按钮ID



//     $(".public-btn-date1").on("click", "li", function () {
//         $(this).addClass("active").siblings().removeClass("active");
//     })



// });





//工作建议渲染
function renderWorkSuggest(cityArea, ID, cot) {

    const url = platformPath + '/dbWorkProposal/selectDbWorkProposal'
    const param = {
        sscq: cityArea,
        zdId: ID //有序
    }
    publicAjaxRequest(url, param, 'GET').done(function (res) {
        if (res.code == 200) {
            let obj = res.obj
            //console.log("pageID:" + ID)
            //console.log(res)

            var dom = `<div class="caselink" >
                        ${obj == null ? "无" : obj.proposalContent}
                    </div>`;
            
            $(".textArea").html(dom)
            $(".contents").textSlideUp('reload');
  
           

            


            //$('#work_suggest').text(obj.proposalContent)
            $('#workSuggest_data').text(obj == null ? "无" : obj.proposalContent)
            $('#editWorkSuggest').text(obj == null ? "无" : obj.proposalContent)



        } else {
            //layer.msg("报错:" + res.msg)
            //console.log('pageId')
            //console.log(pageId)
        }
    })
}



let ids = []
get_ztreePople();
$("#select_id").click(function () {
    console.log('tree1')
    layer.open({
        type: 1, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: "选择账号",
        content: $(".ztree-selectid"), //内容
        moveType: 1, //拖拽模式，0或者1
        shadeClose: false, //是否点击遮罩关闭
        resize: false, // 是否允许拉伸
        area: ['400px', '500px'],
        btn: ["确认", "取消"], //按钮
        btn1: function (index) {

            $(".bmry").val(selectUsername)
            $(".bmry").attr("cid", selectUserId)
            //console.log($(".bmry").attr("cid"))
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);
        },

    });
});



function get_ztreePople() {
    console.log('tree')
    $(document).ready(function () {
        // 渲染树
        tree.loadRootNode();
    });
}

let selectUsername = null;
let selectUserId = null
console.log($("#treeDemo"))
var tree = {
    zTree: '',
    pNode: '',
    setting: {
        isSimpleData: true,
        treeNodeKey: "id",
        treeNodeParentKey: "pid",

        view: {
            showLine: false,
            showIcon: false
        },
        callback: { //回调函数
            /**
             * event:鼠标事件
             * treeId：树的容器id
             * treeNode：当前点击的节点
             */
            onExpand: function (event, treeId, treeNode) {
                tree.pNode = treeNode;
                tree.loadNodeByPNode();
            },
            onClick: zTreeOnClick,
        },
        check: {
            enable: false, //是否显示单选框/复选框
            chkStyle: "radio", //勾选框类型(checkbox 或 radio）
            radioType: "all" //勾选级 level：同一级内 ; all：整棵树内
        },
    },
    /**
     * 一般情况下，如果一段代码中要用到一个变量
     * 而这个变量的值是在回调函数中赋值的
     * 这个时候要保证使用这个变量的时候回调函数已经执行了
     */
    loadRootNode: function () { //加载根节点,pid=0
        var zNodes = [];
        var parameter = {
            pid: 0
        };
        $.ajax({
            url: ffbasezgfPath + '/t-sys-department/queryDepartmentUser?id=0',
            type: "get",
            headers: {
                "Authorization": "d4813b28-490d-4df6-b301-69cfdb1cc5ed"
            },
            success: function (data) {
                $.each(data.obj, function (i, item) {
                    var html = {
                        id: item.id,
                        pid: item.pId,
                        name: item.name,
                        open: false,
                        noR: true,
                        isParent: item.isParent,
                        nocheck: true,
                        parent: true,
                        checked: false
                    };
                    // html.children= ajaxChild(item.key);
                    zNodes[i] = html;

                });

                $.fn.zTree.init($("#treeDemo"), tree.setting, zNodes);
                tree.zTree = $.fn.zTree.getZTreeObj("treeDemo");
            },
        })
    },

    //点击该节点，加载该节点的子节点
    /**
     * 该方法是点击父节点的+号后执行的，意味着执行该方法的时候树已经生成了
     * 所以才能用tree.zTree
     */
    loadNodeByPNode: function () {
        var children = [];
        var folder = false;
        if (ids.indexOf(tree.pNode.id) != -1) {
            return;
        }
        ids.push(tree.pNode.id);
        $.ajax({
            url: ffbasezgfPath + '/t-sys-department/queryDepartmentUser?id=' + tree.pNode.id,
            type: "get",
            headers: {
                "Authorization": "d4813b28-490d-4df6-b301-69cfdb1cc5ed"
            },
            success: function (data) {
                $.each(data.obj, function (o, item2) {
                    var html2 = {
                        id: item2.id,
                        pid: item2.pid,
                        name: item2.name,
                        nocheck: item2.isParent,
                        isParent: item2.isParent,
                    };
                    folder = item2.isParent;
                    children[o] = html2;

                });
                tree.zTree.addNodes(tree.pNode, children, folder);
            },
        })
    }
};

function zTreeOnClick(event, treeId, treeNode) {
    if (treeNode.isParent == true) {
        $(".curSelectedNode").removeClass("curSelectedNode");
    } else {
        selectUsername = treeNode.name;
        selectUserId = treeNode.id;

    }
};