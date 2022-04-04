#include <algorithm>
#include <cstdlib>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <string>
#include <time.h>
#include <vector>

using namespace std;

void read_player_score(
  string player_name,
  int* score,
  int* guess,
  bool *is_player_exist_in_save
) {
  ifstream infile("player.ini");
  if (!infile) 
    throw "Err in read player.ini";

  string read_name;
  int read_score = 0, read_guess = 0;
  while (!infile.eof())
  {
    try
    {
      infile >> read_name >> read_score >> read_guess;
      // cout << read_name << " " << read_score << " " << read_guess << endl;
      if (read_name == player_name)
      {
        *is_player_exist_in_save = true;
        *score = read_score;
        *guess = read_guess;
        break;
      }
    }
    catch (...)
    {
      throw "Err in read player.ini";
    }
  }
}

void save_player_data(
  string player_name,
  int score,
  int guess,
  bool is_player_exist_in_save
) {
  cout << "Saving..." << endl;
  if (is_player_exist_in_save)
  {
    vector<string> names;
    vector<string> scores;
    vector<string> guesses;
    fstream iofile("player.ini");
    if (!iofile)
      throw "Err in save player score";
    string readin;
    while (iofile >> readin)
    {
      names.push_back(readin);
      iofile >> readin;
      scores.push_back(readin);
      iofile >> readin;
      guesses.push_back(readin);
    }
    iofile.close();

    fstream inifile("player.ini", ios::out|ios::trunc);
    if (!inifile)
      throw "Err in save player score";
    for (unsigned int i = 0; i < names.size(); i++)
    {
      if (names.at(i) == player_name)
        inifile << player_name << " " << score << " " << guess << endl;
      else
        inifile << names.at(i) << " " << scores.at(i) << " " << guesses.at(i) << endl;
    }
    inifile.close();
  }
  else
  {
    fstream inifile("player.ini", ios::app);
    if (!inifile)
      throw "Err in save player score";
    inifile << player_name << " " << score << " " << guess << endl;
    inifile.close();
  }
  cout << "File Saved. You can close game now." << endl;
}

vector<int>* get_random_seq()
{
  // 如果不用 Static 还能怎么写？
  static vector<int> fibonacci = {1, 1, 2, 3, 5, 8, 13, 21};
  static vector<int> lucas = {1, 3, 4, 7, 11, 18, 29, 47};
  static vector<int> pell = {1, 2, 5, 12, 29, 70, 169, 408};
  static vector<int> triangular = {1, 3, 6, 10, 15, 21, 28, 36};
  static vector<int> square = {1, 4, 9, 16, 25, 36, 49, 64};
  static vector<int> pentagonal = {1, 5, 12, 22, 35, 51, 70, 92};
  static vector<vector<int>*> seqs = {
    &fibonacci,
    &lucas,
    &pell,
    &triangular,
    &square,
    &pentagonal
  };

  const int seqs_size = seqs.size();
  srand((unsigned)time(0));
  int index = rand() % seqs_size;

  // for (int item : *seqs[index])
  //   cout << item << " ";

  return seqs[index];
}

// give two nums then guess the next
int main()  
{
  string readin;
  string player_name;
  int score = 0, guess = 0;
  bool is_player_exist_in_save = false;

  bool is_got_name = false;
  cout << "Hello, what's your name?" << endl;
  while (!is_got_name)
  {
    cin >> readin;
    char alphas[] = {
      'a', 'b', 'c', 'd', 'e', 'f', 'g',
      'h', 'i', 'j', 'k', 'l', 'm', 'n',
      'o', 'p', 'q', 'r', 's', 't', 'u',
      'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G',
      'H', 'I', 'J', 'K', 'L', 'M', 'N',
      'O', 'P', 'Q', 'R', 'S', 'T', 'U',
      'V', 'W', 'X', 'Y', 'Z'
    };
    for (char a : alphas)
    {
      if ((signed)(readin.find(a)) != -1)
      {
        player_name = readin;
        is_got_name = true;
      }
    }
    if (!is_got_name)
    {
      cout << "Player name should contain a-z or A-Z: ";
    }
  }

  read_player_score(player_name, &score, &guess, &is_player_exist_in_save);

  const float percent = ((guess == 0) ? 0 : ((float)score / guess)) * 100;
  if (is_player_exist_in_save)
    cout << "Welcome back, " << player_name << "." << endl
         << "Your current score is: " << score
         << ", guess time: " << guess
         << ", percent: " << setprecision(2) << percent << "%"
         << endl;
  else
    cout << "Welcome " << player_name << "." << endl << "We created a new account for you." << endl;

  bool guess_next = true;
  int num_guess_right = 0;
  int num_guess_count = 0;
  while (guess_next)
  {
    vector<int>* seq = get_random_seq();
    const int idx = rand() % (seq->size() - 1);
    cout << seq->at(idx) << " " << seq->at(idx + 1) << " ";

    bool is_input_a_number = false;
    cin >> readin;
    while (!is_input_a_number) 
    {
      try
      {
        int guess_num = stoi(readin, nullptr);
        is_input_a_number = true;
        num_guess_count++;
        if (guess_num == seq->at(idx + 2))
        {
          cout << "Right! ";
          num_guess_right++;
        }
        else
        {
          cout << "Not right. ";
        }
      }
      catch (...)
      {
        cout << "Error input, please input again: ";
        cin >> readin;
      }
    }

    cout << "Go ahead for next? (Y/N) ";
    while (true) 
    {
      cin >> readin;
      if (readin == "Y" || readin == "y")
      {
        guess_next = true;
        break;
      }
      if (readin == "N" || readin == "n")
      {
        guess_next = false;
        break;
      }
    }
  }

  score += num_guess_right;
  guess += num_guess_count;
  save_player_data(player_name, score, guess, is_player_exist_in_save);
}