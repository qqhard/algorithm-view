/**
 * Created by hard on 16-7-14.
 */
var svgContainer = d3.select("#tree");
var root_x = parseInt(svgContainer.attr("root_x"));
var root_y = parseInt(svgContainer.attr("root_y"));
var CHEIGHT = parseInt(svgContainer.attr("cheight"));
var CWIDTH = parseInt(svgContainer.attr("cwidth"));
var CREDUIS = parseInt(svgContainer.attr("creduis"));
var CMAX_CENG = parseInt(svgContainer.attr("cmax_ceng"));
var CDURATION = parseInt(svgContainer.attr("cduration"));

var nodes = [];
var data = [];

function cal_ceng(i) {
    var ii = i + 1;
    var ceng = 0;
    while(ii>>ceng > 0)ceng+=1;
    return ceng-1;
}

function cal_max_ceng(nodes) {
    var len = nodes.length;
    return cal_ceng(len);
}

function cal_x(i,max_ceng) {
    if(i==0)return root_x;

    var ceng = cal_ceng(i);
    var ceng_width = Math.pow(2,max_ceng-ceng) * CWIDTH;
    var ceng_num = i+1;
    var tmp = 1;
    while(ceng_num > tmp){
        ceng_num-=tmp;
        tmp=tmp<<1;
    }
    var ceng_ban = Math.pow(2,ceng-1)+0.5;
    return root_x+(ceng_num-ceng_ban)*ceng_width;
}

function cal_y(i) {
    return root_y + cal_ceng(i) * CHEIGHT;
}

function nodes(data) {

    var nodes = [];
    for(var i=0;i<data.length;i++){
        nodes.push({val:data[i],r:CREDUIS});
    }

    var max_ceng = cal_max_ceng(nodes);
    for(var i=0;i<nodes.length;i++){
        nodes[i].x = cal_x(i,max_ceng);
        nodes[i].y = cal_y(i);
    }
    return nodes;
}

function edges(nodes) {
    var edges = [];
    for(var i = 1;i < nodes.length; i++){
        var edge = {};
        edge.x1 = nodes[i].x;
        edge.y1 = nodes[i].y;
        edge.x2 = nodes[((i+1)>>1)-1].x;
        edge.y2 = nodes[((i+1)>>1)-1].y;
        edges.push(edge);
    }
    return edges;
}


//    var circles = svgContainer.selectAll("circle")
//            .data(nodes)
//            .enter()
//            .append("circle");
//
//    circles.transition()
//            .attr("cx",function(d){return d.x;})
//            .attr("cy",function(d){return d.y;})
//            .attr("r",function(d){return d.r});
//
//    var lines = svgContainer.selectAll("line")
//            .data(edges)
//            .enter()
//            .append("line");
//    lines.transition()
//            .attr("x1",function(d){return d.x1;})
//            .attr("y1",function(d){return d.y1;})
//            .attr("x2",function(d){return d.x2;})
//            .attr("y2",function(d){return d.y2;})
//            .attr("stroke","black")
//            .attr("stroke-width",5);
//
//    var texts = svgContainer.selectAll("text")
//            .data(nodes)
//            .enter()
//            .append("text");
//
//    texts.transition()
//            .text(function(d){return d.val;})
//            .attr("x",function(d){return d.x-CREDUIS/2;})
//            .attr("y",function(d){return d.y+CREDUIS/3;})
//            .attr("fill","white")
//            .attr("font-size",22);

function view_text(node) {
    var text = svgContainer.append("text")
        .text(node.val)
        .attr("x",node.x-CREDUIS/2)
        .attr("y",node.y+CREDUIS/3)
        .attr("fill","white")
        .attr("font-size",22);
    return text;
}



function view_insert(node) {
    var index = nodes.length;
    nodes.push(node);
    var x = cal_x(index,CMAX_CENG);
    var y = cal_y(index);
    node.x = x;
    node.y = y;
    node.circle.transition()
        .duration(CDURATION)
        .attr("cx",x)
        .attr("cy",y);
    if(index>0){
        var father = ((index+1)>>1)-1;
        var x1 = nodes[father].x, y1 = nodes[father].y, x2 = x, y2 = y;
        var c = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
        var edge = svgContainer
            .append("line")
            .attr("x1",x1+CREDUIS*(x2-x1)/c)
            .attr("y1",y1+CREDUIS*(y2-y1)/c)
            .attr("x2",x2-CREDUIS*(x2-x1)/c)
            .attr("y2",y2-CREDUIS*(y2-y1)/c)
            .attr("stroke","black")
            .attr("stroke-width",5);

        node.edge = edge;
    }

    node.text.remove();
    node.text = view_text(node);
}


