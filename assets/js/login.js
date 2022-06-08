$(function () {
    // 点击去注册账号的链接
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    });

    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 校验两次密码是否一样
        repwd: function (value) {
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码不一致";
            }
        },
    });

    // 监听注册表单的时间
    $("#form_reg").on("submit", function (e) {
        // 阻止默认行为
        e.preventDefault();
        $.post(
            "/api/reguser",
            {
                username: $("#form_reg [name=username]").val(),
                password: $("#form_reg [name=password]").val(),
            },
            function (res) {
                if (res.status!==0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 模拟人的点击行为
                $("#link_login").click();
             }
        );
    });
    // 监听点击登录事件
    $("#form_login").submit(function (e){
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(), 
            success:function (res){
                if (res.status!==0) {
                    return layer.msg('登录失败!')
                }
                layer.msg("登录成功!")
                // console.log(1);
                // 将登录成功后的字符保存
                localStorage.setItem("token", res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
});
