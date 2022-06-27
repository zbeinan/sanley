let margin = { top: 10, right: 50, bottom: 10, left: 40 },
    width = 960 - margin.left - margin.right,
    height = { top: 320 - margin.top - margin.bottom, bottom: 220 - margin.top - margin.bottom },
    padding = { top : 30, bottom: 30, right: 80 },
    inside = { x : width - padding.right , y$1 : height.top - padding.top , y$2 : height.bottom - padding.bottom},
    [Q,H,P,E,N]=[[],[],[],[],[]];//流量,扬程,功率,效率,气蚀
//创建svg
let svg$1 = createSVG(height.top,"svgTop");
let svg$2 = createSVG(height.bottom,"svgBot");

//创建标注文字
svg$1.html(`
    <g class="text">
        <text text-anchor="end" x="-22" y="3"> H 
            <tspan x="-10" y="2"> [m] </tspan>
        </text>
        <text text-anchor="start" x="${width + 10}" y="0"> Eta 
            <tspan x="${width + 12}" y="12">[%]</tspan>
        </text>
        <text text-anchor="end" x="${width + 5}" y="${height.top-14}"> Q 
            <tspan>[m³/H]</tspan>
        </text>
    </g>
`);

svg$2.html(`
    <g class="text">
        <text text-anchor="end" x="-22" y="3"> P
            <tspan x="-10" y="2">[m]</tspan>
        </text>
        <text text-anchor="start" x="${width + 12}" y="3"> NPSH 
            <tspan x="${width + 20}" y="13">[m]</tspan>
        </text>
    </g>
`);

//创建标尺合集
let axis$1 = svg$1.append("g").attr("class", "axis");
let axis$2 = svg$2.append("g").attr("class", "axis");

//创建曲线合集
let curve$1 = svg$1.append("g").attr("class", "line");
let curve$2 = svg$2.append("g").attr("class", "line");

// 定义曲线采用的方式
let lineGenerator = d3.line().curve(d3.curveNatural);
let lineGeneratorRed = d3.line().curve(d3.curveBundle);

let CSVDATA = d3.csv(CSVFILE, d=>{Q.push(+d.流量),H.push(+d.扬程),P.push(+d.功率),E.push(+d.效率),N.push(+d.气蚀)});