function view_node_init(val) {
    var x=0,y=0;
    var circle =svgContainer.append("circle")
        .attr("cx",x)
        .attr("cy",y)
        .attr("r",CREDUIS);
    var text = svgContainer.append("text")
        .text(val)
        .attr("x",x-CREDUIS/2)
        .attr("y",y+CREDUIS/3)
        .attr("fill","white")
        .attr("font-size",22);
    return {circle:circle,text:text,x:x,y:y,val:val}
}

function view_change(index,father) {

    var x1 = nodes[index].x;
    var y1 = nodes[index].y;
    var x2 = nodes[father].x;
    var y2 = nodes[father].y;
    nodes[index].circle.transition().attr("cx",x2).attr("cy",y2);
    nodes[father].circle.transition().attr("cx",x1).attr("cy",y1);
    nodes[index].text.transition().attr("x",x2-CREDUIS/2).attr("y",y2+CREDUIS/3);
    nodes[father].text.transition().attr("x",x1-CREDUIS/2).attr("y",y1+CREDUIS/3);

    var tmp = nodes[index];
    nodes[index] = nodes[father];
    nodes[father] = tmp;

    tmp = nodes[index].edge;
    nodes[index].edge = nodes[father].edge;
    nodes[father].edge = tmp;
    nodes[index].x = x1;
    nodes[index].y = y1;
    nodes[father].x = x2;
    nodes[father].y = y2;
}

function disable_buttons() {
    document.getElementById("submit").disabled=true;
    document.getElementById("delete").disabled=true;
}

function undisable_buttons() {
    document.getElementById("submit").disabled=false;
    document.getElementById("delete").disabled=false;
}

function view_ajust_from_leaf(index) {
    if(index==0){
        undisable_buttons();
        return ;
    }
    setTimeout(function () {

        var father = ((index+1)>>1)-1;
        if(nodes[index].val<nodes[father].val){
            view_change(index,father);
            view_ajust_from_leaf(father);
        }else{
            undisable_buttons();
        }
    },1000);
}

function view_ajust_from_head(index) {
    var lson = ((index+1)<<1)-1,rson = ((index+1)<<1|1)-1;
    var len = nodes.length;
    if(lson>=len){
        undisable_buttons();
        return ;
    }
    var son = -1;
    if(rson>=len){
        son = lson;
    }else if(nodes[lson].val <= nodes[rson].val){
        son = lson;
    }else{
        son = rson;
    }
    if(nodes[index].val <= nodes[son].val){
        undisable_buttons();
        return ;
    }

    setTimeout(function () {
        view_change(son,index);
        view_ajust_from_head(son);
    },1000);

}

function view_delete() {
    var x = nodes[0].x, y = nodes[0].y;
    nodes[0].circle.transition().attr("cx",0).attr("cy",0).remove();
    nodes[0].text.transition().attr("x",0).attr("y",0).remove();

    nodes[0] = nodes[nodes.length-1];
    nodes.pop();
    nodes[0].x = x;
    nodes[0].y = y;
    nodes[0].circle.transition().attr("cx",x).attr("cy",y);
    nodes[0].text.transition().attr("x",x-CREDUIS/2).attr("y",y+CREDUIS/3);
    nodes[0].edge.remove();
}

d3.select("#submit").on("click",function () {
    var val = document.getElementById("text").value;
    if(val.length > 2 || !/^[0-9]+$/.test(val)){
        alert("只能输入两为数字")
        return ;
    }
    val =  parseInt(val);
    disable_buttons();
    var node = view_node_init(val);
    view_insert(node);
    view_ajust_from_leaf(nodes.length-1);
});

d3.select("#delete").on("click",function () {
    disable_buttons();
    view_delete();
    if(nodes.length==0){
        undisable_buttons();
        return ;
    }
    view_ajust_from_head(0);
});
