let originData = [];
let dataCollection = {
    personRank: [],
    groupAvgRank: [],
    submitRank: []
};
let isInit = false;

//bmi block btn
const cleanInputBtn = document.querySelector('.cleanInput');
const bmiCalcBtn = document.querySelector('.startCalc');
const bmiResult = document.querySelector(".c-countInfo");
const joinPeople = document.querySelector(".joinPeople");
//group rank block btn
const fastRankList = document.querySelector(".fastRankList"); 
const submitRankList = document.querySelector(".submitRankList"); 
const personRankList = document.querySelector(".personRankList");
const personNum = document.querySelector(".personNum");
//filter block Btn
const allBtn = document.querySelector(".allBtn");
const underTenBtn = document.querySelector(".underTenBtn");
const haveMsgBtn = document.querySelector(".haveMsgBtn");
const haveVideoBtn = document.querySelector(".haveVideoBtn");
const keySearchBtn = document.querySelector(".keySearchBtn");
const keySearchValue = document.querySelector("#keySearchValue");





//快到慢排序
function sortFastToSlow(data){
    let arr = data.sort((now,next) => {
        let totalSec1 = parseInt(now.practiceMinute,10) * 60 + parseInt(now.practiceSecond,10);
        let totalSec2 = parseInt(next.practiceMinute,10) * 60 + parseInt(next.practiceSecond,10);
        return totalSec1 - totalSec2
    });
    for(let i = 0; i <arr.length; i++){
        arr[i].id = i+1;
        // console.log(arr[i].id)
    }
    return arr
}
//計算BMI
function calcBmi(weight,height){
    let bmi = (weight/(height/100)**2).toFixed(2);
    let state = '';
    console.log(weight,height, bmi);
    if (isNaN(bmi) || bmi <= 0){
        console.log(`您的數值輸入錯誤，請重新輸入`);
        return
      } else if (bmi<18.5){
        state = '過輕';
      } else if (bmi<24){
        state = '正常';
      } else if (bmi<27){
        state = '過重';
      } else if (bmi<30){
        state = '輕度肥胖';
      } else if (bmi<35){
        state = '中度肥胖';
      } else {
        state = '重度肥胖';
      }
      
    // console.log( {'value': bmi, 'result': state});
    return {value: bmi, result: state}
}
//
function sortMoreToLess(data){
    dataCollection.submitRank = data.sort((now, next)=>{
        return now.quantity - next.quantity
    }).reverse();
}

