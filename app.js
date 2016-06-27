
;(function(win, undefined){

    var validator = function(form){
        this.form = document.forms[form]
        this.items = []
        this.options = []
    }

    validator.prototype = {
        add: function(opts){
            this.items.push(opts.name)
            this.options.push(opts)
            bindHandlers.call(this,opts)
            return this
        }
    }

    win.validator = validator


    /****************私有方法**********************************/

    //绑定验证事件
    function bindHandlers(opts){
        var el = this.form[opts.name], theSame
        if(opts.sameTo){ theSame = this.form[opts.sameTo]}
        inputFn = inputHandler.call(this,opts)

    }
    function inputHandler(opts){
        return function(){
            validate.call(this,opts)
        }
    }
    //验证
    function validate(opts){
        var el = this.form[opts.name], reg = '', valiFn = opts.valiFn, defaultValue = el.getAttribute('placeholder')
        if(el.value === defaultValue){ el.value = '' }
        if(opts.rule){

        }
    }


})(window);




var a = new validator('myForm')

a.add({
    name:'password',
    rule:/^[a-zA-Z0-9\_\-\~\!\%\*\@\#\$\&\.\(\)\[\]\{\}\<\>\?\\\/\'\"]{3,20}$/,
    tips:'请输入可以联系到您的手机号码！',
    error:'对不起，您填写的手机号码格式不正确！'
}).add({
    name:'confirm-password',
    rule:/^[a-zA-Z0-9\_\-\~\!\%\*\@\#\$\&\.\(\)\[\]\{\}\<\>\?\\\/\'\"]{3,20}$/,
    sameTo:'password',
    error:'你填写的密码不正确或者和原密码不同'
}).add({
    name:'mobile',
    rule:/^[1-9]\d{10}$/,
    tips:'请输入可以联系到您的手机号码！',
    error:'对不起，您填写的手机号码格式不正确！'
}).add({
    name:'email',
    rule:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    tips:'请输入您常用的E-mail邮箱号，以便我们联系您，为您提供更好的服务！',
    error:'对不起，您填写的E-mail格式不正确！正确的格式：yourname@gmail.com。'
})







/*
* opts.beforeSubmit
* opts.target
* opts.sameTo
*opts.beforeFocus
*opts.beforeBlur
*opts.afterBlur
*opts.afterChange
*opts.onkeypress
*opts.action
*opts.rule_type
*opts.rule
*
*
* */