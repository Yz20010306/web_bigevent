$(function () {
  // console.log(1);
  // 导入layui方法
  var layer = layui.layer;
  var form = layui.form;

  // 调用方法
  initCate();
  // 初始化富文本编辑器
  initEditor();
  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: "get",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章类别失败");
        }
        console.log(1);
        // 调用模板引擎
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 一定得调用 重新渲染
        form.render();
      },
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //选择封面
  $("#btnChoseImage").on("click", function () {
    $("#coverFile").click();
  });
  // 监听coverFile  change事件
  $("#coverFile").on("change", function (e) {
    // e.preventDefault();
    // 获取到文件的列表数组
    var file = e.target.files[0];
    if (file.length === 0) {
      return;
    }
    // 根据文件创建url地址
    var newImgURL = URL.createObjectURL(file);
    // 为裁剪区重新设置图片
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 文件状态
  var art_state = "已发布";
  // 为存为草稿按钮绑定点击事件
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });
  // 为表单绑定submit提交事件
  $("#form-pub").on("submit", function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    //基于form表单 快速创建对象
    var fd = new FormData($(this)[0]);
    fd.forEach(function (v,k){
      console.log(k,v);
    })
    // console.log(fd);
    fd.append("state", art_state);
    // 将封面裁剪过后的图片输出为文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //   将文件存储到fd中
        fd.append("cover_img", blob);
        //   发起ajax请求
        publishArticl(fd);
      });
  });
    function publishArticl(fd){
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData:false,
            success:function (res){
                if (res.status!==0) {
                    return layer.msg("失败");
                }
              layer.msg('成功');
              
                location.href = '/article/arr_list.html';
            }
        })
    }
});
