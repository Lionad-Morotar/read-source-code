#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main()
{
  const int max_number_count = 100;
  int nums_arr[max_number_count];
  vector<int> nums_vec(max_number_count);

  cout << "Input numbers or enter 'sum' to calc sum." << endl;

  int total_count = 0;
  while (total_count < max_number_count * 2)
  {
    bool is_got_a_number = false;
    string input;

    cout << total_count + 1 << "th num: ";
    cin >> input;
    if (input == "sum")
    {
      break;
    }

    while (!is_got_a_number)
    {
      try {
        int num = stoi(input, nullptr);
        if (total_count % 2 == 0)
          nums_arr[total_count % 2] = num;
        else
          nums_vec[total_count % 2] = num;
        is_got_a_number = true;
        total_count++;
      }
      catch (...) 
      {
        cout << "Err, Input" << total_count + 1 <<  "th number again: ";
        cin >> input;
      }
    }
  }

  int sum = 0;
  for (int i = 0; i < total_count; i++)
  {
    if (i % 2 == 0)
      sum += nums_arr[i % 2];
    else
      sum += nums_vec[i % 2];
  }
  cout << "Sum is: " << sum << endl;
}
