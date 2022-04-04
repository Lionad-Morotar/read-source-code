#include <iostream>
#include <string>
#include <vector>

#include "bstree.h"

using namespace std;

int main () {

  tree::BSTree<string> bst;
  tree::Tree<string>* pbst = &bst;

  cout << "create a new tree, its empty: " << (bst.empty() ? "yes" : "no") << endl;

  bst.insert("Piglet");
  bst.insert("Eyeore");
  bst.insert("Roo");

  cout << "then insert three vals, its size: " << bst.size() << endl;

  cout << "root value: " << pbst->root->data << endl;
  cout << "root left : " << (*pbst->root->childs.at(0))->data << endl;
  cout << "root right: " << (*pbst->root->childs.at(1))->data << endl;

  bst.insert("Tigger");
  bst.insert("Chris");
  bst.insert("Pooh");
  bst.insert("Kanga");

  cout << "then insert more, its size: " << bst.size() << endl;

  cout << endl;
  cout << "preorder of tree: " << bst.preorder() << endl;

  bst.remove("Piglet");
  cout << "[remove] root 'Piglet'" << endl;
  cout << "preorder of tree: " << bst.preorder() << endl;

  bst.remove("Pooh");
  cout << "[remove] leaf 'Pooh'" << endl;
  cout << "preorder of tree: " << bst.preorder() << endl;

  bst.remove("Eyeore");
  cout << "[remove] 'Eyeore' which has left but no right" << endl;
  cout << "preorder of tree: " << bst.preorder() << endl;

  bst.remove("Roo");
  cout << "[remove] 'Roo' which has right but no left" << endl;
  cout << "preorder of tree: " << bst.preorder() << endl;
}