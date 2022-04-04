#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

using std::cout;
using std::string;
using std::vector;

inline bool less_than(int a, int b)
{
  return a < b;
}

inline bool big_than(int a, int b)
{
  return a > b;
}

vector<int> filter(
  const vector<int> &vec,
  bool (* filter_method)(int, int),
  const int target_value
) {
  vector<int> nvec;
  for (int i : vec)
    if (filter_method(i, target_value))
      nvec.push_back(i);
  return nvec;
}

int main()
{
  vector<int> vec = {1, 45, 6456, 12, 5, 98, 3, 11, 2};

  vector<int> out = filter(vec, less_than, 10);

  for(int i : out) cout << i << ' ';
}