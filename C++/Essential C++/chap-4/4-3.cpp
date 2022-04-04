#include <iostream>

#include "4-3.h"

int main() {
  std::cout << "Program Name  : " << ProgramInfo::get_program_name() << std::endl;
  std::cout << "Version Stamp : " << ProgramInfo::get_version_stamp() << std::endl;
  std::cout << "Version Number: " << ProgramInfo::get_version_number() << std::endl;
  std::cout << "Tests Run     : " << ProgramInfo::get_tests_run() << std::endl;
  std::cout << "Tests Passed  : " << ProgramInfo::get_tests_passed() << std::endl;
}