var svgContainer = d3.select("#skiplist");
var PARAM = {
    LEFT: 30,
    RIGHT: 20,
    LEVEL_HEIGHT: 20,
    MAX_LEVEL: 4,
    CDURATION: 500,
    FONT_SIZE: 20,
    INTERVAL:80,
    THRESHOLD: 0.3,
};


function SkipLinkNode(key,x,y,level) {
    this.x = x;
    this.y = y;
    this.level = level;
    var height = level * PARAM.LEVEL_HEIGHT;
    var width = PARAM.LEFT + PARAM.RIGHT;
    var mid = PARAM.LEFT + x;
    var bottom = y + PARAM.MAX_LEVEL * PARAM.LEVEL_HEIGHT;
    var top = bottom - level * PARAM.LEVEL_HEIGHT;

    this.node = svgContainer.append("rect")
        .attr("x",x)
        .attr("y",top)
        .attr("width",width)
        .attr("height",height)
        .attr("fill","none")
        .attr("stroke-width",1)
        .attr("stroke","rgb(0,0,0)");

    this.left = svgContainer.append("rect")
        .attr("x",x)
        .attr("y",top)
        .attr("width",PARAM.LEFT)
        .attr("height",height)
        .attr("fill","none")
        .attr("stroke-width",1)
        .attr("stroke","rgb(0,0,0)");
    
    this.text = svgContainer.append("text")
        .text(key)
        .attr("x",x+3)
        .attr("y",(bottom + top) / 2 + 5.5)
        .attr("fill","black")
        .attr("font-size",PARAM.FONT_SIZE)

    this.right = [];
    this.link = [];
    for(var i = 0;i < level; i++){
        this.right.push(
            svgContainer.append("rect")
            .attr("x",mid)
            .attr("y",y + (PARAM.MAX_LEVEL - i - 1) * PARAM.LEVEL_HEIGHT)
            .attr("width",PARAM.RIGHT)
            .attr("height",PARAM.LEVEL_HEIGHT)
            .attr("fill","none")
            .attr("stroke-width",1)
            .attr("stroke","rgb(0,0,0)")
        );

        this.link.push(
            svgContainer.append("line")
                .attr("x1",mid + PARAM.RIGHT / 2)
                .attr("y1",bottom - i * PARAM.LEVEL_HEIGHT - PARAM.LEVEL_HEIGHT / 2)
                .attr("x2",mid + PARAM.RIGHT / 2)
                .attr("y2",bottom - i * PARAM.LEVEL_HEIGHT - PARAM.LEVEL_HEIGHT / 2)
                .attr("stroke-width",1.2)
                .attr("stroke","rgb(0,0,0)")
                .attr("marker-start","url(#markerCircle)")
                .attr("marker-end","url(#markerArrow)")
        );
    }

}

SkipLinkNode.prototype.move = function (x,y) {
    var mx = x - this.x;
    var my = y - this.y;
    this.node.transition()
        .duration(PARAM.CDURATION)
        .attr("x",parseInt(this.node.attr("x"))+mx)
        .attr("y",parseInt(this.node.attr("y"))+my);
    this.left.transition()
        .duration(PARAM.CDURATION)
        .attr("x",parseInt(this.left.attr("x"))+mx)
        .attr("y",parseInt(this.left.attr("y"))+my);
    this.text.transition()
        .duration(PARAM.CDURATION)
        .attr("x",parseInt(this.text.attr("x"))+mx)
        .attr("y",parseInt(this.text.attr("y"))+my);
    for(var i = 0; i < this.level; i++) {
        this.right[i].transition()
            .duration(PARAM.CDURATION)
            .attr("x", parseInt(this.right[i].attr("x"))+mx)
            .attr("y", parseInt(this.right[i].attr("y"))+my);
        this.link[i].transition()
            .duration(PARAM.CDURATION)
            .attr("x1", parseInt(this.link[i].attr("x1"))+mx)
            .attr("y1", parseInt(this.link[i].attr("y1"))+my)
            .attr("x2", parseInt(this.link[i].attr("x2"))+mx)
            .attr("y2", parseInt(this.link[i].attr("y2"))+my);
    }
    this.x = x;
    this.y = y;
}

SkipLinkNode.prototype.remove = function () {
    this.node.remove();
    this.left.remove();
    this.text.remove();
    for(var i=0;i<this.level;i++){
        this.right[i].remove();
        this.link[i].remove();
    }
}

SkipLinkNode.prototype.color = function (col) {
    this.node.transition()
        .duration(PARAM.CDURATION)
        .attr("stroke",col);
    this.text.transition()
        .duration(PARAM.CDURATION)
        .attr("fill",col);
    this.left.transition()
        .duration(PARAM.CDURATION)
        .attr("stroke",col);
    for(var i = 0;i < this.level;i++){
        this.right[i].transition()
            .duration(PARAM.CDURATION)
            .attr("stroke",col);
    }
}

