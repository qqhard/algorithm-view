/**
 * Created by hard on 16-7-17.
 */

var pwidth=$("#myholder").width();
var pheight=$("#myholder").height();
var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
    el: document.getElementById("myholder"),
    width: pwidth,
    height: pheight,
    model: graph,
    interactive: false,
    gridSize: 1
});
var rbtView = RBT.createNew(graph,pwidth,pheight);


function RedBlackTree() {
    this.root = null;
}

function RedBlackNode(key,color) {
    this.key = key;
    this.color = color;
    this.father = null;
    this.leftSon = null;
    this.rightSon = null;
}

RedBlackNode.prototype.changeToBlack = function () {
    this.color = true;
    rbtView.changeToBlack(this.key);
}

RedBlackNode.prototype.changeToRed = function () {
    this.color = false;
    rbtView.changeToRed(this.key);
}

RedBlackNode.prototype.changeColor = function() {
    this.color = !this.color;
    if(this.color == true){
        rbtView.changeToBlack(this.key);
    }else{
        rbtView.changeToRed(this.key);
    }
}

RedBlackNode.prototype.leftLink = function(son) {
    this.leftSon = son;
    son.father = this;
}

RedBlackNode.prototype.rightLink = function(son) {
    this.rightSon = son;
    son.father = this;
}

RedBlackNode.prototype.leftKey = function() {
    return this.leftSon.key;
}

RedBlackNode.prototype.rightKey = function() {
    return this.rightSon.key;
}

RedBlackNode.prototype.fatherKey = function() {
    return this.father.key;
}

RedBlackNode.prototype.leftColor = function() {
    return this.leftSon.color;
}

RedBlackNode.prototype.rightColor = function() {
    return this.rightSon.color;
}

RedBlackNode.prototype.fatherColor = function() {
    return this.father.color;
}

RedBlackNode.prototype.uncleColor = function () {
    if(!this.father){
        throw Error(this.key+" father is null");
    }
    if(!this.father.father){
        throw Error(this.key+" grand father is null");
    }

    if(this.father.father.leftSon === this.father){
        return this.father.father.rightColor();
    }else{
        return this.father.father.leftColor();
    }
}



RedBlackTree.prototype.RED = false;

RedBlackTree.prototype.BLACK = true;

RedBlackTree.prototype.rightRotate = function (now) {
    rbtView.leftRotate(now.key);
    var father = now.father;
    father.leftLink(now.rightSon);
    now.rightLink(father);
    return now;
}

RedBlackTree.prototype.leftRotate = function (now) {
    rbtView.rightRotate(now.key);
    var father = now.father;
    father.rightLink(now.leftSon);
    now.leftLink(father);
    return now;
}

RedBlackTree.prototype.rotate = function (now) {
    var nowIsLeft = now.father.leftSon == now;
    var fatherIsLeft = now.father.father.leftSon == now.father;
    var gFather = now.father.father;
    var ggFather = gFather.father;
    if(nowIsLeft == true && fatherIsLeft == true){
        var newNode = this.rightRotate(now.father);
        if(ggFather==null){
            this.root = newNode;
            this.root.father = null;
        }else{
            if(ggFather.leftSon==gFather){
                ggFather.leftLink(newNode);
            }else{
                ggFather.rightLink(newNode);
            }
        }
        newNode.changeToBlack();
        newNode.rightSon.changeToRed();
    }else if(nowIsLeft == false && fatherIsLeft == false){
        var newNode = this.leftRotate(now.father);
        if(ggFather==null){
            this.root = newNode;
            this.root.father = null;
        }else{
            if(ggFather.leftSon==gFather){
                ggFather.leftLink(newNode);
            }else{
                ggFather.rightLink(newNode);
            }
        }
        newNode.changeToBlack();
        newNode.leftSon.changeToRed();
    }else if(nowIsLeft == true && fatherIsLeft == false){//RL
        gFather.rightLink(this.rightRotate(now));
        setTimeout(function () {
            var newNode = this.leftRotate(now);
            if(ggFather==null){
                this.root = newNode;
                this.root.father = null;
                this.root.changeToBlack();
            }else{
                if(ggFather.leftSon==gFather){
                    ggFather.leftLink(newNode);
                }else{
                    ggFather.rightLink(newNode);
                }
            }
            gFather.changeToRed();
            newNode.changeToBlack();
        }.bind(this),2000);

    }else{//LR
        gFather.leftLink(this.leftRotate(now));
        setTimeout(function () {
            var newNode = this.rightRotate(now);
            if(ggFather==null){
                this.root = newNode;
                this.root.father = null;
                this.root.changeToBlack();
            }else{
                if(ggFather.leftSon==gFather){
                    ggFather.leftLink(newNode);
                }else{
                    ggFather.rightLink(newNode);
                }
            }
            gFather.changeToRed();
            newNode.changeToBlack();
        }.bind(this),2000);


    }
}

RedBlackTree.prototype.insAjust = function (now) {
    //case 1, father is black,over
    if(now.father == null || now.fatherColor()==this.BLACK){
        return ;
    }
    if(now.uncleColor()==this.RED){
        var grandFather = now.father.father;
        if(grandFather.father != null)grandFather.changeColor();
        grandFather.leftSon.changeColor();
        grandFather.rightSon.changeColor();
        this.insAjust(grandFather);
    }else{
        console.log("rotate");
        this.rotate(now);
    }
}

