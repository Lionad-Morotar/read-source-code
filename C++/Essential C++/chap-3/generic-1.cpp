#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

using std::cout;
using std::string;
using std::vector;

vector<int> less_than_10(const vector<int> &vec)
{
  vector<int> nvec;
  for (int i : vec) if (i < 10) nvec.push_back(i);
  return nvec;
}

int main()
{
  vector<int> vec = {1, 45, 6456, 12, 5, 98, 3, 11, 2};

  vector<int> out = less_than_10(vec);

  for(int i : out) cout << i << ' ';
}