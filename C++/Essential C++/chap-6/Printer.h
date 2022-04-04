// * ...
// struct has_iterator {
//   template <typename T>
//   static char test(typename T::iterator*);
//   template <typename T>
//   static int test(...);
//   static const bool value = sizeof(test<vector<int>>(0)) == sizeof(char);
// };

template <typename stream>
class Printer {
public:
  Printer(stream &os): os(os) {}

  template <typename Elem>
  void print(Elem &elem, char delimer = '\0') {
    // if (has_iterator<Elem>::value) {
    //   for (auto item : v)
    //     cout << item << " ";
    // } else {
    //   os << elem << delimer;
    // }
    os << elem << delimer;
  }

private:
  stream &os;
};