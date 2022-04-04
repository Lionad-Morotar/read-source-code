#include <algorithm>
#include <iostream>
#include <iomanip>
#include <functional>
#include <string>
#include <vector>
#include <iterator>

#include "Printer.h"

using namespace std;
using namespace std::placeholders;


template <typename Copyfrom, typename Copyto, typename Compare>
Copyto filter(
  Copyfrom left,
  Copyfrom right,
  Copyto at,
  Compare compare
) {
  while (left != right) {
    if (compare(*left))
      *at++ = *left;
    left++;
  }
  return at;
}


// * 类模板不能重载
template <typename Elem>
class CompareWith {
public:
  CompareWith(Elem val) : val(val) {}
  inline bool operator()(Elem &data) {
    return bind(less<Elem>(), _1, val)(data);
  }
private:
  Elem &val;
};


template <typename Elem, typename Fn = less<Elem>>
class Compare {
public:
  Compare(Elem val) : val(val) {}
  inline bool operator()(Elem &data) {
    return Fn()(data, val);
  }
private:
  Elem &val;
};


template <int val>
class CompareMultiple {
public:
  bool operator()(int &a, int &b) {
    return a < b * val;
  }
};


template <typename Elem>
void print(vector<Elem> &v) {
  for (auto item : v)
    cout << setw(3) << item << " ";
  cout << endl;
}


int main()
{
  Printer<ostream> printer(cout);
  vector<int> vec = {1, 45, 32, 57, 64, 56, 12, 33, 98, 37, 27, 80, 48, 96, 11, 2, 100, 8, 22, 9};

  printer.print("Testcases for Compare:\n");
  
  {
    vector<int> out(vec.size());
    auto compare_with = bind(less<int>(), _1, 10);
    filter(vec.begin(), vec.end(), out.begin(), compare_with);
    print(out);
  }

  {
    vector<int> out(vec.size());
    CompareWith<int> compare_with(10);
    filter(vec.begin(), vec.end(), out.begin(), compare_with);
    print(out);
  }

  {
    vector<int> out(vec.size());
    Compare<int, CompareMultiple<5>> compare_with(10);
    filter(vec.begin(), vec.end(), out.begin(), compare_with);
    print(out);
  }
}