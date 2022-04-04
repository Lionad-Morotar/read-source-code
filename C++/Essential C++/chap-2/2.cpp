#include <algorithm>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

#include "calc_sequence.hpp"

using namespace std;

// calc pentagonal arr
int main()
{
  const vector<int>& (* calcs[])(int) = {
    calc_Fibonacci,
    calc_pentagonal
  };
  enum calc_tyle {
    ns_Fibonacci,
    ns_pentagonal
  };
  vector<string> calc_name = {
    "Fibonacci",
    "pentagonal"
  };

  string readin;
  cout << "Select a method to calc." << endl;
  while (true)
  {
    cout << "a) Fibonacci; b) pentagonal; ";
    cin >> readin;
    if (!(readin == "a" || readin == "b")) {
      cout << "Err input, ";
      continue;
    }

    const int select_type = (char)readin[0] - 'a';
    const string select_name = calc_name.at(select_type);
    const vector<int> &(*calc)(int) = calcs[select_type];

    bool change_calc = false;
    cout << "Input a number to calc " << select_name << " arr." << endl;
    while (!change_calc)
    {
      int pos = get_pos();

      const vector<int> &seq = calc(pos);

      cout << "First " << pos << " elems of " << select_name << ": \n\t";
      print_vector(seq, pos);

      string readin;
      cout.clear();
      cin.clear();
      while (true)
      {
        cout << "Again? (Y/N) ";
        cin >> readin;
        if (readin == "y" || readin == "Y")
        {
          break;
        }
        if (readin == "n" || readin == "N")
        {
          change_calc = true;
          break;
        }
      }
    }
  }

  return 0;
}

int get_pos()
{
  string readin;
  while (true)
  {
    cout << "Number: ";
    cin >> readin;
    try
    {
      int num = stoi(readin);
      if (num <= 0)
      {
        cerr << "Number must bigger than 0." << endl;
        continue;
      }
      if (num >= 100)
      {
        cerr << "Number must smaller than 100." << endl;
        continue;
      }
      return num;
    }
    catch (...)
    {
      cerr << "Err input, pls reenter: ";
    }
  }
}

