# JQuery MVC Framework

## How to define MVC component?

BFF Framework:

```ts
// areas/root/services/details.controller
namespace "areas.root.services.details" {
  index: function () {
    // assembly lookup magic
    return this.query.with<DetailsProjection>().then(DetailsViewModel);
  }
}
// areas/root/services/details.runtime
{
  o: null,
  $root: null,
  // ...
}
// areas/root/services/details.template
...
```

Runtime:

```js
$.utils.viewScript("module path to my component", myComponent);
```

## How it works?

```js
var JQExt = {
  viewScript: function (path, prototype) {
    // ...
    // allocate ref to module namespace
    var namespace = $.utils.registerNamespace(path);
    prototype.o = null;
    namespace[name] = function (o) {
      this.o = o;
      // create closure (before ES5 lambda fns)
      var self = this;
      // constructor
      $(function () {
        // $(fn) - init namespace now if page loaded or wait and init
        self.init();
      });
      // destructor
      $(document).on("view-unloaded", function (e) {
        if (e.id == o.viewId) {
          // cleanup namespace events
          if (self.unload != undefined) self.unload();
          if (o.viewId != null) {
            $("*", "body").off("." + o.viewId);
            $(document).off("." + o.viewId);
            $(window).off("." + o.viewId);
          }
        }
      });
    };
    // same as: class namespace[module path to MyComponent] extends MyComponent
    namespace[name].prototype = prototype;
  },
};
```

Ok, let's define our component:

```js
// This string was generated via DI.
// (function ($){})(jQuery); - IIFE (Immediately invoked function expression) module
(function ($) {
  $.utils.viewScript("areas.root.services.details", {
    // we should define all variables, for v8 performance
    o: null,
    $root: null,
    $header: null,
    $static: null,
    $col: null,
    showed: null,
    // ok, it's "onload" constructor, so, we can select our DOM
    init: function () {
      // we can't use "const", so, we should write clean code with small functions so that variables are always declared at the beginning
      var $button = $(
        '<a href="' +
          this.o.handlers.popupUrl +
          '" class="submit button type1 popup order-link">Get consultation</a>'
      );
      // We also need to find all elements in the DOM and cache the results
      this.$root = $(".v-services-details-root");
      this.$header = $("header .b-logo-line.b-site-row .content");
      this.$satatic = $(".header-fixed-from", this.$root);
      this.$col = $('<td class="logo-line-item query-button"></td>').append(
        $button
      );
      // hey, the form with the button is loaded, add validation to it, or if the validation script is not loaded yet, put the task in the queue
      $(document).trigger("ajax-content-loaded", this.$col);
      // .bind(this) - this is ECMAScript 5 that I wrote out of stupidity, it should be "self + .apply"
      // P.S. For this I got hit on the head by the team lead.
      $(window).on("scroll", this.onscroll.bind(this));
      this.onscroll({
        target: window,
      });
      if (screen.width < 1100) {
        this.moveWidgets();
      }
    },
    // function () - Now eslint would issue a warning that this function is not named, but here it was used so as not to pollute the scope
    show: function () {
      $("tr", this.$header).append(this.$col);
      this.$satatic.append(this.$header);
      this.showed = true;
    },
    hide: function () {
      this.$col.detach();
      $("header .b-logo-line.b-site-row").append(this.$header);
      this.showed = false;
    },
    onscroll: function (ev) {
      var $target = $(ev.target);
      if ($target.scrollTop() < 507 && this.showed) {
        this.hide();
      } else if ($target.scrollTop() >= 507 && !this.showed) {
        this.show();
      }
    },
    moveWidgets: function () {
      $(".services-cross-links", this.$root).after($(".widgets", this.$root));
    },
  });
})(jQuery);

// In fact, you only needed to define the module name as an argument.
function ($){}
// -> DI Preprocessor ->
(function ($){})(jQuery);

function ($, areas_root_services_details){}
// -> DI Preprocessor ->
(function ($, areas_root_services_details){})(jQuery, $.utils.load("areas.root.services.details"));

// or u can define an object with auto-injected $
```

## Is it hard to test?

No, each of these modules is tested independently, without any additional tools. Because usually you prefer to use a message bus instead of dependency injection.

## Is it possible to simplify this code with JSX, better DI or web components?

Yes

## Is it possible to simplify this code with ES modules?

No!

## Is it possible to simplify this code with React?

No!
