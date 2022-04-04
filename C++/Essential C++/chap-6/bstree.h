#include <iostream>
#include <string>
#include <vector>
#include <map>

namespace tree {

using namespace std;

/************************ Interface **************************/

template <typename Elem>
class Tree;
template <typename Elem>
class TreeNode;
template <typename Elem>
class BSTree;
template <typename Elem>
class BSTreeNode;

/******* TreeNode *******/
/************************/

template <typename Elem>
class TreeNode {
public:
  friend class BSTree<Elem>;
  typedef TreeNode<Elem>* PTreeNode;

  Elem data;
  TreeNode<Elem>* parent;
  vector<PTreeNode*> childs;

  void remove() {
    if (!this->parent)
      throw "Can't remove node without parent";
    for (unsigned i = 0; i < this->parent->childs.size(); i++) {
      if (*this->parent->childs[i] == this)
        *this->parent->childs[i] = nullptr;
    }
    this->parent = nullptr;
  }
  // PTreeNode copy() {
  //   return new TreeNode<Elem>(data, parent, childs);
  // }
  void copy(const PTreeNode node) {
    data = node->data;
    parent = node->parent;
    childs = node->childs;
  }

protected:
  TreeNode<Elem>(const Elem &data):
    data(data),
    parent(nullptr)
  {};
  void set_childs(vector<PTreeNode*> &childs) {
    this->childs = childs;
  }
};

/******* Tree *******/
/********************/

template <typename Elem>
class Tree {
public:
  typedef TreeNode<Elem>* PTreeNode;
  virtual ~Tree() {};

  PTreeNode root;

  // void copy() const;
  bool empty() const { return root == nullptr; };
  unsigned size() const;

protected:
  // TODO construct with a sequence
  Tree<Elem> ();
  // Tree<Elem> (const Tree&);
  // Tree<Elem> &operator=(const Tree&);

  virtual void insert(Elem data) = 0;
  virtual void remove(Elem data) = 0;
};

/******* Binary Search Tree *******/
/**********************************/

template <typename Elem>
class BSTreeNode: public TreeNode<Elem> {
public:
  friend class BSTree<Elem>;
  typedef TreeNode<Elem>* PTreeNode;
  typedef BSTreeNode<Elem>* PBSTreeNode;

  PBSTreeNode left = nullptr;
  PBSTreeNode right = nullptr;

  BSTreeNode(const Elem &data):
    TreeNode<Elem>(data),
    left(nullptr),
    right(nullptr)
  {
    vector<PTreeNode*> childs = {
      (PTreeNode*)(&left),
      (PTreeNode*)(&right)
    };
    TreeNode<Elem>::set_childs(childs);
  };

  inline void link_left(PBSTreeNode node) {
    this->left = node;
    node->parent = (PTreeNode)this;
  }
  inline void link_right(PBSTreeNode node) {
    this->right = node;
    node->parent = (PTreeNode)this;
  }
  void copy(const PBSTreeNode node) {
    left = node->left;
    right = node->right;
    TreeNode<Elem>::copy((PTreeNode)node);  
  }
};

template <typename Elem>
class BSTree : public Tree<Elem> {
public:
  typedef TreeNode<Elem>* PTreeNode;
  typedef BSTreeNode<Elem>* PBSTreeNode;
  BSTree();
  // BSTree(const BSTree&);
  // BSTree &operator=(const BSTree&);

  string preorder() const;

