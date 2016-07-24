/**
 * Created by valseek on 2016/7/17.
 */

// this is to delete something
joint.dia.MyLink = joint.dia.Cell.extend({

        // The default markup for links.
        markup: [
            '<path class="connection" stroke="black" d="M 0 0 0 0"/>',
            '<g class="labels"/>',
            '<g class="marker-vertices"/>',
        ].join(''),

        labelMarkup: [
            '<g class="label">',
            '<rect />',
            '<text />',
            '</g>'
        ].join(''),

        toolMarkup: [
            '<g class="link-tool">',
            '<g class="tool-remove" event="remove">',
            '<circle r="11" />',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',
            '<title>Remove link.</title>',
            '</g>',
            '<g class="tool-options" event="link:options">',
            '<circle r="11" transform="translate(25)"/>',
            '<path fill="white" transform="scale(.55) translate(29, -16)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,18.689,18.689,20.871,16,20.871z"/>',
            '<title>Link options.</title>',
            '</g>',
            '</g>'
        ].join(''),

        // The default markup for showing/removing vertices. These elements are the children of the .marker-vertices element (see `this.markup`).
        // Only .marker-vertex and .marker-vertex-remove element have special meaning. The former is used for
        // dragging vertices (changin their position). The latter is used for removing vertices.
        vertexMarkup: [
            '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
            '<circle class="marker-vertex" idx="<%= idx %>" r="10" />',
            '<path class="marker-vertex-remove-area" idx="<%= idx %>" d="M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z" transform="translate(5, -33)"/>',
            '<path class="marker-vertex-remove" idx="<%= idx %>" transform="scale(.8) translate(9.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">',
            '<title>Remove vertex.</title>',
            '</path>',
            '</g>'
        ].join(''),

        arrowheadMarkup: [
            '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
            '<path class="marker-arrowhead" end="<%= end %>" d="M 26 0 L 0 13 L 26 26 z" />',
            '</g>'
        ].join(''),

        defaults: {

            type: 'link',
            source: {},
            target: {}
        },

        isLink: function() {

            return true;
        },

        disconnect: function() {

            return this.set({ source: g.point(0, 0), target: g.point(0, 0) });
        },

        // A convenient way to set labels. Currently set values will be mixined with `value` if used as a setter.
        label: function(idx, value) {

            idx = idx || 0;

            var labels = this.get('labels') || [];

            // Is it a getter?
            if (arguments.length === 0 || arguments.length === 1) {

                return labels[idx];
            }

            var newValue = _.merge({}, labels[idx], value);

            var newLabels = labels.slice();
            newLabels[idx] = newValue;

            return this.set({ labels: newLabels });
        },

        translate: function(tx, ty, opt) {

            // enrich the option object
            opt = opt || {};
            opt.translateBy = opt.translateBy || this.id;
            opt.tx = tx;
            opt.ty = ty;

            return this.applyToPoints(function(p) {
                return { x: (p.x || 0) + tx, y: (p.y || 0) + ty };
            }, opt);
        },

        scale: function(sx, sy, origin, opt) {

            return this.applyToPoints(function(p) {
                return g.point(p).scale(sx, sy, origin).toJSON();
            }, opt);
        },

        applyToPoints: function(fn, opt) {

            if (!_.isFunction(fn)) {
                throw new TypeError('dia.Link: applyToPoints expects its first parameter to be a function.');
            }

            var attrs = {};

            var source = this.get('source');
            if (!source.id) {
                attrs.source = fn(source);
            }

            var target = this.get('target');
            if (!target.id) {
                attrs.target = fn(target);
            }

            var vertices = this.get('vertices');
            if (vertices && vertices.length > 0) {
                attrs.vertices = _.map(vertices, fn);
            }

            return this.set(attrs, opt);
        },

        reparent: function(opt) {

            var newParent;

            if (this.graph) {

                var source = this.graph.getCell(this.get('source').id);
                var target = this.graph.getCell(this.get('target').id);
                var prevParent = this.graph.getCell(this.get('parent'));

                if (source && target) {
                    newParent = this.graph.getCommonAncestor(source, target);
                }

                if (prevParent && (!newParent || newParent.id !== prevParent.id)) {
                    // Unembed the link if source and target has no common ancestor
                    // or common ancestor changed
                    prevParent.unembed(this, opt);
                }

                if (newParent) {
                    newParent.embed(this, opt);
                }
            }

            return newParent;
        },

        hasLoop: function(opt) {

            opt = opt || {};

            var sourceId = this.get('source').id;
            var targetId = this.get('target').id;

            if (!sourceId || !targetId) {
                // Link "pinned" to the paper does not have a loop.
                return false;
            }

            var loop = sourceId === targetId;

            // Note that there in the deep mode a link can have a loop,
            // even if it connects only a parent and its embed.
            // A loop "target equals source" is valid in both shallow and deep mode.
            if (!loop && opt.deep && this.graph) {

                var sourceElement = this.graph.getCell(sourceId);
                var targetElement = this.graph.getCell(targetId);

                loop = sourceElement.isEmbeddedIn(targetElement) || targetElement.isEmbeddedIn(sourceElement);
            }

            return loop;
        },

        getSourceElement: function() {

            var source = this.get('source');

            return (source && source.id && this.graph && this.graph.getCell(source.id)) || null;
        },

        getTargetElement: function() {

            var target = this.get('target');

            return (target && target.id && this.graph && this.graph.getCell(target.id)) || null;
        },

        // Returns the common ancestor for the source element,
        // target element and the link itself.
        getRelationshipAncestor: function() {

            var connectionAncestor;

            if (this.graph) {

                var cells = _.compact([
                    this,
                    this.getSourceElement(), // null if source is a point
                    this.getTargetElement() // null if target is a point
                ]);

                connectionAncestor = this.graph.getCommonAncestor.apply(this.graph, cells);
            }

            return connectionAncestor || null;
        },

        // Is source, target and the link itself embedded in a given element?
        isRelationshipEmbeddedIn: function(element) {

            var elementId = _.isString(element) ? element : element.id;
            var ancestor = this.getRelationshipAncestor();

            return !!ancestor && (ancestor.id === elementId || ancestor.isEmbeddedIn(elementId));
        }
    },
    {
        endsEqual: function(a, b) {

            var portsEqual = a.port === b.port || !a.port && !b.port;
            return a.id === b.id && portsEqual;
        }
    });