SkipLinkNode.prototype.dolink = function (level, x, y) {
    this.link[level].transition()
        .duration(PARAM.CDURATION)
        .attr("x2", x)
        .attr("y2", y);
}

SkipLinkNode.prototype.colorLink = function (level, color) {
    this.link[level]
        .attr("stroke",color);
}

SkipLinkNode.prototype.linkX1 = function (level) {
    return parseInt(this.link[level].attr("x1"));
}

SkipLinkNode.prototype.linkY1 = function (level) {
    return parseInt(this.link[level].attr("y1"));
}

SkipLinkNode.prototype.linkX2 = function (level) {
    return parseInt(this.link[level].attr("x2"));
}

SkipLinkNode.prototype.linkY2 = function (level) {
    return parseInt(this.link[level].attr("y2"));
}

function Animation() {
    this.animations = [];
}

Animation.prototype.add = function (args,fun) {
    this.animations.push({
        args:args,
        fun:fun,
    });
}

Animation.prototype.run = function (index) {
    if(index >= this.animations.length){
        this.animations = [];
        return ;
    };
    this.animations[index].fun(this.animations[index].args);
    setTimeout(function () {
        this.run(index + 1);
    }.bind(this),PARAM.CDURATION);
}

function Node(key,view) {
    this.key = key;

    this.level = 1;
    while(Math.random() < PARAM.THRESHOLD && this.level < PARAM.MAX_LEVEL){
        this.level++;
    }
    this.next = [];
    for(var i = 0; i < this.level; i++){
        this.next.push(null);
    }
    console.log(this.level);
    if(view==null){
        this.view = new SkipLinkNode(key,10,10,this.level);
    }else{
        this.view = view;
    }

}

function insert(head, key) {
    var updates = [];
    for(var i = 0;i < PARAM.MAX_LEVEL;i++){
        updates.push(null);
    }
    var p = head;
    var level = PARAM.MAX_LEVEL - 1;
    while(level >= 0){
        if(p.next[level] == null){
            updates[level] = p;
            level--;
            continue;
        }
        var q = p.next[level];
        if(q.key < key){
            ani.add({
                now: p.view,
                level: level,
            },function (args) {
                var now = args.now;
                var level = args.level;
                now.color("red");
            });
            p = q;
        }else if(q.key == key){
            ani.add({
                now: p.view,
                level: level,
            },function (args) {
                var now = args.now;
                var level = args.level;
                now.color("red");
            });
            p = q;
            break;
        }else{
            updates[level] = p;
            level--;
        }
    }
    var tmpLevel = level;
    if(tmpLevel < 0) tmpLevel = 0;
    ani.add({
        now: p.view,
        level: tmpLevel,
    },function (args) {
        var now = args.now;
        var level = args.level;
        now.color("red");
    });


    for(var i = level;i >= 0;i--){
        updates[i] = p;
    }
    /*view-start*/
    var forMoves = [];
    var tmp = p.next[0];
    while(tmp!=null){
        forMoves.push(tmp);
        tmp = tmp.next[0];
    }

    ani.add({
        moves: forMoves,
        updates: updates,
    },function (args) {
        var updates = args.updates;
        for(var i = 0; i < PARAM.MAX_LEVEL;i++){
            updates[i].view.dolink(i, updates[i].view.linkX1(i), updates[i].view.linkY1(i));
        }
        var moves = args.moves;
        for(var i=0;i<moves.length;i++){
            var view = moves[i].view;
            view.move(view.x + PARAM.INTERVAL, view.y);
        }
    });
    /*view-end*/
    var newNode = new Node(key);
    /*view-start*/
    ani.add({
        node: newNode.view,
        x: p.view.x + PARAM.INTERVAL,
        y: p.view.y,
    },function (args) {
        var node = args.node;
        node.move(args.x, args.y);
    });
    /*view-end*/
    for(var i = 0;i < newNode.level;i++){
        var q = updates[i].next[i];
        updates[i].next[i] = newNode;
        newNode.next[i] = q;
    }
    /*view-start*/
    ani.add({
        updates: updates,
        newNode: newNode,
    },function (args) {
        var updates = args.updates;
        for(var i=0;i<PARAM.MAX_LEVEL;i++){
            var nextNode = updates[i].next[i];
            if(nextNode != null){
                updates[i].view.dolink(i,nextNode.view.x,updates[i].view.linkY1(i));
            }
            nextNode = newNode.next[i];
            if(nextNode != null){
                newNode.view.dolink(i, nextNode.view.x, nextNode.view.linkY1(i));
            }
        }
    });
    /*view-end*/
}

