#include <algorithm>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

using namespace std;

int get_pos();
const vector<int> &calc_pentagonal(int);

template <typename T>
void print_vector(const vector<T> &, int);

// calc pentagonal arr
int main()
{
  cout << "Input a number to calc pentagonal arr." << endl;
  while (true)
  {
    int pos = get_pos();

    const vector<int> &seq = calc_pentagonal(pos);

    cout << "First " << pos << " elems of pentagonal: \n\t";
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
        return 0;
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

const vector<int> &calc_pentagonal(int pos)
{
  static vector<int> pentagonal;

  if ((unsigned) pos <= pentagonal.size())
  {
    return pentagonal;
  }

  for (int i = pentagonal.size(); i < pos; i++)
  {
    int n = i + 1;
    int num = n * (3 * n - 1) / 2;
    pentagonal.push_back(num);
  }

  return pentagonal;
}

template <typename T>
void print_vector(const vector<T> &vec, int pos)
{
  const int num_padding = 10;

  for (int i = 0; i < pos; i++)
  {
    cout << setw(num_padding) << vec.at(i) << (((i + 1) % 10 == 0) ? "\n\t" : "");
  }
  cout << endl;
}