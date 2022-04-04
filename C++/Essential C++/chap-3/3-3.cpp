#include <iostream>
#include <fstream>
#include <vector>
#include <map>
#include <set>
#include <string>
#include <iterator>
#include <algorithm>
#include <sstream>

using namespace std;

typedef vector<string> tchildsvec;
typedef map<string, tchildsvec> tfamilies;

tfamilies read_family_info();
void user_query(tfamilies &);

int main() {
  tfamilies fam = read_family_info();
  user_query(fam);
}

tfamilies read_family_info()
{
  ifstream infile("3-3.txt");

  tfamilies family;
  string readline;
  while (getline(infile, readline)) {
    stringstream ss(readline);
    vector<string> vec;
    string buffer;
    while (ss >> buffer)
      vec.push_back(buffer);
    
    if (vec.empty()) continue;

    string surname = vec.at(0);
    vec.erase(vec.begin());

    family[surname] = vec;
  }

  return family;
}

void user_query(tfamilies &fam)
{
  cout << "Welcome to family search app.\n"
    << "[NAME] Enter name to query family info.\n"
    << "[SHOW] Input 'all' to query all datas.\n"
    << "[Quit] Input 'quit' to quit.\n\n";

  bool not_quit = true;
  while(not_quit) {
    string readin;
    while (cin >> readin) {
      if (readin == "quit" || readin == "QUIT") {
        not_quit = false;
        break;
      }
      if (readin == "all" || readin == "ALL") {
        for (auto f : fam) {
          cout << f.first << " : ";
          for (auto child : f.second) {
            cout << child << " ";
          }
          cout << "\n";
        }
      }
      else if (fam.count(readin)) {
        cout << readin << " : ";
        for (auto child : fam[readin]) {
          cout << child << " ";
        }
        cout << "\n";
      }
      else {
        cout << "Not found.\n";
      }
      cout << "\n";
    }
  }
}