/**
 * @fileoverview Javascript Logger (in the spirit of log4j)
 * This library is designed to make the writing and debugging
 * of javascript code easier, by allowing the programmer to perform
 * debug or log output at any place in their code.  This supports
 * the concept of different levels of logging (debug < info < warn < error < fatal << none)
 * as well as different log outputs.  Three log outputs are included, but you can
 * add your own.  The included log outputs are {@link Log#writeLogger},
 * {@link Log#alertLogger}, and {@link Log#popupLogger}.  For debugging on Safari,
 * the log ouput {@link Log#consoleLogger} is also included.  To turn off debugging
 * but still leave the logger calls in your script, use the log level {@link Log#NONE}.
 *
 * Example usage:
 * <pre>
 * &lt;html&gt;
 *  &lt;head&gt;
 *      &lt;script src="log4js.js" type="text/javascript"&gt;&lt;/script&gt;
 *  &lt;/head&gt;
 *  &lt;body&gt;
 *     Log4JS test...&lt;hr/&gt;
 *     &lt;script&gt;
 *        // Setup log objects
 *        //
 *        //  log object of priority debug and the console logger (Safari)
 *        var log3 = new JLog(JLog.DEBUG, JLog.consoleLogger);
 *
 *        log3.debug('foo3');    // will log message to Safari console or existing popup
 *        log3.warn('bar3');     // same
 *
 *     &lt;/script&gt;
 *  &lt;/body&gt;
 * &lt;/html&gt;
 * </pre>
 *
 * @author Marcus R Breese mailto:mbreese@users.sourceforge.net
 * @license Apache License 2.0
 * @version 0.31
 *<pre>
 **************************************************************
 *
 * Copyright 2005 Fourspaces Consulting, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 *
 **************************************************************
 *
 * Changelog:
 * 0.31 Bug fix (resizeable should be resizable - Darryl Lyons)
 * 0.3  Migrated to SF.net SVN repository - test cleanups
 * 0.2  - Added consoleLogger for Safari
 *    - Changed popupLogger so that it only notifies once (or twice)
 *      that a popup blocker is active.
 *    - Added JLog.NONE level for silencing all logging
 * </pre>
 */


// TODO
// - make a good way to dump an object

/**
 * Create a new logger
 * @constructor
 * @class The main Log class.  Create a new instance of this class to send all logging events.
 * @param level The cut-off logger level.  You can adjust this level in the constructor and leave all other logging events in place.  Defaults to {@link Log#WARN}.
 * @param logger The logger to use.  The logger is a function that accepts the logging events and informs the user or developer. Defaults to {@link Log#writeLogger}.
 */
function JLog(name) {
        var _currentLevel = JLog.WARN;
        var _appender = JLog.consoleAppender; // default to console appender
        var _name = null;

        /**
        * Sets the current logger name
        * @param {String} name This name will be prepended to all messages.
        */
        this.setName = function(name) {
          _name = name || null;
        };

        /**
        * Sets the current logger function
        * @param logger The function that will be called when a log event needs to be displayed
        */
        this.setAppender = function(appender) {
          if (appender) {
            _appender = appender;
          }
        };

        /**
        * Sets the current threshold log level for this Log instance.  Only events that have a priority of this level or greater are logged.
        * @param level The new threshold priority level for logging events.  This can be one of the static members {@link Log#DEBUG},  {@link Log#INFO}, {@link Log#WARN}, {@link Log#ERROR}, {@link Log#FATAL}, {@link Log#NONE}, or it can be one of the strings ["debug", "info", "warn", "error", "fatal", "none"].
        */
        this.setLevel = function(level) {
          if (level && typeof level === 'number') {
            _currentLevel = level;
          } else if (level) {
            switch(level) {
              case 'debug': _currentLevel = JLog.DEBUG; break;
              case 'info': _currentLevel = JLog.INFO; break;
              case 'error': _currentLevel = JLog.ERROR; break;
              case 'fatal': _currentLevel = JLog.FATAL; break;
              case 'warn': _currentLevel = JLog.WARN; break;
              default: _currentLevel = JLog.NONE;
            }
          }
        };

        /**
        * Gets the current name
        * @return current name
        */
        this.getName = function() {
          return _name;
        };

        /**
        * Gets the current event appender function
        * @return current appender
        */
        this.getAppender = function() {
          return _appender;
        };

        /**
        * Gets the current threshold priority level
        * @return current level
        */
        this.getLevel = function() {
          return _currentLevel;
        };

        if (name) {
          this.setName(name);
        };
};

/**
 * Log an event with priority of "debug"
 * @param s the log message
 */
JLog.prototype.debug = function(s) {
  if (this.getLevel() <= JLog.DEBUG) {
    this._log(s, "DEBUG", this);
  };
};

/**
 * Log an event with priority of "info"
 * @param s the log message
 */
JLog.prototype.info = function(s) {
  if (this.getLevel() <= JLog.INFO) {
    this._log(s, "INFO", this);
  };
};

/**
 * Log an event with priority of "warn"
 * @param s the log message
 */
JLog.prototype.warn = function(s) {
  if (this.getLevel() <= JLog.WARN) {
    this._log(s, "WARN", this);
  };
};

/**
 * Log an event with priority of "error"
 * @param s the log message
 */
JLog.prototype.error = function(s) {
  if (this.getLevel() <= JLog.ERROR) {
    this._log(s, "ERROR", this);
  };
};

/**
 * Log an event with priority of "fatal"
 * @param s the log message
 */
JLog.prototype.fatal = function(s) {
  if (this.getLevel() <= JLog.FATAL) {
    this._log(s, "FATAL", this);
  };
};

/**
 * _log is the function that actually calling the configured logger function.
 * It is possible that this function could be extended to allow for more
 * than one logger.
 *
 * This method is used by {@link Log#debug}, {@link Log#info}, {@link Log#warn}, {@link Log#error}, and {@link Log#fatal}
 * @private
 * @param {String} msg The message to display
 * @param level The priority level of this log event
 */
JLog.prototype._log = function(msg, level) {
  var name = this.getName(),
      namePrefix = name ? name + ': ' : '',
      msgString = level + ' - ' + namePrefix + msg;

  this.getAppender()(msgString);
};

JLog.DEBUG  = 1;
JLog.INFO   = 2;
JLog.WARN   = 3;
JLog.ERROR  = 4;
JLog.FATAL  = 5;
JLog.NONE   = 6;

/**
 * Static Safari WebKit console logger method. This logger will write messages to the Safari javascript console, if available.
 * If this browser doesn't have a javascript console (IE/Moz), then it degrades gracefully to {@link Log#popupLogger}
 * @param {String} msg The message to display
 * @param level The priority level of this log event
 */
JLog.consoleAppender = function(msg) {
  if (window.console) {
    window.console.log(msg);
  };
};