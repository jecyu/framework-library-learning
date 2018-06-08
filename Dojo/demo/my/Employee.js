define(['dojo/_base/declare', 'my/Person'], function (declare, Person) {
  return declare(Person, {
    salary: null,
    constructor: function () {
      // The "constructor" method is special: the parent class (Person)
      // constructor is called automatically before this one
    },

    askForRaise: function () {
      return this.salary * 0.2;
    }
  });
});