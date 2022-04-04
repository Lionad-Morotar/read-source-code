#include <iomanip>
#include <vector>
#include <iostream>

extern int get_pos();

template <typename T>
void print_vector(const std::vector<T> &, int);

extern const std::vector<int> &calc_Fibonacci(int);
extern const std::vector<int> &calc_pentagonal(int);

const std::vector<int> &calc_pentagonal(int pos)
{
  static std::vector<int> pentagonal;

  if ((unsigned)pos <= pentagonal.size())
  {
    return pentagonal;
  }

  for (int i = pentagonal.size(); i < pos; i++)
  {
    int n = i + 1;
    int num = n * (3 * n - 1) / 2;
    pentagonal.push_back(num);
  }

  return pentagonal;
}

const std::vector<int> &calc_Fibonacci(int pos)
{
  static std::vector<int> Fibonacci = {1, 1};

  if ((unsigned)pos <= Fibonacci.size())
  {
    return Fibonacci;
  }

  for (int i = Fibonacci.size(); i < pos; i++)
  {
    int curr = Fibonacci.at(i - 1);
    int prev = Fibonacci.at(i - 2);
    int next = curr + prev;
    Fibonacci.push_back(next);
  }

  return Fibonacci;
}

template <typename T>
void print_vector(const std::vector<T> &vec, int pos)
{
  const int num_padding = 10;

  for (int i = 0; i < pos; i++)
  {
    std::cout << std::setw(num_padding) << vec.at(i) << (((i + 1) % 10 == 0) ? "\n\t" : "");
  }
  std::cout << std::endl;
}