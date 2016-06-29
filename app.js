
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
        this.init(form)
    }

    validator.prototype = {

        init:function(opts){
            if(typeof opts == 'undefined') return this
            var self = this, form = document.forms[opts]
            addEvent(form, 'submit', function(e){
                preventDefault(e)
                validateAll.call(self, self.options)

            })
        },
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
        changeFn = changeHandler.call(this, opts)
        addEvent(el, 'input', inputFn)
        addEvent(el, 'change', changeFn)
    }
    function inputHandler(opts){
        return function(){
            validate.call(this,opts)
        }
    }
    function changeHandler(opts){
        return function(){
            validate.call(this,opts)
        }
    }

    //验证所有
    function validateAll(options){
        for(var i = 0, len = options.length; i < len; i++){
            validate.call(this, options[i])
        }
    }
    //验证
    function validate(opts){
        var el = this.form[opts.name], reg = '', valiFn = opts.valiFn, defaultValue = el.getAttribute('placeholder')
        if(el.value === defaultValue){ el.value = '' }
        if(opts.rules){
            for(var i = 0; i< opts.rules.length; i++){
                var valiReg = true, valiStr = true;
                if(typeof opts.rules[i] != 'string'){
                    valiReg = validateReg(el, opts.rules[i])

                }else{
                    valiStr = validateString(el, opts.rules[i])
                }

                if(!valiReg || !valiStr){
                    insertMessage(el, opts.message[i])
                    return          //遇到错误就返回一定要返回，不然很可能其他条件通过，将错误信息删除了
                }
                if(valiReg && valiReg){
                    removeMessage(el)
                }
            }
        }else if(opts.sameTo){
            var selfValue = el.value
            var targetValue = this.form[opts.sameTo].value
            if(selfValue !== targetValue){
                insertMessage(el, opts.message[0])
            }else{
                removeMessage(el)
            }

        }
    }



    function validateReg(el, rule){
        return rule.test(el.value)
    }

    function validateString(el, rule){

        var result;
        var ruleArr = /(\w+)/ig.exec(rule);


        //不带参数的规则处理
        if(ruleArr[1] === ruleArr.input){
            result = regItem[ruleArr.input](el);

        }else{
            //带参数的规则处理，如：maxLength
            ruleArr = /(\w+)\((\d+)/ig.exec(rule);
            result = regItem[ruleArr[1]](el, ruleArr[2]);
        }

        return result
    }

    function insertMessage(el, message){
        var errorEle = document.createElement('span')
        var parent = el.parentNode ;
        var nodeEles = parent.getElementsByTagName('span')
        errorEle.className = 'errorMessage ' + el.name + '_errorMessage'

        if(nodeEles.length != 0){
            for(var i = 0; i<nodeEles.length; i++){
                if(!hasClass(nodeEles[i], 'errorMessage')){
                    insertAfter(el, errorEle)
                }
            }

        }else{
            insertAfter(el, errorEle)
        }
        parent.getElementsByClassName('errorMessage')[0].innerHTML = message;

    }

    function removeMessage(el){
        var parent = el.parentNode;
        var errorEle = parent.getElementsByClassName('errorMessage')[0];
        if(errorEle){
            parent.removeChild(errorEle)
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

    function hasClass(el, oClass){
        oClass = ' ' + oClass + ' '
        return (' ' + el.className + ' ').indexOf(oClass) > -1
    }

    function insertAfter(el, errorEle){
        if(el.nextSibling){
            el.parentNode.insertBefore(errorEle, el.nextSibling)
        }else{
            el.parentNode.appendChild(errorEle)
        }
    }

    function preventDefault(e){
        e = e || window.event
        if(e.preventDefault){
            e.preventDefault()
        }else{
            e.returnValue = false
        }
    }


})(window);




var a = new validator('myForm')

a.add({
    name:'password',
    rules:['required',/\d+/,'minLength(5)'],
    message:['必须填','必须为数字','太短']
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
    message:['对不起，您填写的E-mail格式不正确！']
}).add({
    name:'sure',
    rules:['required'],
    message:['这项必须选']
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
