#include <iostream>
#include <iomanip>
#include <iterator>
#include <vector>
#include <map>
#include <typeinfo>

using std::vector;
using std::ostream;
using std::endl;
using std::string;
using std::map;

typedef unsigned int idx;
// FIXME ints that > 0
typedef unsigned int idx_nature;

class Sequence;
class Sequence_Iterator;

/******* Sequence_Iterator *******/
/*********************************/

class Sequence_Iterator {
public:
  Sequence_Iterator():
    _index(0),
    _seq(nullptr)
    {};
  Sequence_Iterator(idx idx, Sequence* seq):
    _index(idx),
    _seq(seq)
    {};
  Sequence_Iterator(const Sequence_Iterator &it):
    _index(it._index),
    _seq(it._seq)
    {};

  inline bool operator==(const Sequence_Iterator &it) const {
    return _index == it._index;
  }
  inline bool operator!=(const Sequence_Iterator &it) const {
    return !(*this == it);
  }
  inline int operator*();
  inline operator int() const {
    return _index;
  }
  inline Sequence_Iterator operator+(int);
  inline Sequence_Iterator &operator++() {
    _index++;
    return *this;
  }
  inline Sequence_Iterator operator++(int) {
    Sequence_Iterator it = *this;
    _index++;
    return it;
  }

private:
  idx _index;
  Sequence* _seq;
};

/******* Sequence *******/
/************************/

class Sequence {
public:
  int at(idx);
  void print(ostream &);
  bool is_elem(int);

  friend class Sequence_Iterator;
  typedef Sequence_Iterator iterator;
  inline Sequence_Iterator begin() {
    return Sequence_Iterator(_pos_begin - 1, this);
  }
  inline Sequence_Iterator end() {
    return Sequence_Iterator(_pos_end - 1, this);
  }

  virtual ~Sequence() {};

  static int max_elem_size() { return _maxsize; };

protected:
  Sequence(idx_nature);
  Sequence(idx_nature, idx_nature);
  Sequence(const Sequence &);

  virtual void gen_elem(idx) = 0;

  vector<int> _nums;
  idx_nature _pos_begin;
  idx_nature _pos_end;

  static const unsigned int _maxsize = 40;
};

/* Sequence Member Fns */

Sequence::Sequence (idx_nature end) {
  if (end <= 0)
    throw "idx must be positive";
  if (end > _maxsize)
    throw "size of idx overflow";
  _pos_begin = 1;
  _pos_end  = end;
}

Sequence::Sequence (idx_nature begin, idx_nature end) {
  if (begin >= end)
    throw "begin must smaller than end";
  if (begin < 0)
    throw "idx must be positive";
  if (end - begin > _maxsize)
    throw "size of idx overflow";
  _pos_begin = begin;
  _pos_end = end;
}

Sequence::Sequence (const Sequence &seq) {
  _pos_begin = seq._pos_begin;
  _pos_end = seq._pos_end;
  for (auto item : seq._nums)
    _nums.push_back(item);
}

int Sequence::at (idx idx) {
  if (idx + 1 > _maxsize)
    throw "idx size overflow";
  if (idx >= _nums.size())
    gen_elem(idx);
  return _nums.at(idx);
}

void Sequence::print (ostream &os = std::cout) {
  // TODO setw refers to the largest number in the sequence
  const int padding = (_pos_end / 5)
    ? _pos_end / 5 * 2
    : 3;
  // FIXME: result of typeid().name is not right
  os << "Sequence " << typeid(*this).name()
     << " from [" << _pos_begin 
     << " to " << _pos_end 
     << "):\n";
  for (idx i = _pos_begin; i < _pos_end; i++) {
    os << std::setw(padding)
       << at(i - 1)
       << (((i + 1 - _pos_begin) % 10 == 0) && (i < _pos_end - 1) ? "\n" : "");
  }
  os << endl;
}

bool Sequence::is_elem (int target) {
  int last = _nums.back();
  if (last == target)
    return true;
  else if (last > target) {
    for (auto elem : _nums) {
      if (elem == target)
        return true;
    }
    return false;
  }
  else if (last < target) {
    while (
      _nums.size() < _maxsize &&
      _nums.back() < target
    ) {
      gen_elem(_nums.size());
    }
    const bool is_find = _nums.back() == target;
    const bool is_full = _nums.size() == _maxsize;
    if (is_full && !is_find)
      throw "overflow when find target in Sequence";
    return is_find;
  }
  // ? how to avoid this return
  return false;
}

ostream &operator<< (ostream &os, Sequence* seq) {
  seq->print(os);
  return os;
}

/******* Sequence_Iterator *******/
/*********************************/

inline int Sequence_Iterator::operator* () {
  if (_index + 1 > _seq->_maxsize)
    throw "iterator overflow";
  if (!_seq)
    throw "iterator null";
  return _seq->at(_index);
}

inline Sequence_Iterator Sequence_Iterator::operator+ (int i) {
  const int target = _index + i;
  if (target < 0 || target > (int)_seq->_maxsize)
    throw "out of range";
  _index += i;
  return *this;
}

/******* Fibonacci *******/
/*************************/

class Fibonacci : public Sequence {
public:
  Fibonacci(idx_nature end): Sequence(end) {};
  Fibonacci(idx_nature begin, idx_nature end): Sequence(begin, end) {};
  Fibonacci(const Fibonacci &seq): Sequence(seq) {};
private:
  virtual void gen_elem(idx idx) {
    if (idx == 0 || idx == 1) {
      _nums.push_back(1);
    } else {
      _nums.push_back(
        at(idx - 1) +
        at(idx - 2)
      );
    }
  }
};

/******* Pentagonal *******/
/**************************/

class Pentagonal : public Sequence {
public:
  Pentagonal(idx_nature end): Sequence(end) {};
  Pentagonal(idx_nature begin, idx_nature end): Sequence(begin, end) {};
  Pentagonal(const Pentagonal &seq): Sequence(seq) {};
private:
  virtual void gen_elem(idx idx) {
    const int n = _nums.size() + 1;
    _nums.push_back(n * (3*n - 1) / 2);
  }
};

/******* Squares *******/
/**************************/

class Squares : public Sequence {
public:
  Squares(idx_nature end): Sequence(end) {};
  Squares(idx_nature begin, idx_nature end): Sequence(begin, end) {};
  Squares(const Squares &seq): Sequence(seq) {};
private:
  virtual void gen_elem(idx idx) {
    _nums.push_back((idx + 1) * (idx + 1));
  }
};