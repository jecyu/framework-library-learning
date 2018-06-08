define(['dojo/_base/declare'], function (declare) {
  var _VanillaSoftServe = declare(null, {
    constructor: function () {
      console.log('adding soft serve');
    }
  });

  var _OreoMixin = declare(null, {
    constructor: function () {
      console.log('mixing a oreos');
    },
    kind: 'plain'
  });

  var _CookieDoughMixin = declare(null, {
    constructor: function () {
      console.log('mixing in cookie dough');
    },
    chunkSizes: 'medium'
  });

  return declare([_VanillaSoftServe, _OreoMixin, _CookieDoughMixin], {
    constructor: function () {
      console.log("A blizzard with " +
        this.kind + " oreos and " +
        this.chunkSize + "-sized chunks of cookie dough."
      );
    }
  });
});