//初始化
function init(){
    isInit = true;
    axios.get('https://raw.githubusercontent.com/hexschool/js-traninging-week6API/main/data.json')
        .then((res) => originData = res.data) //取得原始資料
        .then(() => {
            joinPeople.textContent = originData.length;
            personNum.textContent = `No. 1 ~ No. ${originData.length}`;
            dataCollection.personRank = sortFastToSlow(originData);
            let arr = calcGroupAvg(originData);
            dataCollection.groupAvgRank = arr.sort((now,next)=>{
                return (now.avgMin * 60 + now.avgSec) - (next.avgMin * 60 + next.avgSec)
            });
            sortMoreToLess(calcGroupAvg(originData));
            console.log(dataCollection);
        })
        .then(()=>{
            render();
            isInit = false;
        })
        .catch((error)=>{    
            console.log(`error: ${ error }`);
        });

    cleanInputBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        document.querySelector('#height').value = '';
        document.querySelector('#weight').value = '';
        bmiResult.innerHTML = `<div>不要害怕面對現實</div>`;
    });
    bmiCalcBtn.addEventListener('click', (e)=>{
        const height = parseInt(document.querySelector('#height').value, 10);
        const weight = parseInt(document.querySelector('#weight').value, 10);
        let obj = calcBmi(weight,height);
        console.log(obj);
        e.preventDefault();
        bmiResult.innerHTML = `<ul>
                                    <li class="bmiTitle">BMI<span class="bmiValue">${obj.value}</span></li>
                                    <li class="bmiState">${obj.result}</li>
                                </ul>`;
        document.querySelector('#height').value = '';
        document.querySelector('#weight').value = '';
    });
    allBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        isInit = true;
        render();
        isInit = false;
        console.log(e);
        jumpSearch();
        toggleBtnClass('allBtn');
    });
    underTenBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        let arr = dataCollection.personRank.filter((item)=>{
            return item.practiceMinute < 10
        })
        render(arr);
        // console.log(arr);
        jumpSearch();
        toggleBtnClass('underTenBtn');
    });
    haveMsgBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        let arr = dataCollection.personRank.filter((item)=>{
            return 'message' in item
        })
        render(arr);
        // console.log(arr);
        jumpSearch();
        toggleBtnClass('haveMsgBtn');
    });
    haveVideoBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        let arr = dataCollection.personRank.filter((item)=>{
            return item.youtubeUrl.length > 0
        })
        render(arr);
        // console.log(arr);
        jumpSearch();
        toggleBtnClass('haveVideoBtn');
    });
    keySearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let value = keySearchValue.value.toLocaleLowerCase();
        // console.log(value);
        let searchData = dataCollection.personRank.filter((item)=>{
            return item.slackName.toLocaleLowerCase().indexOf(value) >= 0 ? true : false
        });
        // console.log(searchData);
        render(searchData);
        toggleBtnClass();
    })
    
}
//跳到個人排名區塊
function jumpSearch(){  
    window.location.href = `#search`;
    // window.location.reload();
}
//點擊搜尋方塊時highlight點擊的按紐
function toggleBtnClass(btnName = ''){
    let className = 'is-active';
    console.log(btnName);
    if(btnName === 'allBtn'){
        allBtn.classList.add(className);
        underTenBtn.classList.remove(className);
        haveMsgBtn.classList.remove(className);
        haveVideoBtn.classList.remove(className);
    } else if(btnName === 'underTenBtn'){
        underTenBtn.classList.add(className);
        allBtn.classList.remove(className);
        haveMsgBtn.classList.remove(className);
        haveVideoBtn.classList.remove(className);
    } else if(btnName === 'haveMsgBtn'){
        haveMsgBtn.classList.add(className);
        allBtn.classList.remove(className);
        underTenBtn.classList.remove(className);
        haveVideoBtn.classList.remove(className);
    } else if(btnName === 'haveVideoBtn'){
        haveVideoBtn.classList.add(className);
        allBtn.classList.remove(className);
        underTenBtn.classList.remove(className);
        haveMsgBtn.classList.remove(className);
    } else {
        allBtn.classList.remove(className);
        underTenBtn.classList.remove(className);
        haveMsgBtn.classList.remove(className);
        haveVideoBtn.classList.remove(className);
    }
}
//將各組別人數，時間算出來
function calcGroupAvg(data){
    let arr = [];
    for(let i = 0; i < 27; i++){
        let groupTotalSec = 0;
        let groupAvg = 0;
        let avgMin = 0;
        let avgSec = 0;
        let groupData = data.filter((item)=>{
                return parseInt(item.jsGroup, 10) === (i+1)
        });
        groupData.forEach((item) => {
            // console.log(item);
            groupTotalSec += parseInt(item.practiceMinute,10) * 60 + parseInt(item.practiceSecond, 10);
        });
        groupAvg = parseInt(groupTotalSec / groupData.length);
        avgMin = parseInt(groupAvg/60);
        avgSec = groupAvg % 60;
        let newData = groupData.sort((now,next)=>{
            let totalSec1 = parseInt(now.practiceMinute,10) * 60 + parseInt(now.practiceSecond,10);
            let totalSec2 = parseInt(next.practiceMinute,10) * 60 + parseInt(next.practiceSecond,10);
            return totalSec1 - totalSec2
            });
        // console.log(newData, groupData);
        arr.push({
            quantity: newData.length, //組別數量
            group: newData[0].jsGroup, //JS組別
            avgMin: avgMin, //組別平均分鐘
            avgSec: avgSec, //組別平均秒數
            inGroupAvgRank: [ //組別內前三
                newData[0], 
                newData[1], 
                newData[2]
            ]
        });
    }
    // console.log(`各分組資料統計完畢`);
    // console.log(arr);

    return arr
}


