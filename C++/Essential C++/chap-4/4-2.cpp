#include <iostream>
#include <string>
#include <vector>

#include "Stack.h"

int main() {
  Stack stack;

  stack.push("1");
  stack.push("2");
  stack.push("2");
  stack.push("3");
  stack.push("3");
  stack.push("3");

  std::cout << "find \"3\" " << stack.count("3") << " times.\n";

  std::cout << "has '2' or not: " << stack.find("2") << "\n";
  std::cout << "has '4' or not: " << stack.find("4") << "\n";
}