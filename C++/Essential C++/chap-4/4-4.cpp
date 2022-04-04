#include <algorithm>
#include <cstdlib>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <string>
#include <time.h>
#include <vector>

#include "UserProfile.h"

using namespace std;

int main()  
{
  UserProfile guest1;
  cout << guest1;
  UserProfile guest2("guest", "tkhapjiabbnydbwh");
  cout << guest2;

  UserProfile lionad("Lionad", "addmfjbphhjgyygk");
  cout << lionad;
  cout << endl;

  lionad.add_score(1, 2);
  cout << lionad;
  lionad.save();

  guest1.save();
  guest2.save();
}