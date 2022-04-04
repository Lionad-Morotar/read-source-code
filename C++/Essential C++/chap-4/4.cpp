#include <iostream>
#include "sequence.h"

#ifndef INT_MAX
#define INT_MAX 2147483647
#endif

int main () {

  typedef Sequence::Type SeqType;

  for (SeqType t = SeqType::Fibonacci; t < (SeqType::Pentagonal + 1); t = SeqType(t + 1)) {  
    Sequence ftype(t, 10, 15);
    std::cout << "type of ftype is: " << (int)ftype.type() << "\n";
    std::cout << "typename of ftype is: " << (string)ftype.type() << "\n";
  }
  std::cout << std::endl;

  Sequence f2(SeqType::Fibonacci, 1, 21);
  Sequence f3(f2);
  Sequence f4 = f3;
  f4.print();

  if (Sequence::is_elem(89, f2))
    std::cout << "89 is an elem in fibonacci.\n";
  else
    std::cout << "89 is not an elem in fibonacci.\n";
  if (Sequence::is_elem(90, f2))
    std::cout << "90 is an elem in fibonacci.\n";
  else
    std::cout << "90 is not an elem in fibonacci.\n";
  try {
    Sequence::is_elem(INT_MAX, f2);
  } catch (...) {
    std::cout << INT_MAX << " is overflow.\n";
  }

  Sequence f2_2(SeqType::Pentagonal, 1, 21);
  Sequence f3_2(f2_2);
  Sequence f4_2 = f3_2;
  f4_2.print();

  if (Sequence::is_elem(51, f2_2))
    std::cout << "51 is an elem in pentagonal.\n";
  else
    std::cout << "51 is not an elem in pentagonal.\n";
  if (Sequence::is_elem(52, f2_2))
    std::cout << "52 is an elem in pentagonal.\n";
  else
    std::cout << "52 is not an elem in pentagonal.\n";
  try {
    Sequence::is_elem(INT_MAX, f2_2);
  } catch (...) {
    std::cout << INT_MAX << " is overflow.\n";
  }
  std::cout << std::endl;

  Sequence f5(SeqType::Fibonacci, 10, 15);
  f5.print();

  Sequence f5_2(SeqType::Pentagonal, 10, 15);
  f5_2.print();
  std::cout << std::endl;

  Sequence f6(SeqType::Fibonacci, 3, 11);
  Sequence::iterator it = f6.begin();
  std::cout << "Sequence " << (string)f6.type()
            << " at " << (int)it + 1 
            << "th place is: " << *it
            << std::endl;

  std::cout << "Sequence " << (string)f6.type() << " -> [3,11): ";
  Sequence::iterator it2;
  for (it2 = f6.begin(); it2 < f6.end(); it2++) {
    std::cout << *it2 << " ";
  }
  std::cout << std::endl;

  Sequence f7(SeqType::Fibonacci, 10, 15);
  std::cout << f7;
}