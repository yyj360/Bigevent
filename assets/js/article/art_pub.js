$(function() {
    var layer = layui.layer
    var form = layui.form

    //封装一个函数,获取下拉列表信息
    initCade()

    function initCade() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败!')
                }
                layer.msg('获取数据成功!')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)

    //绑定选择封面 跳出选择文件
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        //给选择文件绑定change事件
    $('#coverFile').on('change', function(e) {
        var files = this.files
        if (files.length === 0) {
            return
        }
        //重新渲染裁剪区域(更换图片)
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
    })
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 给表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
            e.preventDefault()
            var fd = new FormData(this)
            fd.append('state', art_state)
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                }).toBlob(function(blob) {
                    fd.append('cover_img', blob)
                    publishArticle(fd)
                })

        })
        //封装一个调接口的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg(res.message, function() {
                    location.href = 'art_list.html'
                })
            }
        })
    }
})