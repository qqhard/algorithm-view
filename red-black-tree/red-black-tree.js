/**
 * Created by hard on 16-7-17.
 */


console.log('test');


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

RedBlackNode.prototype.changeColor = function() {
    this.color = !this.color;
}

RedBlackNode.prototype.leftLink = function(son) {
    this.leftSon = son;
    son.father = this;
}

RedBlackNode.prototype.rightLink = function(son) {
    this.rightSon = son;
    son.father = this;
}

RedBlackNode.prototype.leftKey = function(son) {
    return this.leftSon.key;
}

RedBlackNode.prototype.rightKey = function(son) {
    return this.rightSon.key;
}

RedBlackTree.prototype.insert = function(key) {
    if(this.root==null){
        this.root = new RedBlackNode(key,true);
        this.root.leftLink(new RedBlackNode(null,true));
        this.root.rightLink(new RedBlackNode(null,true));
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
    


}

var tree = new RedBlackTree();
tree.insert(3);
