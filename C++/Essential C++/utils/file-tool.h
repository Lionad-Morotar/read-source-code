#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <iterator>

std::string findline_from_CSV(const std::string &filename, const std::string &name) {
  std::ifstream infile(filename);
  if (!infile)
    throw "Err in read_INI_line";

  while(!infile.eof()) {
    std::string line;
    std::getline(infile, line);
    if (line.find(name) == 0) {
      infile.close();
      return line;
    }
  }

  infile.close();
  return "";
}

void writeline_to_CSV(
  const std::string &filename,
  const std::string &line,
  const std::string &begin
) {
  std::ifstream infile(filename);
  if (!infile)
    throw "Err in read_INI_line";

  bool find_line = false;
  std::string readin;

  std::stringstream ss;
  while (!infile.eof()) {
    std::getline(infile, readin, '\n');
    if (readin.find(begin) == 0)
      find_line = true,
      ss << line << '\n';
    else
      ss << readin << '\n';
  }
  if (!find_line)
    ss << line << '\n';
  infile.close();

  std::fstream outfile(filename, std::ios::out|std::ios::trunc);
  if (!outfile)
    throw "Err in write_INI_line";

  while (!ss.eof()) {
    std::getline(ss, readin, '\n');
    if (readin.size() > 0 && readin != "\n" && readin != "\r\n")
      outfile << readin << '\n';
  }
  outfile.close();
}

// // TODO ::skip
// template <typename T>
// T read_INI_file(const std::string& filename, T &vec)
// {
//   std::ifstream ifs(filename);
//   if (!ifs)
//     throw "Error when read_INI_file: " + filename;

//   int column_size = sizeof(vec[0]);
//   ifs >> t;
//   ifs.close();
//   return t;
// }