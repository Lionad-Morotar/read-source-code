#include <iostream>
#include <string>

using namespace std;

int main () {

  string user_first_name;
  string user_last_name;

  cout << "What's your name?\n"
       << "First name: ";
  cin >> user_first_name;
  cout << "Last name: ";
  cin >> user_last_name;
  cout << "Hello," << user_first_name << " " << user_last_name << "!";

  return 0;
}
