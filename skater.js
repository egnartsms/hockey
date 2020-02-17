(function () {
   'use strict';
   let $ = {
      x: 10,

      y: {
         a: 1,
         b: 2
      },

      sayHi: function () {
         return `Hi! x = ${$.x}, y = ${$.y}`;
      }
   };
   return $;
})()