  void insert(PBSTreeNode node);
  virtual void insert(Elem data);
  // void remove(PTreeNode node);
  virtual void remove(Elem data);
};

/************************ Implement **************************/

/******* Tree *******/
/********************/

template <typename Elem>
Tree<Elem>::Tree(): root(nullptr) {};

template <typename Elem>
unsigned Tree<Elem>::size() const {
  // * assume there's no loop in the tree
  unsigned size = 0;
  if (root) {
    PTreeNode cur;
    vector<PTreeNode> nodes = { root };
    while (nodes.size() != 0) {
      cur = nodes.back();
      nodes.pop_back();
      size++;
      for (PTreeNode* child : cur->childs) {
        if (*child)
          nodes.push_back((PTreeNode)(*child));
      }
    }
  }
  return size;
}

/******* Binary Search Tree *******/
/**********************************/

template <typename Elem>
BSTree<Elem>::BSTree(): Tree<Elem>() {}

template <typename Elem>
string BSTree<Elem>::preorder() const {
  string res = "";
  if (Tree<Elem>::root) {
    PBSTreeNode cur;
    vector<PBSTreeNode> nodes = { (PBSTreeNode)(Tree<Elem>::root) };
    while (nodes.size() != 0) {
      cur = nodes.back();
      nodes.pop_back();
      res += cur->data + " ";
      if (cur->right)
        nodes.push_back(cur->right);
      if (cur->left)
        nodes.push_back(cur->left);
    }
  }
  return res;
}

template <typename Elem>
void BSTree<Elem>::insert (PBSTreeNode node) {
  if (Tree<Elem>::root == nullptr) {
    Tree<Elem>::root = node;
    return;
  }
  PTreeNode cur_base = Tree<Elem>::root;
  auto cur = (BSTreeNode<Elem>*)cur_base;
  while (cur_base != nullptr) {
    if (node->data < cur_base->data) {
      if (cur->left == nullptr) {
        cur->link_left(node);
        return;
      } else {
        cur_base = cur->left;
        cur = (BSTreeNode<Elem>*)cur_base;
      }
    } else {
      if (cur->right == nullptr) {
        cur->link_right(node);
        return;
      } else {
        cur_base = cur->right;
        cur = (BSTreeNode<Elem>*)cur_base;
      }
    }
  }
}

template <typename Elem>
void BSTree<Elem>::insert (Elem data) {
  insert(new BSTreeNode<Elem>(data));
}

template <typename Elem>
void BSTree<Elem>::remove (Elem data) {
  PTreeNode cur_base = Tree<Elem>::root;
  PBSTreeNode cur = (PBSTreeNode)cur_base;
  while (cur_base != nullptr) {
    if (cur_base->data == data) {
      break;
    }
    if (cur_base->data < data) {
      cur_base = cur->right;
      cur = (PBSTreeNode)cur_base;
    } else {
      cur_base = cur->left;
      cur = (PBSTreeNode)cur_base;
    }
  }
  PBSTreeNode cur_parent = (PBSTreeNode)((PTreeNode)cur->parent);
  if (cur->left == nullptr && cur->right == nullptr) {
    // cout << cur_base->data << " no left no right" << endl;
    cur->remove();
  }
  else if (cur->left != nullptr && cur->right == nullptr) {
    // cout << cur_base->data << " has left no right" << endl;
    cur->remove();
    if (cur_parent->left == cur)
      cur_parent->link_left(cur->left);
    else if (cur_parent->right == cur)
      cur_parent->link_right(cur->left);
  }
  else if (cur->left == nullptr && cur->right != nullptr) {
    // cout << cur_base->data << " has right no left" << endl;
    cur->remove();
    if (cur_parent->left == cur)
      cur_parent->link_left(cur->right);
    else if (cur_parent->right == cur)
      cur_parent->link_right(cur->right);
  }
  else if (cur->left != nullptr && cur->right != nullptr) {
    // cout << cur_base->data << " has left and right" << endl;
    PBSTreeNode it = cur->left;
    PBSTreeNode max_at_left_tree = cur;
    while (it != nullptr) {
      max_at_left_tree = it;
      it = it->right;
    }
    max_at_left_tree->left = cur->left;
    max_at_left_tree->right = cur->right;
    cur->BSTreeNode<Elem>::copy(max_at_left_tree);
    cur->parent = nullptr;
    max_at_left_tree->remove();
  }
}

};