CSVDATA.then(()=>{   
    
/**
 * 调用数据绘制标尺
 * Author:北南
*/
    let domainH =  decimal(isAxis(H,6)),
        domainE =  decimal(isAxis(E,6)), 
        domainQ =  decimal(isAxis(Q,8)),
        domainP =  decimal(isAxis(P,6)),
        domainN =  decimal(isAxis(N,6));
     
    // 扬程标尺
    let axisH =  d3.axisLeft(
                    d3.scalePoint()
                        .domain(domainH)
                        .range([0,inside.y$1])
                    );
        
    axis$1.append("g")
        .attr("class","axisH")
        .call(axisH);

    // 效率标尺
    let axisE = d3.axisRight(
                    d3.scalePoint()
                        .domain(domainE)
                        .range([inside.y$1 / 2,inside.y$1])
                    );

    axis$1.append("g")
            .attr("class","axisE")
            .attr("transform", "translate(" + width + ",0 )")
            .call(axisE);
            
    //流量标尺      
    let axisQ = d3.axisBottom(
                    d3.scalePoint()
                        .domain(domainQ)
                        .range([0,inside.x])
                    );

    axis$1.append("g")
            .attr("class","axisQ")
            .attr("transform", "translate(0," + (inside.y$1) + ")")
            .call(axisQ);

    // 功率标尺      
    let axisP = d3.axisLeft(
                    d3.scalePoint()
                        .domain(domainP)
                        .range([0,inside.y$2])
                    );

    axis$2.append("g")
            .attr("class","axisP")
            .call(axisP);

    // 气蚀标尺
    let axisN = d3.axisRight(
                    d3.scalePoint()
                        .domain(domainN)
                        .range([0,inside.y$2])
                    );

    axis$2.append("g")
            .attr("class","axisN")
            .attr("transform", "translate(" + width + ",0 )")
            .call(axisN);

    // 流量底部标尺
    axis$2.append("g")
            .attr("class","axisQ")
            .attr("transform", "translate(0," + inside.y$2 + ")")
            .call(axisQ);

    // axis线样式
    d3.selectAll(".axisH .tick,.axisP .tick").append("line").attr("stroke","#ddd").attr("x2",`${width}`);
    d3.selectAll(".svgTop .axisQ .tick").append("line").attr("stroke","#ddd").attr("y2",`${-inside.y$1}`);
    d3.selectAll(".svgBot .axisQ .tick").html(`
        <line stroke="#ddd" y2="${-inside.y$2}"></line>
    `);
    d3.selectAll(".axis .domain").remove();

    let H$1 = countCurve(domainQ,domainH,Q,H);
    let H$2 = countCurve(domainQ,domainH,Q,H,true);
    let E$1 = countCurve(domainQ,domainE,Q,E);
    let E$2 = countCurve(domainQ,domainE,Q,E,true);
    let P$1 = countCurve(domainQ,domainP,Q,P);
    let P$2 = countCurve(domainQ,domainP,Q,P,true);
    let N$1 = countCurve(domainQ,domainN,Q,N);
    let N$2 = countCurve(domainQ,domainN,Q,N,true);

    //  创建顶部曲线
    curve$1.append("path")
        .attr("class", "blue thin")
        .attr("d", lineGenerator(H$1)); curve$1.append("path")
        .attr("class", "blue rude")
        .attr("d", lineGenerator(H$2));
    curve$1.append("path")
        .attr("class", "black thin")
        .attr("d", lineGenerator(E$1));
    curve$1.append("path")
        .attr("class", "black rude")
        .attr("d", lineGenerator(E$2));
    // 创建底部曲线
    curve$2.append("path")
    .attr("class", "blue thin")
    .attr("d", lineGenerator(P$1));
    curve$2.append("path")
        .attr("class", "blue rude")
        .attr("d", lineGenerator(P$2));
    curve$2.append("path")
        .attr("class", "black thin")
        .attr("d", lineGenerator(N$1));
    curve$2.append("path")
        .attr("class", "black rude")
        .attr("d", lineGenerator(N$2));

    //获取位置
    let wrap = d3.select("#wrapper");

    /**
     * 开始鼠标动态功能
     * Author:北南
    */
    //开始鼠标跟随功能
    let moveLine = document.querySelectorAll(".thin");
    let moveMouseG = svg$1.append("g").attr("class", "effects");
    let moveMouse = moveMouseG.append("g").attr("class", "moveMouseG");  
    let moveMouseBotG = svg$2.append("g").attr("class", "effects");            
    // 创建圆
    let circle1= moveMouseG.append("circle").attr("class","circle1 circleHot").attr("r", 3);
    let circle2= moveMouseG.append("circle").attr("class","circle2 circle").attr("r", 3);
    let circle3= moveMouseBotG.append("circle").attr("class","circle3 circle").attr("r", 3);
    let circle4= moveMouseBotG.append("circle").attr("class","circle4 circle").attr("r", 3);
// 添加移动跟随点
    moveMouse.append("circle").attr("class", "circleMove").attr("r", 3); 
    moveMouse.append("circle").attr("class", "circleMoveBase").attr("r", 8); 
// 创建移动跟随框
    let moveRect = wrap.append("div").attr("class", "moveRect"); 
    let clickRect = wrap.append("div").attr("class", "clickRect"); 
// 点击线
let lineRed= moveMouseG.append("path").attr("class","lineRed"); //红色线    
    moveMouseG.append("path") .attr("class", "clickLine");
    moveMouseG.append("path") .attr("class", "clickLine");
    moveMouseBotG.append("path") .attr("class", "clickLine"); 
    moveMouseBotG.append("rect")
        .attr("width", width)
        .attr("height", inside.y$2)
        .attr("class", "rulerBotRect")
        .attr("fill", "none")
        .attr("pointer-events", "all")
// 添加事件
    moveMouseG.append("rect")
        .attr("width", width)
        .attr("height", inside.y$1)
        .attr("class", "rulerTopRect")
        .attr("fill", "none")
        .attr("pointer-events", "all")
    .on("mouseout", function () {
        d3.selectAll(".moveMouseG,.moveRect").style("opacity", "0");
        })
    .on("mouseover", function () {
        d3.selectAll(".moveMouseG,.effects,.moveRect").style("opacity", "1");
        })
    .on("mousemove", function () {
        let mouse = d3.mouse(this);
        d3.select(".moveMouseG")
            .attr("transform",function (d, i) {
                    let pos= movePath(0,mouse,".moveMouseG");
                    let moveWrap= document.querySelector(".moveRect");
                    moveWrap.style.cssText=`
                        left:${mouse[0] + (moveWrap.offsetWidth/2 - 5)}px;
                        top:${pos.y - (moveWrap.offsetHeight/2 + 0)}px;`;
                    moveWrap.innerHTML=`
                        <p>Q:<span>1.54 m³/h</span></p>
                        <p>H:<span>10.36 m</span></p>
                        <p>E:<span>50.00</span></p>
                        <p>P:<span>0.08 KW</span></p>
                    `
                    moveShowHide(mouse,".moveRect");
                    return `translate(${mouse[0]},${pos.y})`
                });
            })
    .on("click", function () {
        let mouse = d3.mouse(this);
        // 定义点的位置
        let pos1 = movePath(0,mouse,".circle1");               
        let pos2 = movePath(1,mouse,".circle2");                
        let pos3 = movePath(2,mouse,".circle3");                
        let pos4 = movePath(3,mouse,".circle4");                
            circle1.attr("cx",mouse[0]).attr("cy",pos1.y).attr("class","circle1 yellow");
            circle2.attr("cx",mouse[0]).attr("cy",pos2.y)
            circle3.attr("cx",mouse[0]).attr("cy",pos3.y);
            circle4.attr("cx",mouse[0]).attr("cy",pos4.y);
        // 定义十字线聚焦
        let lines = document.querySelectorAll(".clickLine");  
            d3.select(lines[0]).attr("d",moveToLineH(mouse,pos1.y,width,lines[0]));
            d3.select(lines[1]).attr("d",moveToLine(mouse,inside.y$1,lines[1]));
            d3.select(lines[2]).attr("d",moveToLine(mouse,inside.y$2,lines[2]));
        // 定义点线连接
        let lineData=[
                [0, inside.y$1],
                [mouse[0]/2,inside.y$1 - pos1.y + pos1.y],
                [mouse[0], pos1.y]
            ];
            lineRed.attr("d", lineGeneratorRed(lineData));

        // 点击生成数据
        let clickRect= document.querySelector(".clickRect");
        clickRect.style.cssText=`
            right:${margin.right}px;
            top:${margin.top}px;`;
        clickRect.innerHTML=`
            <p>Q:<span>1.54 m³/h</span></p>
            <p>H:<span>10.36 m</span></p>
            <p>E:<span>50.00</span></p>
            <p>P:<span>0.08 KW</span></p>
        `;

            moveShowHide(mouse,".lineRed");
            moveShowHide(mouse,".clickRect");                    
    });

    //鼠标跟随算法
    function movePath(line,mouse,obj){
        let begin = 0,
            end = moveLine[line].getTotalLength(),
            target = null,            
            pos;
            // obj
        //获取变化数值
        while (true) {
            target = Math.floor((begin + end) / 2);
            pos = moveLine[line].getPointAtLength(target);
            pos.x = Math.floor(pos.x);
            pos.y = Math.floor(pos.y);
            if ((target === end || target === begin) &&  pos.x !== mouse[0]) { break; }
            if (pos.x > mouse[0]) end = target;
            else if (pos.x < mouse[0]) begin = target;
            else break;
        }
            moveShowHide(mouse,obj);
        return pos;
    }
  
});


