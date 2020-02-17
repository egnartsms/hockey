(function () {
   'use strict';
   let $ = {
      nontrackedKeys: [
         "cxt",
         "canvas",
         "LENGTH",
         "ZONE_LENGTH",
         "HALF_NEUTRAL_ZONE",
         "CENTER_X",
         "CENTER_Y"
      ],

      cxt: "new Object()",

      canvas: "new Object()",

      init: function () {
         $.canvas = document.getElementById('background');
         $.cxt = $.canvas.getContext('2d');
      
         // Init dependent dimensions
         // Blue lines are part of the neutral zone.
         $.LENGTH = $.WIDTH * 2.;
         $.ZONE_LENGTH = ($.LENGTH - 2. * $.GOAL_LINE) / 3.;
         $.HALF_NEUTRAL_ZONE = $.ZONE_LENGTH / 2.;
      
         $.CENTER_X = $.WIDTH;
         $.CENTER_Y = $.WIDTH / 2.;
      
         document.getElementById('draw').onclick = () => {
            $.onDraw();
         };
      },

      RINK_CANVAS_PADDING: 3,

      BLUE_COLOR: "#266390",

      RED_COLOR: "#CC162F",

      WIDTH: 30,

      LENGTH: "new Object()",

      GOAL_LINE: 4,

      CORNER_RADIUS: 8.5,

      ZONE_LENGTH: "new Object()",

      HALF_NEUTRAL_ZONE: "new Object()",

      THICK_LINE_WIDTH: 0.3,

      THIN_LINE_WIDTH: 0.05,

      CENTRAL_LINE_GAP: 0.5,

      CENTRAL_FACEOFF_SPOT_DIAMETER: 0.3,

      FACEOFF_CIRCLE_RADIUS: 4.5,

      FACEOFF_SPOT_DIAMETER: 0.6,

      FACEOFF_SPOT_FILLED_STRIP: 0.35,

      FACEOFF_SPOT_X_DIST: 10,

      FACEOFF_SPOT_Y_DIST: 8,

      FACEOFF_CIRCLE_INNER_SPACE_X: 1.2,

      FACEOFF_CIRCLE_INNER_SPACE_Y: 0.45,

      FACEOFF_CIRCLE_INNER_HORN_X_SIZE: 1.2,

      FACEOFF_CIRCLE_INNER_HORN_Y_SIZE: 0.9,

      FACEOFF_CIRCLE_OUTER_SPACE_X: 1.7,

      FACEOFF_CIRCLE_OUTER_HORN_Y_SIZE: 0.6,

      CENTER_X: null,

      CENTER_Y: null,

      onDraw: function () {
         $.clear();
         $.setBasicTransformation($.cxt);
         $.draw();
         $.drawAthlete();
      },

      clear: function () {
         $.canvas.width = $.canvas.width;
      },

      setBasicTransformation: function (cxt) {
         cxt.resetTransform();
         cxt.translate($.RINK_CANVAS_PADDING, $.RINK_CANVAS_PADDING);
         cxt.scale(
            ($.canvas.width - 2 * $.RINK_CANVAS_PADDING) / $.LENGTH, 
            ($.canvas.height - 2 * $.RINK_CANVAS_PADDING) / $.WIDTH
         );
         cxt.translate(0, $.WIDTH);
         cxt.scale(1.0, -1.0);
      },

      draw: function () {
         // First draw the outer borders and set it as clipping path
         $.cxt.beginPath();
         $.cxt.moveTo($.CORNER_RADIUS, 0)
         $.cxt.lineTo($.LENGTH - $.CORNER_RADIUS, 0);
         $.cxt.arcTo($.LENGTH, 0, $.LENGTH, $.WIDTH, $.CORNER_RADIUS);
         $.cxt.lineTo($.LENGTH, $.WIDTH - $.CORNER_RADIUS);
         $.cxt.arcTo($.LENGTH, $.WIDTH, 0, $.WIDTH, $.CORNER_RADIUS);
         $.cxt.lineTo($.CORNER_RADIUS, $.WIDTH);
         $.cxt.arcTo(0, $.WIDTH, 0, 0, $.CORNER_RADIUS);
         $.cxt.lineTo(0, $.CORNER_RADIUS);
         $.cxt.arcTo(0, 0, $.LENGTH, 0, $.CORNER_RADIUS);
         $.cxt.clip();
      
         $.cxt.save();
      
         // Stroke the borders
         $.cxt.lineWidth = $.THIN_LINE_WIDTH;
         $.cxt.strokeStyle = 'black';
         $.cxt.stroke();
      
         // Goal lines   
         $.cxt.beginPath();
         $.cxt.moveTo($.GOAL_LINE, 0);
         $.cxt.lineTo($.GOAL_LINE, $.WIDTH);
         $.cxt.moveTo($.LENGTH - $.GOAL_LINE, 0);
         $.cxt.lineTo($.LENGTH - $.GOAL_LINE, $.WIDTH);
      
         $.cxt.lineWidth = $.THIN_LINE_WIDTH;
         $.cxt.strokeStyle = $.RED_COLOR;
         $.cxt.stroke();
      
         // Blue lines
         $.cxt.beginPath();
         $.cxt.moveTo($.GOAL_LINE + $.ZONE_LENGTH, 0);
         $.cxt.lineTo($.GOAL_LINE + $.ZONE_LENGTH, $.WIDTH);
         $.cxt.moveTo($.LENGTH - $.GOAL_LINE - $.ZONE_LENGTH, 0);
         $.cxt.lineTo($.LENGTH - $.GOAL_LINE - $.ZONE_LENGTH, $.WIDTH);
      
         $.cxt.lineWidth = $.THICK_LINE_WIDTH;
         $.cxt.strokeStyle = $.BLUE_COLOR;
         $.cxt.stroke();
      
         // Central red line
         $.cxt.beginPath();
         $.cxt.moveTo($.CENTER_X, 0);
         $.cxt.lineTo($.CENTER_X, $.CENTER_Y - $.CENTRAL_LINE_GAP / 2);
         $.cxt.moveTo($.CENTER_X, $.CENTER_Y + $.CENTRAL_LINE_GAP / 2);
         $.cxt.lineTo($.CENTER_X, $.WIDTH);
      
         $.cxt.lineWidth = $.THICK_LINE_WIDTH;
         $.cxt.strokeStyle = $.RED_COLOR;
         $.cxt.stroke();
      
         // Central face-off circle and spot
         $.cxt.beginPath();
         $.cxt.arc($.CENTER_X, $.CENTER_Y, $.FACEOFF_CIRCLE_RADIUS, 0, Math.PI * 2);
         $.cxt.strokeStyle = $.BLUE_COLOR;
         $.cxt.lineWidth = $.THIN_LINE_WIDTH;
         $.cxt.stroke();
      
         $.cxt.beginPath();
         $.cxt.arc($.CENTER_X, $.CENTER_Y, $.CENTRAL_FACEOFF_SPOT_DIAMETER / 2, 0, Math.PI * 2);
         $.cxt.fillStyle = $.BLUE_COLOR;
         $.cxt.fill();
      
         function drawFaceoff(x, y) {
            $.cxt.save();
      
            $.cxt.strokeStyle = $.RED_COLOR;
            $.cxt.fillStyle = $.RED_COLOR;
            $.cxt.lineWidth = $.THIN_LINE_WIDTH;
      
            $.cxt.translate(x, y);
      
            $.cxt.beginPath();
            $.cxt.arc(0, 0, $.FACEOFF_CIRCLE_RADIUS, 0, Math.PI * 2);
            $.cxt.stroke();
      
            $.cxt.beginPath();
            $.cxt.arc(0, 0, $.FACEOFF_SPOT_DIAMETER / 2, 0, Math.PI * 2);
            $.cxt.stroke();
      
            $.cxt.fillRect(
               -$.FACEOFF_SPOT_FILLED_STRIP / 2, -$.FACEOFF_SPOT_DIAMETER / 2,
               $.FACEOFF_SPOT_FILLED_STRIP, $.FACEOFF_SPOT_DIAMETER
            );
      
            // Now the inner horns
            function innerHorn(offX, offY, x, y) {
               $.cxt.save();
               $.cxt.translate(offX, offY);
               $.cxt.beginPath();
               $.cxt.moveTo(0, 0);
               $.cxt.lineTo(x, 0);
               $.cxt.moveTo(0, 0);
               $.cxt.lineTo(0, y);
               $.cxt.stroke();
               $.cxt.restore();
            }
      
            let 
               argsEven = [
                  $.FACEOFF_CIRCLE_INNER_SPACE_X / 2, $.FACEOFF_CIRCLE_INNER_SPACE_Y / 2,
                  $.FACEOFF_CIRCLE_INNER_HORN_X_SIZE, $.FACEOFF_CIRCLE_INNER_HORN_Y_SIZE
               ],
               argsOdd = [
                  $.FACEOFF_CIRCLE_INNER_SPACE_Y / 2, $.FACEOFF_CIRCLE_INNER_SPACE_X / 2,
                  $.FACEOFF_CIRCLE_INNER_HORN_Y_SIZE, $.FACEOFF_CIRCLE_INNER_HORN_X_SIZE
               ];
      
            $.cxt.save();
            innerHorn.apply(null, argsEven);
            $.cxt.rotate(Math.PI / 2);
            innerHorn.apply(null, argsOdd);
            $.cxt.rotate(Math.PI / 2);
            innerHorn.apply(null, argsEven);
            $.cxt.rotate(Math.PI / 2);
            innerHorn.apply(null, argsOdd);
            $.cxt.restore();
      
            // The outer horns
            function outerHorn(offX, offY, y) {
               $.cxt.save();
               $.cxt.translate(offX, offY);
               $.cxt.beginPath();
               $.cxt.moveTo(0, 0);
               $.cxt.lineTo(0, y);
               $.cxt.stroke();
               $.cxt.restore();
            }
      
            let 
               offX = $.FACEOFF_CIRCLE_OUTER_SPACE_X / 2,
               offY = $.cathetus($.FACEOFF_CIRCLE_RADIUS, offX);
      
            outerHorn(offX, offY, $.FACEOFF_CIRCLE_OUTER_HORN_Y_SIZE);
            outerHorn(-offX, offY, $.FACEOFF_CIRCLE_OUTER_HORN_Y_SIZE);
            outerHorn(offX, -offY, -$.FACEOFF_CIRCLE_OUTER_HORN_Y_SIZE);
            outerHorn(-offX, -offY, -$.FACEOFF_CIRCLE_OUTER_HORN_Y_SIZE);
      
            $.cxt.restore();
         }
      
         drawFaceoff($.FACEOFF_SPOT_X_DIST, $.FACEOFF_SPOT_Y_DIST);
         drawFaceoff($.FACEOFF_SPOT_X_DIST, $.WIDTH - $.FACEOFF_SPOT_Y_DIST);
         drawFaceoff($.LENGTH - $.FACEOFF_SPOT_X_DIST, $.FACEOFF_SPOT_Y_DIST);
         drawFaceoff($.LENGTH - $.FACEOFF_SPOT_X_DIST, $.WIDTH - $.FACEOFF_SPOT_Y_DIST);
      
         $.cxt.restore();
      },

      cathetus: function (hypotenuse, cathetus) {
         return Math.sqrt(hypotenuse * hypotenuse - cathetus * cathetus);
      },

      drawAthlete: function () {
         let canvas = document.getElementById('rink'),
            cxt = canvas.getContext('2d');
      
         const ATHLETE_DIAMETER = 1.2;
         const ATHLETE_COLOR = '#cc9829';
      
         canvas.width = canvas.width;
      
         cxt.save();
         $.setBasicTransformation(cxt);
         cxt.translate(25, 25);
      
         cxt.beginPath();
         cxt.arc(0, 0, ATHLETE_DIAMETER / 2, 0, Math.PI * 2);
         cxt.fillStyle = ATHLETE_COLOR;
         cxt.fill();
      
         // The number
         cxt.save();
         cxt.scale(1.0, -1.0);
         cxt.font = '900 0.8px courier';
         cxt.textAlign = 'center';
         cxt.textBaseline = 'middle';
         cxt.fillStyle = '#58387a';
         cxt.fillText('7', 0, 0, ATHLETE_DIAMETER);
         cxt.restore();
      
         // The stick
         const STICK_ANGLE = -Math.PI * 0.75;
         const STICK_LENGTH = 0.8;
         const STICK_HOOK_LENGTH = 0.4;
         const STICK_HOOK_ANGLE = Math.PI * 0.25;
      
         cxt.save();
      
         cxt.lineJoin = 'round';
         cxt.lineCap = 'round';
         cxt.strokeStyle = '#555959';
      
         cxt.rotate(STICK_ANGLE);
         cxt.translate(ATHLETE_DIAMETER / 2, 0);
      
         cxt.beginPath();
         cxt.moveTo(0, 0);
         cxt.lineTo(STICK_LENGTH, 0);
         cxt.lineWidth = 0.2;
         cxt.stroke();
      
         cxt.translate(STICK_LENGTH, 0);
         cxt.rotate(STICK_HOOK_ANGLE);
      
         cxt.beginPath();
         cxt.moveTo(0, 0);
         cxt.lineTo(STICK_HOOK_LENGTH, 0);
         cxt.lineWidth = 0.3;
         cxt.stroke();
      
         cxt.restore();
      
         cxt.restore();
      }
   };
   return $;
})()