$(function() {
    load();

    $("#title").on("keyup", function (e) {
        // 如果按下回车且值不为空
        if (e.keyCode === 13 && $("input").val() !== "") {
            // 储存数据
            setData($("input").val());
            $("input").val('');
        }
    })

    // 完成 todo
    $("ol,ul").on("click", "input", function () {
        var index = $(this).siblings("a").attr("id");
        var list = getData();
        list[index].done = $(this).prop("checked");
        localStorage.setItem("todolist", JSON.stringify(list));
        load();
    })

    // 删除单个
    $("ol,ul").on("click", "a", function () {
        var list = getData();
        var index = $(this).attr("id");
        list.splice(index, 1);
        localStorage.setItem("todolist", JSON.stringify(list));
        load();
    })

    // 清除全部
    $("footer a").on("click", function () {
        localStorage.clear();
        load();
    })

    // 编辑事项内容
    $("ol,ul").on("dblclick", "p", function () {
        var str = $(this).html();
        $(this).html("<input type='text' value='" + str + "'></input>")
                .children("input").select();
        $(this).children("input").on("blur", function () {
            var upstr = $(this).val();
            var data = getData();
            var index = $(this).parents("p").siblings("a").attr("id");
            data[index].title = upstr;
            localStorage.setItem("todolist", JSON.stringify(data));
            load();
        })
        $(this).children("input").on("keyup", function (e) {
            if (e.keyCode === 13) {
                $(this).blur();
            }
        })
    })

    // 渲染页面
    function load () {
        var todoC = 0,doneC = 0;
        $("#todolist,#donelist").html('');
        var list = getData();
        $.each(list, function (i, val) {
            if(val.done) {
                doneC++;
                $("#donelist").prepend("<li><input id='check' type='checkbox' checked><p>" + val.title + "</p><a id='" + i + "' href='javascript:;'>删除</a></li>");
            } else {
                todoC++;
                $("#todolist").prepend("<li><input id='check' type='checkbox'><p>" + val.title + "</p><a id='" + i + "' href='javascript:;'>删除</a></li>");
            }
        })
        $("#todocount").html(todoC + " 个");
        $("#donecount").html(doneC + " 个");
    }

    // 获取 todolist
    function getData () {
        var data = localStorage.getItem("todolist");
        if(data !== null) {
            return JSON.parse(data);
        } else {
            return [];
        }
    }
    // 储存 todolist
    function setData (title) {
        var data = localStorage.getItem("todolist");
        if(data !== null && title) {
            var todolist = JSON.parse(data);
            todolist.push({title: title,done: false});
            localStorage.setItem("todolist", JSON.stringify(todolist));
        } else if(title) {
            data = JSON.stringify([{title: title,done: false}]);
            localStorage.setItem("todolist", data);
        }
        load();
    }


    // 天气预报模块

    AMap.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch()
        citySearch.getLocalCity(function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息
            var city = result.city;
            url = 'http://wthrcdn.etouch.cn/weather_mini?city=' + city;
            $.ajax({
                url: url,
                method: 'GET',
                success: function(res) {
                    var list = JSON.parse(res).data.forecast;
                    $.each(list, function (i, val) {
                        $("#weather").append('<div><div class="boxItems"><p>'+val.date.replace('星期', '周')+'</p><h3>'+val.type+'</h3><h4>'+val.high.substr(2,4)+' / '+val.low.substr(2,4)+'</h4></div></div>');
                    })
                    $("#weather div").first().find("p").html("今天");
                }
            })
          }
        })
    })

    // 响应头没有 Access-Control-Allow-Origin ，放弃
    // 获取经纬度
    /* var longi, lati, url, list;
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {  
                longi = position.coords.longitude;
                lati = position.coords.latitude;
                url = 'https://api.caiyunapp.com/v2.5/5eyJftwYzMcK52KY/' + longi + ',' + lati + '/daily?dailysteps=7';
                // console.log(url);
                $.get(url, function (res) {
                    list = res.reslut.daily.temperature;
                    $.each(list, function (i, val) {
                        $("#weather").append('<div><div class="boxItems"><p>'+val.date+'</p><h3>'+val.avg+'</h3><h4>'+val.max+'° / '+val.min+'°</h4></div></div>');
                    })
                    console.log(list)
                })
            },
            function (e) {
               throw(e.message);
            }
        )
    } else {
        url = 'http://wthrcdn.etouch.cn/weather_mini?city=' + shengfen;
        $.ajax({
            url: url,
            method: 'GET',
            success: function(res) {
              //list = res.data.data.forecast;
              console.log(res);
            }
        })
    } */
})