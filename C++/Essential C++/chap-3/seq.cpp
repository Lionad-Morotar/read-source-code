#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using std::cout;
using std::string;
using std::vector;

int main () {

  /* five ways to create vector */

  // ERROR: vector<int> vec()
  
  vector<int> vec1;
  vector<int> vec2 = {1, 2, 3, 4, 5};
  vector<int> vec3(5);
  vector<int> vec4(5, 100);
  vector<int> vec5(vec4);

  vector<int>* vecs[] = {
    &vec1, &vec2, &vec3, &vec4, &vec5
  };
  for (vector<int>* vec : vecs) {
    cout << "[VEC]: ";
    for (int i : *vec) {
      cout << i << ' ';
    }
    cout << std::endl;
  }

  /* usecase of insert */

  vector<int>::iterator it = std::find(vec2.begin(), vec2.end(), 1);
  vec2.insert(it, 1);

  vector<int>::iterator it2 = std::find(vec2.begin(), vec2.end(), 3);
  vec2.insert(it2, 2, 2);

  const int temparr[3] = {1,2,3};
  vec2.insert(vec2.begin(), temparr, temparr+3);

  cout << "\n\n[VEC]: ";
  for (int i : vec2)
  {
    cout << i << ' ';
  }
  cout << std::endl;

  /* usecase of erase */

  vector<int>::iterator pos_3_left = std::find(vec2.begin(), vec2.end(), 3);
  vector<int>::iterator pos_3_right = std::find(++pos_3_left, vec2.end(), 3);
  vec2.erase(pos_3_left, pos_3_right);

  cout << "\n\n[VEC]: ";
  for (int i : vec2)
  {
    cout << i << ' ';
  }
  cout << std::endl;
}