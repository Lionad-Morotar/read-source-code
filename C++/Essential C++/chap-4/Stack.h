#include <string>
#include <vector>

class Stack {
public:
  bool push(const std::string &);
  bool pop(std::string &);
  bool peek(const std::string &);
  bool empty();
  bool full();
  int  size();
  bool find(const std::string &);
  int count(const std::string &);

private:
  const unsigned int _maxsize = 50;
  std::vector<std::string> _stack;
};

inline int Stack::size () {
  return _stack.size();
}

inline bool Stack::full () {
  return _stack.size() == _maxsize;
}

inline bool Stack::empty () {
  return _stack.size() == 0;
}

bool Stack::peek (const std::string & str) {
  if (empty())
    return false;
  else if (_stack.back() == str)
    return true;
  else return false;
}

bool Stack::push (const std::string & str) {
  if (full())
    return false;
  else {
    _stack.push_back(str);
    return true;
  }
}

bool Stack::pop (std::string & str) {
  if (empty())
    return false;
  else {
    str = _stack.back();
    _stack.pop_back();
    return true;
  }
}

bool Stack::find (const std::string & str) {
  for (std::string item : _stack) {
    if (item == str)
      return true;
  }
  return false;
}

int Stack::count(const std::string & str) {
  int occurs = 0;
  for (std::string item : _stack) {
    if (item == str)
      occurs++;
  }
  return occurs;
}
