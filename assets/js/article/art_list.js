$(function() {
    var layer = layui.layer
    var form = layui.form

    //定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义查询参数对象
    var q = {
            pagenum: 1,
            pagesize: 2,
            cate_id: '',
            state: ''
        }
        //1- 封装一个函数,获取列表信息
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //渲染表单
                renderPage(res.total)
            }
        })
    }
    //封装一个函数,获取下拉列表信息
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //2-筛选功能(老一套)
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //收集数据
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 修改参数对象
        q.cate_id = cate_id;
        q.state = state
            // 调接口
        initTable()
    })

    //数据列表分页功能
    function renderPage(total) {
        layui.laypage.render({
            elem: 'pageBox',
            count: total, // 总的条数
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum, // 当前页的页码
            limits: [2, 4, 6, 8, 10],
            layout: ['count', 'limit', 'page', 'prev', 'next', 'skip'],
            //解决死循环bag
            jump: function(obj, first) {
                if (first === true) {
                    return
                }
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                initTable()
            }
        })
    }

    //做删除功能
    $('body').on('click', '.btn-delete', function() {
        //获取删除按钮的个数
        var len = $('.btn-delete').length
            //获取分类的id
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除此文章吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        })
    })
})