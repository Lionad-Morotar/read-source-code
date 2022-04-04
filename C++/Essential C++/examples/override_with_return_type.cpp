// http://blog.chinaunix.net/uid-20476365-id-1942464.html

#include <string>
#include <iostream>

using namespace std;

string getvalue_slow(const int&)
{
  return "getvalue_slow";
}

string g_fast = "getvalue_fast";
const char* getvalue_fast(const int&)
{
  return g_fast.c_str();
}

struct Result
{
  const int& i;
  explicit Result(const int& r) : i(r){}
  operator string() const{ return getvalue_slow(i);}
  operator const char* () const { return getvalue_fast(i);}
};

Result getvalue(const int& i)
{
  return Result(i);
}
void print_const(const char* str)
{
  cout << str << endl;
}
void print(const string& str)
{
  cout << str << endl;
}

int main()
{
  print(getvalue(1));
  print_const(getvalue(1));
}