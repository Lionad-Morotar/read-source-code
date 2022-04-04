#include <iostream>
#include <iomanip>
#include <iterator>
#include <vector>
#include <map>

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

class Sequence_Iterator {
public:
  Sequence_Iterator();
  Sequence_Iterator(idx idx, Sequence *);
  Sequence_Iterator(const Sequence_Iterator &);
  bool operator==(const Sequence_Iterator &) const;
  bool operator!=(const Sequence_Iterator &) const;
  int operator*() const;
  operator int() const;
  Sequence_Iterator& operator++();
  Sequence_Iterator operator++(int);
private:
  idx _index;
  Sequence* _seq;
};


/******* Sequence *******/
/*************************/

class Sequence {
public:

  enum Type { Unset, Fibonacci, Pentagonal };
  class TypeReturn {
  public:
    TypeReturn (const enum Type t): _type(t) {};
    operator string() const { return _typenames.at(_type); };
    operator int() const { return _type; };
  private:
    const enum Type _type;
  };

  /* constructor */
  Sequence(enum Type, idx_nature, idx_nature);
  Sequence(const Sequence &);

  void print(ostream &) const;

  friend class TypeReturn;
  TypeReturn type () const { return TypeReturn(_type); };

  /* iterator */
  friend class Sequence_Iterator;
  typedef Sequence_Iterator iterator;
  Sequence_Iterator begin();
  Sequence_Iterator end();

  /* static member fn */
  static void calc_to_pos(const Sequence &, idx);
  static void calc_next(const Sequence &);
  static int at(const Sequence &, idx);
  static bool is_elem(int, Sequence &);

  /* elem generator fns */
  typedef void(*GenFn)(const Sequence &);
  static void gen_fibonacci(const Sequence &);
  static void gen_pentagonal(const Sequence &);

private:
  /* nature indexes */
  enum Type _type;
  string _typename;
  GenFn _gen;
  vector<int>* _nums;
  idx_nature _pos_begin;
  idx_nature _pos_end;

  static const int _maxsize = 40;
  static map<Type, vector<int>> _store;
  static map<Type, string> _typenames;
};

/* Sequence Static Initialize */

map<Sequence::Type, vector<int>> Sequence::_store = {
  {Sequence::Type::Fibonacci, {1, 1}},
  {Sequence::Type::Pentagonal, {}},
};
map<Sequence::Type, string> Sequence::_typenames = {
  {Sequence::Type::Fibonacci, "fibonacci"},
  {Sequence::Type::Pentagonal, "pentagonal"},
};

/* Sequence Member Fns */

Sequence::Sequence (Sequence::Type type, idx_nature left, idx_nature right) {
  if (left >= right)
    throw "wrong input";
  if (right - left > _maxsize)
    throw "position overflow";

  _type = type;
  _pos_begin = left;
  _pos_end = right;
  _typename = _typenames.at(type);
  _nums = & Sequence::_store.at(type);

  switch (type) {
    case Sequence::Type::Fibonacci: {
      _gen = & Sequence::gen_fibonacci;  
      break;
    }
    case Sequence::Type::Pentagonal: {
      _gen = & Sequence::gen_pentagonal;
      break;
    }
    default:
      throw "wrong type";
  };
}

// ? how to check integrity
// Sequence::Sequence (idx_nature left, idx_nature right):
//   _pos_begin(left),
//   _pos_end(right)
//   {}

Sequence::Sequence (const Sequence &f):
  _type(f._type),
  _typename(f._typename),
  _gen(f._gen),
  _nums(f._nums),
  _pos_begin(f._pos_begin),
  _pos_end(f._pos_end)
  {}

void Sequence::calc_to_pos (const Sequence &seq, idx idx) {
  while (seq._nums->size() < idx + 1) {
    calc_next(seq);
  }
}

