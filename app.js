
;(function(win, undefined){

    var regItem = {
        // 是否为必填
        required: function(field) {
            var value = field.value;

            //判断是不是单选框，多选框的可能
            if(field.type === 'checkbox' || field.type === 'radio'){
                return field.checked === true;
            }
            return value !== null && value !== '';
        },
        maxLength: function(field, length){
            var value = field.value;
            return value.length <= length;
        },
        minLength: function(field, length){
            var value = field.value;
            return value.length >= length;
        }

    }
    var inputFn;

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
        addEvent(el, 'input', inputFn)

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
        if(opts.rules){
            for(var i = 0; i< opts.rules.length; i++){
                if(typeof opts.rules[i] != 'string'){
                    validateReg(el, opts.rules[i])
                }else{
                    validateString(el, opts.rules[i])
                }
            }
        }else if(opts.sameTo){

        }
    }

    function validateReg(el, rule){
      //console.log(rule.test(el.value))
    }

    function validateString(el, rule){

        var result;
        var ruleArr = /(\w+)/ig.exec(rule);


        //不带参数的规则处理
        if(ruleArr[1] === ruleArr.input){
            result = regItem[ruleArr.input](rule);

            if(result === false){

            }

        }else{
            //带参数的规则处理，如：maxLength
            ruleArr = /(\w+)\((\d+)/ig.exec(rule);
            result = regItem[ruleArr[1]](el, ruleArr[2]);
            if(result === false){

            }
        }
    }



    /*******工具函数******************************************/
    function addEvent(el, type, fn){
        if(typeof el.addEventListener != 'undefined'){
            el.addEventListener(type, fn, false)
        }else if(typeof el.attachEvent != 'undefined'){
            el.attachEvent('on' + type, fn);
        }else{
            el['on' + type] = fn
        }
    }


})(window);




var a = new validator('myForm')

a.add({
    name:'password',
    rules:[/\d+/,'minLength(5)','required'],
    message:['必须为数字','太短']
}).add({
    name:'confirm-password',
    sameTo:'password',
    message:['密码必须保持一致']
}).add({
    name:'mobile',
    rules:[/^[1-9]\d{10}$/],
    message:['手机号输入错误']
}).add({
    name:'email',
    rules:[/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/],
    message:['对不起，您填写的E-mail格式不正确！正确的格式：yourname@gmail.com。']
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