// this is what  I do


var Node={
    red_color:'#CD0000',
    black_color:'#000000',
    vertical_distance:70,
    circle_radius:15,
    createNew:function(x,y,value,isNull){
        var rbtNode={};
        rbtNode.lchild=null;
        rbtNode.rchild=null;
        rbtNode.father=null;
        rbtNode.link_father=null;
        rbtNode.deep=null;
        rbtNode.value=value;
        rbtNode.x=x;
        rbtNode.y=y;
        if(isNull==1){
            rbtNode.rbtnode=new joint.shapes.basic.Rect({
                position:{x:x,y:y},
                size:{width:Node.circle_radius,height:Node.circle_radius},
                attrs:{rect:{fill:'#222222'},text:{text:"",fill:'#ffffff'}}
            });
        }
        else{
            rbtNode.rbtnode=new joint.shapes.basic.Circle({
                position:{x:x,y:y},
                size:{width:Node.circle_radius*2,height:Node.circle_radius*2},
                attrs:{circle:{fill:Node.red_color},text:{text:""+value,fill:'#ffffff'}}
            });
        }
        rbtNode.changeToRed=function(){
            rbtNode.rbtnode.attr({
                circle:{fill:Node.red_color}
            });
        };
        rbtNode.changeToBlack=function(){
            rbtNode.rbtnode.attr({
                circle:{fill:Node.black_color}
            });
        };
        return rbtNode;
    }
}


