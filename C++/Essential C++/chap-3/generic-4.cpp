#include <algorithm>
#include <iostream>
#include <functional>
#include <string>
#include <vector>
#include <iterator>

using namespace std;
using namespace std::placeholders;

template <
  typename Copyfrom,
  typename Copyto,
  typename Compare
>
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

int main()
{
  vector<int> vec = {1, 45, 6456, 12, 5, 98, 3, 11, 2};
  vector<int> out(vec.size());
  const auto compare = bind(less<int>(), _1, 10);
  filter(vec.begin(), vec.end(), out.begin(), compare);

  for(int i : out) cout << i << ' ';
  cout << '\n';


  int arr[9] = {1, 45, 6456, 12, 5, 98, 3, 11, 2};
  int arr_out[9] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
  filter(arr, arr + 9, arr_out, compare);
  
  for(int i : arr_out) cout << i << ' ';
  cout << '\n';
  
  
  vector<int> out2(0);
  filter(vec.begin(), vec.end(), inserter(out2, out2.end()), compare);

  for(int i : arr_out) cout << i << ' ';
  cout << '\n';
}