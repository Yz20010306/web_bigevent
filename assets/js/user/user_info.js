$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称需要在1-6位之间";
      }
    },
  });
  iniUserInfo();
  // 初始化用户的基本信息
  function iniUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败!");
        }
        //   console.log(res);
          form.val("formUserInfo",res.data)
      },
    });
    }
    // 重置表单的数据
    $("#btnReset").on('click',function (e){
        // 阻止默认重置事件
        e.preventDefault();
        iniUserInfo();
    })
    // 监听表单的提交事件
    $(".layui-form").on("submit",function (e){
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success:function (res){
                    if (res.status!==0) {
                        return layer.msg('更新用户信息失败!')
                }
                layer.msg("更新用户信息成功")
                // 调用父页面里的方法
                window.parent.getuserInfo()
            }
        })
    })
});
