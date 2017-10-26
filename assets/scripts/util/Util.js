//工具模块
var Util = (function(util){
    util = util||function(){};
    var utl = util.prototype;
    //生成uuid
    utl.createUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };
    //时间戳生成日期
    utl.formatTimeForH5 = function (now) {
        var year = new Date(now).getFullYear();
        var month = new Date(now).getMonth() + 1 >= 10 ? new Date(now).getMonth() + 1 : '0' + (new Date(now).getMonth() + 1);
        var date = new Date(now).getDate() >= 10　? new Date(now).getDate() :　'0' + new Date(now).getDate();
        var hour = new Date(now).getHours();
        var minute = new Date(now).getMinutes();
        var second = new Date(now).getSeconds();

        return [year + "-" + month + "-" + date,(hour == '0' ? '00' : hour)
        + ":" + (minute == '0' ? '00' : minute)  + ":" + (second == '0' ? '00' : second)];
    };
    //得到时间戳是昨天还是今天time->指定时间戳
    utl.compareDay = function(time){
        var _now  = new Date().getTime();//当前时间戳
        var _nowYear = new Date().getFullYear();//当前年份
        var _nowMonth = new Date().getMonth()+1;//当前月份
        var _nowDay = new Date().getDate();//指定天

        var _year = new Date(time).getFullYear();//指定年份
        var _month = new Date(time).getMonth()+1;//指定月份
        var _day = new Date(time).getDate();//指定天

        if(_nowYear==_year&&_nowMonth==_month&&_nowDay==_day){//同一天
            return '今天';
        }else if(_nowYear==_year&&_nowMonth==_month&&_nowDay-1==_day){
            return '昨天';
        }else{
            var m =  _month>10?_month:'0'+_month;
            var d = _day>10?_day:'0'+_day;
            return m+'-'+d;
        }
    };
    //根据时间戳得到日期是今天或昨天
    utl.getDate = function(time){
        var d = this.compareDay(time);
        var hour = new Date(time).getHours();//得到小时
        var minute = new Date(time).getMinutes();//得到分钟
        var second = new Date(time).getSeconds();//得到秒数
        return{
            date:d,
            time:(hour+1 >10 ? hour :'0' + hour)
            + ":" + (minute+1 > 10 ? minute : '0' + minute)
            + ":" + (second+1 > 10 ? second :'0'+ second)
        }
    };
    //得到现在到未来某个时间点的倒计时
    utl.getCountDown = function(future){
        var now = new Date().getTime();
        var nextStatus = future
        var nextStatusText = (nextStatus-now)/1000;
        //console.log(nextStatusText);
        var days=Math.floor(nextStatusText/3600/24);
        var hours=Math.floor((nextStatusText-days*24*3600)/3600);
        var mins=Math.floor((nextStatusText-days*24*3600-hours*3600)/60);
        var secs=Math.floor((nextStatusText-days*24*3600-hours*3600-mins*60));

        //console.log(days,hours,mins,secs);
        if(hours<=0){
            hours = 0;
        }
        if(mins<=0){
            mins = 0;
        }
        if(secs<=0){
            secs = 0;
        }
        //var time = hours+"小时"+mins+"分钟"+secs+"秒";
        var time = hours+":"+mins+":"+secs;
        return time;
    };
    //得到某个范围内随机整数
    utl.getRandInt = function(n,m){
        var c = m-n+1;
        return Math.floor(Math.random() * c + n);
    };
    //得到当前土地的种植详情->有则返回种植详情否者返回false
    utl.getCurPlantDetail = function(pdId,allDetails){//传入当前土地pdId和全部种植详情
        //cc.log(pdId,allDetails);
        var curDetails = null;
        for(var i = 0;i<allDetails.length;i++){
            if(allDetails[i].id==pdId){
                curDetails = allDetails[i];
                break;
            }
        }
        return curDetails;
    };
    //通过当前土地id的到到当前土地pdId
    /**
    @param landId->当前土地id
    @param landArr->当前土地了列表
    */
    utl.getPdIdByLandId = function(landId,landArr){
        let pdId = 0;
        for(let i = 0;i<landArr.length;i++){
            if(landId==landArr[i].id){
                pdId = landArr[i].pdId;
                break;
            }
        }
        return pdId;
    };
    //通过wood_id得到玩家仓库中的对应木材数量
    //有则返回对应数量，没有就返回0
    utl.getCntByWoodId = function(woodList,id){
        var num = 0;
        for(var i = 0;i<woodList.length;i++){
            if(id==woodList[i].itemTypeId){
                num = woodList[i].cnt;
                break;
            }
        }
        return num;
    };
    //组合市场中的商品列表
    utl.assemMarketList = function(obj){
        var newArr = [];
        for(var item in obj){
            newArr.push(obj[item]);
        }
        return newArr;
    };
    //通过植物的下一次状态时间定时触发任务
    /**
     @param now->现在时间;
     @param future->下一个状态的时间;
     @param task->需要执行的函数;
     */
    utl.updateStatusByNextStatusTime = function(now,future,task){
        //后台传递数据有问题 暂不解决
        var now = now||new Date().getTime();
        var future = future||new Date().getTime();
        if(now>=future) return;
        var time = future-now+1000;
        var timeOut = setTimeout(()=>{
            alert(1);
            task();
            alert(2);
        },time)
    };
    //得到一个Obj[]中所有的nextStsTime并压入数组
    /**
     * @arrList ->所有种植详情
     * */
    utl.getNextStsTimeFromArr = function(arrList){
        var arr = [];
        if(arrList.length>0){
            for(let i = 0;i<arrList.length;i++){
                if(arrList[i].nextStsTime){
                    arr.push(arrList[i].nextStsTime);
                }
            }
        };
        return arr;
    };
    //得到一个数组中所有大于某一个值的数值
    utl.getAllThatThanParam = function(param,arr){
        var arr = arr||[new Date().getTime()];
        var param = param||new Date().getTime();
        var newArr = [];
        if(arr.length>0){
            for(let i = 0;i<arr.length;i++){
                if(arr[i]>param){
                    newArr.push(arr[i]);
                }
            }
            if(newArr.length<1){
                return [new Date().getTime()];
            }
            return newArr;
        }
        return [new Date().getTime()];
    };
    //得到数组中最小的数
    utl.getMinFromArr = function(arr){
        if(arr.length>0){
           return Math.min(...arr);
           //Math.min.apply(null,arr);
        }
        return new Date().getTime();
    };

    //手机号正则
    utl.mobileReg = /^1[3-9][\d]{9}$/;
    //验证手机号码
    utl.regMobile = function(mobile){
        return this.mobileReg.test(mobile);
    };
    //拆分字符串
    utl.splitStr = function(str){
        return str.split('_')[1];
    };
    return new util;
})(Util);

module.exports = Util;