RedBlackTree.prototype.insert = function(key) {
    rbtView.addNode(key);
    if(this.root==null){
        rbtView.changeToBlack(key);
        this.root = new RedBlackNode(key,true);
        this.root.leftLink(new RedBlackNode(null,true));
        this.root.rightLink(new RedBlackNode(null,true));

        return true;
    }
    var now = this.root;
    while(now.key != null){
        if(key < now.key){
            now = now.leftSon;
        }else if(key > now.key){
            now = now.rightSon;
        }else{
            break;
        }
    }
    //dup key ,insert fail
    if(now.key!=null)return false;
    now.key = key;
    now.color = this.RED;
    now.leftLink(new RedBlackNode(null,true));
    now.rightLink(new RedBlackNode(null,true));
    this.insAjust(now);
    console.log(this.root);
    return true;
}


RedBlackTree.prototype.find = function (key) {
    var now = this.root;
    while(now.key != null){
        if(key < now.key){
            now = now.leftSon;
        }else if(key > now.key){
            now = now.rightSon;
        }else{
            break;
        }
    }
    if(now.key == key)return now;
    else return null;
}

RedBlackTree.prototype.delAjust = function (node) {
    if(node == null || node.color == this.BLACK || node.father == null){
        return ;
    }
    var father = node.father;
    if(father.leftSon == node){
        var brother = father.rightSon;
        if(brother.color == this.RED){
            father.changeColor();
            brother.changeColor();
            var gFather = father.father;
            var newNode = this.leftRotate(brother);
            if(gFather==null){
                this.root = newNode
            }else{
                if(gFather.leftSon == father){
                    gFather.leftLink(newNode);
                }else{
                    gFather.rightLink(newNode);
                }
            }
            this.delAjust(node);
        }else{
            if(brother.leftColor()==this.BLACK && brother.rightColor()==this.BLACK){
                brother.changeColor();
                this.delAjust(father);
            }else if(brother.leftColor()==this.RED && brother.rightColor()==this.BLACK){
                brother.changeColor();
                brother.leftSon.changeColor();
                father.rightLink(this.rightRotate(brother.leftSon));
                this.delAjust(node);
            }else if(brother.rightColor()==this.BLACK){
                brother.color = father.color;
                father.color = this.BLACK;
                brother.rightSon.color = this.BLACK;
                var gFather = father.father;
                var newNode = this.leftRotate(brother);
                if(gFather==null){
                    this.root = newNode;
                    this.root.color = this.BLACK;
                    this.root.father = null;
                }else{
                    if(gFather.leftSon == father){
                        gFather.leftLink(newNode);
                    }else{
                        gFather.rightLink(newNode);
                    }
                }
                this.delAjust(gFather);
            }
        }
    }else{
        var brother = father.leftSon;
        if(brother.color == this.RED){
            father.changeColor();
            brother.changeColor();
            var gFather = father.father;
            var newNode = this.rightRotate(brother);
            if(gFather==null){
                this.root = newNode
            }else{
                if(gFather.leftSon == father){
                    gFather.leftLink(newNode);
                }else{
                    gFather.rightLink(newNode);
                }
            }
            this.delAjust(node);
        }else{
            if(brother.leftColor()==this.BLACK && brother.rightColor()==this.BLACK){
                brother.changeColor();
                this.delAjust(father);
            }else if(brother.leftColor()==this.BLACK && brother.rightColor()==this.RED){
                brother.changeColor();
                brother.rightSon.changeColor();
                father.leftLink(this.leftRotate(brother.rightSon));
                this.delAjust(node);
            }else if(brother.leftColor()==this.BLACK){
                brother.color = father.color;
                father.color = this.BLACK;
                brother.leftSon.color = this.BLACK;
                var gFather = father.father;
                var newNode = this.rightRotate(brother);
                if(gFather==null){
                    this.root = newNode;
                    this.root.color = this.BLACK;
                    this.root.father = null;
                }else{
                    if(gFather.leftSon == father){
                        gFather.leftLink(newNode);
                    }else{
                        gFather.rightLink(newNode);
                    }
                }
                this.delAjust(gFather);
            }
        }
    }
}

RedBlackTree.prototype.delete = function (key) {
    var node = this.find(key);
    if(node == null)return false;
    //has two child
    var old = node, child = null, father = null;
    if(node.leftKey()!=null && node.rightKey()!=null){
        node = node.rightSon;
        while(node.leftKey()!=null){
            node = node.leftSon;
        }
        child = node.rightSon;
        father = node.father;
        if(father.leftSon==node){
            father.leftLink(child);
        }else{
            father.rightLink(child);
        }
        if(old.color == this.RED)rbtView.changeToRed(node.key);
        else rbtView.changeToBlack(node.key);
        // rbtView.cover(node.key,old.key);
        rbtView.delnode(node.key);
        rbtView.ch
        old.key = node.key;
    }else{
        if(node.leftKey() != null){
            child = node.leftSon;
        }else{
            child = node.rightSon;
        }
        father = node.father;
        if(father==null){
            this.root = node;
            this.root.father = null;
            this.root.color = this.BLACK;
        }else{
            if(father.leftSon==node){
                father.leftLink(child);
            }else{
                father.rightLink(child);
            }
        }
        console.log(node.key);
        rbtView.delnode(node.key);
    }
    if(node.color == this.BLACK){
        setTimeout(function () {
            this.delAjust(node);
        }.bind(this),2000);
    }
    return true;
}

// var main = function () {
//     var tree = new RedBlackTree();
//     tree.insert(3);
//     tree.insert(2);
//     tree.insert(1);
//     tree.insert(6);
//     tree.insert(100);
//     tree.insert(29);
//     tree.delete(100);
//     tree.delete(2);
//     tree.delete(3);
//     tree.delete(29);
//     console.log(tree.root);
// }();
//
