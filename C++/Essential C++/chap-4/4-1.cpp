#include <iostream>
#include <string>
#include <vector>

#include "Stack.h"

int main() {
  Stack stack;

  stack.push("1");
  stack.push("2");
  stack.push("3");

  std::string str1, str2, str3;
  if (stack.pop(str1))
    std::cout << "pop 1st: " << str1 << '\n';
  if (stack.pop(str2))
    std::cout << "pop 2st: " << str2 << '\n';
  if (stack.pop(str3))
    std::cout << "pop 3st: " << str3 << '\n';
}