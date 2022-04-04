#include <iomanip>
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int max(int, int);
float max(float, float);
string max(string, string);
int max(vector<int> *);
float max(vector<float> *);
int max(int *, int);
float max(float *, int);
string max(string *, int);

int main()
{
  cout << "max 1, 2: " << max(1, 2) << endl;
  cout << "max 1.1, 2.2: " << setprecision(2) << max(1.2, 2.2) << endl;
  cout << "max \"abc\", \"aaa\": " << max("abc", "aaa") << endl;

  vector<int> vec = {7, 34, 2124, 435, 6, 1, 0};
  cout << "max vector(7, 34, 2124, 435, 6, 1, 0): " << max(&vec) << endl;

  vector<float> vec_float = {7.1, 34.2, 2124.3, 435.4, 6.5, 1.6, 0.7};
  cout << "max vector(7.1, 34.2, 2124.3, 435.4, 6.5, 1.6, 0.7): " << setprecision(2) << max(&vec_float) << endl;

  int nums[7] = {7, 34, 2124, 435, 6, 1, 0};
  cout << "max arr(7, 34, 2124, 435, 6, 1, 0): " << max(nums, 7) << endl;

  float nums_float[7] = {7.1, 34.2, 2124.3, 435.4, 6.5, 1.6, 0.7};
  cout << "max arr(7.1, 34.2, 2124.3, 435.4, 6.5, 1.6, 0.7): " << max(nums_float, 7) << endl;

  string strs[3] = {"asdf", "sdfa", "fdsa"};
  cout << "max arr(\"asdf\", \"sdfa\", \"fdsa\"): " << max(strs, 3) << endl;
}

int max(int a, int b)
{
  return a < b ? b : a;
}

float max(float a, float b)
{
  return a < b ? b : a;
}

string max(string a, string b)
{
  return a < b ? b : a;
}

int max(vector<int> *vec)
{
  sort(vec->begin(), vec->end());
  return vec->back();
}

float max(vector<float> *vec)
{
  return *max_element(vec->begin(), vec->end());
}

int max(int *nums, int size)
{
  return *max_element(nums, nums + size);
}

float max(float *nums, int size)
{
  return *max_element(nums, nums + size);
}

string max(string *strs, int size)
{
  return *max_element(strs, strs + size);
}