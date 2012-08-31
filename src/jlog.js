/**
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

function JLog(name) {
        var _currentLevel = JLog.WARN,
            _appender = JLog.consoleAppender,
            _name = null;

        this.setName = function(name) {
          _name = name || null;
        };

        this.setAppender = function(appender) {
          if (appender) {
            _appender = appender;
          }
        };

        // Sets the current threshold log level for this Log instance.  Only events that have a priority of this level or greater are logged.
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

        this.getName = function() {
          return _name;
        };

        this.getAppender = function() {
          return _appender;
        };

        this.getLevel = function() {
          return _currentLevel;
        };

        if (name) {
          this.setName(name);
        };
};

JLog.DEBUG  = 1;
JLog.INFO   = 2;
JLog.WARN   = 3;
JLog.ERROR  = 4;
JLog.FATAL  = 5;
JLog.NONE   = 6;

JLog.prototype.debug = function() {
  if (this.getLevel() <= JLog.DEBUG) {
    this._log("DEBUG", arguments);
  };
};

JLog.prototype.info = function() {
  if (this.getLevel() <= JLog.INFO) {
    this._log("INFO", arguments);
  };
};

JLog.prototype.warn = function() {
  if (this.getLevel() <= JLog.WARN) {
    this._log("WARN", arguments);
  };
};

JLog.prototype.error = function() {
  if (this.getLevel() <= JLog.ERROR) {
    this._log("ERROR", arguments);
  };
};

JLog.prototype.fatal = function() {
  if (this.getLevel() <= JLog.FATAL) {
    this._log("FATAL", arguments);
  };
};

JLog.prototype._log = function() {
  var level = arguments[0],
      args = Array.prototype.slice.call(arguments[1]),
      name = this.getName(),
      namePrefix = name ? name + ': ' : '',
      msgString = level + ' - ' + namePrefix + args.join(', ');

  this.getAppender()(msgString);
};

JLog.consoleAppender = function(msg) {
  if (window.console) {
    window.console.log(msg);
  };
};