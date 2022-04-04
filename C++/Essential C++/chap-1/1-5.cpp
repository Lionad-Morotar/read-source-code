#include <iostream>
#include <string>

using namespace std;

int main()
{

  string username;
  string temp_read = "";

  cout << "Hello, what's your name?" << endl;

  while (!temp_read.size())
  {
    cout << "Your Name (At least two letters required): ";
    cin >> temp_read;
    if (temp_read.size() >= 2)
      username = temp_read;
    else
      temp_read = "";
  }

  cout << "Welcome, " << username;
}
