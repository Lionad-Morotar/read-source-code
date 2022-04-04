#include <string>
#include <sstream>
#include <cstdlib>
#include <time.h>

#ifndef INT_MAX
#define INT_MAX 2147483647
#endif

static int RANDOM_SEED_COUNT = time(NULL);

void init_random_seed () {
  srand(RANDOM_SEED_COUNT++);
}

template <typename T>
T split(const std::string &str, char delim, T &vec) {
  std::stringstream ss(str);
  std::string readin;
  while (getline(ss, readin, delim)) {
    vec.push_back(readin);
  }
  return vec;
}

std::string getRandomID (const unsigned int len = 16) {
  init_random_seed();
  std::string id;
  while (id.size() < len) {
    id += (char)(rand() % 26 + 'a');
  }
  return id;
}