function remove(head,key) {
    var updates = [];
    for(var i = 0;i < PARAM.MAX_LEVEL;i++){
        updates.push(null);
    }
    var p = head;
    var level = PARAM.MAX_LEVEL - 1;
    while(level >= 0){
        if(p.next[level] == null){
            updates[level] = p;
            level--;
            continue;
        }
        var q = p.next[level];
        if(q.key < key){
            ani.add({
                now: p.view,
                level: level,
            },function (args) {
                var now = args.now;
                var level = args.level;
                now.color("red");
            });
            p = q;
        }else if(q.key == key){
            updates[level] = p;
            level--;
            if(level < 0){
                ani.add({
                    now: p.view,
                    level: 0,
                },function (args) {
                    var now = args.now;
                    var level = args.level;
                    now.color("red");
                });
                p = q;
            }
        }else{
            updates[level] = p;
            level--;
        }
    }

    /*view-start*/
    var forMoves = [];
    var tmp = p.next[0];
    while(tmp!=null){
        forMoves.push(tmp);
        tmp = tmp.next[0];
    }

    ani.add({
        updates: updates,
        now: p.view,
    },function (args) {
        var now = args.now;
        for(var i=0;i<now.level;i++){
            now.dolink(i,now.linkX1(i),now.linkY1(i));
        }
        var updates = args.updates;
        for(var i=0;i<PARAM.MAX_LEVEL;i++){
            var view = updates[i].view;
            view.dolink(i,view.linkX1(i),view.linkY1(i));
        }
    });

    ani.add({
        now: p.view,
    },function (args) {
        var now = args.now;
        now.move(10,10);
    });

    ani.add({
        now: p.view,
    },function (args) {
        var now = args.now;
        now.remove();
    });

    ani.add({
        moves: forMoves,
        updates: updates,
    },function (args) {
        var updates = args.updates;
        for(var i = 0; i < PARAM.MAX_LEVEL;i++){
            updates[i].view.dolink(i, updates[i].view.linkX1(i), updates[i].view.linkY1(i));
        }
        var moves = args.moves;
        for(var i=0;i<moves.length;i++){
            var view = moves[i].view;
            view.move(view.x - PARAM.INTERVAL, view.y);
        }
    });

    for(var i = 0;i < p.view.level;i++){
        updates[i].next[i] = p.next[i];
    }

    ani.add({
        updates: updates,
    },function (args) {
        var updates = args.updates;
        console.log(updates);
        for(var i=0;i<PARAM.MAX_LEVEL;i++){
            var nextNode = updates[i].next[i];
            if(nextNode != null){
                updates[i].view.dolink(i,nextNode.view.x, updates[i].view.linkY1(i));
            }
        }
    });
}

var viewHeader = new SkipLinkNode("头",10,100,4);
var header = new Node("头",viewHeader);
var ani = new Animation();
var hash = [];

function disable_buttons() {
    document.getElementById("submit").disabled=true;
    document.getElementById("delete").disabled=true;
}

function undisable_buttons() {
    document.getElementById("submit").disabled=false;
    document.getElementById("delete").disabled=false;
}


d3.select("#submit").on("click",function () {
    var val = document.getElementById("text").value;
    if(val.length > 2 || !/^[0-9]+$/.test(val)){
        alert("只能输入两为数字")
        return ;
    }
    val =  parseInt(val);
    if (hash[val] != null){
        alert("key已经存在了")
        return ;
    }
    hash[val] = true;

    ani.add({},function (args) {
        disable_buttons();
    });
    insert(header, val);
    ani.add({},function (args) {
        var p = header;
        while(p!=null){
            p.view.color("black");
            for(var i=0;i<p.view.level;i++){
                p.view.colorLink(i,"black");
            }
            p = p.next[0];
        }
    });
    ani.add({},function (args) {
        setTimeout(function () {
            undisable_buttons();
        },PARAM.CDURATION);
    });
    ani.run(0);
});


d3.select("#delete").on("click",function () {
    var val = document.getElementById("text").value;
    if(val.length > 2 || !/^[0-9]+$/.test(val)){
        alert("只能输入两为数字")
        return ;
    }
    if(hash[val] == null){
        alert("key不存在")
        return ;
    }
    delete hash[val];
    val =  parseInt(val);
    ani.add({},function (args) {
        disable_buttons();
    });
    remove(header, val);
    ani.add({},function (args) {
        var p = header;
        while(p!=null){
            p.view.color("black");
            for(var i=0;i<p.view.level;i++){
                p.view.colorLink(i,"black");
            }
            p = p.next[0];
        }
    });
    ani.add({},function (args) {
        setTimeout(function () {
            undisable_buttons();
        },PARAM.CDURATION);
    });
    ani.run(0);
});
