# form-validate
form-validate表单验证

## 简介

表单验证插件，无任何依赖

## 外观

截图几乎没有任何样式，外观请自己写，本插件只实现各个功能
![截图]()

## 示例

![扫一扫]()
[表单验证实例](https://fangxianzheng.github.io/demo/FDatetime-HZC/demo1)

## 依赖

无依赖

## 使用方法

在页面中引入所需的文件

`<script src="form-validate.js"></script>`

````
  var ooo = new validator('myForm')

        ooo.add({
            name:'user',
            rules:['required',/^[\u2E80-\u9FFF]+$/,'maxLength(4)'],
            message:['这项必须填','必须是中文','最长不能超过4位'],
            callback:function(el, errorEl){
                //document.getElementsByTagName('body')[0].appendChild(errorEl)
            }
        }).add({
            name:'password',
            rules:['required',/\d+/,'minLength(5)'],
            message:['必须填','必须为数字','太短'],
            callback:function(el, errorEl){
                errorEl.style.cssText = 'color:red;'

            }
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
        ooo.remove('email')
        ooo.add({
            name:'email',
            rules:[/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/],
            message:['对不起，您填写的E-mail格式不正确！']
        })

        document.getElementById('submit').addEventListener('click',function(){
            console.log(ooo.valid)
        })
````

## 文档

### 初始化

` var ooo = new validator(form)` 这样就实例化了一个对象`ooo`
`form` 为form 的ID或name.

### 暴露的方法

#### `.add(object)` 添加验证项

核心方法，参数`object` 为一个对象，具体属性和方法如下表

|       参数        |   说明   |  默认值 |      可填值     |
|------------------|----------|--------|----------------|
| name              |  需要验证的表单项 | 无 （必填）    | 一个input的name活id值  |
| rules               | 验证的规则    | 无（必填）     | 一个数组，数组内容为'required','maxLength(number)','minLength(number)',或正则     |
| message            | 错误信息 |  无（必填   | 一个数组，数组提示文字对应rules中的规则   |
| callback      | 验证后的回调函数   | function(el, errorEl)） | 代码块，回调函数中的两个参数分别是验证项的元素、错误信息元素 |
| sameTo        | 和哪一项内容相同，一般用于确认密码的input   | 无 | 一个验证项的id或name， 如 sameTo: 'password'，意思是和密码内容相同 |

`callback`方法的使用：

* 改变提示信息的颜色 

```
.add({
  //////其他代码
  callback: function(el, errorEl){
     errorEl.style.cssText = 'color:red;'
  }
  //////其他代码
})
```
* 改变提示信息的位置

```
.add({
  //////其他代码
  callback: function(el, errorEl){
     document.getElementsByTagName('body')[0].appendChild(errorEl)
  }
  //////其他代码
})
```

* 发挥自己想象，想怎么写就怎么写

#### `.remove(inputName)` 移除验证项

移除一个验证项，参数为input的内容

#### `.valid` 判断是否通过验证，值为`true`或`false`

通常在`submit`表单的方法中，判断表单是否通过验证，若通过为`true`，否则为`false`