function render(arr = []){
    if(isInit){
        let personrRankStr = ``,
            groupRankStr=``,
            submitRankStr =``;
        let groupRank = dataCollection.groupAvgRank,
            submitRank = dataCollection.submitRank;
        let rankImgClass = ['c-card--fri','c-card--sec','c-card--thr'];
        for(let i=0; i<=2; i++){
            groupRankStr += `<li class="l-billboardList__item">
                                <div class="c-card c-card--medal ${rankImgClass[i]}">
                                <div class="c-card__tit">
                                    <p class="o-title">第${groupRank[i].group}組</p>
                                    <div class="l-stackWrap">
                                        <div class="l-stackWrap__item">
                                            <div class="l-stack">
                                                <div class="l-stack__top">
                                                    <p class="o-title o-title--sm o-title--normal o-title--gy">繳交人數</p>
                                                </div>
                                                <div class="l-stack__cnt">
                                                    <p class="o-txt">${groupRank[i].quantity}人</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="l-stackWrap__item">
                                            <div class="l-stack">
                                                <div class="l-stack__top">
                                                    <p class="o-title o-title--sm o-title--normal o-title--gy">平均時間</p>
                                                </div>
                                                <div class="l-stack__cnt">
                                                    <p class="o-txt">${groupRank[i].avgMin}分${groupRank[i].avgSec}秒</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="c-card__main">
                                    <div class="l-stack">
                                        <div class="l-stack__top">
                                            <p class="o-title o-title--sm o-title--normal o-title--gy">組內排名</p>
                                        </div>
                                        <div class="l-stack__cnt">
                                            <ul class="l-memberList">
                                                <li class="l-memberList__item">
                                                    <div class="c-memberClip">
                                                        <div class="c-memberClip__title">${groupRank[i].inGroupAvgRank[0].slackName}</div>
                                                        <div class="c-memberClip__timer">${groupRank[i].inGroupAvgRank[0].practiceMinute}分${groupRank[i].inGroupAvgRank[0].practiceSecond}秒</div>
                                                    </div>
                                                </li>
                                                <li class="l-memberList__item">
                                                    <div class="c-memberClip">
                                                        <div class="c-memberClip__title">${groupRank[i].inGroupAvgRank[1].slackName}</div>
                                                        <div class="c-memberClip__timer">${groupRank[i].inGroupAvgRank[1].practiceMinute}分${groupRank[i].inGroupAvgRank[1].practiceSecond}秒</div>
                                                    </div>
                                                </li>
                                                <li class="l-memberList__item">
                                                    <div class="c-memberClip">
                                                    <div class="c-memberClip__title">${groupRank[i].inGroupAvgRank[2].slackName}</div>
                                                    <div class="c-memberClip__timer">${groupRank[i].inGroupAvgRank[2].practiceMinute}分${groupRank[i].inGroupAvgRank[2].practiceSecond}秒</div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="c-card__bottom c-card__bottom--r">
                                    <div class="o-txt o-txt--sm o-txt--gy">2021/3/13 下午 8:38:53</div>
                                </div>
                            </div>
                        </li>`;
            submitRankStr += `<li class="l-billboardList__item">
                                <div class="c-card c-card--medal ${rankImgClass[i]}">
                                    <div class="c-card__tit">
                                        <p class="o-title">第${submitRank[i].group}組</p>
                                        <div class="l-stackWrap">
                                            <div class="l-stackWrap__item">
                                                <div class="l-stack">
                                                    <div class="l-stack__top">
                                                        <p class="o-title o-title--sm o-title--normal o-title--gy">繳交人數</p>
                                                    </div>
                                                    <div class="l-stack__cnt">
                                                        <p class="o-txt">${submitRank[i].quantity}人</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="l-stackWrap__item">
                                                <div class="l-stack">
                                                    <div class="l-stack__top">
                                                        <p class="o-title o-title--sm o-title--normal o-title--gy">平均時間</p>
                                                    </div>
                                                    <div class="l-stack__cnt">
                                                        <p class="o-txt">${submitRank[i].avgMin}分${submitRank[i].avgSec}秒</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="c-card__main">
                                        <div class="l-stack">
                                            <div class="l-stack__top">
                                                <p class="o-title o-title--sm o-title--normal o-title--gy">組內排名</p>
                                            </div>
                                            <div class="l-stack__cnt">
                                                <ul class="l-memberList">
                                                    <li class="l-memberList__item">
                                                        <div class="c-memberClip">
                                                            <div class="c-memberClip__title">${submitRank[i].inGroupAvgRank[0].slackName}</div>
                                                            <div class="c-memberClip__timer">${submitRank[i].inGroupAvgRank[0].practiceMinute}分${submitRank[i].inGroupAvgRank[0].practiceSecond}秒</div>
                                                        </div>
                                                    </li>
                                                    <li class="l-memberList__item">
                                                        <div class="c-memberClip">
                                                        <div class="c-memberClip__title">${submitRank[i].inGroupAvgRank[1].slackName}</div>
                                                        <div class="c-memberClip__timer">${submitRank[i].inGroupAvgRank[1].practiceMinute}分${submitRank[i].inGroupAvgRank[1].practiceSecond}秒</div>
                                                        </div>
                                                    </li>
                                                    <li class="l-memberList__item">
                                                        <div class="c-memberClip">
                                                        <div class="c-memberClip__title">${submitRank[i].inGroupAvgRank[2].slackName}</div>
                                                        <div class="c-memberClip__timer">${submitRank[i].inGroupAvgRank[2].practiceMinute}分${submitRank[i].inGroupAvgRank[2].practiceSecond}秒</div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>`;
        }
        // console.log(`groupRankStr:${groupRankStr}`);
        submitRankList.innerHTML = submitRankStr;
        fastRankList.innerHTML = groupRankStr;
        dataCollection.personRank.forEach((item,index) => {
            personrRankStr += `<li class="l-card__item">
                        <div class="c-card">
                            <div class="c-card__tags">
                                <ul class="l-badges">
                                    <li class="l-badges__item">
                                        <div class="o-badge o-badge--og">No. ${item.id}</div>
                                    </li>
                                    <li class="l-badges__item">
                                        <div class="o-badge o-badge--gn">${item.jsGroup === '未分組'? '': 'TEAM'} ${item.jsGroup}</div>
                                    </li>
                                    ${
                                        (item.practiceMinute<10)?`<li class="l-badges__item"><div class="o-badge">Under 10 mins</div></li>` : ``
                                    }
                                </ul>
                            </div>
                            <div class="c-card__tit">
                                <div class="l-stack">
                                    <div class="l-stack__top">
                                        <p class="o-title">${item.slackName}</p>
                                    </div>
                                    <div class="l-stack__cnt">
                                        <p class="o-txt">${item.practiceMinute}分 ${item.practiceSecond} 秒</p>
                                    </div>
                                </div>
                            </div>
                            ${
                                'message' in item ? `<div class="c-card__main">
                                    <div class="l-stack">
                                        <div class="l-stack__top">
                                            <p class="o-title o-title--sm o-title--gy">留言</p>
                                        </div>
                                        <div class="l-stack__cnt">
                                            <p class="o-txt">${ item.message }</p>
                                        </div>
                                    </div>
                                </div>`: ``
                            }                        
                            <div class="c-card__bottom c-card__bottom--apart">
                                <div class="l-badges">
                                    <div class="l-badges__item">
                                        <a src="${item.codepenUrl}" class="o-badge o-badge--outline">Code</a>
                                    </div>
                                    ${item.youtubeUrl.length === 0 ? ``:`<div class="l-badges__item">
                                    <a src="${item.youtubeUrl}" class="o-badge o-badge--outline">Video</a>
                                </div>`}
                                    
                                </div>
                                <div class="o-txt o-txt--sm o-txt--gy">${item.timestamp}</div>
                            </div>
                        </div>
                    </li>`
        })
        personNum.textContent = `全部共${dataCollection.personRank.length}筆資料`;
        personRankList.innerHTML = personrRankStr;
    } else {
        let str = ``;
        if(arr.length === 0){
            personNum.textContent = `搜尋共符合${arr.length}筆資料`;
            personRankList.innerHTML = str;
            return
        }
        personNum.textContent = `搜尋共符合${arr.length}筆資料`;
        arr.forEach((item) => {
            str += `<li class="l-card__item">
                        <div class="c-card">
                            <div class="c-card__tags">
                                <ul class="l-badges">
                                    <li class="l-badges__item">
                                        <div class="o-badge o-badge--og">No. ${item.id}</div>
                                    </li>
                                    <li class="l-badges__item">
                                        <div class="o-badge o-badge--gn">${item.jsGroup === '未分組'? '': 'TEAM'} ${item.jsGroup}</div>
                                    </li>
                                    ${
                                        (item.practiceMinute<10)?`<li class="l-badges__item"><div class="o-badge">Under 10 mins</div></li>` : ``
                                    }
                                </ul>
                            </div>
                            <div class="c-card__tit">
                                <div class="l-stack">
                                    <div class="l-stack__top">
                                        <p class="o-title">${item.slackName}</p>
                                    </div>
                                    <div class="l-stack__cnt">
                                        <p class="o-txt">${item.practiceMinute}分 ${item.practiceSecond} 秒</p>
                                    </div>
                                </div>
                            </div>
                            ${
                                'message' in item ? `<div class="c-card__main">
                                    <div class="l-stack">
                                        <div class="l-stack__top">
                                            <p class="o-title o-title--sm o-title--gy">留言</p>
                                        </div>
                                        <div class="l-stack__cnt">
                                            <p class="o-txt">${ item.message }</p>
                                        </div>
                                    </div>
                                </div>`: ``
                            }                        
                            <div class="c-card__bottom c-card__bottom--apart">
                                <div class="l-badges">
                                    <div class="l-badges__item">
                                        <a src="${item.codepenUrl}" class="o-badge o-badge--outline">Code</a>
                                    </div>
                                    ${item.youtubeUrl.length === 0 ? ``:`<div class="l-badges__item">
                                    <a src="${item.youtubeUrl}" class="o-badge o-badge--outline">Video</a>
                                </div>`}
                                    
                                </div>
                                <div class="o-txt o-txt--sm o-txt--gy">${item.timestamp}</div>
                            </div>
                        </div>
                    </li>`
        });
        personRankList.innerHTML = str;
        // console.log(str);
    }
}

init();
