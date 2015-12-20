express-dynamic-helpers-patch
==============================

Dynamic helpers monkey patch for express 3.x and 4.x

### How to install?

```js
  npm install express-dynamic-helpers-patch --save
```

### How to use It?

```js
  require('express-dynamic-helpers-patch')(app);
  // and now You can use 2.x express dynamicHelpers
  app.dynamicHelpers({
    user: function (req, res) {
      ...
    }
  });
```

License: MIT
