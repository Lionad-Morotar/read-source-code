#include <iostream>
#include "sequence.h"

#ifndef INT_MAX
#define INT_MAX 2147483647
#endif

int main () {

  Fibonacci fibo(21);
  Sequence *seq = &fibo;
  seq->print();

  Squares square(1, 41);
  seq = &square;
  seq->print();

  Pentagonal penta_1(1, 21);
  Pentagonal penta_2(penta_1);
  Pentagonal penta_3 = penta_2;
  seq = &penta_3;
  std::cout << seq;

  if (seq->is_elem(51))
    std::cout << "51 is an elem in pentagonal.\n";
  if (!seq->is_elem(52))
    std::cout << "52 is not an elem in pentagonal.\n";
  try {
    seq->is_elem(INT_MAX);
  } catch (...) {
    std::cout << INT_MAX << " is overflow.\n";
  }

  std::cout << "Pentagonal [3,11): ";
  for (Sequence::iterator it = seq->begin(); it < seq->end(); it++)
    std::cout << *it << " ";
  std::cout << endl;

  std::cout << "Pentagonal at " << (int)seq->begin() + 4 + 1
            << "th number is: " << *(seq->begin() + 4)
            << std::endl;
}