var RBT = {
    delay:10,
    duration:1000,
    createNew:function(graph,paperWidth,paperHeight){
        rbtree={};
        rbtree.graph=graph;
        rbtree.head=null;
        rbtree.width=parseInt(paperWidth);
        rbtree.height=parseInt(paperHeight);
        addEmptyNode=function(target_node){
            var tmpdeep=target_node.deep*2;
            var tmplx=target_node.rbtnode.prop('position/x')-paperWidth/tmpdeep;
            var tmprx=target_node.rbtnode.prop('position/x')+paperWidth/tmpdeep;
            var tmpy=target_node.rbtnode.prop('position/y')+Node.vertical_distance;
            var tmplchild=Node.createNew(tmplx,tmpy,NaN,1);
            var tmprchild=Node.createNew(tmprx,tmpy,NaN,1);
            tmplchild.deep=tmpdeep;
            tmprchild.deep=tmpdeep;
            target_node.lchild=tmplchild;
            target_node.rchild=tmprchild;
            rbtree.graph.addCells([tmplchild.rbtnode,tmprchild.rbtnode]);
            addLink(tmplchild,target_node);
            addLink(tmprchild,target_node);
        }
        rbtree.addNode=function(val){
            var tmpnode,tmpdeep;
            if(rbtree.head ==  null){       // 当前为空树
                tmpnode=Node.createNew(rbtree.width/2-Node.circle_radius,30,val,0);
                tmpnode.value=val;
                tmpnode.deep=2;
                rbtree.head=tmpnode;
                graph.addCell(tmpnode.rbtnode);
            }
            else{                         // 当前不为空树
                var tmpp=rbtree.head;
                var lastnode=null;
                while(tmpp!=null&&!isNaN(tmpp.value)){
                    lastnode=tmpp;
                    if(val>=tmpp.value)tmpp=tmpp.rchild;
                    else tmpp=tmpp.lchild;
                }
                var tmpdeep=lastnode.deep*2;
                var tmpx,tmpy;
                if(val>=lastnode.value){            //插入右边
                    tmpx=lastnode.rbtnode.prop('position/x')+paperWidth/tmpdeep;
                    tmpy=lastnode.rbtnode.prop('position/y')+Node.vertical_distance;
                    tmpnode=Node.createNew(tmpx,tmpy,val,0);
                    tmpnode.deep=tmpdeep;
                    tmpnode.father=lastnode;
                    lastnode.rchild.rbtnode.remove();
                    lastnode.rchild=tmpnode;
                }
                else{                                   //插入左边
                    tmpx=lastnode.rbtnode.prop('position/x')-paperWidth/tmpdeep;
                    tmpy=lastnode.rbtnode.prop('position/y')+Node.vertical_distance;
                    tmpnode=Node.createNew(tmpx,tmpy,val,0);
                    tmpnode.deep=tmpdeep;
                    tmpnode.father=lastnode;
                    lastnode.lchild.rbtnode.remove();
                    lastnode.lchild=tmpnode;
                }
                graph.addCells([tmpnode.rbtnode]);
                addLink(tmpnode,lastnode);
            }
            addEmptyNode(tmpnode);
        }
        function addLink(source_node,target_node){
            var tmplink=new joint.dia.MyLink({
                source:{id:source_node.rbtnode.id},
                target:{id:target_node.rbtnode.id}
            });
            source_node.link_father=tmplink;
            //console.log("link:   "+source_node.value+" = "+target_node.value);
            rbtree.graph.addCell(tmplink);
            return tmplink;
        }
        function findNode(val){
            if(rbtree.head==null)return null;
            var tmpnode=rbtree.head;
            while(tmpnode!=null&&!isNaN(tmpnode.value)&&tmpnode.value!=val){
                if(val>=tmpnode.value){
                    tmpnode=tmpnode.rchild;
                }
                else tmpnode=tmpnode.lchild;
            }
            return tmpnode;
        }
        rbtree.changeToRed=function(val){
            var tmpnode=findNode(val);
            if(tmpnode==null||isNaN(tmpnode.value))return ;
            tmpnode.changeToRed();
        }
        rbtree.changeToBlack=function(val){
            var tmpnode=findNode(val);
            if(tmpnode==null||isNaN(tmpnode.value))return ;
            tmpnode.changeToBlack();
        }

        function changePosition(tnode,px,py){
            var delay=RBT.delay;
            var duration=RBT.duration;
            tnode.x=px;tnode.y=py;
            tnode.rbtnode.transition('position/x',px,{
                delay: delay,
                duration: duration,
            });
            tnode.rbtnode.transition('position/y',py,{
                delay: delay,
                duration: duration,
            });
        }

        rbtree.cover=function(source_val,target_val) {
            var source_node = findNode(source_val);
            var target_node = findNode(target_val);
            if(source_node==null||isNaN(source_node.value)||target_node==null||isNaN(target_node.value))return ;
            var source_father = source_node.father;
            source_node.rchild.rbtnode.remove();
            source_node.lchild.link_father.remove();
            if (source_node.value >= source_father.value) {
                source_father.rchild = source_node.lchild;
            }
            else {
                source_father.lchild = source_node.lchild;
            }
            source_node.link_father.remove();
            addLink(source_node.lchild,source_node.father);
            var tmpos=source_node.rbtnode.prop('position');
            changePosition(source_node.lchild,tmpos.x,tmpos.y);
            changePosition(source_node,target_node.rbtnode.prop('position').x,target_node.rbtnode.prop('position').y);
            setTimeout(function(){
                var tmplc=target_node.lchild;
                var tmprc=target_node.rchild;
                if(target_node==rbtree.head){rbtree.head=source_node;}
                else{
                    if(target_node.value>=target_node.father.value){
                        target_node.father.rchild=source_node;
                    }
                    else{
                        target_node.father.lchild=source_node;
                    }
                    addLink(source_node,target_node.father);
                    source_node.father=target_node.father;
                }
                source_node.lchild=target_node.lchild;
                source_node.rchild=target_node.rchild;
                source_node.deep=target_node.deep;
                target_node.lchild=null;
                target_node.rchild=null;
                target_node.rbtnode.remove();
                if(tmplc!=null)addLink(tmplc,source_node)
                if(tmprc!=null)addLink(tmprc,source_node)
                tmplc.father=source_node;
                tmprc.father=source_node;
            },1100)
        }
        rbtree.delnode=function(val){
            var tmpnode=findNode(val);
            if(tmpnode==null||isNaN(tmpnode.value))return ;
            var tmpos=tmpnode.rbtnode.prop('position');
            tmpnode.rchild.rbtnode.remove();
            if(tmpnode.father==null){
                tmpnode.lchild.rbtnode.remove();
            }
            else{
                if(tmpnode.value>=tmpnode.father.value){
                    tmpnode.father.rchild=tmpnode.lchild;
                }
                else{
                    tmpnode.father.lchild=tmpnode.lchild;
                }
                tmpnode.lchild.link_father.remove();
                addLink(tmpnode.lchild,tmpnode.father);
                tmpnode.link_father.remove();
                changePosition(tmpnode.lchild,tmpos.x,tmpos.y);
            }
            changePosition(tmpnode,paperWidth,paperHeight);
            setTimeout(function(){
                tmpnode.rbtnode.remove();
            },1000);
            tmpnode.lchild.father=tmpnode.father;
            tmpnode.lchild=null;
            tmpnode.rchild=null;
            tmpnode.father=null;
        }

        function recursionForExChangeNode(father_node,child_node,lOrR){
            if(child_node==null)return ;
            var tmpx,tmpy,tmpfx,tmpdeep;
            tmpy=father_node.y+Node.vertical_distance;
            tmpfx=father_node.x;
            tmpdeep=father_node.deep*2;
            if(lOrR == 0) tmpx = tmpfx-rbtree.width/tmpdeep;
            else tmpx=tmpfx+rbtree.width/tmpdeep;
            child_node.deep=tmpdeep;
            child_node.x=tmpx;
            child_node.y=tmpy;
           changePosition(child_node,tmpx,tmpy);
            recursionForExChangeNode(child_node,child_node.lchild,0);
            recursionForExChangeNode(child_node,child_node.rchild,1);
        }

        rbtree.exChange=function(vala,ca,valb,cb){
            var tmpnodea=findNode(vala);
            var tmpnodeb=findNode(valb);
            var nodea,nodeb;
            if(tmpnodea==null||isNaN(tmpnodea.value))return ;
            if(tmpnodeb==null||isNaN(tmpnodeb.value))return ;
            if(ca==0)nodea=tmpnodea.lchild;
            else nodea=tmpnodea.rchild;
            if(cb==0)nodeb=tmpnodeb.lchild;
            else nodeb=tmpnodeb.rchild;
            if(nodea==null||nodeb==null)return;
            var tfa=nodea.father;
            var tfb=nodeb.father;
            var which_child_a,which_child_b;
            if(nodea.father.lchild==nodea)which_child_a=0;
            else which_child_a=1;
            if(nodeb.father.lchild==nodeb)which_child_b=0;
            else which_child_b=1;
            nodea.link_father.remove();
            nodeb.link_father.remove();
            if(which_child_a==0){
                tfa.lchild=nodeb;
            }
            else{
                tfa.rchild=nodeb;
            }
            if(which_child_b==0){
                tfb.lchild=nodea;
            }
            else{
                tfb.rchild=nodea;
            }
            nodeb.father=tfa;
            nodea.father=tfb;
            addLink(nodea,tfb);
            addLink(nodeb,tfa);
            recursionForExChangeNode(tmpnodeb,nodea,cb);
            recursionForExChangeNode(tmpnodea,nodeb,ca);
        }


        rbtree.leftRotate=function(val){
            var tmpnode=findNode(val);
            var tmpfnode=tmpnode.father;
            var tmpfpos=tmpfnode.rbtnode.prop('position');
            tmpnode.link_father.remove();
            tmpnode.rchild.link_father.remove();
            if(tmpfnode.father==null){
                rbtree.head=tmpnode;
            }else{
                var tmpgfnode=tmpfnode.father;
                tmpfnode.link_father.remove();
                if(tmpfnode.father.lchild==tmpfnode){
                    tmpgfnode.lchild=tmpnode;
                }
                else{
                        tmpgfnode.rchild=tmpnode;
                }
                tmpnode.father=tmpgfnode;
                addLink(tmpnode,tmpgfnode);
            }
            tmpfnode.lchild=tmpnode.rchild;
            tmpnode.rchild=tmpfnode;
            addLink(tmpnode.rchild,tmpnode);
            addLink(tmpfnode.lchild,tmpfnode);
            tmpnode.rchild.father=tmpnode;
            tmpfnode.lchild.father=tmpfnode;
            tmpnode.deep=tmpfnode.deep;
            changePosition(tmpnode,tmpfpos.x,tmpfpos.y);
            recursionForExChangeNode(tmpnode,tmpnode.lchild,0);
            recursionForExChangeNode(tmpnode,tmpnode.rchild,1);
        }

        rbtree.rightRotate=function(val){
            var tmpnode=findNode(val);
            var tmpfnode=tmpnode.father;
            var tmpfpos=tmpfnode.rbtnode.prop('position');
            tmpnode.link_father.remove();
            tmpnode.lchild.link_father.remove();
            if(tmpnode.father==null){
                rbtree.head=tmpnode;
            }else{
                var tmpgfnode=tmpfnode.father;
                tmpfnode.link_father.remove();
                if(tmpfnode.father.lchild==tmpfnode){
                    tmpgfnode.lchild=tmpnode;
                }
                else{
                    tmpgfnode.rchild=tmpnode;
                }
                tmpnode.father=tmpgfnode;
                addLink(tmpnode,tmpgfnode);
            }
            tmpfnode.rchild=tmpnode.lchild;
            tmpnode.lchild=tmpfnode;
            addLink(tmpnode.lchild,tmpnode);
            addLink(tmpfnode.rchild,tmpfnode);
            tmpnode.lchild.father=tmpnode;
            tmpfnode.rchild.father=tmpfnode;
            tmpnode.deep=tmpfnode.deep;
            changePosition(tmpnode,tmpfpos.x,tmpfpos.y);
            recursionForExChangeNode(tmpnode,tmpnode.lchild,0);
            recursionForExChangeNode(tmpnode,tmpnode.rchild,1);
        }

        rbtree.insertNode=function(){
            
        }

        return rbtree;
    }
}







