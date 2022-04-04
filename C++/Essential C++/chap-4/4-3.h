#include <string>

using std::string;

class ProgramInfo {
public:
  static string get_program_name();
  static string get_version_stamp();
  static int get_version_number();
  static int get_tests_run();
  static int get_tests_passed();
private:
  static string program_name;
  static string version_stamp;
  static int version_number;
  static int tests_run;
  static int tests_passed;
};

string ProgramInfo::program_name = "4-3";
string ProgramInfo::version_stamp = "1.0.0";
int ProgramInfo::version_number = 1;
int ProgramInfo::tests_run = 100;
int ProgramInfo::tests_passed = 100;

inline string ProgramInfo::get_program_name() {
  return program_name;
}
inline string ProgramInfo::get_version_stamp() {
  return version_stamp;
}
inline int ProgramInfo::get_version_number() {
  return version_number;
}
inline int ProgramInfo::get_tests_run() {
  return tests_run;
}
inline int ProgramInfo::get_tests_passed() {
  return tests_passed;
}