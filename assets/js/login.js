$(function() {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击去登录的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    //从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer
        //通过 form.varify() 函数自定义效验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        repwd: function(value) {
            var pwd = $('.reg-box [name = password]').val()
            if (pwd !== value) {
                return '两次密码不一致!'
            }
        }
    })

    //监听注册表单事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.post('/api/reguser', {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功,请登录!')
                //模拟默认点击
            $('#link_login').click()
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        //阻止表单默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(), //收集数据
            success: function(res) {
                console.log(res.status);
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                    // console.log(res.token)
                localStorage.setItem('token', res.token)
                    //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})