/**
 * 定义通用功能方法
 * Author:北南
*/

// 线条函数
function moveToLine(mouse,height,obj){
    let d = `M${mouse[0]},${height} ${mouse[0]},0`;
        moveShowHide(mouse,obj);
        return d;
}
// 横线函数
function moveToLineH(mouse,y,width,obj){
    let d = `M0,${y} L${width},${y}`
        moveShowHide(mouse,obj);
    return d;
}
// 超出隐藏，范围内显示
function moveShowHide(mouse,obj){
    if (mouse[0] > inside.x) {
        d3.select(obj).style("opacity", 0); 
    } else {
        d3.select(obj).style("opacity", 1);
    }  
}

//修改d3源码 <=n 返回大于或等于自身的数值
function ticks(start, stop, count) {
    let reverse,
        i = -1,
        n,
        ticks,
        step;

    stop = +stop, start = +start, count = +count;
    if (start === stop && count > 0) return [start];
    if (reverse = stop < start) n = start, start = stop, stop = n;
    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

    if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i <= n/*<=n*/) ticks[i] = (r0 + i) * step;
    } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i <= n/*<=n*/) ticks[i] = (r0 + i) / step;
    }

    if (reverse) ticks.reverse();

    return ticks;
}

function tickIncrement(start, stop, count) {
    let e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);
    let step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function createSVG(height,clased) { 
    let svg = d3.select('#wrapper').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .attr("class", clased)
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    return svg;
}

// 标尺生成函数
function isAxis(ars,step) { 
    let max = d3.max(ars);
    let axis;       
    if(ars === Q ){
        let axisT = d3.ticks(0,max,step);
        if(max === d3.max(axisT)){
            axis = d3.ticks(0,max,step);
        }else{
            axis =  ticks(0,max,step);
        }
    }else{
        axis = ticks(0,max,step);
        if(ars !== Q)  axis.reverse();
        if(ars !== E ) axis.unshift("");
    }
    return axis;
}

