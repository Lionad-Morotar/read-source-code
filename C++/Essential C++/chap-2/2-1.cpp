#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

using namespace std;

int get_pos();
void print_fibo(int);

// calc fibo arr
int main()
{
  while (true) {
    int pos = get_pos();
    print_fibo(pos);

    string readin;
    cout.clear();
    cin.clear();
    cout << "Exit? ('Y' for exit & other to calc again) ";
    cin >> readin;
    if (readin == "y" || readin == "Y")
    {
      break;
    }
  }
  return 0;
}

int get_pos()
{
  cout << "Enter a number to calc fibo arr: ";

  int readin;
  while (cin >> readin)
  {
    if (readin < 0)
      cerr << "Position must bigger than 0: ";
    else if (readin > 1024)
      cerr << "Position must larger than 1024: ";
    else break;
  }
  return readin;
}

void print_fibo(int pos)
{
  const int num_padding = 10;

  cout << "First " << pos << " elems of fibo: \n\t";
  switch (pos)
  {
    case 2:
      cout << setw(num_padding) << 1;
    case 1:
      cout << setw(num_padding) << 1;
    default:
      cout << setw(num_padding) << 1 << 1;
  }

  vector<int> fibo = {1, 1};

  for (int i = 2; i < pos; i++)
  {
    int curr = fibo.at(i - 1);
    int prev = fibo.at(i - 2);
    int next = curr + prev;
    fibo.push_back(next);

    cout << setw(num_padding) << next << ((i % 9 == 0) ? "\n\t" : "");
  }
  cout << endl;
}