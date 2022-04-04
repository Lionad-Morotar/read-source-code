#include <iostream>
#include <string>
#include <vector>

using std::cout;
using std::string;
using std::vector;

template <typename T, typename E>
T find_elem(T left, const T right, const E elem)
{
  if (left == right)
    return right;

  while (left++ != right)
  {
    if (*left == elem)
      return left;
  }

  return right;
}

template <typename T, typename E>
inline void print_find(T p, E target)
{
  if (p)
    cout << "Find " << target << " in continer.\n";
  else
    cout << "Not find " << target << " in continer.\n";
}

inline int *get_begin_address(vector<int> &vec)
{
  return &vec[0];
}

inline int *get_end_address(vector<int> &vec)
{
  return &vec[vec.size()];
}

int main()
{
  // arr
  {
    int arr[6] = {1, 3, 4, 7, 8, 9};

    const int target = 8;
    int *p = find_elem(arr, arr + 6, target);
    print_find(p, target);

    const int target2 = 88;
    int *p2 = find_elem(arr, arr + 6, target2);
    print_find(p2, target2);
  }
  // vec
  {
    vector<int> vec = {1, 3, 4, 7, 8, 9};

    const int target = 8;
    int *p = find_elem(&vec[0], &vec[vec.size()], target);
    print_find(p, target);
  }
  // get_address vec
  {
    vector<int> vec = {1, 3, 4, 7, 8, 9};

    const int target = 8;
    int *p = find_elem(get_begin_address(vec), get_end_address(vec), target);
    print_find(p, target);
  }
  // get_address vec
  {
    vector<int> vec = {1, 3, 4, 7, 8, 9};

    const int target = 8;
    vector<int>::iterator p = find_elem(vec.begin(), vec.end(), target);
    if (p != vec.end()) {
      cout << "Find.";
    } else {
      cout << "Not Find.";
    }
  }
}
