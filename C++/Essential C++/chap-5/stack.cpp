#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Stack {
public:
  void push(const string &);
  string pop();
  inline bool full() { return _stack.size() == _maxsize; };
  inline bool empty() { return _stack.size() == 0; };
  inline int size() { return _stack.size(); };
  inline int maxsize() { return _maxsize; };
  bool find(const string &);
  int count(const string &);

private:
  const unsigned int _maxsize = 5;
  vector<string> _stack;
};

void Stack::push (const string &str) {
  if (full())
    throw "stack is full";
  _stack.push_back(str);
}

string Stack::pop () {
  if (empty())
    throw "stack is empty";
  string str = _stack.back();
  _stack.pop_back();
  return str;
}

bool Stack::find (const string & str) {
  for (string item : _stack) {
    if (item == str)
      return true;
  }
  return false;
}

int Stack::count(const string & str) {
  int occurs = 0;
  for (string item : _stack) {
    if (item == str)
      occurs++;
  }
  return occurs;
}

/******* Main *******/
/********************/

int main () {
  Stack stack;

  cout << "stack is empty: " << (stack.empty() ? "yes" : "no") << endl;
  cout << "stack maxsize: " << stack.maxsize() << endl;

  cout << "then push in " << stack.maxsize() << " elems...\n";
  for (int i = 0; i < stack.maxsize(); i++) {
    const string pushin = to_string(i + 1);
    cout << "push in:" << pushin << "\n";
    stack.push(pushin);
  }

  cout << "stack is full: " << (stack.full() ? "yes" : "no") << endl;

  cout << "then pop one out: " << stack.pop() << endl;

  cout << "stack size: " << stack.size() << endl;
}