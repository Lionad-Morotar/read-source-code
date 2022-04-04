#include <algorithm>
#include <iostream>
#include <functional>
#include <string>
#include <vector>

using namespace std;
using namespace std::placeholders;

inline bool less_than(int a, int b)
{
  return a < b;
}

template <typename Compare>
vector<int> filter(
  const vector<int> &vec,
  Compare compare
) {
  vector<int> nvec;
  vector<int>::const_iterator iter = vec.begin();

  while (iter != vec.end()) {
    if (compare(*iter))
      nvec.push_back(*iter);
    iter++;
  }
  return nvec;
}

int main()
{
  vector<int> vec = {1, 45, 6456, 12, 5, 98, 3, 11, 2};

  const auto compare = bind(less_than, _1, 10);

  vector<int> out = filter(vec, compare);

  for(int i : out) cout << i << ' ';
}