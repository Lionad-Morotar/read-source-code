#include <iostream>
#include <vector>

struct has_iterator {
  template <typename T>
  static char test(typename T::operator++*);
  template <typename T>
  static int test(...);
  static const bool value = sizeof(test<std::vector<int>>(0)) == sizeof(char);
};

int main () {
  std::cout << has_iterator::value << std::endl;
}