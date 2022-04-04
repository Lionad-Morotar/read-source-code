#include <iostream>
#include <fstream>
#include <vector>
#include <map>
#include <set>
#include <string>
#include <iterator>
#include <algorithm>

using namespace std;

int main() {
  ofstream outfile_odd("3-4-odd.txt");
  ofstream outfile_dou("3-4-dou.txt");
  if (!outfile_odd || !outfile_dou)
    throw "File not exist, pls check 3-1-1.txt and 3-1-2.txt.";

  cout << "Enter some integers (ctrl+d then press enter to commit): ";
  vector<int> vec;
  istream_iterator<int> iter(cin), eos;
  copy(iter, eos, back_inserter(vec));

  vector<int> odd, dou;
  for (int i : vec) {
    i % 2
      ? odd.push_back(i)
      : dou.push_back(i);
  }

  ostream_iterator<string> oter_odd(outfile_odd, " ");
  for (int i : odd) *oter_odd++ = to_string(i);

  ostream_iterator<string> oter_dou(outfile_dou, "\n");
  for (int i : dou) *oter_dou++ = to_string(i);
}