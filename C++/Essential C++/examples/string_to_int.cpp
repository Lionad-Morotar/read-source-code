// stoi example
#include <iostream>
#include <string>

using namespace std;

int main()
{
  string str_dec = "2001, A Space Odyssey";
  string str_hex = "40c3";
  string str_bin = "-10010110001";
  string str_auto = "0x7f";

  string::size_type sz; // alias of size_t
  // 以上一句，需要特别说明，这个sz变量，是为了获取在转换过程中，转换了多少位的数据。如果不需要这个数据，可以设置为 nullptr
  // 所以这个变量，也可以直接定义为 site_z sz;
  // 不一定按上面的定义方法

  int i_dec = stoi(str_dec, &sz);
  int i_hex = stoi(str_hex, nullptr, 16);
  int i_bin = stoi(str_bin, nullptr, 2);
  int i_auto = stoi(str_auto, nullptr, 0);

  cout << str_dec << ": " << i_dec << " and [" << str_dec.substr(sz) << "]\n";
  cout << str_hex << ": " << i_hex << '\n';
  cout << str_bin << ": " << i_bin << '\n';
  cout << str_auto << ": " << i_auto << '\n';

  return 0;
}