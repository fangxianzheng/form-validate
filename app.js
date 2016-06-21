
(function(win){

    var Fvalidate = function(formId, arr){

        this.myForm = document.getElementById(formId);
        this.resultErrorMessage = [];
        this.arr = arr;
        this.allErrorRules = {};
        this.allErrorMessages = {};
        this.testHook = {
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

        };
        this.verification(this.arr);
    };

    Fvalidate.prototype = {
        verification: function(arr){

            //循环出每个input的验证详细信息
            for(var i = 0, j = arr.length; i < j; i++){

                var inputName = arr[i].name;
                var inputRules = arr[i].rules;
                var inputMessages = arr[i].messages;
                var inputIgnore = arr[i].ignore;



                //循环出每条验证规则
                for(var k = 0; k < inputRules.length; k++){

                    var result;
                    var inputEle = this.myForm[inputName];
                    //当规则不是字符串(是正则)时
                    if(typeof inputRules[k] != 'string'){
                        result = inputRules[k].test(inputEle.value);
                        if(!result){
                            this.allErrorRules[inputName] = this.allErrorRules[inputName] || [];
                            this.allErrorRules[inputName].push(inputRules[k]);
                            this.allErrorMessages[inputName] = this.allErrorMessages[inputName] || [];
                            this.allErrorMessages[inputName].push(inputMessages[k]);
                        }
                    }else{       //当规则是字符串时

                        var ruleArr = /(\w+)/ig.exec(inputRules[k]);
                        //不带参数
                        if(ruleArr[1] === ruleArr.input){
                            result = this.testHook[ruleArr.input](inputEle);
                            if(!result){
                                this.allErrorRules[inputName] = this.allErrorRules[inputName] || [];
                                this.allErrorRules[inputName].push(inputRules[k]);
                                this.allErrorMessages[inputName] = this.allErrorMessages[inputName] || [];
                                this.allErrorMessages[inputName].push(inputMessages[k]);
                            }
                        }else{
                            //带参数的规则处理，如：maxLength
                            ruleArr = /(\w+)\((\d+)/ig.exec(inputRules[k]);
                            result = this.testHook[ruleArr[1]](inputEle, ruleArr[2]);
                            if(!result){
                                this.allErrorRules[inputName] = this.allErrorRules[inputName] || [];
                                this.allErrorRules[inputName].push(inputRules[k]);
                                this.allErrorMessages[inputName] = this.allErrorMessages[inputName] || [];
                                this.allErrorMessages[inputName].push(inputMessages[k]);
                            }
                        }
                    }

                }
            }

            console.log(this.allErrorRules)
            console.log(this.allErrorMessages)




/*            var inputEle = this.myForm[name] || '';

            //存放取到的验证规则和方法
            var allRule = [], allMessage = [], errorRule=[], errorMessage=[], oneValid;

            //如果input元素不存在，停止验证
            if(inputEle === ''){
                return ;
            }

            //循环出验证规则和信息
            for(var i=0; i < obj.rules.length; i++){
                allRule[i] = obj.rules[i];
                allMessage[i] = obj.messages[i];
                var result;

                //当规则不是字符串(是正则)时
                if(typeof allRule[i] != 'string'){
                    result =  allRule[i].test(inputEle.value);
                    if(result === false){
                        errorRule.push(allRule[i]);
                        errorMessage.push(allMessage[i]);

                    }
                }else{     //当规则不是正则时

                    var ruleArr = /(\w+)/ig.exec(allRule[i]);

                    //不带参数的规则处理
                    if(ruleArr[1] === ruleArr.input){
                         result = this.testHook[ruleArr.input](inputEle);
                         if(result === false){
                             errorRule.push(allRule[i]);
                             errorMessage.push(allMessage[i]);
                         }

                    }else{
                        //带参数的规则处理，如：maxLength
                        ruleArr = /(\w+)\((\d+)/ig.exec(allRule[i]);
                        result = this.testHook[ruleArr[1]](inputEle, ruleArr[2]);
                        if(result === false){
                            errorRule.push(allRule[i]);
                            errorMessage.push(allMessage[i]);
                        }
                    }

                }

            }

            //只选择一条错误信息推到全局验证

            oneValid = errorMessage.length === 0;

            if(!oneValid){
                this.resultErrorMessage.push(errorMessage[0])
            }

            //创建错误信息元素
            var errorEle = document.createElement('span');
            errorEle.className = 'errorMessage ' + name + '_errorMessage';
            if(!oneValid){
                errorEle.innerHTML = errorMessage[0];
            }


            //默认将错误元素插入input后面
            if(inputEle.nextSibling){
                inputEle.parentNode.insertBefore(errorEle,inputEle.nextSibling)
            }else{
                inputEle.parentNode.appendChild(errorEle)
            }

            //运行回调函数，将对应元素和它的错误信息传入，以便可以修改默认样式或增添样式
            callback(inputEle, errorEle, oneValid)*/

        }

    };

    return win.Fvalidate = Fvalidate;

})(window, undefined);





var o = new Fvalidate('myForm',[{
    name:'user',
    rules: ['required',/^[\u4e00-\u9fa5]+$/i],
    messages:  ['这项必须填','必须为中文'],
    callback:function(){},
    ignore:false
},{
    name:'sure',
    rules: ['required'],
    messages:  ['这项必须填'],
    callback:function(){},
    ignore:false
},{
    name:'mobile',
    rules: ['required','maxLength(11)','minLength(5)'],
    messages:  ['这项必须填','手机号超过最大长度','长度太短'],
    callback:function(){},
    ignore:false
}])



/*
o.verification ('user', {
    rules: ['required',/^[\u4e00-\u9fa5]+$/i],
    messages:  ['这项必须填','必须为中文']
},function(ele, errorEle, oneValid){
    ele.style.borderBottomColor = 'red'
    errorEle.style.color = 'red';
});
*/


/*o.verification ('sure', {
    rules: ['required'],
    messages:  ['这项必须填']
},function(){

});

o.verification ('mobile', {
    rules: ['required','maxLength(11)','minLength(5)'],
    messages:  ['这项必须填','手机号超过最大长度','长度太短']
},function(ele, errorEle, valid){
    if(!valid){
        ele.style.borderBottomColor = 'red';
        errorEle.style.color = 'red';
    }
});*/














