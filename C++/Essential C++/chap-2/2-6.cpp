#include <iomanip>
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using std::cout;
using std::vector;
using std::string;
using std::setprecision;
using std::endl;

// template <typename T1>
// T1 max_element(T1 *left, T1 *right)
// {
//   if (left == right) return right

//   T1 *maxist = left;
//   while (left++ != right) {
//     if (*left > *maxist) {
//       maxist = left;
//     }
//   }
//   return maxist
// }

template <typename T1>
inline T1 max(T1 a, T1 b)
{
  return a < b ? b : a;
}

template <typename T2>
inline T2 max(vector<T2> *vec)
{
  sort(vec->begin(), vec->end());
  return vec->back();
}

template <typename T3>
inline T3 max(T3 *nums, int size)
{
  return *std::max_element(nums, nums + size);
}

int main()
{
  cout << "max 1, 2: " << max(1, 2) << endl;
  cout << "max 1.1, 2.2: " << setprecision(2) << max(1.2, 2.2) << endl;
  cout << "max \"abc\", \"aaa\": " << max("abc", "aaa") << endl;

  vector<int> vec = {7, 34, 2124, 435, 6, 1, 0};
  cout << "max vector(7, 34, 2124, 435, 6, 1, 0): " << max(&vec) << endl;

  vector<float> vec_float = {7.1, 34.2, 2124.3, 435.4, 6.5, 1.6, 0.7};
  cout << "max vector(7.1, 34.2, 2124.3, 435.4, 6.5, 1.6, 0.7): " << setprecision(2) << max(&vec_float) << endl;

  int nums[7] = {7, 34, 2124, 435, 6, 1, 0};
  cout << "max arr(7, 34, 2124, 435, 6, 1, 0): " << max(nums, 7) << endl;

  float nums_float[7] = {7.1, 34.2, 2124.3, 435.4, 6.5, 1.6, 0.7};
  cout << "max arr(7.1, 34.2, 2124.3, 435.4, 6.5, 1.6, 0.7): " << max(nums_float, 7) << endl;

  string strs[3] = {"asdf", "sdfa", "fdsa"};
  cout << "max arr(\"asdf\", \"sdfa\", \"fdsa\"): " << max(strs, 3) << endl;
}
