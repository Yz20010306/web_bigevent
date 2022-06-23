$(function () {
  var layer = layui.layer;
  var form = layui.form;
  inintArtCateList();
  // 获取文章列表
  function inintArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        console.log(res);
        var htmlStr = template("tpl_table", res);
        $("tbody").html(htmlStr);
      },
    });
  }
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "300px"],
      title: "添加文章类别",
      content: $("#dialog-add").html(),
    });
  });

  $("body").on("submit", "#form_add", function (e) {
    e.preventDefault();
    // console.log(1);
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增分类失败");
        }
        inintArtCateList();
        layer.msg("新增分类成功");
        layer.close(indexAdd);
      },
    });
  });
  var indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    // console.log(1);
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "300px"],
      title: "修改文章类别",
      content: $("#dialog-edit").html(),
    });

    var id = $(this).attr("btn-id");
    //   console.log(id);
    $.ajax({
      method: "get",
      url: "/my/article/cates/" + id,
      success: function (res) {
        // console.log(res);
        form.val("form-edit", res.data);
      },
    });
  });

  // 通过代理的形式绑定submit事件
  $("body").on("submit", "#form_edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "post",
      url: "/my/article/updatecate",
      data: $(this).serialize(),

      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("更新分类信息失败");
        }
        layer.msg("更新分类成功");
        layer.close(indexEdit);
        inintArtCateList();
      },
    });
  });

  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("btn-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "get",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("失败");
          }
          layer.msg("成功");
            layer.close(index);
            inintArtCateList();
        },
      });
    });
  });
});
