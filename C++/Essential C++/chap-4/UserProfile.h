#include <algorithm>
#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
#include <map>
#include <iterator>

#include "../utils/file-tool.h"
#include "../utils/string-tool.h"

using std::string;
using std::vector;
using std::map;
using std::ostream;
using std::setw;

class UserProfile {
public:
  enum Level {
    Unset,
    Beginner,
    Intermediate,
    Advanced,
    Expert
  };
  string name;
  string id;
  enum Level level;
  int log_times;
  int guess_right;
  int guess_total;
  float percent;

  UserProfile ():
    name("guest"),
    id(getRandomID()),
    level(UserProfile::Level::Beginner),
    log_times(1),
    guess_right(0),
    guess_total(0),
    percent(0.0)
    {};

  UserProfile (const string &n):
    name(n),
    id(getRandomID()),
    level(UserProfile::Level::Beginner),
    log_times(1),
    guess_right(0),
    guess_total(0),
    percent(0.0)
    {}
 

  // * how to reuse constructor ?
  // @example this = &UserProfile();
  UserProfile (const string &_name, const string &_id) {
    string line = findline_from_CSV("player.ini", _name);
    if (line.size() == 0)
      throw "name & id not found";

    try {
      vector<string> data;
      split(line, ' ', data);

      if (data[0] != _name || data[1] != _id)
        throw "got wrong line";
      name = data[0];
      id = data[1];
      log_times = stoi(data[2]) + 1;
      guess_right = stoi(data[3]);
      guess_total = stoi(data[4]);
    } catch (...) {
      throw "error when parse palyer data";
    }
    UserProfile::calc_percentage(this);
    UserProfile::calc_level(this);
  }

  void add_score(int g_r, int g_t) {
    if (g_r < 0 || g_t < 0)
      throw "guess_right and guess_total must be positive";
    if (g_r > g_t)
      throw "guess_right must be less than guess_total";
    guess_right += g_r;
    guess_total += g_t;
    UserProfile::calc_percentage(this);
    UserProfile::calc_level(this);
  }

  void save () {
    string line = name + " " + id + " " + std::to_string(log_times) + " " + std::to_string(guess_right) + " " + std::to_string(guess_total);
    writeline_to_CSV("player.ini", line, name + " " + id);
  }

  static void calc_percentage (UserProfile *up) {
    up->percent = (up->guess_total == 0)
      ? 0
      : (float)up->guess_right / up->guess_total;
  }

  static void calc_level (UserProfile *up) {
    if (up->percent < 0.3)
      up->level = UserProfile::Level::Beginner;
    else if (up->percent < 0.6)
      up->level = UserProfile::Level::Intermediate;
    else if (up->percent < 0.9)
      up->level = UserProfile::Level::Advanced;
    else
      up->level = UserProfile::Level::Expert;
  }

  bool operator== (const UserProfile &up) {
    return up.name == name && up.id == id;
  }

  bool operator!= (const UserProfile &up) {
    return !(*this == up);
  }
};

ostream &operator<< (ostream &os, const UserProfile &up) {
  os << "NAME" << "\t"
     << setw(8) << "LOG"
     << setw(8) << "RIGHT"
     << setw(8) << "TOTAL"
     << setw(12) << "PERCENT"
     << setw(20) << "ID\n";
  os << up.name << '\t'
     << setw(8) << up.log_times
     << setw(8) << up.guess_right
     << setw(8) << up.guess_total
     << setw(10) << up.percent * 100 << "%"
     << setw(20) << up.id << "\n"; 
  return os;
}
