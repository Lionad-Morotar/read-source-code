#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <algorithm>

using namespace std;

inline bool sort_by_strlen(string a, string b)
{
  return a < b;
}

int main()
{
  vector<string> words(0);

  ifstream infile("1-7-1.txt");
  if (!infile)
  {
    cerr << "Err! Read 1-7-1.txt err." << endl;
    return 1;
  }

  string readin;
  while (!infile.eof())
  {
    infile >> readin;
    if (words.size() == words.max_size())
    {
      words.resize(words.max_size() * 2);
    }
    words.push_back(readin);
  }

  for (string item : words)
  {
    cout << item << " ";
  }
  cout << endl;

  sort(words.begin(), words.end(), sort_by_strlen);
  for (string item : words)
  {
    cout << item << " ";
  }
  cout << endl;

  ofstream writefile("1-7-2.txt");
  if (!writefile)
  {
    cerr << "Err! Read 1-7-2.txt err." << endl;
    return 1;
  }
  for (string item : words)
  {
    writefile << item << " ";
    // if (item.find('.') != -1) {
    //   writefile << endl;
    // }
  }
}
