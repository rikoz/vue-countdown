/*!
 * vue-countdown v1.0.1
 * https://fengyuanchen.github.io/vue-countdown
 *
 * Copyright 2018-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2018-11-09T12:54:21.854Z
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueCountdown = factory());
}(this, (function () { 'use strict';

  var MILLISECONDS_SECOND = 1000;
  var MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
  var MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;
  var MILLISECONDS_DAY = 24 * MILLISECONDS_HOUR;
  var index = {
    name: 'countdown',
    data: function data() {
      return {
        /**
         * It is counting down.
         * @type {boolean}
         */
        counting: false,

        /**
         * The remaining milliseconds.
         * @type {number}
         */
        totalMilliseconds: 0
      };
    },
    props: {
      /**
       * Starts the countdown automatically when initialized.
       */
      autoStart: {
        type: Boolean,
        default: true
      },

      /**
       * Emits the countdown events.
       */
      emitEvents: {
        type: Boolean,
        default: true
      },

      /**
       * The interval time (in milliseconds) of the countdown progress.
       */
      interval: {
        type: Number,
        default: 1000,
        validator: function validator(value) {
          return value >= 0;
        }
      },

      /**
       * The tag name of the component's root element.
       */
      tag: {
        type: String,
        default: 'span'
      },

      /**
       * The time (in milliseconds) to count down from.
       */
      time: {
        type: Number,
        default: 0,
        validator: function validator(value) {
          return value >= 0;
        }
      },

      /**
       * Transforms the output props before render.
       */
      transform: {
        type: Function,
        default: function _default(props) {
          return props;
        }
      }
    },
    computed: {
      /**
       * Remaining days.
       * @returns {number} The computed value.
       */
      days: function days() {
        return Math.floor(this.totalMilliseconds / MILLISECONDS_DAY);
      },

      /**
       * Remaining hours.
       * @returns {number} The computed value.
       */
      hours: function hours() {
        return Math.floor(this.totalMilliseconds % MILLISECONDS_DAY / MILLISECONDS_HOUR);
      },

      /**
       * Remaining minutes.
       * @returns {number} The computed value.
       */
      minutes: function minutes() {
        return Math.floor(this.totalMilliseconds % MILLISECONDS_HOUR / MILLISECONDS_MINUTE);
      },

      /**
       * Remaining seconds.
       * @returns {number} The computed value.
       */
      seconds: function seconds() {
        return Math.floor(this.totalMilliseconds % MILLISECONDS_MINUTE / MILLISECONDS_SECOND);
      },

      /**
       * Remaining milliseconds.
       * @returns {number} The computed value.
       */
      milliseconds: function milliseconds() {
        return Math.floor(this.totalMilliseconds % MILLISECONDS_SECOND);
      },

      /**
       * Total remaining days.
       * @returns {number} The computed value.
       */
      totalDays: function totalDays() {
        return this.days;
      },

      /**
       * Total remaining hours.
       * @returns {number} The computed value.
       */
      totalHours: function totalHours() {
        return Math.floor(this.totalMilliseconds / MILLISECONDS_HOUR);
      },

      /**
       * Total remaining minutes.
       * @returns {number} The computed value.
       */
      totalMinutes: function totalMinutes() {
        return Math.floor(this.totalMilliseconds / MILLISECONDS_MINUTE);
      },

      /**
       * Total remaining seconds.
       * @returns {number} The computed value.
       */
      totalSeconds: function totalSeconds() {
        return Math.floor(this.totalMilliseconds / MILLISECONDS_SECOND);
      }
    },
    render: function render(createElement) {
      return createElement(this.tag, this.$scopedSlots.default ? [this.$scopedSlots.default(this.transform({
        days: this.days,
        hours: this.hours,
        minutes: this.minutes,
        seconds: this.seconds,
        milliseconds: this.milliseconds,
        totalDays: this.totalDays,
        totalHours: this.totalHours,
        totalMinutes: this.totalMinutes,
        totalSeconds: this.totalSeconds,
        totalMilliseconds: this.totalMilliseconds
      }))] : this.$slots.default);
    },
    watch: {
      $props: {
        deep: true,
        immediate: true,

        /**
         * Update the countdown when props changed.
         */
        handler: function handler() {
          this.totalMilliseconds = this.time;

          if (this.autoStart) {
            this.start();
          }
        }
      }
    },
    methods: {
      /**
       * Starts to countdown.
       * @public
       * @emits Countdown#start
       */
      start: function start() {
        if (this.counting) {
          return;
        }

        this.counting = true;

        if (this.emitEvents) {
          /**
           * Countdown start event.
           * @event Countdown#start
           */
          this.$emit('start');
        }

        this.continue();
      },

      /**
       * Continues the countdown.
       * @private
       */
      continue: function _continue() {
        if (!this.counting) {
          return;
        }

        var delay = Math.min(this.totalMilliseconds, this.interval);

        if (delay > 0) {
          this.timeout = setTimeout(this.progress, delay, this);
        } else {
          this.end();
        }
      },

      /**
       * Pauses the countdown.
       * @private
       */
      pause: function pause() {
        clearTimeout(this.timeout);
      },

      /**
       * Progresses to countdown.
       * @private
       * @emits Countdown#progress
       */
      progress: function progress() {
        if (!this.counting) {
          return;
        }

        this.totalMilliseconds -= this.interval;

        if (this.emitEvents && this.totalMilliseconds > 0) {
          /**
           * Countdown progress event.
           * @event Countdown#progress
           */
          this.$emit('progress', {
            days: this.days,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            totalDays: this.totalDays,
            totalHours: this.totalHours,
            totalMinutes: this.totalMinutes,
            totalSeconds: this.totalSeconds
          });
        }

        this.continue();
      },

      /**
       * Aborts the countdown.
       * @public
       * @emits Countdown#abort
       */
      abort: function abort() {
        if (!this.counting) {
          return;
        }

        this.pause();
        this.counting = false;

        if (this.emitEvents) {
          /**
           * Countdown abort event.
           * @event Countdown#abort
           */
          this.$emit('abort');
        }
      },

      /**
       * Ends the countdown.
       * @public
       * @emits Countdown#end
       */
      end: function end() {
        if (!this.counting) {
          return;
        }

        this.pause();
        this.totalMilliseconds = 0;
        this.counting = false;

        if (this.emitEvents) {
          /**
           * Countdown end event.
           * @event Countdown#end
           */
          this.$emit('end');
        }
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.pause();
    }
  };

  return index;

})));