// 验证是否为浮点数
function isFloat(n) { return  n % 1 !==0; /* ~~n !==n */ }

// 验证数组是否为浮点数
function isNumber(n) {  let v = n.map(i=> parseFloat(i));  return v; }

// 小数标尺处理函数
function decimal(ars) { 
    let max  =  d3.max(ars);    
    let num  =  max < 1 ? 2 : ars.some(i=>isFloat(i)) ? 1 : 0;
    let tmp  =  ars.map((v,i) =>
    {
        if(v !=="" && v !== 0 && num !== 0) { 
            v =  (Math.round(v*100)/100).toString();           
            let rs = v.indexOf(".");
            if(rs < 0){
                rs = v.length;
                v += '.0';
            }
            while (v.length <= rs + num){
                v += '0';
            }
        };      
        return v
    });
    return tmp;
}
  
  
// 将传过来的值都进行统一处理 仅对单数值改变，不能对数组类型
function numInt( n ) {  
    let val;      
    if (Array.isArray(n)){
        let num;
        n.forEach( i =>{
            if(i !==  0){
                if( isFloat (i)) {                    
                    
                    if( n.some( v => i < 10 && i > 1) )         num = 100;
                    if( n.some( v => v < 100 && v >= 10) )      num = 10; 
                    if( n.some( v => v < 1000 && v >= 100) )    num = 1;  
                    if ( n.every( v => v < 1))                  num = 1000;              

                }else{
                    if( n.some( v => v < 100 && v >= 10) )      num = 1; 
                }
            }
        })
        val = n.map( i => {
            let tm = i * num;
            return tm;
        });
    }

    if( typeof n === "number"){
        
        if( isFloat(n))                 n = n.toFixed(2);     
        if ( n < 1)                     val = n * 1000;       
        if ( n < 10 && n > 1 )          val = n * 100; 
        if ( n < 100  && n > 10 )       val = n * 10;
        if ( n < 1000 && n > 100 )      val = n * 1; 
    }    
    
    return val;
}
// 把区块进行拆分
function numSplit( n ) { 
    return n / 1000
}
  
// 计算曲线Y值
function curveY(height,y,axisY,yVal,eta) { 
    let yValConvert;
    if(eta){
        //  获取每个Y值物理块
        let actual = numSplit( numInt(height / 2) ).toFixed(2);
        // 标尺块和物理块结合算出实际高度 Y值
        yValConvert = yVal.map( i =>   Math.ceil( height - ((i / axisY) *  actual) ) ); 
    }else{
        // 图表1 曲线可绘制高度 inside.y$1
        let vHeight = height - ( height / ( y.length - 1 ) );

        //  获取每个Y值物理块
        let actual = numSplit( numInt(vHeight) ).toFixed(2);
        // 标尺块和物理块结合算出实际高度 Y值
        yValConvert = yVal.map( i =>   Math.ceil( height - ((i / axisY) *  actual) ) );
    }
    return  yValConvert;
}
  // 曲线计算函数
  function countCurve(x,y,xq,u,cut) {   
  
    //  计算标尺高宽区块-每一块比例尺寸
    let mX = d3.max(isNumber(x));
    let mY = d3.max(isNumber(y));
    let axisX = numSplit(numInt(mX));
    let axisY = numSplit(numInt(mY));  
    
    // 提取节点   
    let node=[];
    let sqrt = Math.ceil(Math.sqrt(u.length));
    for(let i = 0; i < u.length; i++){
        let sVal = sqrt > 4 ? 8 : 4 ;
        if(i % sVal == 0 ) {
            let v =  i == 0 ? i : i - 1; node.push(v);            
        }        
    }
    node.push (u.length-1);

    // 计算曲线x值 
    let  xVal$1 = node.map( i=>i == 0 ? (xq[i] = 0)  : xq[i] );

    let xVal = numInt( xVal$1 );
    let actualX  =  numSplit(inside.x) ;  // 计算实际物理尺寸高宽区块
    let xValConvert = xVal.map( i => Math.ceil( (i / axisX ) *  actualX ) );


    // 计算曲线Y值 
    let yVal$1 = node.map( i => u[i]);
    let yVal = numInt( yVal$1);
    let yValConvert;   
    
    if( u == H )  yValConvert = curveY( inside.y$1,y,axisY,yVal );   
    if( u == E ) {
        let e = true;
        yValConvert = curveY( inside.y$1,y,axisY,yVal,e);
    }

    if(u == P || u == N)  yValConvert = curveY( inside.y$2,y,axisY,yVal );
    let result = xValConvert.map((key, value) => [ key, yValConvert[value] ]);

    if(cut==true) {
        result.shift();    
    }  
    return result;
  }
  