void Sequence::gen_fibonacci (const Sequence &seq) {
  if (seq._nums->size() == 0)
    seq._nums->push_back(1),
    seq._nums->push_back(1);
  else if (seq._nums->size() == 1)
    seq._nums->push_back(1);
  else
    seq._nums->push_back(
      seq._nums->at(seq._nums->size() - 1) +
      seq._nums->at(seq._nums->size() - 2)
    );
}

void Sequence::gen_pentagonal (const Sequence &seq) {
  const int n = seq._nums->size() + 1;
  seq._nums->push_back(n * (3*n - 1) / 2);
}

void Sequence::calc_next (const Sequence &seq) {
  if (seq._nums->size() == _maxsize)
    throw "sequence size overflow";
  else
    seq._gen(seq);
}

int Sequence::at (const Sequence &seq, idx idx) {
  if (idx + 1 > _maxsize)
    throw "idx range overflow";
  if (idx >=seq._nums->size())
    calc_to_pos(seq, idx);
  return seq._nums->at(idx);
}

bool Sequence::is_elem (int elem, Sequence &seq) {
  int last = seq._nums->back();
  if (last == elem)
    return true;
  else if (last > elem) {
    for (int item : *seq._nums) {
      if (item == elem)
        return true;
    }
    return false;
  }
  else if (last < elem) {
    while (
      seq._nums->size() < _maxsize &&
      seq._nums->back() < elem
    ) {
      calc_next(seq);
    }
    const bool is_find = seq._nums->back() == elem;
    const bool is_full = seq._nums->size() == _maxsize;
    if (is_full && !is_find)
      throw "overflow in finding";
    return is_find;
  }

  // ? how to avoid this return
  return false;
}

void Sequence::print (ostream &oss = std::cout) const {
  const int padding = (_pos_end / 5)
    ? _pos_end / 5 * 2
    : 3;
  // cout << _pos_end << ' ' << padding;

  oss << "Sequence " << _typename 
     << " from [" << _pos_begin 
     << " to " << _pos_end 
     << "):\n";
  for (unsigned int i = _pos_begin; i < _pos_end; i++) {
    oss
      << std::setw(padding)
      << at(*this, i - 1)
      << (((i + 1 - _pos_begin) % 10 == 0) && (i < _pos_end - 1) ? "\n" : "");
  }
  oss << endl;
}

// https://stackoverflow.com/questions/10744787/operator-must-take-exactly-one-argument
ostream& operator<< (ostream &oss, const Sequence &fb) {
  fb.print(oss);
  return oss;
}

inline Sequence_Iterator Sequence::begin () {
  return Sequence_Iterator(_pos_begin - 1, this);
}

inline Sequence_Iterator Sequence::end () {
  return Sequence_Iterator(_pos_end - 1, this);
}

/******* Fibonacci_iterator *******/
/**********************************/

Sequence_Iterator::Sequence_Iterator ():
  _index(0),
  _seq(nullptr)
  {}

Sequence_Iterator::Sequence_Iterator (idx idx, Sequence* seq):
  _index(idx),
  _seq(seq)
  {}

Sequence_Iterator::Sequence_Iterator (const Sequence_Iterator &fi):
  _index(fi._index),
  _seq(fi._seq)
  {}

inline bool Sequence_Iterator::operator== (const Sequence_Iterator &fi) const {
  return _index == fi._index && _seq == fi._seq;
}

inline bool Sequence_Iterator::operator!= (const Sequence_Iterator &fi) const {
  return !(this == &fi);
}

inline int Sequence_Iterator::operator*() const {
  if (_index + 1 > Sequence::_maxsize)
    throw "iterator overflow";
  else if (_index + 1 > _seq->_nums->size()) {
    Sequence::calc_to_pos(*_seq, _index);
  }
  return _seq->_nums->at(_index);
}

inline Sequence_Iterator& Sequence_Iterator::operator++() {
  ++_index;
  return *this;
}

inline Sequence_Iterator Sequence_Iterator::operator++(int) {
  Sequence_Iterator tmp = *this;
  ++_index;
  return tmp;
}

Sequence_Iterator::operator int() const {
  return _index;
}