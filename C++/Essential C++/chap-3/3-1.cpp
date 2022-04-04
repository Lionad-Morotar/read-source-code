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
  ifstream infile("3-1-1.txt");
  ofstream outfile("3-1-2.txt");
  if (!infile || !outfile)
    throw "File not exist, pls check 3-1-1.txt and 3-1-2.txt.";
  
  istream_iterator<string> iter(infile);
  istream_iterator<string> eof;
  ostream_iterator<string> oter(outfile, " ");

  set<string> excludes = {"a", "In", "ac", "at", "et", "eu", "ex", "id", "in", "mi", "ut"};
  map<string, int> words;
  while (iter++ != eof) {
    if (excludes.count(*iter))
      continue;
    words[*iter]++;
  }

  for (auto item : words) {
    cout << item.first << " : " << item.second << "\n";
  }
}