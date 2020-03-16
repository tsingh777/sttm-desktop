module.exports = /******/ (function(modules) {
  // webpackBootstrap
  /******/ // eslint-disable-next-line no-unused-vars
  /******/ function hotDownloadUpdateChunk(chunkId) {
    /******/ var filename = require('path').join(
      __dirname,
      '' + chunkId + '.' + hotCurrentHash + '.hot-update.js',
    );
    /******/ require('fs').readFile(filename, 'utf-8', function(err, content) {
      /******/ if (err) {
        /******/ if (__webpack_require__.onError) return __webpack_require__.oe(err);
        /******/ throw err;
        /******/
      }
      /******/ var chunk = {};
      /******/ require('vm').runInThisContext(
        /******/ '(function(exports) {' + content + '\n})',
        /******/ { filename: filename },
        /******/
      )(chunk);
      /******/ hotAddUpdateChunk(chunk.id, chunk.modules);
      /******/
    });
    /******/
  } // eslint-disable-next-line no-unused-vars
  /******/
  /******/ /******/ function hotDownloadManifest() {
    /******/ var filename = require('path').join(
      __dirname,
      '' + hotCurrentHash + '.hot-update.json',
    );
    /******/ return new Promise(function(resolve, reject) {
      /******/ require('fs').readFile(filename, 'utf-8', function(err, content) {
        /******/ if (err) return resolve();
        /******/ try {
          /******/ var update = JSON.parse(content);
          /******/
        } catch (e) {
          /******/ return reject(e);
          /******/
        }
        /******/ resolve(update);
        /******/
      });
      /******/
    });
    /******/
  } // eslint-disable-next-line no-unused-vars
  /******/
  /******/ /******/ function hotDisposeChunk(chunkId) {
    /******/ delete installedChunks[chunkId];
    /******/
  }
  /******/
  /******/ var hotApplyOnUpdate = true; // eslint-disable-next-line no-unused-vars
  /******/ /******/ var hotCurrentHash = '1577d4fead26b4700085';
  /******/ var hotRequestTimeout = 10000;
  /******/ var hotCurrentModuleData = {};
  /******/ var hotCurrentChildModule; // eslint-disable-next-line no-unused-vars
  /******/ /******/ var hotCurrentParents = []; // eslint-disable-next-line no-unused-vars
  /******/ /******/ var hotCurrentParentsTemp = []; // eslint-disable-next-line no-unused-vars
  /******/
  /******/ /******/ function hotCreateRequire(moduleId) {
    /******/ var me = installedModules[moduleId];
    /******/ if (!me) return __webpack_require__;
    /******/ var fn = function(request) {
      /******/ if (me.hot.active) {
        /******/ if (installedModules[request]) {
          /******/ if (installedModules[request].parents.indexOf(moduleId) === -1) {
            /******/ installedModules[request].parents.push(moduleId);
            /******/
          }
          /******/
        } else {
          /******/ hotCurrentParents = [moduleId];
          /******/ hotCurrentChildModule = request;
          /******/
        }
        /******/ if (me.children.indexOf(request) === -1) {
          /******/ me.children.push(request);
          /******/
        }
        /******/
      } else {
        /******/ console.warn(
          /******/ '[HMR] unexpected require(' +
            /******/ request +
            /******/ ') from disposed module ' +
            /******/ moduleId,
          /******/
        );
        /******/ hotCurrentParents = [];
        /******/
      }
      /******/ return __webpack_require__(request);
      /******/
    };
    /******/ var ObjectFactory = function ObjectFactory(name) {
      /******/ return {
        /******/ configurable: true,
        /******/ enumerable: true,
        /******/ get: function() {
          /******/ return __webpack_require__[name];
          /******/
        },
        /******/ set: function(value) {
          /******/ __webpack_require__[name] = value;
          /******/
        },
        /******/
      };
      /******/
    };
    /******/ for (var name in __webpack_require__) {
      /******/ if (
        /******/ Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
        /******/ name !== 'e' &&
        /******/ name !== 't'
        /******/
      ) {
        /******/ Object.defineProperty(fn, name, ObjectFactory(name));
        /******/
      }
      /******/
    }
    /******/ fn.e = function(chunkId) {
      /******/ if (hotStatus === 'ready') hotSetStatus('prepare');
      /******/ hotChunksLoading++;
      /******/ return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
        /******/ finishChunkLoading();
        /******/ throw err;
        /******/
      });
      /******/
      /******/ function finishChunkLoading() {
        /******/ hotChunksLoading--;
        /******/ if (hotStatus === 'prepare') {
          /******/ if (!hotWaitingFilesMap[chunkId]) {
            /******/ hotEnsureUpdateChunk(chunkId);
            /******/
          }
          /******/ if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
            /******/ hotUpdateDownloaded();
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    };
    /******/ fn.t = function(value, mode) {
      /******/ if (mode & 1) value = fn(value);
      /******/ return __webpack_require__.t(value, mode & ~1);
      /******/
    };
    /******/ return fn;
    /******/
  } // eslint-disable-next-line no-unused-vars
  /******/
  /******/ /******/ function hotCreateModule(moduleId) {
    /******/ var hot = {
      /******/ // private stuff
      /******/ _acceptedDependencies: {},
      /******/ _declinedDependencies: {},
      /******/ _selfAccepted: false,
      /******/ _selfDeclined: false,
      /******/ _disposeHandlers: [],
      /******/ _main: hotCurrentChildModule !== moduleId, // Module API
      /******/
      /******/ /******/ active: true,
      /******/ accept: function(dep, callback) {
        /******/ if (dep === undefined) hot._selfAccepted = true;
        /******/ else if (typeof dep === 'function') hot._selfAccepted = dep;
        /******/ else if (typeof dep === 'object')
          /******/ for (var i = 0; i < dep.length; i++)
            /******/ hot._acceptedDependencies[dep[i]] = callback || function() {};
        /******/ else hot._acceptedDependencies[dep] = callback || function() {};
        /******/
      },
      /******/ decline: function(dep) {
        /******/ if (dep === undefined) hot._selfDeclined = true;
        /******/ else if (typeof dep === 'object')
          /******/ for (var i = 0; i < dep.length; i++)
            /******/ hot._declinedDependencies[dep[i]] = true;
        /******/ else hot._declinedDependencies[dep] = true;
        /******/
      },
      /******/ dispose: function(callback) {
        /******/ hot._disposeHandlers.push(callback);
        /******/
      },
      /******/ addDisposeHandler: function(callback) {
        /******/ hot._disposeHandlers.push(callback);
        /******/
      },
      /******/ removeDisposeHandler: function(callback) {
        /******/ var idx = hot._disposeHandlers.indexOf(callback);
        /******/ if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
        /******/
      }, // Management API
      /******/
      /******/ /******/ check: hotCheck,
      /******/ apply: hotApply,
      /******/ status: function(l) {
        /******/ if (!l) return hotStatus;
        /******/ hotStatusHandlers.push(l);
        /******/
      },
      /******/ addStatusHandler: function(l) {
        /******/ hotStatusHandlers.push(l);
        /******/
      },
      /******/ removeStatusHandler: function(l) {
        /******/ var idx = hotStatusHandlers.indexOf(l);
        /******/ if (idx >= 0) hotStatusHandlers.splice(idx, 1);
        /******/
      }, //inherit from previous dispose call
      /******/
      /******/ /******/ data: hotCurrentModuleData[moduleId],
      /******/
    };
    /******/ hotCurrentChildModule = undefined;
    /******/ return hot;
    /******/
  }
  /******/
  /******/ var hotStatusHandlers = [];
  /******/ var hotStatus = 'idle';
  /******/
  /******/ function hotSetStatus(newStatus) {
    /******/ hotStatus = newStatus;
    /******/ for (var i = 0; i < hotStatusHandlers.length; i++)
      /******/ hotStatusHandlers[i].call(null, newStatus);
    /******/
  } // while downloading
  /******/
  /******/ /******/ var hotWaitingFiles = 0;
  /******/ var hotChunksLoading = 0;
  /******/ var hotWaitingFilesMap = {};
  /******/ var hotRequestedFilesMap = {};
  /******/ var hotAvailableFilesMap = {};
  /******/ var hotDeferred; // The update info
  /******/
  /******/ /******/ var hotUpdate, hotUpdateNewHash;
  /******/
  /******/ function toModuleId(id) {
    /******/ var isNumber = +id + '' === id;
    /******/ return isNumber ? +id : id;
    /******/
  }
  /******/
  /******/ function hotCheck(apply) {
    /******/ if (hotStatus !== 'idle') {
      /******/ throw new Error('check() is only allowed in idle status');
      /******/
    }
    /******/ hotApplyOnUpdate = apply;
    /******/ hotSetStatus('check');
    /******/ return hotDownloadManifest(hotRequestTimeout).then(function(update) {
      /******/ if (!update) {
        /******/ hotSetStatus('idle');
        /******/ return null;
        /******/
      }
      /******/ hotRequestedFilesMap = {};
      /******/ hotWaitingFilesMap = {};
      /******/ hotAvailableFilesMap = update.c;
      /******/ hotUpdateNewHash = update.h;
      /******/
      /******/ hotSetStatus('prepare');
      /******/ var promise = new Promise(function(resolve, reject) {
        /******/ hotDeferred = {
          /******/ resolve: resolve,
          /******/ reject: reject,
          /******/
        };
        /******/
      });
      /******/ hotUpdate = {};
      /******/ var chunkId = 'main'; // eslint-disable-next-line no-lone-blocks
      /******/ /******/ {
        /******/ hotEnsureUpdateChunk(chunkId);
        /******/
      }
      /******/ if (
        /******/ hotStatus === 'prepare' &&
        /******/ hotChunksLoading === 0 &&
        /******/ hotWaitingFiles === 0
        /******/
      ) {
        /******/ hotUpdateDownloaded();
        /******/
      }
      /******/ return promise;
      /******/
    });
    /******/
  } // eslint-disable-next-line no-unused-vars
  /******/
  /******/ /******/ function hotAddUpdateChunk(chunkId, moreModules) {
    /******/ if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId]) /******/ return;
    /******/ hotRequestedFilesMap[chunkId] = false;
    /******/ for (var moduleId in moreModules) {
      /******/ if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        /******/ hotUpdate[moduleId] = moreModules[moduleId];
        /******/
      }
      /******/
    }
    /******/ if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
      /******/ hotUpdateDownloaded();
      /******/
    }
    /******/
  }
  /******/
  /******/ function hotEnsureUpdateChunk(chunkId) {
    /******/ if (!hotAvailableFilesMap[chunkId]) {
      /******/ hotWaitingFilesMap[chunkId] = true;
      /******/
    } else {
      /******/ hotRequestedFilesMap[chunkId] = true;
      /******/ hotWaitingFiles++;
      /******/ hotDownloadUpdateChunk(chunkId);
      /******/
    }
    /******/
  }
  /******/
  /******/ function hotUpdateDownloaded() {
    /******/ hotSetStatus('ready');
    /******/ var deferred = hotDeferred;
    /******/ hotDeferred = null;
    /******/ if (!deferred) return;
    /******/ if (hotApplyOnUpdate) {
      /******/ // Wrap deferred object in Promise to mark it as a well-handled Promise to
      /******/ // avoid triggering uncaught exception warning in Chrome.
      /******/ // See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
      /******/ Promise.resolve()
        /******/ .then(function() {
          /******/ return hotApply(hotApplyOnUpdate);
          /******/
        })
        /******/ .then(
          /******/ function(result) {
            /******/ deferred.resolve(result);
            /******/
          },
          /******/ function(err) {
            /******/ deferred.reject(err);
            /******/
          },
          /******/
        );
      /******/
    } else {
      /******/ var outdatedModules = [];
      /******/ for (var id in hotUpdate) {
        /******/ if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
          /******/ outdatedModules.push(toModuleId(id));
          /******/
        }
        /******/
      }
      /******/ deferred.resolve(outdatedModules);
      /******/
    }
    /******/
  }
  /******/
  /******/ function hotApply(options) {
    /******/ if (hotStatus !== 'ready')
      /******/ throw new Error('apply() is only allowed in ready status');
    /******/ options = options || {};
    /******/
    /******/ var cb;
    /******/ var i;
    /******/ var j;
    /******/ var module;
    /******/ var moduleId;
    /******/
    /******/ function getAffectedStuff(updateModuleId) {
      /******/ var outdatedModules = [updateModuleId];
      /******/ var outdatedDependencies = {};
      /******/
      /******/ var queue = outdatedModules.map(function(id) {
        /******/ return {
          /******/ chain: [id],
          /******/ id: id,
          /******/
        };
        /******/
      });
      /******/ while (queue.length > 0) {
        /******/ var queueItem = queue.pop();
        /******/ var moduleId = queueItem.id;
        /******/ var chain = queueItem.chain;
        /******/ module = installedModules[moduleId];
        /******/ if (!module || module.hot._selfAccepted) continue;
        /******/ if (module.hot._selfDeclined) {
          /******/ return {
            /******/ type: 'self-declined',
            /******/ chain: chain,
            /******/ moduleId: moduleId,
            /******/
          };
          /******/
        }
        /******/ if (module.hot._main) {
          /******/ return {
            /******/ type: 'unaccepted',
            /******/ chain: chain,
            /******/ moduleId: moduleId,
            /******/
          };
          /******/
        }
        /******/ for (var i = 0; i < module.parents.length; i++) {
          /******/ var parentId = module.parents[i];
          /******/ var parent = installedModules[parentId];
          /******/ if (!parent) continue;
          /******/ if (parent.hot._declinedDependencies[moduleId]) {
            /******/ return {
              /******/ type: 'declined',
              /******/ chain: chain.concat([parentId]),
              /******/ moduleId: moduleId,
              /******/ parentId: parentId,
              /******/
            };
            /******/
          }
          /******/ if (outdatedModules.indexOf(parentId) !== -1) continue;
          /******/ if (parent.hot._acceptedDependencies[moduleId]) {
            /******/ if (!outdatedDependencies[parentId])
              /******/ outdatedDependencies[parentId] = [];
            /******/ addAllToSet(outdatedDependencies[parentId], [moduleId]);
            /******/ continue;
            /******/
          }
          /******/ delete outdatedDependencies[parentId];
          /******/ outdatedModules.push(parentId);
          /******/ queue.push({
            /******/ chain: chain.concat([parentId]),
            /******/ id: parentId,
            /******/
          });
          /******/
        }
        /******/
      }
      /******/
      /******/ return {
        /******/ type: 'accepted',
        /******/ moduleId: updateModuleId,
        /******/ outdatedModules: outdatedModules,
        /******/ outdatedDependencies: outdatedDependencies,
        /******/
      };
      /******/
    }
    /******/
    /******/ function addAllToSet(a, b) {
      /******/ for (var i = 0; i < b.length; i++) {
        /******/ var item = b[i];
        /******/ if (a.indexOf(item) === -1) a.push(item);
        /******/
      }
      /******/
    } // at begin all updates modules are outdated // the "outdated" status can propagate to parents if they don't accept the children
    /******/
    /******/ /******/ /******/ var outdatedDependencies = {};
    /******/ var outdatedModules = [];
    /******/ var appliedUpdate = {};
    /******/
    /******/ var warnUnexpectedRequire = function warnUnexpectedRequire() {
      /******/ console.warn(
        /******/ '[HMR] unexpected require(' + result.moduleId + ') to disposed module',
        /******/
      );
      /******/
    };
    /******/
    /******/ for (var id in hotUpdate) {
      /******/ if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
        /******/ moduleId = toModuleId(id); /** @type {TODO} */
        /******/ /******/ var result;
        /******/ if (hotUpdate[id]) {
          /******/ result = getAffectedStuff(moduleId);
          /******/
        } else {
          /******/ result = {
            /******/ type: 'disposed',
            /******/ moduleId: id,
            /******/
          };
          /******/
        } /** @type {Error|false} */
        /******/ /******/ var abortError = false;
        /******/ var doApply = false;
        /******/ var doDispose = false;
        /******/ var chainInfo = '';
        /******/ if (result.chain) {
          /******/ chainInfo = '\nUpdate propagation: ' + result.chain.join(' -> ');
          /******/
        }
        /******/ switch (result.type) {
          /******/ case 'self-declined':
            /******/ if (options.onDeclined) options.onDeclined(result);
            /******/ if (!options.ignoreDeclined)
              /******/ abortError = new Error(
                /******/ 'Aborted because of self decline: ' +
                  /******/ result.moduleId +
                  /******/ chainInfo,
                /******/
              );
            /******/ break;
          /******/ case 'declined':
            /******/ if (options.onDeclined) options.onDeclined(result);
            /******/ if (!options.ignoreDeclined)
              /******/ abortError = new Error(
                /******/ 'Aborted because of declined dependency: ' +
                  /******/ result.moduleId +
                  /******/ ' in ' +
                  /******/ result.parentId +
                  /******/ chainInfo,
                /******/
              );
            /******/ break;
          /******/ case 'unaccepted':
            /******/ if (options.onUnaccepted) options.onUnaccepted(result);
            /******/ if (!options.ignoreUnaccepted)
              /******/ abortError = new Error(
                /******/ 'Aborted because ' + moduleId + ' is not accepted' + chainInfo,
                /******/
              );
            /******/ break;
          /******/ case 'accepted':
            /******/ if (options.onAccepted) options.onAccepted(result);
            /******/ doApply = true;
            /******/ break;
          /******/ case 'disposed':
            /******/ if (options.onDisposed) options.onDisposed(result);
            /******/ doDispose = true;
            /******/ break;
          /******/ default:
            /******/ throw new Error('Unexception type ' + result.type);
          /******/
        }
        /******/ if (abortError) {
          /******/ hotSetStatus('abort');
          /******/ return Promise.reject(abortError);
          /******/
        }
        /******/ if (doApply) {
          /******/ appliedUpdate[moduleId] = hotUpdate[moduleId];
          /******/ addAllToSet(outdatedModules, result.outdatedModules);
          /******/ for (moduleId in result.outdatedDependencies) {
            /******/ if (
              /******/ Object.prototype.hasOwnProperty.call(
                /******/ result.outdatedDependencies,
                /******/ moduleId,
                /******/
              )
              /******/
            ) {
              /******/ if (!outdatedDependencies[moduleId])
                /******/ outdatedDependencies[moduleId] = [];
              /******/ addAllToSet(
                /******/ outdatedDependencies[moduleId],
                /******/ result.outdatedDependencies[moduleId],
                /******/
              );
              /******/
            }
            /******/
          }
          /******/
        }
        /******/ if (doDispose) {
          /******/ addAllToSet(outdatedModules, [result.moduleId]);
          /******/ appliedUpdate[moduleId] = warnUnexpectedRequire;
          /******/
        }
        /******/
      }
      /******/
    } // Store self accepted outdated modules to require them later by the module system
    /******/
    /******/ /******/ var outdatedSelfAcceptedModules = [];
    /******/ for (i = 0; i < outdatedModules.length; i++) {
      /******/ moduleId = outdatedModules[i];
      /******/ if (
        /******/ installedModules[moduleId] &&
        /******/ installedModules[moduleId].hot._selfAccepted && // removed self-accepted modules should not be required
        /******/ /******/ appliedUpdate[moduleId] !== warnUnexpectedRequire
        /******/
      ) {
        /******/ outdatedSelfAcceptedModules.push({
          /******/ module: moduleId,
          /******/ errorHandler: installedModules[moduleId].hot._selfAccepted,
          /******/
        });
        /******/
      }
      /******/
    } // Now in "dispose" phase
    /******/
    /******/ /******/ hotSetStatus('dispose');
    /******/ Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
      /******/ if (hotAvailableFilesMap[chunkId] === false) {
        /******/ hotDisposeChunk(chunkId);
        /******/
      }
      /******/
    });
    /******/
    /******/ var idx;
    /******/ var queue = outdatedModules.slice();
    /******/ while (queue.length > 0) {
      /******/ moduleId = queue.pop();
      /******/ module = installedModules[moduleId];
      /******/ if (!module) continue;
      /******/
      /******/ var data = {}; // Call dispose handlers
      /******/
      /******/ /******/ var disposeHandlers = module.hot._disposeHandlers;
      /******/ for (j = 0; j < disposeHandlers.length; j++) {
        /******/ cb = disposeHandlers[j];
        /******/ cb(data);
        /******/
      }
      /******/ hotCurrentModuleData[moduleId] = data; // disable module (this disables requires from this module)
      /******/
      /******/ /******/ module.hot.active = false; // remove module from cache
      /******/
      /******/ /******/ delete installedModules[moduleId]; // when disposing there is no need to call dispose handler
      /******/
      /******/ /******/ delete outdatedDependencies[moduleId]; // remove "parents" references from all children
      /******/
      /******/ /******/ for (j = 0; j < module.children.length; j++) {
        /******/ var child = installedModules[module.children[j]];
        /******/ if (!child) continue;
        /******/ idx = child.parents.indexOf(moduleId);
        /******/ if (idx >= 0) {
          /******/ child.parents.splice(idx, 1);
          /******/
        }
        /******/
      }
      /******/
    } // remove outdated dependency from module children
    /******/
    /******/ /******/ var dependency;
    /******/ var moduleOutdatedDependencies;
    /******/ for (moduleId in outdatedDependencies) {
      /******/ if (
        /******/ Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
        /******/
      ) {
        /******/ module = installedModules[moduleId];
        /******/ if (module) {
          /******/ moduleOutdatedDependencies = outdatedDependencies[moduleId];
          /******/ for (j = 0; j < moduleOutdatedDependencies.length; j++) {
            /******/ dependency = moduleOutdatedDependencies[j];
            /******/ idx = module.children.indexOf(dependency);
            /******/ if (idx >= 0) module.children.splice(idx, 1);
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    } // Now in "apply" phase
    /******/
    /******/ /******/ hotSetStatus('apply');
    /******/
    /******/ hotCurrentHash = hotUpdateNewHash; // insert new code
    /******/
    /******/ /******/ for (moduleId in appliedUpdate) {
      /******/ if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
        /******/ modules[moduleId] = appliedUpdate[moduleId];
        /******/
      }
      /******/
    } // call accept handlers
    /******/
    /******/ /******/ var error = null;
    /******/ for (moduleId in outdatedDependencies) {
      /******/ if (
        /******/ Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
        /******/
      ) {
        /******/ module = installedModules[moduleId];
        /******/ if (module) {
          /******/ moduleOutdatedDependencies = outdatedDependencies[moduleId];
          /******/ var callbacks = [];
          /******/ for (i = 0; i < moduleOutdatedDependencies.length; i++) {
            /******/ dependency = moduleOutdatedDependencies[i];
            /******/ cb = module.hot._acceptedDependencies[dependency];
            /******/ if (cb) {
              /******/ if (callbacks.indexOf(cb) !== -1) continue;
              /******/ callbacks.push(cb);
              /******/
            }
            /******/
          }
          /******/ for (i = 0; i < callbacks.length; i++) {
            /******/ cb = callbacks[i];
            /******/ try {
              /******/ cb(moduleOutdatedDependencies);
              /******/
            } catch (err) {
              /******/ if (options.onErrored) {
                /******/ options.onErrored({
                  /******/ type: 'accept-errored',
                  /******/ moduleId: moduleId,
                  /******/ dependencyId: moduleOutdatedDependencies[i],
                  /******/ error: err,
                  /******/
                });
                /******/
              }
              /******/ if (!options.ignoreErrored) {
                /******/ if (!error) error = err;
                /******/
              }
              /******/
            }
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    } // Load self accepted modules
    /******/
    /******/ /******/ for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
      /******/ var item = outdatedSelfAcceptedModules[i];
      /******/ moduleId = item.module;
      /******/ hotCurrentParents = [moduleId];
      /******/ try {
        /******/ __webpack_require__(moduleId);
        /******/
      } catch (err) {
        /******/ if (typeof item.errorHandler === 'function') {
          /******/ try {
            /******/ item.errorHandler(err);
            /******/
          } catch (err2) {
            /******/ if (options.onErrored) {
              /******/ options.onErrored({
                /******/ type: 'self-accept-error-handler-errored',
                /******/ moduleId: moduleId,
                /******/ error: err2,
                /******/ originalError: err,
                /******/
              });
              /******/
            }
            /******/ if (!options.ignoreErrored) {
              /******/ if (!error) error = err2;
              /******/
            }
            /******/ if (!error) error = err;
            /******/
          }
          /******/
        } else {
          /******/ if (options.onErrored) {
            /******/ options.onErrored({
              /******/ type: 'self-accept-errored',
              /******/ moduleId: moduleId,
              /******/ error: err,
              /******/
            });
            /******/
          }
          /******/ if (!options.ignoreErrored) {
            /******/ if (!error) error = err;
            /******/
          }
          /******/
        }
        /******/
      }
      /******/
    } // handle errors in accept handlers and self accepted module load
    /******/
    /******/ /******/ if (error) {
      /******/ hotSetStatus('fail');
      /******/ return Promise.reject(error);
      /******/
    }
    /******/
    /******/ hotSetStatus('idle');
    /******/ return new Promise(function(resolve) {
      /******/ resolve(outdatedModules);
      /******/
    });
    /******/
  } // The module cache
  /******/
  /******/ /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/ hot: hotCreateModule(moduleId),
      /******/ parents:
        ((hotCurrentParentsTemp = hotCurrentParents),
        (hotCurrentParents = []),
        hotCurrentParentsTemp),
      /******/ children: [],
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      hotCreateRequire(moduleId),
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, { enumerable: true, get: getter });
      /******/
    }
    /******/
  }; // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true });
    /******/
  }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode,
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value);
    /******/ if (mode & 8) return value;
    /******/ if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
    /******/ var ns = Object.create(null);
    /******/ __webpack_require__.r(ns);
    /******/ Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    /******/ if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key];
          }.bind(null, key),
        );
    /******/ return ns;
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default'];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, 'a', getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ''; // __webpack_hash__
  /******/
  /******/ /******/ __webpack_require__.h = function() {
    return hotCurrentHash;
  }; // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return hotCreateRequire(0)((__webpack_require__.s = 0));
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ './node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js':
      /*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
      /*! no static exports found */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';
        eval(
          '\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ "source-map-support/source-map-support.js").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ "electron-webpack/out/electron-main-hmr/HmrClient").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n// __ts-babel@6.0.4\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixtQkFBTyxDQUFDLDBGQUEwQzs7QUFFbEQ7O0FBRUE7QUFDQTtBQUNBLENBQUM7OztBQUdELGtCQUFrQixtQkFBTyxDQUFDLDBHQUFrRCxZQUFZOzs7QUFHeEY7QUFDQSxTQUFTLHVCQUFnQjtBQUN6QixDQUFDLEU7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8gX190cy1iYWJlbEA2LjAuNFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n',
        );

        /***/
      },

    /***/ './node_modules/uuid/lib/bytesToUuid.js':
      /*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          "/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\nvar byteToHex = [];\nfor (var i = 0; i < 256; ++i) {\n  byteToHex[i] = (i + 0x100).toString(16).substr(1);\n}\n\nfunction bytesToUuid(buf, offset) {\n  var i = offset || 0;\n  var bth = byteToHex;\n  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4\n  return ([bth[buf[i++]], bth[buf[i++]], \n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]],\n\tbth[buf[i++]], bth[buf[i++]],\n\tbth[buf[i++]], bth[buf[i++]]]).join('');\n}\n\nmodule.exports = bytesToUuid;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanM/MjM2NiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cbnZhciBieXRlVG9IZXggPSBbXTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbn1cblxuZnVuY3Rpb24gYnl0ZXNUb1V1aWQoYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBvZmZzZXQgfHwgMDtcbiAgdmFyIGJ0aCA9IGJ5dGVUb0hleDtcbiAgLy8gam9pbiB1c2VkIHRvIGZpeCBtZW1vcnkgaXNzdWUgY2F1c2VkIGJ5IGNvbmNhdGVuYXRpb246IGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMxNzUjYzRcbiAgcmV0dXJuIChbYnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXV0pLmpvaW4oJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ5dGVzVG9VdWlkO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/uuid/lib/bytesToUuid.js\n",
        );

        /***/
      },

    /***/ './node_modules/uuid/lib/rng.js':
      /*!**************************************!*\
  !*** ./node_modules/uuid/lib/rng.js ***!
  \**************************************/
      /*! no static exports found */
      /***/ function(module, exports, __webpack_require__) {
        eval(
          '// Unique ID creation requires a high quality random # generator.  In node.js\n// this is pretty straight-forward - we use the crypto API.\n\nvar crypto = __webpack_require__(/*! crypto */ "crypto");\n\nmodule.exports = function nodeRNG() {\n  return crypto.randomBytes(16);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvcm5nLmpzPzUzZDciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMsc0JBQVE7O0FBRTdCO0FBQ0E7QUFDQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy91dWlkL2xpYi9ybmcuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gbm9kZS5qc1xuLy8gdGhpcyBpcyBwcmV0dHkgc3RyYWlnaHQtZm9yd2FyZCAtIHdlIHVzZSB0aGUgY3J5cHRvIEFQSS5cblxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vZGVSTkcoKSB7XG4gIHJldHVybiBjcnlwdG8ucmFuZG9tQnl0ZXMoMTYpO1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/uuid/lib/rng.js\n',
        );

        /***/
      },

    /***/ './node_modules/uuid/v4.js':
      /*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
      /*! no static exports found */
      /***/ function(module, exports, __webpack_require__) {
        eval(
          'var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng.js");\nvar bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");\n\nfunction v4(options, buf, offset) {\n  var i = buf && offset || 0;\n\n  if (typeof(options) == \'string\') {\n    buf = options === \'binary\' ? new Array(16) : null;\n    options = null;\n  }\n  options = options || {};\n\n  var rnds = options.random || (options.rng || rng)();\n\n  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n  rnds[6] = (rnds[6] & 0x0f) | 0x40;\n  rnds[8] = (rnds[8] & 0x3f) | 0x80;\n\n  // Copy bytes to buffer, if provided\n  if (buf) {\n    for (var ii = 0; ii < 16; ++ii) {\n      buf[i + ii] = rnds[ii];\n    }\n  }\n\n  return buf || bytesToUuid(rnds);\n}\n\nmodule.exports = v4;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdXVpZC92NC5qcz9jNjRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFVBQVUsbUJBQU8sQ0FBQyxpREFBVztBQUM3QixrQkFBa0IsbUJBQU8sQ0FBQyxpRUFBbUI7O0FBRTdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL3V1aWQvdjQuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcm5nID0gcmVxdWlyZSgnLi9saWIvcm5nJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgYnVmID0gb3B0aW9ucyA9PT0gJ2JpbmFyeScgPyBuZXcgQXJyYXkoMTYpIDogbnVsbDtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG5cbiAgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gIHJuZHNbOF0gPSAocm5kc1s4XSAmIDB4M2YpIHwgMHg4MDtcblxuICAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcbiAgaWYgKGJ1Zikge1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCAxNjsgKytpaSkge1xuICAgICAgYnVmW2kgKyBpaV0gPSBybmRzW2lpXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmIHx8IGJ5dGVzVG9VdWlkKHJuZHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHY0O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/uuid/v4.js\n',
        );

        /***/
      },

    /***/ './package.json':
      /*!**********************!*\
  !*** ./package.json ***!
  \**********************/
      /*! exports provided: productName, name, version, description, main, scripts, repository, author, license, devDependencies, dependencies, build, husky, optionalDependencies, default */
      /***/ function(module) {
        eval(
          'module.exports = JSON.parse("{\\"productName\\":\\"SikhiToTheMax\\",\\"name\\":\\"sttm-desktop\\",\\"version\\":\\"7.2.0\\",\\"description\\":\\"The SikhiToTheMax desktop app\\",\\"main\\":\\"app.js\\",\\"scripts\\":{\\"precommit\\":\\"npm test\\",\\"test\\":\\"run-p test:*\\",\\"test:lint\\":\\"run-p test:lint:*\\",\\"test:lint:html\\":\\"htmlhint --config .htmlhintrc www\\",\\"test:lint:js\\":\\"eslint app.js packaging www/js\\",\\"test:lint:css\\":\\"stylelint \\\\\\"www/src/scss/*.scss\\\\\\" --syntax scss --fix\\",\\"start\\":\\"concurrently --kill-others \\\\\\"npm run watch-css\\\\\\" \\\\\\"cross-env NODE_ENV=development electron .\\\\\\"\\",\\"build\\":\\"npm run build-css\\",\\"compile\\":\\"electron-webpack\\",\\"dev\\":\\"electron-webpack dev\\",\\"pack:mac\\":\\"npm run build && electron-builder --mac\\",\\"pack:win\\":\\"npm run build && electron-builder --win --x64\\",\\"pack:win32\\":\\"npm run build && electron-builder --win --ia32\\",\\"pack:linux\\":\\"npm run build && electron-builder --linux --x64\\",\\"dist:mac\\":\\"npm run build && electron-builder --mac --publish always\\",\\"dist:win\\":\\"npm run pack:win && electron-builder --win --x64 --publish always\\",\\"dist:win32\\":\\"npm run pack:win32 && electron-builder --win --ia32 --publish always\\",\\"build-css\\":\\"run-p build-css:*\\",\\"build-css:main\\":\\"node-sass --output-style compressed --include-path www/src/scss www/src/scss/styles.scss www/assets/css/bundle.css\\",\\"build-css:obs\\":\\"node-sass --output-style compressed --include-path www/src/scss/obs www/src/scss/obs/styles.scss www/obs/bundle.css\\",\\"watch-css\\":\\"nodemon --watch www -e scss -x \\\\\\"npm run build-css\\\\\\"\\",\\"rebuild-realm\\":\\"$(npm bin)/electron-rebuild -f -w realm\\",\\"postinstall\\":\\"electron-builder install-app-deps\\"},\\"repository\\":{\\"type\\":\\"git\\",\\"url\\":\\"ssh://git@github.com:khalisfoundation/sttm-desktop.git\\"},\\"author\\":\\"Khalis, Inc. <techsupport@khalisfoundation.org>\\",\\"license\\":\\"OSL-3.0\\",\\"devDependencies\\":{\\"@babel/preset-env\\":\\"^7.8.7\\",\\"@babel/preset-react\\":\\"^7.8.3\\",\\"concurrently\\":\\"^3.3.0\\",\\"cross-env\\":\\"^3.1.4\\",\\"electron\\":\\"^4.2.12\\",\\"electron-builder\\":\\"^22.3.2\\",\\"electron-publisher-s3\\":\\"^20.17.2\\",\\"electron-rebuild\\":\\"^1.8.8\\",\\"electron-webpack\\":\\"^2.7.4\\",\\"eslint\\":\\"^5.3.0\\",\\"eslint-config-airbnb-base\\":\\"^13.1.0\\",\\"eslint-config-prettier\\":\\"^4.1.0\\",\\"eslint-plugin-import\\":\\"^2.16.0\\",\\"eslint-plugin-prettier\\":\\"^3.0.1\\",\\"htmlhint\\":\\"^0.10.1\\",\\"husky\\":\\"^1.3.1\\",\\"node-sass\\":\\"^4.9.3\\",\\"nodemon\\":\\"^1.18.4\\",\\"npm-run-all\\":\\"^4.1.3\\",\\"prettier\\":\\"^1.16.4\\",\\"pretty-quick\\":\\"^1.10.0\\",\\"semver\\":\\"^5.6.0\\",\\"simple-git\\":\\"^1.107.0\\",\\"spectron\\":\\"^3.6.1\\",\\"ssh2\\":\\"^0.5.4\\",\\"stylelint\\":\\"^7.9.0\\",\\"stylelint-config-prettier\\":\\"^5.0.0\\",\\"stylelint-config-standard\\":\\"^16.0.0\\",\\"stylelint-order\\":\\"^0.4.1\\",\\"webpack\\":\\"^4.42.0\\"},\\"dependencies\\":{\\"anvaad-js\\":\\"^1.4.0\\",\\"copy-to-clipboard\\":\\"^3.0.8\\",\\"electron-chromecast\\":\\"^1.1.0\\",\\"electron-log\\":\\"^2.0.2\\",\\"electron-updater\\":\\"^4.2.0\\",\\"express\\":\\"^4.15.2\\",\\"extract-zip\\":\\"^1.6.7\\",\\"get-json\\":\\"^1.0.0\\",\\"http-shutdown\\":\\"^1.2.1\\",\\"hyperscript\\":\\"^2.0.2\\",\\"image-type\\":\\"^3.0.0\\",\\"imagemin\\":\\"^6.0.0\\",\\"imagemin-jpegtran\\":\\"^6.0.0\\",\\"imagemin-pngquant\\":\\"^6.0.0\\",\\"ip\\":\\"^1.1.5\\",\\"is-online\\":\\"^7.0.0\\",\\"lodash.debounce\\":\\"^4.0.8\\",\\"lodash.defaultsdeep\\":\\"^4.6.0\\",\\"lodash.get\\":\\"^4.4.2\\",\\"lodash.set\\":\\"^4.3.2\\",\\"marked\\":\\"^0.6.1\\",\\"moment\\":\\"^2.22.1\\",\\"noty\\":\\"^3.2.0-beta\\",\\"openport\\":\\"0.0.5\\",\\"react\\":\\"^16.13.0\\",\\"react-dom\\":\\"^16.13.0\\",\\"react-router-static\\":\\"^1.0.0\\",\\"read-chunk\\":\\"^3.0.0\\",\\"realm\\":\\"^3.5.0\\",\\"request\\":\\"^2.81.0\\",\\"request-progress\\":\\"^3.0.0\\",\\"request-promise\\":\\"^4.2.4\\",\\"sanitize-html\\":\\"^1.20.0\\",\\"scroll\\":\\"^2.0.1\\",\\"socket.io\\":\\"^2.1.1\\",\\"sqlite3\\":\\"^4.0.3\\",\\"tippy.js\\":\\"^2.5.2\\",\\"universal-analytics\\":\\"^0.4.20\\",\\"update\\":\\"^0.7.4\\",\\"uuid\\":\\"^3.3.2\\"},\\"build\\":{\\"appId\\":\\"org.khalisfoundation.sttm\\",\\"copyright\\":\\"Copyright © 2018 Khalis Foundation , SikhiToTheMax Trademark SHARE Charity, UK\\\\n\\",\\"files\\":[\\"**/*\\",\\"!assets${/*}\\",\\"!builds${/*}\\",\\"!**/scss${/*}\\",\\"!packaging${/*}\\",\\"!test${/*}\\",\\"!www/node_modules${/*}\\",\\"!www/package.json\\",\\"!**/{.eslintignore,.eslintrc,.gitmodules,.htmlhintrc,.stylelintrc,.travis.yml,appveyor.yml,data.db,id_rsa.enc,README,STTM.provisionprofile}\\",\\"!**/*.map\\"],\\"extraResources\\":[\\"data.db\\"],\\"directories\\":{\\"buildResources\\":\\"assets\\",\\"output\\":\\"builds\\"},\\"publish\\":{\\"provider\\":\\"s3\\",\\"bucket\\":\\"sttm-releases\\",\\"path\\":\\"${os}-${arch}\\",\\"region\\":\\"us-west-2\\"},\\"dmg\\":{\\"icon\\":\\"STTM-DMG.icns\\"},\\"mac\\":{\\"category\\":\\"public.app-category.reference\\",\\"icon\\":\\"assets/STTM.icns\\",\\"target\\":[\\"default\\"]},\\"nsis\\":{\\"artifactName\\":\\"SikhiToTheMaxSetup-${version}.${ext}\\",\\"deleteAppDataOnUninstall\\":true,\\"perMachine\\":true},\\"win\\":{\\"icon\\":\\"assets/STTM.ico\\",\\"target\\":[\\"nsis\\"]},\\"linux\\":{\\"target\\":\\"deb\\",\\"icon\\":\\"assets\\"}},\\"husky\\":{\\"hooks\\":{\\"pre-commit\\":\\"pretty-quick --staged\\",\\"pre-push\\":\\"npm test\\"}},\\"optionalDependencies\\":{\\"react-native\\":\\"^0.61.5\\"}}");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiIuL3BhY2thZ2UuanNvbi5qcyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./package.json\n',
        );

        /***/
      },

    /***/ './src/common/defaults.json':
      /*!**********************************!*\
  !*** ./src/common/defaults.json ***!
  \**********************************/
      /*! exports provided: userPrefs, gurmukhiKB, changelog-seen, changelog-seen-count, searchOptions, obs, default */
      /***/ function(module) {
        eval(
          'module.exports = JSON.parse("{\\"userPrefs\\":{\\"app\\":{\\"theme\\":\\"light-theme\\",\\"themebg\\":\\"\\",\\"overlay-cast\\":false,\\"announcement-overlay\\":false,\\"layout\\":{\\"presenter-view\\":true},\\"analytics\\":{\\"collect-statistics\\":true,\\"limit-changelog\\":false},\\"custom-theme-options\\":{\\"show-theme-editor\\":true},\\"live-feed-location\\":\\"default\\"},\\"searchResults\\":{\\"translationEnglish\\":\\"ssk\\",\\"transliteration\\":true,\\"meta\\":true},\\"toolbar\\":{\\"gurbani-options\\":{\\"display-visraams\\":false},\\"gurbani\\":{\\"bani-length\\":\\"short\\",\\"mangal-position\\":\\"current\\"},\\"vishraam\\":{\\"vishraam-options\\":\\"colored-words\\",\\"vishraam-source\\":\\"sttm\\"}},\\"slide-layout\\":{\\"fields\\":{\\"display-translation\\":true,\\"display-transliteration\\":true,\\"display-teeka\\":true,\\"display-next-line\\":false},\\"font-sizes\\":{\\"announcements\\":7,\\"gurbani\\":9,\\"translation\\":5,\\"transliteration\\":4,\\"teeka\\":4},\\"language-settings\\":{\\"translation-language\\":\\"English\\",\\"transliteration-language\\":\\"English\\"},\\"larivaar-settings\\":{\\"assist-type\\":\\"single-color\\"},\\"autoplay-options\\":{\\"autoplayTimer\\":10},\\"display-options\\":{\\"disable-akhandpaatt\\":false,\\"akhandpaatt\\":false,\\"larivaar\\":false,\\"larivaar-assist\\":false,\\"left-align\\":false,\\"quick-tools\\":true,\\"shortcut-tray-on\\":true}}},\\"gurmukhiKB\\":false,\\"changelog-seen\\":\\"0.0.0\\",\\"changelog-seen-count\\":0,\\"searchOptions\\":{\\"searchLanguage\\":\\"gr\\",\\"searchType\\":0,\\"searchSource\\":\\"all\\"},\\"obs\\":{\\"overlayPrefs\\":{\\"overlayVars\\":{\\"layout\\":\\"split\\",\\"bgColor\\":\\"#2c3e50\\",\\"bgOpacity\\":1,\\"textColor\\":\\"#EAC445\\",\\"padding\\":0.5,\\"fontSize\\":3,\\"gurbaniFontSize\\":5,\\"gurbaniTextColor\\":\\"#EAC445\\",\\"overlayLogo\\":true,\\"overlayLarivaar\\":false,\\"theme\\":false},\\"gurbani\\":{\\"bottom\\":156,\\"height\\":42,\\"left\\":280,\\"right\\":1080,\\"top\\":114,\\"width\\":800},\\"teeka\\":{\\"bottom\\":192,\\"height\\":36,\\"left\\":280,\\"right\\":1080,\\"top\\":156,\\"width\\":800},\\"translation\\":{\\"bottom\\":564,\\"height\\":36,\\"left\\":280,\\"right\\":1080,\\"top\\":528,\\"width\\":800},\\"transliteration\\":{\\"bottom\\":528,\\"height\\":36,\\"left\\":280,\\"right\\":1080,\\"top\\":492,\\"width\\":800}}}}");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiIuL3NyYy9jb21tb24vZGVmYXVsdHMuanNvbi5qcyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/common/defaults.json\n',
        );

        /***/
      },

    /***/ './src/common/store.js':
      /*!*****************************!*\
  !*** ./src/common/store.js ***!
  \*****************************/
      /*! no static exports found */
      /***/ function(module, exports, __webpack_require__) {
        eval(
          "const electron = __webpack_require__(/*! electron */ \"electron\");\n\nconst fs = __webpack_require__(/*! fs */ \"fs\");\n\nconst ldDefaultsDeep = __webpack_require__(/*! lodash.defaultsdeep */ \"lodash.defaultsdeep\");\n\nconst ldGet = __webpack_require__(/*! lodash.get */ \"lodash.get\");\n\nconst ldSet = __webpack_require__(/*! lodash.set */ \"lodash.set\");\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nfunction parseDataFile(filePath, defaults) {\n  // We'll try/catch it in case the file doesn't exist yet,\n  // which will be the case on the first application run.\n  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object\n  try {\n    return JSON.parse(fs.readFileSync(filePath));\n  } catch (error) {\n    // if there was some kind of error, return the passed in defaults instead.\n    return defaults;\n  }\n}\n\nclass Store {\n  constructor(opts) {\n    // Renderer process has to get `app` module via `remote`,\n    // whereas the main process can get it directly\n    // app.getPath('userData') will return a string of the user's app data directory path.\n    const userDataPath = (electron.app || electron.remote.app).getPath('userData'); // We'll use the `configName` property to set the file name and path.join\n    // to bring it all together as a string\n\n    this.path = path.join(userDataPath, `${opts.configName}.json`);\n    this.data = parseDataFile(this.path, opts.defaults);\n    this.defaults = opts.defaults; // Write preferences to localStorage for viewers\n\n    this.combined = ldDefaultsDeep(this.data, this.defaults);\n\n    if (typeof localStorage === 'object') {\n      localStorage.setItem('prefs', JSON.stringify(this.combined.userPrefs));\n    }\n  } // This will return the default values\n\n\n  getDefaults() {\n    return this.defaults;\n  } // This will just return the property on the `data` object\n\n\n  get(key) {\n    return ldGet(this.combined, key);\n  } // ...and this will set it\n\n\n  set(key, val) {\n    ldSet(this.data, key, val);\n    this.combined = ldDefaultsDeep(this.data, this.defaults); // Wait, I thought using the node.js' synchronous APIs was bad form?\n    // We're not writing a server so there's not nearly the same IO demand on the process\n    // Also if we used an async API and our app was quit\n    // before the asynchronous write had a chance to complete,\n    // we might lose that data. Note that in a real app, we would try/catch this.\n\n    fs.writeFileSync(this.path, JSON.stringify(this.data)); // Update localStorage for viewer\n\n    if (typeof localStorage === 'object') {\n      localStorage.setItem('prefs', JSON.stringify(this.combined.userPrefs));\n    }\n  }\n\n  delete(key) {\n    delete this.data[key];\n    this.combined = ldDefaultsDeep(this.data, this.defaults);\n    fs.writeFileSync(this.path, JSON.stringify(this.data)); // Update localStorage for viewer\n\n    if (typeof localStorage === 'object') {\n      localStorage.setItem('prefs', JSON.stringify(this.combined.userPrefs));\n    }\n  }\n\n  getAllPrefs() {\n    return this.get('userPrefs');\n  }\n\n  getUserPref(key) {\n    return this.get(`userPrefs.${key}`);\n  }\n\n  setUserPref(key, val) {\n    this.set(`userPrefs.${key}`, val);\n  }\n\n} // expose the class\n\n\nmodule.exports = Store;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL3N0b3JlLmpzP2NhOGYiXSwibmFtZXMiOlsiZWxlY3Ryb24iLCJyZXF1aXJlIiwiZnMiLCJsZERlZmF1bHRzRGVlcCIsImxkR2V0IiwibGRTZXQiLCJwYXRoIiwicGFyc2VEYXRhRmlsZSIsImZpbGVQYXRoIiwiZGVmYXVsdHMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJlcnJvciIsIlN0b3JlIiwiY29uc3RydWN0b3IiLCJvcHRzIiwidXNlckRhdGFQYXRoIiwiYXBwIiwicmVtb3RlIiwiZ2V0UGF0aCIsImpvaW4iLCJjb25maWdOYW1lIiwiZGF0YSIsImNvbWJpbmVkIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInVzZXJQcmVmcyIsImdldERlZmF1bHRzIiwiZ2V0Iiwia2V5Iiwic2V0IiwidmFsIiwid3JpdGVGaWxlU3luYyIsImRlbGV0ZSIsImdldEFsbFByZWZzIiwiZ2V0VXNlclByZWYiLCJzZXRVc2VyUHJlZiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLFFBQVEsR0FBR0MsbUJBQU8sQ0FBQywwQkFBRCxDQUF4Qjs7QUFDQSxNQUFNQyxFQUFFLEdBQUdELG1CQUFPLENBQUMsY0FBRCxDQUFsQjs7QUFDQSxNQUFNRSxjQUFjLEdBQUdGLG1CQUFPLENBQUMsZ0RBQUQsQ0FBOUI7O0FBQ0EsTUFBTUcsS0FBSyxHQUFHSCxtQkFBTyxDQUFDLDhCQUFELENBQXJCOztBQUNBLE1BQU1JLEtBQUssR0FBR0osbUJBQU8sQ0FBQyw4QkFBRCxDQUFyQjs7QUFDQSxNQUFNSyxJQUFJLEdBQUdMLG1CQUFPLENBQUMsa0JBQUQsQ0FBcEI7O0FBRUEsU0FBU00sYUFBVCxDQUF1QkMsUUFBdkIsRUFBaUNDLFFBQWpDLEVBQTJDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLE1BQUk7QUFDRixXQUFPQyxJQUFJLENBQUNDLEtBQUwsQ0FBV1QsRUFBRSxDQUFD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TyxLQUFLRCxHQUFMLENBQVUsYUFBWUMsR0FBSSxFQUExQixDQUFQO0FBQ0Q7O0FBRURPLGFBQVcsQ0FBQ1AsR0FBRCxFQUFNRSxHQUFOLEVBQVc7QUFDcEIsU0FBS0QsR0FBTCxDQUFVLGFBQVlELEdBQUksRUFBMUIsRUFBNkJFLEdBQTdCO0FBQ0Q7O0FBdEVTLEMsQ0F5RVo7OztBQUNBTSxNQUFNLENBQUNDLE9BQVAsR0FBaUIxQixLQUFqQiIsImZpbGUiOiIuL3NyYy9jb21tb24vc3RvcmUuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBsZERlZmF1bHRzRGVlcCA9IHJlcXVpcmUoJ2xvZGFzaC5kZWZhdWx0c2RlZXAnKTtcbmNvbnN0IGxkR2V0ID0gcmVxdWlyZSgnbG9kYXNoLmdldCcpO1xuY29uc3QgbGRTZXQgPSByZXF1aXJlKCdsb2Rhc2guc2V0Jyk7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5mdW5jdGlvbiBwYXJzZURhdGFGaWxlKGZpbGVQYXRoLCBkZWZhdWx0cykge1xuICAvLyBXZSdsbCB0cnkvY2F0Y2ggaXQgaW4gY2FzZSB0aGUgZmlsZSBkb2Vzbid0IGV4aXN0IHlldCxcbiAgLy8gd2hpY2ggd2lsbCBiZSB0aGUgY2FzZSBvbiB0aGUgZmlyc3QgYXBwbGljYXRpb24gcnVuLlxuICAvLyBgZnMucmVhZEZpbGVTeW5jYCB3aWxsIHJldHVybiBhIEpTT04gc3RyaW5nIHdoaWNoIHdlIHRoZW4gcGFyc2UgaW50byBhIEphdmFzY3JpcHQgb2JqZWN0XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gaWYgdGhlcmUgd2FzIHNvbWUga2luZCBvZiBlcnJvciwgcmV0dXJuIHRoZSBwYXNzZWQgaW4gZGVmYXVsdHMgaW5zdGVhZC5cbiAgICByZXR1cm4gZGVmYXVsdHM7XG4gIH1cbn1cblxuY2xhc3MgU3RvcmUge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgLy8gUmVuZGVyZXIgcHJvY2VzcyBoYXMgdG8gZ2V0IGBhcHBgIG1vZHVsZSB2aWEgYHJlbW90ZWAsXG4gICAgLy8gd2hlcmVhcyB0aGUgbWFpbiBwcm9jZXNzIGNhbiBnZXQgaXQgZGlyZWN0bHlcbiAgICAvLyBhcHAuZ2V0UGF0aCgndXNlckRhdGEnKSB3aWxsIHJldHVybiBhIHN0cmluZyBvZiB0aGUgdXNlcidzIGFwcCBkYXRhIGRpcmVjdG9yeSBwYXRoLlxuICAgIGNvbnN0IHVzZXJEYXRhUGF0aCA9IChlbGVjdHJvbi5hcHAgfHwgZWxlY3Ryb24ucmVtb3RlLmFwcCkuZ2V0UGF0aCgndXNlckRhdGEnKTtcbiAgICAvLyBXZSdsbCB1c2UgdGhlIGBjb25maWdOYW1lYCBwcm9wZXJ0eSB0byBzZXQgdGhlIGZpbGUgbmFtZSBhbmQgcGF0aC5qb2luXG4gICAgLy8gdG8gYnJpbmcgaXQgYWxsIHRvZ2V0aGVyIGFzIGEgc3RyaW5nXG4gICAgdGhpcy5wYXRoID0gcGF0aC5qb2luKHVzZXJEYXRhUGF0aCwgYCR7b3B0cy5jb25maWdOYW1lfS5qc29uYCk7XG5cbiAgICB0aGlzLmRhdGEgPSBwYXJzZURhdGFGaWxlKHRoaXMucGF0aCwgb3B0cy5kZWZhdWx0cyk7XG4gICAgdGhpcy5kZWZhdWx0cyA9IG9wdHMuZGVmYXVsdHM7XG5cbiAgICAvLyBXcml0ZSBwcmVmZXJlbmNlcyB0byBsb2NhbFN0b3JhZ2UgZm9yIHZpZXdlcnNcbiAgICB0aGlzLmNvbWJpbmVkID0gbGREZWZhdWx0c0RlZXAodGhpcy5kYXRhLCB0aGlzLmRlZmF1bHRzKTtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcmVmcycsIEpTT04uc3RyaW5naWZ5KHRoaXMuY29tYmluZWQudXNlclByZWZzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVGhpcyB3aWxsIHJldHVybiB0aGUgZGVmYXVsdCB2YWx1ZXNcbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdHM7XG4gIH1cblxuICAvLyBUaGlzIHdpbGwganVzdCByZXR1cm4gdGhlIHByb3BlcnR5IG9uIHRoZSBgZGF0YWAgb2JqZWN0XG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gbGRHZXQodGhpcy5jb21iaW5lZCwga2V5KTtcbiAgfVxuXG4gIC8vIC4uLmFuZCB0aGlzIHdpbGwgc2V0IGl0XG4gIHNldChrZXksIHZhbCkge1xuICAgIGxkU2V0KHRoaXMuZGF0YSwga2V5LCB2YWwpO1xuICAgIHRoaXMuY29tYmluZWQgPSBsZERlZmF1bHRzRGVlcCh0aGlzLmRhdGEsIHRoaXMuZGVmYXVsdHMpO1xuXG4gICAgLy8gV2FpdCwgSSB0aG91Z2h0IHVzaW5nIHRoZSBub2RlLmpzJyBzeW5jaHJvbm91cyBBUElzIHdhcyBiYWQgZm9ybT9cbiAgICAvLyBXZSdyZSBub3Qgd3JpdGluZyBhIHNlcnZlciBzbyB0aGVyZSdzIG5vdCBuZWFybHkgdGhlIHNhbWUgSU8gZGVtYW5kIG9uIHRoZSBwcm9jZXNzXG4gICAgLy8gQWxzbyBpZiB3ZSB1c2VkIGFuIGFzeW5jIEFQSSBhbmQgb3VyIGFwcCB3YXMgcXVpdFxuICAgIC8vIGJlZm9yZSB0aGUgYXN5bmNocm9ub3VzIHdyaXRlIGhhZCBhIGNoYW5jZSB0byBjb21wbGV0ZSxcbiAgICAvLyB3ZSBtaWdodCBsb3NlIHRoYXQgZGF0YS4gTm90ZSB0aGF0IGluIGEgcmVhbCBhcHAsIHdlIHdvdWxkIHRyeS9jYXRjaCB0aGlzLlxuICAgIGZzLndyaXRlRmlsZVN5bmModGhpcy5wYXRoLCBKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpKTtcblxuICAgIC8vIFVwZGF0ZSBsb2NhbFN0b3JhZ2UgZm9yIHZpZXdlclxuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlID09PSAnb2JqZWN0Jykge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZWZzJywgSlNPTi5zdHJpbmdpZnkodGhpcy5jb21iaW5lZC51c2VyUHJlZnMpKTtcbiAgICB9XG4gIH1cblxuICBkZWxldGUoa2V5KSB7XG4gICAgZGVsZXRlIHRoaXMuZGF0YVtrZXldO1xuICAgIHRoaXMuY29tYmluZWQgPSBsZERlZmF1bHRzRGVlcCh0aGlzLmRhdGEsIHRoaXMuZGVmYXVsdHMpO1xuXG4gICAgZnMud3JpdGVGaWxlU3luYyh0aGlzLnBhdGgsIEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpO1xuXG4gICAgLy8gVXBkYXRlIGxvY2FsU3RvcmFnZSBmb3Igdmlld2VyXG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgPT09ICdvYmplY3QnKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJlZnMnLCBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbWJpbmVkLnVzZXJQcmVmcykpO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsbFByZWZzKCkge1xuICAgIHJldHVybiB0aGlzLmdldCgndXNlclByZWZzJyk7XG4gIH1cblxuICBnZXRVc2VyUHJlZihrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYHVzZXJQcmVmcy4ke2tleX1gKTtcbiAgfVxuXG4gIHNldFVzZXJQcmVmKGtleSwgdmFsKSB7XG4gICAgdGhpcy5zZXQoYHVzZXJQcmVmcy4ke2tleX1gLCB2YWwpO1xuICB9XG59XG5cbi8vIGV4cG9zZSB0aGUgY2xhc3Ncbm1vZHVsZS5leHBvcnRzID0gU3RvcmU7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/common/store.js\n",
        );

        /***/
      },

    /***/ './src/common/themes.json':
      /*!********************************!*\
  !*** ./src/common/themes.json ***!
  \********************************/
      /*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, default */
      /***/ function(module) {
        eval(
          'module.exports = JSON.parse("[{\\"name\\":\\"Light\\",\\"background-color\\":\\"#fff\\",\\"gurbani-color\\":\\"#000000\\",\\"translation-color\\":\\"#353535\\",\\"transliteration-color\\":\\"#353535\\",\\"teeka-color\\":\\"#4b4b4b\\",\\"type\\":[\\"COLOR\\",\\"anandkaraj\\"],\\"key\\":\\"light-theme\\"},{\\"name\\":\\"Dark\\",\\"background-color\\":\\"#000\\",\\"gurbani-color\\":\\"#c9e7ff\\",\\"translation-color\\":\\"#fff\\",\\"transliteration-color\\":\\"#fff\\",\\"teeka-color\\":\\"#fff\\",\\"type\\":[\\"COLOR\\",\\"death\\"],\\"key\\":\\"dark-theme\\"},{\\"name\\":\\"Khalsa Gold\\",\\"background-color\\":\\"#ffda39\\",\\"gurbani-color\\":\\"#ffffff\\",\\"gurbani-shadow\\":\\"0 0 4px rgba(140,81,5,1)\\",\\"translation-color\\":\\"#4d2b00\\",\\"transliteration-color\\":\\"#413b3d\\",\\"teeka-color\\":\\"#723c03\\",\\"background-image\\":\\"thumbnails/golden.jpg\\",\\"background-image-full\\":\\"golden.jpg\\",\\"type\\":\\"BACKGROUND\\",\\"key\\":\\"khalsa-gold\\"},{\\"name\\":\\"Baagi Blue\\",\\"background-color\\":\\"#7db6c7\\",\\"gurbani-color\\":\\"#ffffff\\",\\"gurbani-shadow\\":\\"5px 5px 1px rgba(0,0,0,0.7)\\",\\"translation-color\\":\\"#fbfbfb\\",\\"transliteration-color\\":\\"#f4f4f9\\",\\"teeka-color\\":\\"#d3ecff\\",\\"background-image\\":\\"thumbnails/dark-blue.jpg\\",\\"background-image-full\\":\\"dark-blue.jpg\\",\\"type\\":\\"BACKGROUND\\",\\"key\\":\\"baagi-blue\\"},{\\"name\\":\\"Khalsa Rush\\",\\"background-color\\":\\"#fec43c\\",\\"gurbani-color\\":\\"#071f77\\",\\"translation-color\\":\\"#001060\\",\\"transliteration-color\\":\\"#f7faf6\\",\\"teeka-color\\":\\"#433e5d\\",\\"background-image\\":\\"thumbnails/orange.jpg\\",\\"background-image-full\\":\\"orange.jpg\\",\\"type\\":\\"BACKGROUND\\",\\"key\\":\\"khalsa-rush\\"},{\\"name\\":\\"Moody Blue\\",\\"background-color\\":\\"#38987b7\\",\\"gurbani-color\\":\\"#fcfefe\\",\\"translation-color\\":\\"#fde5ab\\",\\"transliteration-color\\":\\"#f1f5f4\\",\\"teeka-color\\":\\"#d1dbe2\\",\\"background-image\\":\\"thumbnails/blue.jpg\\",\\"background-image-full\\":\\"blue.jpg\\",\\"type\\":[\\"BACKGROUND\\",\\"death\\"],\\"key\\":\\"moody-blue\\"},{\\"name\\":\\"A New Day\\",\\"background-color\\":\\"#7ccf3\\",\\"gurbani-color\\":\\"#0e2654\\",\\"gurbani-shadow\\":\\"2px 2px 2px rgba(255,255,255,0.7)\\",\\"translation-color\\":\\"#003a8c\\",\\"transliteration-color\\":\\"#80878a\\",\\"teeka-color\\":\\"#033780\\",\\"background-image\\":\\"thumbnails/clouds.jpg\\",\\"background-image-full\\":\\"clouds.jpg\\",\\"type\\":\\"BACKGROUND\\",\\"key\\":\\"a-new-day\\"},{\\"name\\":\\"Black & Blue\\",\\"background-color\\":\\"#05060b\\",\\"gurbani-color\\":\\"#ffffff\\",\\"translation-color\\":\\"#a3eafd\\",\\"transliteration-color\\":\\"#ededef\\",\\"teeka-color\\":\\"#d4d4d4\\",\\"background-image\\":\\"thumbnails/black.jpg\\",\\"background-image-full\\":\\"black.jpg\\",\\"type\\":\\"BACKGROUND\\",\\"key\\":\\"black-blue\\"},{\\"name\\":\\"floral\\",\\"background-color\\":\\"#ffd3e0\\",\\"gurbani-color\\":\\"#440a1d\\",\\"translation-color\\":\\"#821d3e\\",\\"transliteration-color\\":\\"#a4244e\\",\\"teeka-color\\":\\"#484848\\",\\"background-image\\":\\"thumbnails/floral-bg.jpg\\",\\"background-image-full\\":\\"floral-bg.jpg\\",\\"type\\":[\\"BACKGROUND\\",\\"anandkaraj\\"],\\"key\\":\\"floral\\"},{\\"name\\":\\"Darbar Blue\\",\\"background-color\\":\\"#05060b\\",\\"gurbani-color\\":\\"#ffffff\\",\\"translation-color\\":\\"#a3eafd\\",\\"transliteration-color\\":\\"#ededef\\",\\"teeka-color\\":\\"#d4d4d4\\",\\"background-image\\":\\"thumbnails/blue-darbar.jpg\\",\\"background-image-full\\":\\"blue-darbar.jpg\\",\\"type\\":\\"BACKGROUND\\",\\"key\\":\\"blue-darbar\\"},{\\"name\\":\\"High Contrast\\",\\"background-color\\":\\"#fff\\",\\"gurbani-color\\":\\"#000\\",\\"translation-color\\":\\"#000\\",\\"transliteration-color\\":\\"#000\\",\\"teeka-color\\":\\"#000\\",\\"type\\":\\"SPECIAL\\",\\"key\\":\\"high-contrast\\"},{\\"name\\":\\"Low Light\\",\\"background-color\\":\\"#000\\",\\"gurbani-color\\":\\"#98b1c5\\",\\"translation-color\\":\\"#b1b1b1\\",\\"transliteration-color\\":\\"#b1b1b1\\",\\"teeka-color\\":\\"#b1b1b1\\",\\"type\\":\\"SPECIAL\\",\\"key\\":\\"low-light\\"}]");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiIuL3NyYy9jb21tb24vdGhlbWVzLmpzb24uanMiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/common/themes.json\n',
        );

        /***/
      },

    /***/ './src/main/analytics.js':
      /*!*******************************!*\
  !*** ./src/main/analytics.js ***!
  \*******************************/
      /*! no static exports found */
      /***/ function(module, exports, __webpack_require__) {
        eval(
          "const ua = __webpack_require__(/*! universal-analytics */ \"universal-analytics\"); // https://www.npmjs.com/package/universal-analytics\n\n\nconst isOnline = __webpack_require__(/*! is-online */ \"is-online\");\n\nconst pjson = __webpack_require__(/*! ../../package.json */ \"./package.json\");\n\nconst appVersion = pjson.version;\nconst trackingId = 'UA-45513519-12';\n\nclass Analytics {\n  constructor(userId, store) {\n    if (trackingId) {\n      this.usr = ua(trackingId, userId);\n      this.store = store;\n    }\n  }\n  /**\n   * https://developers.google.com/analytics/devguides/collection/analyticsjs/events\n   * Name           | type | required | example\n   * ------------------------------------------\n   * eventCategory  | text |  yes     | Typically the object that was interacted with (e.g. 'Video')\n   * eventAction    | text |  yes     | The type of interaction (e.g. 'play')\n   * eventLabel     | text |  no      | Useful for categorizing events (e.g. 'Fall Campaign')\n   * eventValue     | int  |  no      | A numeric value associated with the event (e.g. 42)\n   * @param category\n   * @param action\n   * @param label\n   * @param value\n   */\n\n\n  trackEvent(category, action, label, value) {\n    const useragent = this.store.get('user-agent');\n\n    if (false) {} else {\n      console.log(`Tracking Event suppressed for development ec: ${category}, ea: ${action}, el: ${label}, ev: ${value}, ua: ${useragent}`);\n    }\n  }\n  /**\n   *\n   * @param path\n   * @param title\n   * @param hostname\n   */\n\n\n  trackPageView(path, title, hostname = 'SikhiToTheMax Desktop') {\n    if (false) {} else {\n      console.log('Tracking Page suppressed for development');\n    }\n  }\n\n}\n\nmodule.exports = Analytics;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9hbmFseXRpY3MuanM/N2FlZCJdLCJuYW1lcyI6WyJ1YSIsInJlcXVpcmUiLCJpc09ubGluZSIsInBqc29uIiwiYXBwVmVyc2lvbiIsInZlcnNpb24iLCJ0cmFja2luZ0lkIiwiQW5hbHl0aWNzIiwiY29uc3RydWN0b3IiLCJ1c2VySWQiLCJzdG9yZSIsInVzciIsInRyYWNrRXZlbnQiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJ1c2VyYWdlbnQiLCJnZXQiLCJwcm9jZXNzIiwiY29uc29sZSIsImxvZyIsInRyYWNrUGFnZVZpZXciLCJwYXRoIiwidGl0bGUiLCJob3N0bmFtZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLEVBQUUsR0FBR0MsbUJBQU8sQ0FBQyxnREFBRCxDQUFsQixDLENBQTJDOzs7QUFDM0MsTUFBTUMsUUFBUSxHQUFHRCxtQkFBTyxDQUFDLDRCQUFELENBQXhCOztBQUVBLE1BQU1FLEtBQUssR0FBR0YsbUJBQU8sQ0FBQywwQ0FBRCxDQUFyQjs7QUFFQSxNQUFNRyxVQUFVLEdBQUdELEtBQUssQ0FBQ0UsT0FBekI7QUFDQSxNQUFNQyxVQUFVLEdBQUcsZ0JBQW5COztBQUVBLE1BQU1DLFNBQU4sQ0FBZ0I7QUFDZEMsYUFBVyxDQUFDQyxNQUFELEVBQVNDLEtBQVQsRUFBZ0I7QUFDekIsUUFBSUosVUFBSixFQUFnQjtBQUNkLFdBQUtLLEdBQUwsR0FBV1gsRUFBRSxDQUFDTSxVQUFELEVBQWFHLE1BQWIsQ0FBYjtBQUNBLFdBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNEO0FBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7Ozs7O0FBYUFFLFlBQVUsQ0FBQ0MsUUFBRCxFQUFXQyxNQUFYLEVBQW1CQyxLQUFuQixFQUEwQkMsS0FBMUIsRUFBaUM7QUFDekMsVUFBTUMsU0FBUyxHQUFHLEtBQUtQLEtBQUwsQ0FBV1EsR0FBWCxDQUFlLFlBQWYsQ0FBbEI7O0FBRUEsUUFBSUMsS0FBSixFQUE0QyxFQUE1QyxNQWtCTztBQUNMQyxhQUFPLENBQUNDLEdBQVIsQ0FBYSxpREFBZ0RSLFFBQVMsU0FBUUMsTUFBTyxTQUFRQyxLQUFNLFNBQVFDLEtBQU0sU0FBUUMsU0FBVSxFQUFuSTtBQUNEO0FBQ0Y7QUFHRDs7Ozs7Ozs7QUFNQUssZUFBYSxDQUFDQyxJQUFELEVBQU9DLEtBQVAsRUFBY0MsUUFBUSxHQUFHLHVCQUF6QixFQUFrRDtBQUM3RCxRQUFJTixLQUFKLEVBQTRDLEVBQTVDLE1BaUJPO0FBQ0xDLGFBQU8sQ0FBQ0MsR0FBUixDQUFZLDBDQUFaO0FBQ0Q7QUFDRjs7QUEzRWE7O0FBOEVoQkssTUFBTSxDQUFDQyxPQUFQLEdBQWlCcEIsU0FBakIiLCJmaWxlIjoiLi9zcmMvbWFpbi9hbmFseXRpY3MuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB1YSA9IHJlcXVpcmUoJ3VuaXZlcnNhbC1hbmFseXRpY3MnKTsgLy8gaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvdW5pdmVyc2FsLWFuYWx5dGljc1xuY29uc3QgaXNPbmxpbmUgPSByZXF1aXJlKCdpcy1vbmxpbmUnKTtcblxuY29uc3QgcGpzb24gPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKTtcblxuY29uc3QgYXBwVmVyc2lvbiA9IHBqc29uLnZlcnNpb247XG5jb25zdCB0cmFja2luZ0lkID0gJ1VBLTQ1NTEzNTE5LTEyJztcblxuY2xhc3MgQW5hbHl0aWNzIHtcbiAgY29uc3RydWN0b3IodXNlcklkLCBzdG9yZSkge1xuICAgIGlmICh0cmFja2luZ0lkKSB7XG4gICAgICB0aGlzLnVzciA9IHVhKHRyYWNraW5nSWQsIHVzZXJJZCk7XG4gICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2FuYWx5dGljcy9kZXZndWlkZXMvY29sbGVjdGlvbi9hbmFseXRpY3Nqcy9ldmVudHNcbiAgICogTmFtZSAgICAgICAgICAgfCB0eXBlIHwgcmVxdWlyZWQgfCBleGFtcGxlXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBldmVudENhdGVnb3J5ICB8IHRleHQgfCAgeWVzICAgICB8IFR5cGljYWxseSB0aGUgb2JqZWN0IHRoYXQgd2FzIGludGVyYWN0ZWQgd2l0aCAoZS5nLiAnVmlkZW8nKVxuICAgKiBldmVudEFjdGlvbiAgICB8IHRleHQgfCAgeWVzICAgICB8IFRoZSB0eXBlIG9mIGludGVyYWN0aW9uIChlLmcuICdwbGF5JylcbiAgICogZXZlbnRMYWJlbCAgICAgfCB0ZXh0IHwgIG5vICAgICAgfCBVc2VmdWwgZm9yIGNhdGVnb3JpemluZyBldmVudHMgKGUuZy4gJ0ZhbGwgQ2FtcGFpZ24nKVxuICAgKiBldmVudFZhbHVlICAgICB8IGludCAgfCAgbm8gICAgICB8IEEgbnVtZXJpYyB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhlIGV2ZW50IChlLmcuIDQyKVxuICAgKiBAcGFyYW0gY2F0ZWdvcnlcbiAgICogQHBhcmFtIGFjdGlvblxuICAgKiBAcGFyYW0gbGFiZWxcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB0cmFja0V2ZW50KGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSkge1xuICAgIGNvbnN0IHVzZXJhZ2VudCA9IHRoaXMuc3RvcmUuZ2V0KCd1c2VyLWFnZW50Jyk7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgIGlmICh0aGlzLnN0b3JlLmdldCgndXNlclByZWZzLmFwcC5hbmFseXRpY3MuY29sbGVjdC1zdGF0aXN0aWNzJykpIHtcbiAgICAgICAgaXNPbmxpbmUoKS50aGVuKChvbmxpbmUpID0+IHtcbiAgICAgICAgICAvLyBUT0RPOiBmb3Igb2ZmbGluZSB1c2VycywgY29tZSB1cCB3aXRoIGEgd2F5IG9mIHN0b3JpbmcgYW5kIHNlbmQgd2hlbiBvbmxpbmUuXG4gICAgICAgICAgaWYgKG9ubGluZSAmJiB0aGlzLnVzcikge1xuICAgICAgICAgICAgdGhpcy51c3JcbiAgICAgICAgICAgICAgLmV2ZW50KHtcbiAgICAgICAgICAgICAgICBlYzogY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgZWE6IGFjdGlvbixcbiAgICAgICAgICAgICAgICBlbDogbGFiZWwsXG4gICAgICAgICAgICAgICAgZXY6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHVhOiB1c2VyYWdlbnQsXG4gICAgICAgICAgICAgICAgY2QxOiBhcHBWZXJzaW9uLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuc2VuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKGBUcmFja2luZyBFdmVudCBzdXBwcmVzc2VkIGZvciBkZXZlbG9wbWVudCBlYzogJHtjYXRlZ29yeX0sIGVhOiAke2FjdGlvbn0sIGVsOiAke2xhYmVsfSwgZXY6ICR7dmFsdWV9LCB1YTogJHt1c2VyYWdlbnR9YCk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHBhdGhcbiAgICogQHBhcmFtIHRpdGxlXG4gICAqIEBwYXJhbSBob3N0bmFtZVxuICAgKi9cbiAgdHJhY2tQYWdlVmlldyhwYXRoLCB0aXRsZSwgaG9zdG5hbWUgPSAnU2lraGlUb1RoZU1heCBEZXNrdG9wJykge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgaWYgKHRoaXMuc3RvcmUuZ2V0KCd1c2VyUHJlZnMuYXBwLmFuYWx5dGljcy5jb2xsZWN0LXN0YXRpc3RpY3MnKSkge1xuICAgICAgICBpc09ubGluZSgpLnRoZW4oKG9ubGluZSkgPT4ge1xuICAgICAgICAgIGlmIChvbmxpbmUgJiYgdGhpcy51c3IpIHtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJhZ2VudCA9IHRoaXMuc3RvcmUuZ2V0KCd1c2VyLWFnZW50Jyk7XG5cbiAgICAgICAgICAgIHRoaXMudXNyXG4gICAgICAgICAgICAgIC5wYWdldmlldyh7XG4gICAgICAgICAgICAgICAgZHA6IHBhdGgsXG4gICAgICAgICAgICAgICAgZHQ6IHRpdGxlLFxuICAgICAgICAgICAgICAgIGRoOiBob3N0bmFtZSxcbiAgICAgICAgICAgICAgICB1YTogdXNlcmFnZW50LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuc2VuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdUcmFja2luZyBQYWdlIHN1cHByZXNzZWQgZm9yIGRldmVsb3BtZW50Jyk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQW5hbHl0aWNzO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/analytics.js\n",
        );

        /***/
      },

    /***/ './src/main/main.js':
      /*!**************************!*\
  !*** ./src/main/main.js ***!
  \**************************/
      /*! no exports provided */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        'use strict';
        eval(
          "__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst electron = __webpack_require__(/*! electron */ \"electron\");\n\nconst {\n  autoUpdater\n} = __webpack_require__(/*! electron-updater */ \"electron-updater\");\n\nconst log = __webpack_require__(/*! electron-log */ \"electron-log\");\n\nconst express = __webpack_require__(/*! express */ \"express\");\n\nconst fs = __webpack_require__(/*! fs */ \"fs\");\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst uuid = __webpack_require__(/*! uuid/v4 */ \"./node_modules/uuid/v4.js\");\n\nconst op = __webpack_require__(/*! openport */ \"openport\");\n\nconst Store = __webpack_require__(/*! ../common/store */ \"./src/common/store.js\");\n\nconst defaultPrefs = __webpack_require__(/*! ../common/defaults.json */ \"./src/common/defaults.json\");\n\nconst themes = __webpack_require__(/*! ../common/themes.json */ \"./src/common/themes.json\");\n\nconst Analytics = __webpack_require__(/*! ./analytics */ \"./src/main/analytics.js\"); // Are we packaging for a platform's app store?\n\n\nconst appstore = false;\nconst maxChangeLogSeenCount = 5;\nconst expressApp = express();\n/* eslint-disable import/order */\n\nconst httpBase = __webpack_require__(/*! http */ \"http\").Server(expressApp);\n\nconst http = __webpack_require__(/*! http-shutdown */ \"http-shutdown\")(httpBase);\n\nconst io = __webpack_require__(/*! socket.io */ \"socket.io\")(http);\n/* eslint-enable */\n\n\nexpressApp.use(express.static(path.join(__dirname, 'www', 'obs')));\nconst {\n  app,\n  BrowserWindow,\n  dialog,\n  ipcMain\n} = electron;\nconst store = new Store({\n  configName: 'user-preferences',\n  defaults: defaultPrefs\n});\nconst appVersion = app.getVersion();\nconst overlayCast = store.getUserPref('app.overlay-cast'); // Reset to default theme if theme not found\n\nconst currentTheme = themes.find(theme => theme.key === store.getUserPref('app.theme'));\n\nif (currentTheme === undefined) {\n  store.setUserPref('app.theme', themes[0].key);\n}\n\nstore.setUserPref('toolbar.language-settings', null);\nlet mainWindow;\nlet viewerWindow = false;\nlet startChangelogOpenTimer;\nlet endChangelogOpenTimer;\nconst secondaryWindows = {\n  changelogWindow: {\n    obj: false,\n    url: `file://${__dirname}/www/changelog.html`,\n    onClose: () => {\n      const count = store.get('changelog-seen-count');\n      endChangelogOpenTimer = new Date().getTime();\n      store.set('changelog-seen', appVersion);\n      store.set('changelog-seen-count', count + 1);\n      global.analytics.trackEvent('changelog', 'closed', (endChangelogOpenTimer - startChangelogOpenTimer) / 1000.0);\n    },\n    show: () => {\n      startChangelogOpenTimer = new Date().getTime();\n    }\n  },\n  helpWindow: {\n    obj: false,\n    url: `file://${__dirname}/www/help.html`\n  },\n  overlayWindow: {\n    obj: false,\n    url: `file://${__dirname}/www/overlay.html`\n  },\n  shortcutLegend: {\n    obj: false,\n    url: `file://${__dirname}/www/legend.html`\n  }\n};\nlet manualUpdate = false;\nconst viewerWindowPos = {};\nconst isDevelopment = \"development\" !== 'production';\n\nfunction openSecondaryWindow(windowName) {\n  const window = secondaryWindows[windowName];\n  const openWindow = BrowserWindow.getAllWindows().filter(item => item.getURL() === window.url);\n\n  if (openWindow.length > 0) {\n    openWindow[0].show();\n  } else {\n    window.obj = new BrowserWindow({\n      width: 1366,\n      height: 768,\n      show: false\n    });\n    window.obj.webContents.on('did-finish-load', () => {\n      window.obj.show();\n      window.obj.focus();\n\n      if (window.show) {\n        window.show();\n      }\n\n      if (window.focus) {\n        window.focus();\n      }\n    });\n    window.obj.loadURL(window.url);\n    window.obj.on('close', () => {\n      window.obj = false;\n\n      if (window.onClose) {\n        window.onClose();\n      }\n    });\n  }\n}\n\nautoUpdater.logger = log;\nautoUpdater.logger.transports.file.level = 'info'; // autoUpdater events\n\nautoUpdater.on('checking-for-update', () => {\n  mainWindow.webContents.send('checking-for-update');\n});\nautoUpdater.on('update-available', () => {\n  mainWindow.webContents.send('update-available');\n});\nautoUpdater.on('update-not-available', () => {\n  mainWindow.webContents.send('update-not-available');\n\n  if (manualUpdate) {\n    dialog.showMessageBox({\n      type: 'info',\n      buttons: ['OK'],\n      defaultId: 0,\n      title: 'No update available.',\n      message: 'No update available.',\n      detail: `Version ${appVersion} is the latest version.`\n    });\n  }\n});\nautoUpdater.on('update-downloaded', () => {\n  mainWindow.webContents.send('update-downloaded');\n  dialog.showMessageBox({\n    type: 'info',\n    buttons: ['Dismiss', 'Install and Restart'],\n    defaultId: 1,\n    title: 'Update available.',\n    message: 'Update available.',\n    detail: 'Update downloaded and ready to install',\n    cancelId: 0\n  }, response => {\n    if (response === 1) {\n      autoUpdater.quitAndInstall();\n    }\n  });\n});\nautoUpdater.on('error', () => {\n  if (manualUpdate) {// showUpdate('update-error');\n  }\n});\n\nfunction checkForUpdates(manual = false) {\n  if (false) {}\n}\n\nfunction checkForExternalDisplay() {\n  const electronScreen = electron.screen;\n  const displays = electronScreen.getAllDisplays();\n  let externalDisplay = null;\n  Object.keys(displays).forEach(i => {\n    if (displays[i].bounds.x !== 0 || displays[i].bounds.y !== 0) {\n      externalDisplay = displays[i];\n    }\n  });\n\n  if (externalDisplay) {\n    viewerWindowPos.x = externalDisplay.bounds.x + 50;\n    viewerWindowPos.y = externalDisplay.bounds.y + 50;\n    viewerWindowPos.w = externalDisplay.size.width;\n    viewerWindowPos.h = externalDisplay.size.height;\n    return true;\n  }\n\n  return false;\n}\n\nfunction showChangelog() {\n  const lastSeen = store.get('changelog-seen');\n  const lastSeenCount = store.get('changelog-seen-count');\n  const limitChangeLog = store.get('userPrefs.app.analytics.limit-changelog');\n  return lastSeen !== appVersion || lastSeenCount < maxChangeLogSeenCount && !limitChangeLog;\n}\n\nfunction createViewer(ipcData) {\n  const isExternal = checkForExternalDisplay();\n\n  if (isExternal) {\n    viewerWindow = new BrowserWindow({\n      width: 800,\n      height: 400,\n      x: viewerWindowPos.x,\n      y: viewerWindowPos.y,\n      autoHideMenuBar: true,\n      show: false,\n      titleBarStyle: 'hidden',\n      frame: process.platform !== 'win32',\n      backgroundColor: '#000000'\n    });\n    viewerWindow.loadURL(`file://${__dirname}/www/viewer.html`);\n    viewerWindow.webContents.on('did-finish-load', () => {\n      viewerWindow.show();\n      const [width, height] = viewerWindow.getSize();\n      mainWindow.webContents.send('external-display', {\n        width,\n        height\n      });\n      mainWindow.focus();\n\n      if (showChangelog() && secondaryWindows.changelogWindow.obj) {\n        secondaryWindows.changelogWindow.obj.focus();\n      }\n\n      viewerWindow.setFullScreen(true);\n\n      if (typeof ipcData !== 'undefined') {\n        viewerWindow.webContents.send(ipcData.send, ipcData.data);\n      }\n    });\n    viewerWindow.on('enter-full-screen', () => {\n      mainWindow.focus();\n\n      if (showChangelog() && secondaryWindows.changelogWindow.obj) {\n        secondaryWindows.changelogWindow.obj.focus();\n      }\n    });\n    viewerWindow.on('focus', () => {// mainWindow.focus();\n    });\n    viewerWindow.on('closed', () => {\n      viewerWindow = false;\n      mainWindow.webContents.send('remove-external-display');\n    });\n    viewerWindow.on('resize', () => {\n      const [width, height] = viewerWindow.getSize();\n      mainWindow.webContents.send('external-display', {\n        width,\n        height\n      });\n    });\n  }\n\n  mainWindow.webContents.send('presenter-view');\n}\n\nfunction writeFileCallback(err) {\n  if (err) {\n    throw err;\n  }\n}\n\nfunction createBroadcastFiles(arg) {\n  const liveFeedLocation = store.get('userPrefs.app.live-feed-location');\n  const userDataPath = liveFeedLocation === 'default' || !liveFeedLocation ? electron.app.getPath('desktop') : liveFeedLocation;\n  const gurbaniFile = `${userDataPath}/sttm-Gurbani.txt`;\n  const englishFile = `${userDataPath}/sttm-English.txt`;\n\n  try {\n    fs.writeFile(gurbaniFile, arg.Line.Gurmukhi.trim(), writeFileCallback);\n    fs.appendFile(gurbaniFile, '\\n', writeFileCallback);\n    fs.writeFile(englishFile, arg.Line.English.trim(), writeFileCallback);\n    fs.appendFile(englishFile, '\\n', writeFileCallback);\n  } catch (err) {\n    // eslint-disable-next-line no-console\n    console.log(err);\n  }\n}\n\nconst showLine = (line, socket = io) => {\n  const overlayPrefs = store.get('obs');\n  const lineWithSettings = line;\n  lineWithSettings.languageSettings = {\n    translation: store.getUserPref('slide-layout.language-settings.translation-language'),\n    transliteration: store.getUserPref('slide-layout.language-settings.transliteration-language')\n  };\n  const payload = Object.assign(lineWithSettings, overlayPrefs);\n\n  if (!lineWithSettings.fromScroll) {\n    socket.emit('show-line', payload);\n  }\n};\n\nconst updateOverlayVars = () => {\n  const overlayPrefs = store.get('obs');\n  io.emit('update-prefs', overlayPrefs);\n};\n\nconst emptyOverlay = () => {\n  const emptyLine = {\n    Line: {\n      Gurmukhi: '',\n      English: '',\n      Punjabi: '',\n      Transliteration: ''\n    }\n  };\n  showLine(emptyLine);\n  const overlayPrefs = store.get('obs');\n\n  if (overlayPrefs.live) {\n    createBroadcastFiles(emptyLine);\n  }\n};\n\nconst singleInstanceLock = app.requestSingleInstanceLock();\n\nconst searchPorts = () => {\n  op.find({\n    // Re: http://www.sikhiwiki.org/index.php/Gurgadi\n    ports: [1397, 1469, 1539, 1552, 1574, 1581, 1606, 1644, 1661, 1665, 1675, 1708],\n    count: 1\n  }, (err, port) => {\n    if (err) {\n      dialog.showErrorBox('Overlay Error', 'No free ports available. Close other applications and Reboot the machine');\n      app.exit(-1);\n      return;\n    }\n\n    global.overlayPort = port; // console.log(`Overlay Port No ${port}`);\n\n    http.listen(port);\n  });\n};\n\nipcMain.on('toggle-obs-cast', (event, arg) => {\n  if (arg) {\n    searchPorts();\n  } else {\n    http.shutdown();\n  }\n});\n\nif (overlayCast) {\n  searchPorts();\n}\n\nif (!singleInstanceLock) {\n  app.quit();\n} else {\n  app.on('second-instance', () => {\n    // Someone tried to run a second instance, we should focus our window.\n    if (mainWindow) {\n      if (mainWindow.isMinimized()) {\n        mainWindow.restore();\n      }\n\n      mainWindow.focus();\n    }\n  });\n}\n\napp.on('ready', () => {\n  // Retrieve the userid value, and if it's not there, assign it a new uuid.\n  let userId = store.get('userId');\n\n  if (!userId) {\n    userId = uuid();\n    store.set('userId', userId);\n  }\n\n  const analytics = new Analytics(userId, store);\n  global.analytics = analytics;\n  const screens = electron.screen;\n  const {\n    width,\n    height\n  } = screens.getPrimaryDisplay().workAreaSize;\n  mainWindow = new BrowserWindow({\n    minWidth: 800,\n    minHeight: 600,\n    width,\n    height,\n    frame: process.platform !== 'win32',\n    show: false,\n    backgroundColor: '#000000',\n    titleBarStyle: 'hidden'\n  });\n  mainWindow.webContents.on('dom-ready', () => {\n    if (checkForExternalDisplay()) {\n      mainWindow.webContents.send('external-display', {\n        width: viewerWindowPos.w,\n        height: viewerWindowPos.h\n      });\n    }\n\n    mainWindow.show(); // // Platform-specific app stores have their own update mechanism\n    // // so only check if we're not in one\n    // if (!appstore) {\n    //   checkForUpdates();\n    // }\n    // // Show changelog if last version wasn't seen\n    // const lastSeen = store.get('changelog-seen');\n    //\n    // if (showChangelog()) {\n    //   openSecondaryWindow('changelogWindow');\n    //   if (lastSeen !== appVersion) {\n    //     store.set('changelog-seen-count', 1);\n    //   }\n    // }\n    // if (!viewerWindow) {\n    //   createViewer();\n    // }\n  });\n\n  if (isDevelopment) {\n    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?path=changelog`);\n  } else {\n    mainWindow.loadURL(Object(url__WEBPACK_IMPORTED_MODULE_0__[\"format\"])({\n      pathname: path.join(__dirname, 'index.js'),\n      protocol: 'file',\n      slashes: true\n    }));\n  } // mainWindow.loadURL(`file://${__dirname}/`);\n\n\n  if (!store.get('user-agent')) {\n    store.set('user-agent', mainWindow.webContents.getUserAgent());\n  } // Close all other windows if closing the main\n\n\n  mainWindow.on('close', () => {\n    emptyOverlay();\n\n    if (viewerWindow && !viewerWindow.isDestroyed()) {\n      viewerWindow.close();\n    }\n\n    const changelogWindow = secondaryWindows.changelogWindow.obj;\n\n    if (changelogWindow && !changelogWindow.isDestroyed()) {\n      changelogWindow.close();\n    }\n  }); // When a display is connected, add a viewer window if it does not already exit\n\n  screens.on('display-added', () => {\n    if (!viewerWindow) {\n      createViewer();\n    }\n  });\n}); // Quit when all windows are closed.\n\napp.on('window-all-closed', () => {\n  // On OS X it is common for applications and their menu bar\n  // to stay active until the user quits explicitly with Cmd + Q\n  // if (process.platform !== 'darwin') {\n  app.quit(); // }\n});\nipcMain.on('cast-session-active', () => {\n  mainWindow.webContents.send('cast-session-active');\n});\nipcMain.on('cast-session-stopped', () => {\n  mainWindow.webContents.send('cast-session-stopped');\n});\nipcMain.on('checkForUpdates', checkForUpdates);\nipcMain.on('quitAndInstall', () => autoUpdater.quitAndInstall());\nipcMain.on('clear-apv', () => {\n  if (viewerWindow) {\n    viewerWindow.webContents.send('clear-apv');\n  }\n});\nlet lastLine;\nipcMain.on('update-overlay-vars', updateOverlayVars);\nio.on('connection', socket => {\n  updateOverlayVars();\n\n  if (lastLine) {\n    showLine(lastLine, socket);\n  }\n});\nipcMain.on('show-line', (event, arg) => {\n  lastLine = arg;\n  showLine(arg);\n\n  if (viewerWindow) {\n    viewerWindow.webContents.send('show-line', arg);\n  } else {\n    createViewer({\n      send: 'show-line',\n      data: arg\n    });\n  }\n\n  if (arg.live) {\n    createBroadcastFiles(arg);\n  }\n});\nipcMain.on('show-empty-slide', () => {\n  emptyOverlay();\n});\nipcMain.on('show-text', (event, arg) => {\n  const textLine = {\n    Line: {\n      Gurmukhi: arg.isGurmukhi ? arg.text : '',\n      English: !arg.isGurmukhi ? arg.text : '',\n      Punjabi: '',\n      Transliteration: {\n        devanagari: '',\n        English: ''\n      },\n      Translation: {\n        Spanish: '',\n        English: ''\n      }\n    }\n  };\n  const emptyLine = {\n    Line: {\n      Gurmukhi: '',\n      English: '',\n      Punjabi: '',\n      Transliteration: {\n        devanagari: '',\n        English: ''\n      },\n      Translation: {\n        Spanish: '',\n        English: ''\n      }\n    }\n  };\n  const announcementOverlay = store.getUserPref('app.announcement-overlay');\n\n  if (arg.isAnnouncement && !announcementOverlay) {\n    showLine(emptyLine);\n  } else {\n    showLine(textLine);\n  }\n\n  if (viewerWindow) {\n    viewerWindow.webContents.send('show-text', arg);\n  } else {\n    createViewer({\n      send: 'show-text',\n      data: arg\n    });\n  }\n\n  if (arg.live) {\n    createBroadcastFiles(arg);\n  }\n});\nipcMain.on('presenter-view', (event, arg) => {\n  if (viewerWindow) {\n    if (!arg) {\n      viewerWindow.hide();\n    } else {\n      viewerWindow.show();\n      viewerWindow.setFullScreen(true);\n    }\n  }\n});\nipcMain.on('shortcuts', (event, arg) => {\n  mainWindow.webContents.send('shortcuts', arg);\n});\nipcMain.on('scroll-from-main', (event, arg) => {\n  if (viewerWindow) {\n    viewerWindow.webContents.send('send-scroll', arg);\n  }\n});\nipcMain.on('next-ang', (event, arg) => {\n  if (viewerWindow) {\n    viewerWindow.webContents.send('show-ang', arg);\n  }\n\n  mainWindow.webContents.send('next-ang', arg);\n});\nipcMain.on('scroll-pos', (event, arg) => {\n  mainWindow.webContents.send('send-scroll', arg);\n});\nipcMain.on('update-settings', () => {\n  if (viewerWindow) {\n    viewerWindow.webContents.send('update-settings');\n  }\n\n  mainWindow.webContents.send('sync-settings');\n}); // module.exports = {\n//   openSecondaryWindow,\n//   appVersion,\n//   checkForUpdates,\n//   autoUpdater,\n//   store,\n//   themes,\n//   appstore,\n// };\n/* WEBPACK VAR INJECTION */}.call(this, \"src/main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tYWluLmpzPzE1NjkiXSwibmFtZXMiOlsiZWxlY3Ryb24iLCJyZXF1aXJlIiwiYXV0b1VwZGF0ZXIiLCJsb2ciLCJleHByZXNzIiwiZnMiLCJwYXRoIiwidXVpZCIsIm9wIiwiU3RvcmUiLCJkZWZhdWx0UHJlZnMiLCJ0aGVtZXMiLCJBbmFseXRpY3MiLCJhcHBzdG9yZSIsIm1heENoYW5nZUxvZ1NlZW5Db3VudCIsImV4cHJlc3NBcHAiLCJodHRwQmFzZSIsIlNlcnZlciIsImh0dHAiLCJpbyIsInVzZSIsInN0YXRpYyIsImpvaW4iLCJfX2Rpcm5hbWUiLCJhcHAiLCJCcm93c2VyV2luZG93IiwiZGlhbG9nIiwiaXBjTWFpbiIsInN0b3JlIiwiY29uZmlnTmFtZSIsImRlZmF1bHRzIiwiYXBwVmVyc2lvbiIsImdldFZlcnNpb24iLCJvdmVybGF5Q2FzdCIsImdldFVzZXJQcmVmIiwiY3VycmVudFRoZW1lIiwiZmluZCIsInRoZW1lIiwia2V5IiwidW5kZWZpbmVkIiwic2V0VXNlclByZWYiLCJtYWluV2luZG93Iiwidmlld2VyV2luZG93Iiwic3RhcnRDaGFuZ2Vsb2dPcGVuVGltZXIiLCJlbmRDaGFuZ2Vsb2dPcGVuVGltZXIiLCJzZWNvbmRhcnlXaW5kb3dzIiwiY2hhbmdlbG9nV2luZG93Iiwib2JqIiwidXJsIiwib25DbG9zZSIsImNvdW50IiwiZ2V0IiwiRGF0ZSIsImdldFRpbWUiLCJzZXQiLCJnbG9iYWwiLCJhbmFseXRpY3MiLCJ0cmFja0V2ZW50Iiwic2hvdyIsImhlbHBXaW5kb3ciLCJvdmVybGF5V2luZG93Iiwic2hvcnRjdXRMZWdlbmQiLCJtYW51YWxVcGRhdGUiLCJ2aWV3ZXJXaW5kb3dQb3MiLCJpc0RldmVsb3BtZW50IiwicHJvY2VzcyIsIm9wZW5TZWNvbmRhcnlXaW5kb3ciLCJ3aW5kb3dOYW1lIiwid2luZG93Iiwib3BlbldpbmRvdyIsImdldEFsbFdpbmRvd3MiLCJmaWx0ZXIiLCJpdGVtIiwiZ2V0VVJMIiwibGVuZ3RoIiwid2lkdGgiLCJoZWlnaHQiLCJ3ZWJDb250ZW50cyIsIm9uIiwiZm9jdXMiLCJsb2FkVVJMIiwibG9nZ2VyIiwidHJhbnNwb3J0cyIsImZpbGUiLCJsZXZlbCIsInNlbmQiLCJzaG93TWVzc2FnZUJveCIsInR5cGUiLCJidXR0b25zIiwiZGVmYXVsdElkIiwidGl0bGUiLCJtZXNzYWdlIiwiZGV0YWlsIiwiY2FuY2VsSWQiLCJyZXNwb25zZSIsInF1aXRBbmRJbnN0YWxsIiwiY2hlY2tGb3JVcGRhdGVzIiwibWFudWFsIiwiY2hlY2tGb3JFeHRlcm5hbERpc3BsYXkiLCJlbGVjdHJvblNjcmVlbiIsInNjcmVlbiIsImRpc3BsYXlzIiwiZ2V0QWxsRGlzcGxheXMiLCJleHRlcm5hbERpc3BsYXkiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImkiLCJib3VuZHMiLCJ4IiwieSIsInciLCJzaXplIiwiaCIsInNob3dDaGFuZ2Vsb2ciLCJsYXN0U2VlbiIsImxhc3RTZWVuQ291bnQiLCJsaW1pdENoYW5nZUxvZyIsImNyZWF0ZVZpZXdlciIsImlwY0RhdGEiLCJpc0V4dGVybmFsIiwiYXV0b0hpZGVNZW51QmFyIiwidGl0bGVCYXJTdHlsZSIsImZyYW1lIiwicGxhdGZvcm0iLCJiYWNrZ3JvdW5kQ29sb3IiLCJnZXRTaXplIiwic2V0RnVsbFNjcmVlbiIsImRhdGEiLCJ3cml0ZUZpbGVDYWxsYmFjayIsImVyciIsImNyZWF0ZUJyb2FkY2FzdEZpbGVzIiwiYXJnIiwibGl2ZUZlZWRMb2NhdGlvbiIsInVzZXJEYXRhUGF0aCIsImdldFBhdGgiLCJndXJiYW5pRmlsZSIsImVuZ2xpc2hGaWxlIiwid3JpdGVGaWxlIiwiTGluZSIsIkd1cm11a2hpIiwidHJpbSIsImFwcGVuZEZpbGUiLCJFbmdsaXNoIiwiY29uc29sZSIsInNob3dMaW5lIiwibGluZSIsInNvY2tldCIsIm92ZXJsYXlQcmVmcyIsImxpbmVXaXRoU2V0dGluZ3MiLCJsYW5ndWFnZVNldHRpbmdzIiwidHJhbnNsYXRpb24iLCJ0cmFuc2xpdGVyYXRpb24iLCJwYXlsb2FkIiwiYXNzaWduIiwiZnJvbVNjcm9sbCIsImVtaXQiLCJ1cGRhdGVPdmVybGF5VmFycyIsImVtcHR5T3ZlcmxheSIsImVtcHR5TGluZSIsIlB1bmphYmkiLCJUcmFuc2xpdGVyYXRpb24iLCJsaXZlIiwic2luZ2xlSW5zdGFuY2VMb2NrIiwicmVxdWVzdFNpbmdsZUluc3RhbmNlTG9jayIsInNlYXJjaFBvcnRzIiwicG9ydHMiLCJwb3J0Iiwic2hvd0Vycm9yQm94IiwiZXhpdCIsIm92ZXJsYXlQb3J0IiwibGlzdGVuIiwiZXZlbnQiLCJzaHV0ZG93biIsInF1aXQiLCJpc01pbmltaXplZCIsInJlc3RvcmUiLCJ1c2VySWQiLCJzY3JlZW5zIiwiZ2V0UHJpbWFyeURpc3BsYXkiLCJ3b3JrQXJlYVNpemUiLCJtaW5XaWR0aCIsIm1pbkhlaWdodCIsImVudiIsIkVMRUNUUk9OX1dFQlBBQ0tfV0RTX1BPUlQiLCJmb3JtYXRVcmwiLCJwYXRobmFtZSIsInByb3RvY29sIiwic2xhc2hlcyIsImdldFVzZXJBZ2VudCIsImlzRGVzdHJveWVkIiwiY2xvc2UiLCJsYXN0TGluZSIsInRleHRMaW5lIiwiaXNHdXJtdWtoaSIsInRleHQiLCJkZXZhbmFnYXJpIiwiVHJhbnNsYXRpb24iLCJTcGFuaXNoIiwiYW5ub3VuY2VtZW50T3ZlcmxheSIsImlzQW5ub3VuY2VtZW50IiwiaGlkZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRUEsTUFBTUEsUUFBUSxHQUFHQyxtQkFBTyxDQUFDLDBCQUFELENBQXhCOztBQUNBLE1BQU07QUFBRUM7QUFBRixJQUFrQkQsbUJBQU8sQ0FBQywwQ0FBRCxDQUEvQjs7QUFDQSxNQUFNRSxHQUFHLEdBQUdGLG1CQUFPLENBQUMsa0NBQUQsQ0FBbkI7O0FBQ0EsTUFBTUcsT0FBTyxHQUFHSCxtQkFBTyxDQUFDLHdCQUFELENBQXZCOztBQUNBLE1BQU1JLEVBQUUsR0FBR0osbUJBQU8sQ0FBQyxjQUFELENBQWxCOztBQUNBLE1BQU1LLElBQUksR0FBR0wsbUJBQU8sQ0FBQyxrQkFBRCxDQUFwQjs7QUFDQSxNQUFNTSxJQUFJLEdBQUdOLG1CQUFPLENBQUMsMENBQUQsQ0FBcEI7O0FBQ0EsTUFBTU8sRUFBRSxHQUFHUCxtQkFBTyxDQUFDLDBCQUFELENBQWxCOztBQUNBLE1BQU1RLEtBQUssR0FBR1IsbUJBQU8sQ0FBQyw4Q0FBRCxDQUFyQjs7QUFDQSxNQUFNUyxZQUFZLEdBQUdULG1CQUFPLENBQUMsMkRBQUQsQ0FBNUI7O0FBQ0EsTUFBTVUsTUFBTSxHQUFHVixtQkFBTyxDQUFDLHVEQUFELENBQXRCOztBQUNBLE1BQU1XLFNBQVMsR0FBR1gsbUJBQU8sQ0FBQyw0Q0FBRCxDQUF6QixDLENBRUE7OztBQUNBLE1BQU1ZLFFBQVEsR0FBRyxLQUFqQjtBQUNBLE1BQU1DLHFCQUFxQixHQUFHLENBQTlCO0FBRUEsTUFBTUMsVUFBVSxHQUFHWCxPQUFPLEVBQTFCO0FBQ0E7O0FBQ0EsTUFBTVksUUFBUSxHQUFHZixtQkFBTyxDQUFDLGtCQUFELENBQVAsQ0FBZ0JnQixNQUFoQixDQUF1QkYsVUFBdkIsQ0FBakI7O0FBQ0EsTUFBTUcsSUFBSSxHQUFHakIsbUJBQU8sQ0FBQyxvQ0FBRCxDQUFQLENBQXlCZSxRQUF6QixDQUFiOztBQUNBLE1BQU1HLEVBQUUsR0FBR2xCLG1CQUFPLENBQUMsNEJBQUQsQ0FBUCxDQUFxQmlCLElBQXJCLENBQVg7QUFDQTs7O0FBRUFILFVBQVUsQ0FBQ0ssR0FBWCxDQUFlaEIsT0FBTyxDQUFDaUIsTUFBUixDQUFlZixJQUFJLENBQUNnQixJQUFMLENBQVVDLFNBQVYsRUFBcUIsS0FBckIsRUFBNEIsS0FBNUIsQ0FBZixDQUFmO0FBRUEsTUFBTTtBQUFFQyxLQUFGO0FBQU9DLGVBQVA7QUFBc0JDLFFBQXRCO0FBQThCQztBQUE5QixJQUEwQzNCLFFBQWhEO0FBRUEsTUFBTTRCLEtBQUssR0FBRyxJQUFJbkIsS0FBSixDQUFVO0FBQ3RCb0IsWUFBVSxFQUFFLGtCQURVO0FBRXRCQyxVQUFRLEVBQUVwQjtBQUZZLENBQVYsQ0FBZDtBQUtBLE1BQU1xQixVQUFVLEdBQUdQLEdBQUcsQ0FBQ1EsVUFBSixFQUFuQjtBQUVBLE1BQU1DLFdBQVcsR0FBR0wsS0FBSyxDQUFDTSxXQUFOLENBQWtCLGtCQUFsQixDQUFwQixDLENBRUE7O0FBQ0EsTUFBTUMsWUFBWSxHQUFHeEIsTUFBTSxDQUFDeUIsSUFBUCxDQUFZQyxLQUFLLElBQUlBLEtBQUssQ0FBQ0MsR0FBTixLQUFjVixLQUFLLENBQUNNLFdBQU4sQ0FBa0IsV0FBbEIsQ0FBbkMsQ0FBckI7O0FBQ0EsSUFBSUMsWUFBWSxLQUFLSSxTQUFyQixFQUFnQztBQUM5QlgsT0FBSyxDQUFDWSxXQUFOLENBQWtCLFdBQWxCLEVBQStCN0IsTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVMkIsR0FBekM7QUFDRDs7QUFFRFYsS0FBSyxDQUFDWSxXQUFOLENBQWtCLDJCQUFsQixFQUErQyxJQUEvQztBQUVBLElBQUlDLFVBQUo7QUFDQSxJQUFJQyxZQUFZLEdBQUcsS0FBbkI7QUFDQSxJQUFJQyx1QkFBSjtBQUNBLElBQUlDLHFCQUFKO0FBQ0EsTUFBTUMsZ0JBQWdCLEdBQUc7QUFDdkJDLGlCQUFlLEVBQUU7QUFDZkMsT0FBRyxFQUFFLEtBRFU7QUFFZkMsT0FBRyxFQUFHLFVBQVN6QixTQUFVLHFCQUZWO0FBR2YwQixXQUFPLEVBQUUsTUFBTTtBQUNiLFlBQU1DLEtBQUssR0FBR3RCLEtBQUssQ0FBQ3VCLEdBQU4sQ0FBVSxzQkFBVixDQUFkO0FBQ0FQLDJCQUFxQixHQUFHLElBQUlRLElBQUosR0FBV0MsT0FBWCxFQUF4QjtBQUNBekIsV0FBSyxDQUFDMEIsR0FBTixDQUFVLGdCQUFWLEVBQTRCdkIsVUFBNUI7QUFDQUgsV0FBSyxDQUFDMEIsR0FBTixDQUFVLHNCQUFWLEVBQWtDSixLQUFLLEdBQUcsQ0FBMUM7QUFDQUssWUFBTSxDQUFDQyxTQUFQLENBQWlCQyxVQUFqQixDQUNFLFdBREYsRUFFRSxRQUZGLEVBR0UsQ0FBQ2IscUJBQXFCLEdBQUdELHVCQUF6QixJQUFvRCxNQUh0RDtBQUtELEtBYmM7QUFjZmUsUUFBSSxFQUFFLE1BQU07QUFDVmYsNkJBQXVCLEdBQUcsSUFBSVMsSUFBSixHQUFXQyxPQUFYLEVBQTFCO0FBQ0Q7QUFoQmMsR0FETTtBQW1CdkJNLFlBQVUsRUFBRTtBQUNWWixPQUFHLEVBQUUsS0FESztBQUVWQyxPQUFHLEVBQUcsVUFBU3pCLFNBQVU7QUFGZixHQW5CVztBQXVCdkJxQyxlQUFhLEVBQUU7QUFDYmIsT0FBRyxFQUFFLEtBRFE7QUFFYkMsT0FBRyxFQUFHLFVBQVN6QixTQUFVO0FBRlosR0F2QlE7QUEyQnZCc0MsZ0JBQWMsRUFBRTtBQUNkZCxPQUFHLEVBQUUsS0FEUztBQUVkQyxPQUFHLEVBQUcsVUFBU3pCLFNBQVU7QUFGWDtBQTNCTyxDQUF6QjtBQWdDQSxJQUFJdUMsWUFBWSxHQUFHLEtBQW5CO0FBQ0EsTUFBTUMsZUFBZSxHQUFHLEVBQXhCO0FBQ0EsTUFBTUMsYUFBYSxHQUFHQyxhQUFBLEtBQXlCLFlBQS9DOztBQUVBLFNBQVNDLG1CQUFULENBQTZCQyxVQUE3QixFQUF5QztBQUN2QyxRQUFNQyxNQUFNLEdBQUd2QixnQkFBZ0IsQ0FBQ3NCLFVBQUQsQ0FBL0I7QUFDQSxRQUFNRSxVQUFVLEdBQUc1QyxhQUFhLENBQUM2QyxhQUFkLEdBQThCQyxNQUE5QixDQUFxQ0MsSUFBSSxJQUFJQSxJQUFJLENBQUNDLE1BQUwsT0FBa0JMLE1BQU0sQ0FBQ3BCLEdBQXRFLENBQW5COztBQUVBLE1BQUlxQixVQUFVLENBQUNLLE1BQVgsR0FBb0IsQ0FBeEIsRUFBMkI7QUFDekJMLGNBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY1gsSUFBZDtBQUNELEdBRkQsTUFFTztBQUNMVSxVQUFNLENBQUNyQixHQUFQLEdBQWEsSUFBSXRCLGFBQUosQ0FBa0I7QUFDN0JrRCxXQUFLLEVBQUUsSUFEc0I7QUFFN0JDLFlBQU0sRUFBRSxHQUZxQjtBQUc3QmxCLFVBQUksRUFBRTtBQUh1QixLQUFsQixDQUFiO0FBS0FVLFVBQU0sQ0FBQ3JCLEdBQVAsQ0FBVzhCLFdBQVgsQ0FBdUJDLEVBQXZCLENBQTBCLGlCQUExQixFQUE2QyxNQUFNO0FBQ2pEVixZQUFNLENBQUNyQixHQUFQLENBQVdXLElBQVg7QUFDQVUsWUFBTSxDQUFDckIsR0FBUCxDQUFXZ0MsS0FBWDs7QUFDQSxVQUFJWCxNQUFNLENBQUNWLElBQVgsRUFBaUI7QUFDZlUsY0FBTSxDQUFDVixJQUFQO0FBQ0Q7O0FBQ0QsVUFBSVUsTUFBTSxDQUFDVyxLQUFYLEVBQWtCO0FBQ2hCWCxjQUFNLENBQUNXLEtBQVA7QUFDRDtBQUNGLEtBVEQ7QUFVQVgsVUFBTSxDQUFDckIsR0FBUCxDQUFXaUMsT0FBWCxDQUFtQlosTUFBTSxDQUFDcEIsR0FBMUI7QUFFQW9CLFVBQU0sQ0FBQ3JCLEdBQVAsQ0FBVytCLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLE1BQU07QUFDM0JWLFlBQU0sQ0FBQ3JCLEdBQVAsR0FBYSxLQUFiOztBQUNBLFVBQUlxQixNQUFNLENBQUNuQixPQUFYLEVBQW9CO0FBQ2xCbUIsY0FBTSxDQUFDbkIsT0FBUDtBQUNEO0FBQ0YsS0FMRDtBQU1EO0FBQ0Y7O0FBRUQvQyxXQUFXLENBQUMrRSxNQUFaLEdBQXFCOUUsR0FBckI7QUFDQUQsV0FBVyxDQUFDK0UsTUFBWixDQUFtQkMsVUFBbkIsQ0FBOEJDLElBQTlCLENBQW1DQyxLQUFuQyxHQUEyQyxNQUEzQyxDLENBRUE7O0FBQ0FsRixXQUFXLENBQUM0RSxFQUFaLENBQWUscUJBQWYsRUFBc0MsTUFBTTtBQUMxQ3JDLFlBQVUsQ0FBQ29DLFdBQVgsQ0FBdUJRLElBQXZCLENBQTRCLHFCQUE1QjtBQUNELENBRkQ7QUFHQW5GLFdBQVcsQ0FBQzRFLEVBQVosQ0FBZSxrQkFBZixFQUFtQyxNQUFNO0FBQ3ZDckMsWUFBVSxDQUFDb0MsV0FBWCxDQUF1QlEsSUFBdkIsQ0FBNEIsa0JBQTVCO0FBQ0QsQ0FGRDtBQUdBbkYsV0FBVyxDQUFDNEUsRUFBWixDQUFlLHNCQUFmLEVBQXVDLE1BQU07QUFDM0NyQyxZQUFVLENBQUNvQyxXQUFYLENBQXVCUSxJQUF2QixDQUE0QixzQkFBNUI7O0FBQ0EsTUFBSXZCLFlBQUosRUFBa0I7QUFDaEJwQyxVQUFNLENBQUM0RCxjQUFQLENBQXNCO0FBQ3BCQyxVQUFJLEVBQUUsTUFEYztBQUVwQkMsYUFBTyxFQUFFLENBQUMsSUFBRCxDQUZXO0FBR3BCQyxlQUFTLEVBQUUsQ0FIUztBQUlwQkMsV0FBSyxFQUFFLHNCQUphO0FBS3BCQyxhQUFPLEVBQUUsc0JBTFc7QUFNcEJDLFlBQU0sRUFBRyxXQUFVN0QsVUFBVztBQU5WLEtBQXRCO0FBUUQ7QUFDRixDQVpEO0FBYUE3QixXQUFXLENBQUM0RSxFQUFaLENBQWUsbUJBQWYsRUFBb0MsTUFBTTtBQUN4Q3JDLFlBQVUsQ0FBQ29DLFdBQVgsQ0FBdUJRLElBQXZCLENBQTRCLG1CQUE1QjtBQUNBM0QsUUFBTSxDQUFDNEQsY0FBUCxDQUNFO0FBQ0VDLFFBQUksRUFBRSxNQURSO0FBRUVDLFdBQU8sRUFBRSxDQUFDLFNBQUQsRUFBWSxxQkFBWixDQUZYO0FBR0VDLGFBQVMsRUFBRSxDQUhiO0FBSUVDLFNBQUssRUFBRSxtQkFKVDtBQUtFQyxXQUFPLEVBQUUsbUJBTFg7QUFNRUMsVUFBTSxFQUFFLHdDQU5WO0FBT0VDLFlBQVEsRUFBRTtBQVBaLEdBREYsRUFVRUMsUUFBUSxJQUFJO0FBQ1YsUUFBSUEsUUFBUSxLQUFLLENBQWpCLEVBQW9CO0FBQ2xCNUYsaUJBQVcsQ0FBQzZGLGNBQVo7QUFDRDtBQUNGLEdBZEg7QUFnQkQsQ0FsQkQ7QUFtQkE3RixXQUFXLENBQUM0RSxFQUFaLENBQWUsT0FBZixFQUF3QixNQUFNO0FBQzVCLE1BQUloQixZQUFKLEVBQWtCLENBQ2hCO0FBQ0Q7QUFDRixDQUpEOztBQU1BLFNBQVNrQyxlQUFULENBQXlCQyxNQUFNLEdBQUcsS0FBbEMsRUFBeUM7QUFDdkMsTUFBSWhDLEtBQUosRUFBNEMsRUFLM0M7QUFDRjs7QUFFRCxTQUFTaUMsdUJBQVQsR0FBbUM7QUFDakMsUUFBTUMsY0FBYyxHQUFHbkcsUUFBUSxDQUFDb0csTUFBaEM7QUFDQSxRQUFNQyxRQUFRLEdBQUdGLGNBQWMsQ0FBQ0csY0FBZixFQUFqQjtBQUNBLE1BQUlDLGVBQWUsR0FBRyxJQUF0QjtBQUNBQyxRQUFNLENBQUNDLElBQVAsQ0FBWUosUUFBWixFQUFzQkssT0FBdEIsQ0FBOEJDLENBQUMsSUFBSTtBQUNqQyxRQUFJTixRQUFRLENBQUNNLENBQUQsQ0FBUixDQUFZQyxNQUFaLENBQW1CQyxDQUFuQixLQUF5QixDQUF6QixJQUE4QlIsUUFBUSxDQUFDTSxDQUFELENBQVIsQ0FBWUMsTUFBWixDQUFtQkUsQ0FBbkIsS0FBeUIsQ0FBM0QsRUFBOEQ7QUFDNURQLHFCQUFlLEdBQUdGLFFBQVEsQ0FBQ00sQ0FBRCxDQUExQjtBQUNEO0FBQ0YsR0FKRDs7QUFNQSxNQUFJSixlQUFKLEVBQXFCO0FBQ25CeEMsbUJBQWUsQ0FBQzhDLENBQWhCLEdBQW9CTixlQUFlLENBQUNLLE1BQWhCLENBQXVCQyxDQUF2QixHQUEyQixFQUEvQztBQUNBOUMsbUJBQWUsQ0FBQytDLENBQWhCLEdBQW9CUCxlQUFlLENBQUNLLE1BQWhCLENBQXVCRSxDQUF2QixHQUEyQixFQUEvQztBQUNBL0MsbUJBQWUsQ0FBQ2dELENBQWhCLEdBQW9CUixlQUFlLENBQUNTLElBQWhCLENBQXFCckMsS0FBekM7QUFDQVosbUJBQWUsQ0FBQ2tELENBQWhCLEdBQW9CVixlQUFlLENBQUNTLElBQWhCLENBQXFCcEMsTUFBekM7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFTc0MsYUFBVCxHQUF5QjtBQUN2QixRQUFNQyxRQUFRLEdBQUd2RixLQUFLLENBQUN1QixHQUFOLENBQVUsZ0JBQVYsQ0FBakI7QUFDQSxRQUFNaUUsYUFBYSxHQUFHeEYsS0FBSyxDQUFDdUIsR0FBTixDQUFVLHNCQUFWLENBQXRCO0FBQ0EsUUFBTWtFLGNBQWMsR0FBR3pGLEtBQUssQ0FBQ3VCLEdBQU4sQ0FBVSx5Q0FBVixDQUF2QjtBQUVBLFNBQU9nRSxRQUFRLEtBQUtwRixVQUFiLElBQTRCcUYsYUFBYSxHQUFHdEcscUJBQWhCLElBQXlDLENBQUN1RyxjQUE3RTtBQUNEOztBQUVELFNBQVNDLFlBQVQsQ0FBc0JDLE9BQXRCLEVBQStCO0FBQzdCLFFBQU1DLFVBQVUsR0FBR3RCLHVCQUF1QixFQUExQzs7QUFFQSxNQUFJc0IsVUFBSixFQUFnQjtBQUNkOUUsZ0JBQVksR0FBRyxJQUFJakIsYUFBSixDQUFrQjtBQUMvQmtELFdBQUssRUFBRSxHQUR3QjtBQUUvQkMsWUFBTSxFQUFFLEdBRnVCO0FBRy9CaUMsT0FBQyxFQUFFOUMsZUFBZSxDQUFDOEMsQ0FIWTtBQUkvQkMsT0FBQyxFQUFFL0MsZUFBZSxDQUFDK0MsQ0FKWTtBQUsvQlcscUJBQWUsRUFBRSxJQUxjO0FBTS9CL0QsVUFBSSxFQUFFLEtBTnlCO0FBTy9CZ0UsbUJBQWEsRUFBRSxRQVBnQjtBQVEvQkMsV0FBSyxFQUFFMUQsT0FBTyxDQUFDMkQsUUFBUixLQUFxQixPQVJHO0FBUy9CQyxxQkFBZSxFQUFFO0FBVGMsS0FBbEIsQ0FBZjtBQVdBbkYsZ0JBQVksQ0FBQ3NDLE9BQWIsQ0FBc0IsVUFBU3pELFNBQVUsa0JBQXpDO0FBQ0FtQixnQkFBWSxDQUFDbUMsV0FBYixDQUF5QkMsRUFBekIsQ0FBNEIsaUJBQTVCLEVBQStDLE1BQU07QUFDbkRwQyxrQkFBWSxDQUFDZ0IsSUFBYjtBQUNBLFlBQU0sQ0FBQ2lCLEtBQUQsRUFBUUMsTUFBUixJQUFrQmxDLFlBQVksQ0FBQ29GLE9BQWIsRUFBeEI7QUFDQXJGLGdCQUFVLENBQUNvQyxXQUFYLENBQXVCUSxJQUF2QixDQUE0QixrQkFBNUIsRUFBZ0Q7QUFDOUNWLGFBRDhDO0FBRTlDQztBQUY4QyxPQUFoRDtBQUlBbkMsZ0JBQVUsQ0FBQ3NDLEtBQVg7O0FBQ0EsVUFBSW1DLGFBQWEsTUFBTXJFLGdCQUFnQixDQUFDQyxlQUFqQixDQUFpQ0MsR0FBeEQsRUFBNkQ7QUFDM0RGLHdCQUFnQixDQUFDQyxlQUFqQixDQUFpQ0MsR0FBakMsQ0FBcUNnQyxLQUFyQztBQUNEOztBQUNEckMsa0JBQVksQ0FBQ3FGLGFBQWIsQ0FBMkIsSUFBM0I7O0FBQ0EsVUFBSSxPQUFPUixPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2xDN0Usb0JBQVksQ0FBQ21DLFdBQWIsQ0FBeUJRLElBQXpCLENBQThCa0MsT0FBTyxDQUFDbEMsSUFBdEMsRUFBNENrQyxPQUFPLENBQUNTLElBQXBEO0FBQ0Q7QUFDRixLQWZEO0FBZ0JBdEYsZ0JBQVksQ0FBQ29DLEVBQWIsQ0FBZ0IsbUJBQWhCLEVBQXFDLE1BQU07QUFDekNyQyxnQkFBVSxDQUFDc0MsS0FBWDs7QUFDQSxVQUFJbUMsYUFBYSxNQUFNckUsZ0JBQWdCLENBQUNDLGVBQWpCLENBQWlDQyxHQUF4RCxFQUE2RDtBQUMzREYsd0JBQWdCLENBQUNDLGVBQWpCLENBQWlDQyxHQUFqQyxDQUFxQ2dDLEtBQXJDO0FBQ0Q7QUFDRixLQUxEO0FBTUFyQyxnQkFBWSxDQUFDb0MsRUFBYixDQUFnQixPQUFoQixFQUF5QixNQUFNLENBQzdCO0FBQ0QsS0FGRDtBQUdBcEMsZ0JBQVksQ0FBQ29DLEVBQWIsQ0FBZ0IsUUFBaEIsRUFBMEIsTUFBTTtBQUM5QnBDLGtCQUFZLEdBQUcsS0FBZjtBQUNBRCxnQkFBVSxDQUFDb0MsV0FBWCxDQUF1QlEsSUFBdkIsQ0FBNEIseUJBQTVCO0FBQ0QsS0FIRDtBQUlBM0MsZ0JBQVksQ0FBQ29DLEVBQWIsQ0FBZ0IsUUFBaEIsRUFBMEIsTUFBTTtBQUM5QixZQUFNLENBQUNILEtBQUQsRUFBUUMsTUFBUixJQUFrQmxDLFlBQVksQ0FBQ29GLE9BQWIsRUFBeEI7QUFDQXJGLGdCQUFVLENBQUNvQyxXQUFYLENBQXVCUSxJQUF2QixDQUE0QixrQkFBNUIsRUFBZ0Q7QUFDOUNWLGFBRDhDO0FBRTlDQztBQUY4QyxPQUFoRDtBQUlELEtBTkQ7QUFPRDs7QUFDRG5DLFlBQVUsQ0FBQ29DLFdBQVgsQ0FBdUJRLElBQXZCLENBQTRCLGdCQUE1QjtBQUNEOztBQUVELFNBQVM0QyxpQkFBVCxDQUEyQkMsR0FBM0IsRUFBZ0M7QUFDOUIsTUFBSUEsR0FBSixFQUFTO0FBQ1AsVUFBTUEsR0FBTjtBQUNEO0FBQ0Y7O0FBRUQsU0FBU0Msb0JBQVQsQ0FBOEJDLEdBQTlCLEVBQW1DO0FBQ2pDLFFBQU1DLGdCQUFnQixHQUFHekcsS0FBSyxDQUFDdUIsR0FBTixDQUFVLGtDQUFWLENBQXpCO0FBQ0EsUUFBTW1GLFlBQVksR0FDaEJELGdCQUFnQixLQUFLLFNBQXJCLElBQWtDLENBQUNBLGdCQUFuQyxHQUNJckksUUFBUSxDQUFDd0IsR0FBVCxDQUFhK0csT0FBYixDQUFxQixTQUFyQixDQURKLEdBRUlGLGdCQUhOO0FBSUEsUUFBTUcsV0FBVyxHQUFJLEdBQUVGLFlBQWEsbUJBQXBDO0FBQ0EsUUFBTUcsV0FBVyxHQUFJLEdBQUVILFlBQWEsbUJBQXBDOztBQUVBLE1BQUk7QUFDRmpJLE1BQUUsQ0FBQ3FJLFNBQUgsQ0FBYUYsV0FBYixFQUEwQkosR0FBRyxDQUFDTyxJQUFKLENBQVNDLFFBQVQsQ0FBa0JDLElBQWxCLEVBQTFCLEVBQW9EWixpQkFBcEQ7QUFDQTVILE1BQUUsQ0FBQ3lJLFVBQUgsQ0FBY04sV0FBZCxFQUEyQixJQUEzQixFQUFpQ1AsaUJBQWpDO0FBQ0E1SCxNQUFFLENBQUNxSSxTQUFILENBQWFELFdBQWIsRUFBMEJMLEdBQUcsQ0FBQ08sSUFBSixDQUFTSSxPQUFULENBQWlCRixJQUFqQixFQUExQixFQUFtRFosaUJBQW5EO0FBQ0E1SCxNQUFFLENBQUN5SSxVQUFILENBQWNMLFdBQWQsRUFBMkIsSUFBM0IsRUFBaUNSLGlCQUFqQztBQUNELEdBTEQsQ0FLRSxPQUFPQyxHQUFQLEVBQVk7QUFDWjtBQUNBYyxXQUFPLENBQUM3SSxHQUFSLENBQVkrSCxHQUFaO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNZSxRQUFRLEdBQUcsQ0FBQ0MsSUFBRCxFQUFPQyxNQUFNLEdBQUdoSSxFQUFoQixLQUF1QjtBQUN0QyxRQUFNaUksWUFBWSxHQUFHeEgsS0FBSyxDQUFDdUIsR0FBTixDQUFVLEtBQVYsQ0FBckI7QUFDQSxRQUFNa0csZ0JBQWdCLEdBQUdILElBQXpCO0FBQ0FHLGtCQUFnQixDQUFDQyxnQkFBakIsR0FBb0M7QUFDbENDLGVBQVcsRUFBRTNILEtBQUssQ0FBQ00sV0FBTixDQUFrQixxREFBbEIsQ0FEcUI7QUFFbENzSCxtQkFBZSxFQUFFNUgsS0FBSyxDQUFDTSxXQUFOLENBQWtCLHlEQUFsQjtBQUZpQixHQUFwQztBQUtBLFFBQU11SCxPQUFPLEdBQUdqRCxNQUFNLENBQUNrRCxNQUFQLENBQWNMLGdCQUFkLEVBQWdDRCxZQUFoQyxDQUFoQjs7QUFDQSxNQUFJLENBQUNDLGdCQUFnQixDQUFDTSxVQUF0QixFQUFrQztBQUNoQ1IsVUFBTSxDQUFDUyxJQUFQLENBQVksV0FBWixFQUF5QkgsT0FBekI7QUFDRDtBQUNGLENBWkQ7O0FBY0EsTUFBTUksaUJBQWlCLEdBQUcsTUFBTTtBQUM5QixRQUFNVCxZQUFZLEdBQUd4SCxLQUFLLENBQUN1QixHQUFOLENBQVUsS0FBVixDQUFyQjtBQUNBaEMsSUFBRSxDQUFDeUksSUFBSCxDQUFRLGNBQVIsRUFBd0JSLFlBQXhCO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNVSxZQUFZLEdBQUcsTUFBTTtBQUN6QixRQUFNQyxTQUFTLEdBQUc7QUFDaEJwQixRQUFJLEVBQUU7QUFDSkMsY0FBUSxFQUFFLEVBRE47QUFFSkcsYUFBTyxFQUFFLEVBRkw7QUFHSmlCLGFBQU8sRUFBRSxFQUhMO0FBSUpDLHFCQUFlLEVBQUU7QUFKYjtBQURVLEdBQWxCO0FBUUFoQixVQUFRLENBQUNjLFNBQUQsQ0FBUjtBQUNBLFFBQU1YLFlBQVksR0FBR3hILEtBQUssQ0FBQ3VCLEdBQU4sQ0FBVSxLQUFWLENBQXJCOztBQUNBLE1BQUlpRyxZQUFZLENBQUNjLElBQWpCLEVBQXVCO0FBQ3JCL0Isd0JBQW9CLENBQUM0QixTQUFELENBQXBCO0FBQ0Q7QUFDRixDQWREOztBQWdCQSxNQUFNSSxrQkFBa0IsR0FBRzNJLEdBQUcsQ0FBQzRJLHlCQUFKLEVBQTNCOztBQUVBLE1BQU1DLFdBQVcsR0FBRyxNQUFNO0FBQ3hCN0osSUFBRSxDQUFDNEIsSUFBSCxDQUNFO0FBQ0U7QUFDQWtJLFNBQUssRUFBRSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUEyQyxJQUEzQyxFQUFpRCxJQUFqRCxFQUF1RCxJQUF2RCxFQUE2RCxJQUE3RCxFQUFtRSxJQUFuRSxDQUZUO0FBR0VwSCxTQUFLLEVBQUU7QUFIVCxHQURGLEVBTUUsQ0FBQ2dGLEdBQUQsRUFBTXFDLElBQU4sS0FBZTtBQUNiLFFBQUlyQyxHQUFKLEVBQVM7QUFDUHhHLFlBQU0sQ0FBQzhJLFlBQVAsQ0FDRSxlQURGLEVBRUUsMEVBRkY7QUFJQWhKLFNBQUcsQ0FBQ2lKLElBQUosQ0FBUyxDQUFDLENBQVY7QUFDQTtBQUNEOztBQUNEbEgsVUFBTSxDQUFDbUgsV0FBUCxHQUFxQkgsSUFBckIsQ0FUYSxDQVViOztBQUNBckosUUFBSSxDQUFDeUosTUFBTCxDQUFZSixJQUFaO0FBQ0QsR0FsQkg7QUFvQkQsQ0FyQkQ7O0FBdUJBNUksT0FBTyxDQUFDbUQsRUFBUixDQUFXLGlCQUFYLEVBQThCLENBQUM4RixLQUFELEVBQVF4QyxHQUFSLEtBQWdCO0FBQzVDLE1BQUlBLEdBQUosRUFBUztBQUNQaUMsZUFBVztBQUNaLEdBRkQsTUFFTztBQUNMbkosUUFBSSxDQUFDMkosUUFBTDtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxJQUFJNUksV0FBSixFQUFpQjtBQUNmb0ksYUFBVztBQUNaOztBQUVELElBQUksQ0FBQ0Ysa0JBQUwsRUFBeUI7QUFDdkIzSSxLQUFHLENBQUNzSixJQUFKO0FBQ0QsQ0FGRCxNQUVPO0FBQ0x0SixLQUFHLENBQUNzRCxFQUFKLENBQU8saUJBQVAsRUFBMEIsTUFBTTtBQUM5QjtBQUNBLFFBQUlyQyxVQUFKLEVBQWdCO0FBQ2QsVUFBSUEsVUFBVSxDQUFDc0ksV0FBWCxFQUFKLEVBQThCO0FBQzVCdEksa0JBQVUsQ0FBQ3VJLE9BQVg7QUFDRDs7QUFDRHZJLGdCQUFVLENBQUNzQyxLQUFYO0FBQ0Q7QUFDRixHQVJEO0FBU0Q7O0FBRUR2RCxHQUFHLENBQUNzRCxFQUFKLENBQU8sT0FBUCxFQUFnQixNQUFNO0FBQ3BCO0FBQ0EsTUFBSW1HLE1BQU0sR0FBR3JKLEtBQUssQ0FBQ3VCLEdBQU4sQ0FBVSxRQUFWLENBQWI7O0FBRUEsTUFBSSxDQUFDOEgsTUFBTCxFQUFhO0FBQ1hBLFVBQU0sR0FBRzFLLElBQUksRUFBYjtBQUNBcUIsU0FBSyxDQUFDMEIsR0FBTixDQUFVLFFBQVYsRUFBb0IySCxNQUFwQjtBQUNEOztBQUNELFFBQU16SCxTQUFTLEdBQUcsSUFBSTVDLFNBQUosQ0FBY3FLLE1BQWQsRUFBc0JySixLQUF0QixDQUFsQjtBQUNBMkIsUUFBTSxDQUFDQyxTQUFQLEdBQW1CQSxTQUFuQjtBQUVBLFFBQU0wSCxPQUFPLEdBQUdsTCxRQUFRLENBQUNvRyxNQUF6QjtBQUNBLFFBQU07QUFBRXpCLFNBQUY7QUFBU0M7QUFBVCxNQUFvQnNHLE9BQU8sQ0FBQ0MsaUJBQVIsR0FBNEJDLFlBQXREO0FBQ0EzSSxZQUFVLEdBQUcsSUFBSWhCLGFBQUosQ0FBa0I7QUFDN0I0SixZQUFRLEVBQUUsR0FEbUI7QUFFN0JDLGFBQVMsRUFBRSxHQUZrQjtBQUc3QjNHLFNBSDZCO0FBSTdCQyxVQUo2QjtBQUs3QitDLFNBQUssRUFBRTFELE9BQU8sQ0FBQzJELFFBQVIsS0FBcUIsT0FMQztBQU03QmxFLFFBQUksRUFBRSxLQU51QjtBQU83Qm1FLG1CQUFlLEVBQUUsU0FQWTtBQVE3QkgsaUJBQWEsRUFBRTtBQVJjLEdBQWxCLENBQWI7QUFVQWpGLFlBQVUsQ0FBQ29DLFdBQVgsQ0FBdUJDLEVBQXZCLENBQTBCLFdBQTFCLEVBQXVDLE1BQU07QUFDM0MsUUFBSW9CLHVCQUF1QixFQUEzQixFQUErQjtBQUM3QnpELGdCQUFVLENBQUNvQyxXQUFYLENBQXVCUSxJQUF2QixDQUE0QixrQkFBNUIsRUFBZ0Q7QUFDOUNWLGFBQUssRUFBRVosZUFBZSxDQUFDZ0QsQ0FEdUI7QUFFOUNuQyxjQUFNLEVBQUViLGVBQWUsQ0FBQ2tEO0FBRnNCLE9BQWhEO0FBSUQ7O0FBQ0R4RSxjQUFVLENBQUNpQixJQUFYLEdBUDJDLENBUTNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxHQXpCRDs7QUEwQkEsTUFBSU0sYUFBSixFQUFtQjtBQUNqQnZCLGNBQVUsQ0FBQ3VDLE9BQVgsQ0FBb0Isb0JBQW1CZixPQUFPLENBQUNzSCxHQUFSLENBQVlDLHlCQUEwQixpQkFBN0U7QUFDRCxHQUZELE1BRU87QUFDTC9JLGNBQVUsQ0FBQ3VDLE9BQVgsQ0FDRXlHLGtEQUFTLENBQUM7QUFDUkMsY0FBUSxFQUFFcEwsSUFBSSxDQUFDZ0IsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLFVBQXJCLENBREY7QUFFUm9LLGNBQVEsRUFBRSxNQUZGO0FBR1JDLGFBQU8sRUFBRTtBQUhELEtBQUQsQ0FEWDtBQU9ELEdBM0RtQixDQTREcEI7OztBQUVBLE1BQUksQ0FBQ2hLLEtBQUssQ0FBQ3VCLEdBQU4sQ0FBVSxZQUFWLENBQUwsRUFBOEI7QUFDNUJ2QixTQUFLLENBQUMwQixHQUFOLENBQVUsWUFBVixFQUF3QmIsVUFBVSxDQUFDb0MsV0FBWCxDQUF1QmdILFlBQXZCLEVBQXhCO0FBQ0QsR0FoRW1CLENBa0VwQjs7O0FBQ0FwSixZQUFVLENBQUNxQyxFQUFYLENBQWMsT0FBZCxFQUF1QixNQUFNO0FBQzNCZ0YsZ0JBQVk7O0FBQ1osUUFBSXBILFlBQVksSUFBSSxDQUFDQSxZQUFZLENBQUNvSixXQUFiLEVBQXJCLEVBQWlEO0FBQy9DcEosa0JBQVksQ0FBQ3FKLEtBQWI7QUFDRDs7QUFDRCxVQUFNakosZUFBZSxHQUFHRCxnQkFBZ0IsQ0FBQ0MsZUFBakIsQ0FBaUNDLEdBQXpEOztBQUNBLFFBQUlELGVBQWUsSUFBSSxDQUFDQSxlQUFlLENBQUNnSixXQUFoQixFQUF4QixFQUF1RDtBQUNyRGhKLHFCQUFlLENBQUNpSixLQUFoQjtBQUNEO0FBQ0YsR0FURCxFQW5Fb0IsQ0E4RXBCOztBQUNBYixTQUFPLENBQUNwRyxFQUFSLENBQVcsZUFBWCxFQUE0QixNQUFNO0FBQ2hDLFFBQUksQ0FBQ3BDLFlBQUwsRUFBbUI7QUFDakI0RSxrQkFBWTtBQUNiO0FBQ0YsR0FKRDtBQUtELENBcEZELEUsQ0FzRkE7O0FBQ0E5RixHQUFHLENBQUNzRCxFQUFKLENBQU8sbUJBQVAsRUFBNEIsTUFBTTtBQUNoQztBQUNBO0FBQ0E7QUFDQXRELEtBQUcsQ0FBQ3NKLElBQUosR0FKZ0MsQ0FLaEM7QUFDRCxDQU5EO0FBUUFuSixPQUFPLENBQUNtRCxFQUFSLENBQVcscUJBQVgsRUFBa0MsTUFBTTtBQUN0Q3JDLFlBQVUsQ0FBQ29DLFdBQVgsQ0FBdUJRLElBQXZCLENBQTRCLHFCQUE1QjtBQUNELENBRkQ7QUFJQTFELE9BQU8sQ0FBQ21ELEVBQVIsQ0FBVyxzQkFBWCxFQUFtQyxNQUFNO0FBQ3ZDckMsWUFBVSxDQUFDb0MsV0FBWCxDQUF1QlEsSUFBdkIsQ0FBNEIsc0JBQTVCO0FBQ0QsQ0FGRDtBQUlBMUQsT0FBTyxDQUFDbUQsRUFBUixDQUFXLGlCQUFYLEVBQThCa0IsZUFBOUI7QUFDQXJFLE9BQU8sQ0FBQ21ELEVBQVIsQ0FBVyxnQkFBWCxFQUE2QixNQUFNNUUsV0FBVyxDQUFDNkYsY0FBWixFQUFuQztBQUVBcEUsT0FBTyxDQUFDbUQsRUFBUixDQUFXLFdBQVgsRUFBd0IsTUFBTTtBQUM1QixNQUFJcEMsWUFBSixFQUFrQjtBQUNoQkEsZ0JBQVksQ0FBQ21DLFdBQWIsQ0FBeUJRLElBQXpCLENBQThCLFdBQTlCO0FBQ0Q7QUFDRixDQUpEO0FBTUEsSUFBSTJHLFFBQUo7QUFFQXJLLE9BQU8sQ0FBQ21ELEVBQVIsQ0FBVyxxQkFBWCxFQUFrQytFLGlCQUFsQztBQUVBMUksRUFBRSxDQUFDMkQsRUFBSCxDQUFNLFlBQU4sRUFBb0JxRSxNQUFNLElBQUk7QUFDNUJVLG1CQUFpQjs7QUFDakIsTUFBSW1DLFFBQUosRUFBYztBQUNaL0MsWUFBUSxDQUFDK0MsUUFBRCxFQUFXN0MsTUFBWCxDQUFSO0FBQ0Q7QUFDRixDQUxEO0FBT0F4SCxPQUFPLENBQUNtRCxFQUFSLENBQVcsV0FBWCxFQUF3QixDQUFDOEYsS0FBRCxFQUFReEMsR0FBUixLQUFnQjtBQUN0QzRELFVBQVEsR0FBRzVELEdBQVg7QUFDQWEsVUFBUSxDQUFDYixHQUFELENBQVI7O0FBQ0EsTUFBSTFGLFlBQUosRUFBa0I7QUFDaEJBLGdCQUFZLENBQUNtQyxXQUFiLENBQXlCUSxJQUF6QixDQUE4QixXQUE5QixFQUEyQytDLEdBQTNDO0FBQ0QsR0FGRCxNQUVPO0FBQ0xkLGdCQUFZLENBQUM7QUFDWGpDLFVBQUksRUFBRSxXQURLO0FBRVgyQyxVQUFJLEVBQUVJO0FBRkssS0FBRCxDQUFaO0FBSUQ7O0FBQ0QsTUFBSUEsR0FBRyxDQUFDOEIsSUFBUixFQUFjO0FBQ1ovQix3QkFBb0IsQ0FBQ0MsR0FBRCxDQUFwQjtBQUNEO0FBQ0YsQ0FkRDtBQWdCQXpHLE9BQU8sQ0FBQ21ELEVBQVIsQ0FBVyxrQkFBWCxFQUErQixNQUFNO0FBQ25DZ0YsY0FBWTtBQUNiLENBRkQ7QUFJQW5JLE9BQU8sQ0FBQ21ELEVBQVIsQ0FBVyxXQUFYLEVBQXdCLENBQUM4RixLQUFELEVBQVF4QyxHQUFSLEtBQWdCO0FBQ3RDLFFBQU02RCxRQUFRLEdBQUc7QUFDZnRELFFBQUksRUFBRTtBQUNKQyxjQUFRLEVBQUVSLEdBQUcsQ0FBQzhELFVBQUosR0FBaUI5RCxHQUFHLENBQUMrRCxJQUFyQixHQUE0QixFQURsQztBQUVKcEQsYUFBTyxFQUFFLENBQUNYLEdBQUcsQ0FBQzhELFVBQUwsR0FBa0I5RCxHQUFHLENBQUMrRCxJQUF0QixHQUE2QixFQUZsQztBQUdKbkMsYUFBTyxFQUFFLEVBSEw7QUFJSkMscUJBQWUsRUFBRTtBQUNmbUMsa0JBQVUsRUFBRSxFQURHO0FBRWZyRCxlQUFPLEVBQUU7QUFGTSxPQUpiO0FBUUpzRCxpQkFBVyxFQUFFO0FBQ1hDLGVBQU8sRUFBRSxFQURFO0FBRVh2RCxlQUFPLEVBQUU7QUFGRTtBQVJUO0FBRFMsR0FBakI7QUFnQkEsUUFBTWdCLFNBQVMsR0FBRztBQUNoQnBCLFFBQUksRUFBRTtBQUNKQyxjQUFRLEVBQUUsRUFETjtBQUVKRyxhQUFPLEVBQUUsRUFGTDtBQUdKaUIsYUFBTyxFQUFFLEVBSEw7QUFJSkMscUJBQWUsRUFBRTtBQUNmbUMsa0JBQVUsRUFBRSxFQURHO0FBRWZyRCxlQUFPLEVBQUU7QUFGTSxPQUpiO0FBUUpzRCxpQkFBVyxFQUFFO0FBQ1hDLGVBQU8sRUFBRSxFQURFO0FBRVh2RCxlQUFPLEVBQUU7QUFGRTtBQVJUO0FBRFUsR0FBbEI7QUFnQkEsUUFBTXdELG1CQUFtQixHQUFHM0ssS0FBSyxDQUFDTSxXQUFOLENBQWtCLDBCQUFsQixDQUE1Qjs7QUFDQSxNQUFJa0csR0FBRyxDQUFDb0UsY0FBSixJQUFzQixDQUFDRCxtQkFBM0IsRUFBZ0Q7QUFDOUN0RCxZQUFRLENBQUNjLFNBQUQsQ0FBUjtBQUNELEdBRkQsTUFFTztBQUNMZCxZQUFRLENBQUNnRCxRQUFELENBQVI7QUFDRDs7QUFFRCxNQUFJdkosWUFBSixFQUFrQjtBQUNoQkEsZ0JBQVksQ0FBQ21DLFdBQWIsQ0FBeUJRLElBQXpCLENBQThCLFdBQTlCLEVBQTJDK0MsR0FBM0M7QUFDRCxHQUZELE1BRU87QUFDTGQsZ0JBQVksQ0FBQztBQUNYakMsVUFBSSxFQUFFLFdBREs7QUFFWDJDLFVBQUksRUFBRUk7QUFGSyxLQUFELENBQVo7QUFJRDs7QUFDRCxNQUFJQSxHQUFHLENBQUM4QixJQUFSLEVBQWM7QUFDWi9CLHdCQUFvQixDQUFDQyxHQUFELENBQXBCO0FBQ0Q7QUFDRixDQW5ERDtBQXFEQXpHLE9BQU8sQ0FBQ21ELEVBQVIsQ0FBVyxnQkFBWCxFQUE2QixDQUFDOEYsS0FBRCxFQUFReEMsR0FBUixLQUFnQjtBQUMzQyxNQUFJMUYsWUFBSixFQUFrQjtBQUNoQixRQUFJLENBQUMwRixHQUFMLEVBQVU7QUFDUjFGLGtCQUFZLENBQUMrSixJQUFiO0FBQ0QsS0FGRCxNQUVPO0FBQ0wvSixrQkFBWSxDQUFDZ0IsSUFBYjtBQUNBaEIsa0JBQVksQ0FBQ3FGLGFBQWIsQ0FBMkIsSUFBM0I7QUFDRDtBQUNGO0FBQ0YsQ0FURDtBQVdBcEcsT0FBTyxDQUFDbUQsRUFBUixDQUFXLFdBQVgsRUFBd0IsQ0FBQzhGLEtBQUQsRUFBUXhDLEdBQVIsS0FBZ0I7QUFDdEMzRixZQUFVLENBQUNvQyxXQUFYLENBQXVCUSxJQUF2QixDQUE0QixXQUE1QixFQUF5QytDLEdBQXpDO0FBQ0QsQ0FGRDtBQUlBekcsT0FBTyxDQUFDbUQsRUFBUixDQUFXLGtCQUFYLEVBQStCLENBQUM4RixLQUFELEVBQVF4QyxHQUFSLEtBQWdCO0FBQzdDLE1BQUkxRixZQUFKLEVBQWtCO0FBQ2hCQSxnQkFBWSxDQUFDbUMsV0FBYixDQUF5QlEsSUFBekIsQ0FBOEIsYUFBOUIsRUFBNkMrQyxHQUE3QztBQUNEO0FBQ0YsQ0FKRDtBQU1BekcsT0FBTyxDQUFDbUQsRUFBUixDQUFXLFVBQVgsRUFBdUIsQ0FBQzhGLEtBQUQsRUFBUXhDLEdBQVIsS0FBZ0I7QUFDckMsTUFBSTFGLFlBQUosRUFBa0I7QUFDaEJBLGdCQUFZLENBQUNtQyxXQUFiLENBQXlCUSxJQUF6QixDQUE4QixVQUE5QixFQUEwQytDLEdBQTFDO0FBQ0Q7O0FBQ0QzRixZQUFVLENBQUNvQyxXQUFYLENBQXVCUSxJQUF2QixDQUE0QixVQUE1QixFQUF3QytDLEdBQXhDO0FBQ0QsQ0FMRDtBQU9BekcsT0FBTyxDQUFDbUQsRUFBUixDQUFXLFlBQVgsRUFBeUIsQ0FBQzhGLEtBQUQsRUFBUXhDLEdBQVIsS0FBZ0I7QUFDdkMzRixZQUFVLENBQUNvQyxXQUFYLENBQXVCUSxJQUF2QixDQUE0QixhQUE1QixFQUEyQytDLEdBQTNDO0FBQ0QsQ0FGRDtBQUlBekcsT0FBTyxDQUFDbUQsRUFBUixDQUFXLGlCQUFYLEVBQThCLE1BQU07QUFDbEMsTUFBSXBDLFlBQUosRUFBa0I7QUFDaEJBLGdCQUFZLENBQUNtQyxXQUFiLENBQXlCUSxJQUF6QixDQUE4QixpQkFBOUI7QUFDRDs7QUFDRDVDLFlBQVUsQ0FBQ29DLFdBQVgsQ0FBdUJRLElBQXZCLENBQTRCLGVBQTVCO0FBQ0QsQ0FMRCxFLENBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEsiLCJmaWxlIjoiLi9zcmMvbWFpbi9tYWluLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9ybWF0IGFzIGZvcm1hdFVybCB9IGZyb20gJ3VybCc7XG5cbmNvbnN0IGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKTtcbmNvbnN0IHsgYXV0b1VwZGF0ZXIgfSA9IHJlcXVpcmUoJ2VsZWN0cm9uLXVwZGF0ZXInKTtcbmNvbnN0IGxvZyA9IHJlcXVpcmUoJ2VsZWN0cm9uLWxvZycpO1xuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB1dWlkID0gcmVxdWlyZSgndXVpZC92NCcpO1xuY29uc3Qgb3AgPSByZXF1aXJlKCdvcGVucG9ydCcpO1xuY29uc3QgU3RvcmUgPSByZXF1aXJlKCcuLi9jb21tb24vc3RvcmUnKTtcbmNvbnN0IGRlZmF1bHRQcmVmcyA9IHJlcXVpcmUoJy4uL2NvbW1vbi9kZWZhdWx0cy5qc29uJyk7XG5jb25zdCB0aGVtZXMgPSByZXF1aXJlKCcuLi9jb21tb24vdGhlbWVzLmpzb24nKTtcbmNvbnN0IEFuYWx5dGljcyA9IHJlcXVpcmUoJy4vYW5hbHl0aWNzJyk7XG5cbi8vIEFyZSB3ZSBwYWNrYWdpbmcgZm9yIGEgcGxhdGZvcm0ncyBhcHAgc3RvcmU/XG5jb25zdCBhcHBzdG9yZSA9IGZhbHNlO1xuY29uc3QgbWF4Q2hhbmdlTG9nU2VlbkNvdW50ID0gNTtcblxuY29uc3QgZXhwcmVzc0FwcCA9IGV4cHJlc3MoKTtcbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9vcmRlciAqL1xuY29uc3QgaHR0cEJhc2UgPSByZXF1aXJlKCdodHRwJykuU2VydmVyKGV4cHJlc3NBcHApO1xuY29uc3QgaHR0cCA9IHJlcXVpcmUoJ2h0dHAtc2h1dGRvd24nKShodHRwQmFzZSk7XG5jb25zdCBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpKGh0dHApO1xuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5leHByZXNzQXBwLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnd3d3JywgJ29icycpKSk7XG5cbmNvbnN0IHsgYXBwLCBCcm93c2VyV2luZG93LCBkaWFsb2csIGlwY01haW4gfSA9IGVsZWN0cm9uO1xuXG5jb25zdCBzdG9yZSA9IG5ldyBTdG9yZSh7XG4gIGNvbmZpZ05hbWU6ICd1c2VyLXByZWZlcmVuY2VzJyxcbiAgZGVmYXVsdHM6IGRlZmF1bHRQcmVmcyxcbn0pO1xuXG5jb25zdCBhcHBWZXJzaW9uID0gYXBwLmdldFZlcnNpb24oKTtcblxuY29uc3Qgb3ZlcmxheUNhc3QgPSBzdG9yZS5nZXRVc2VyUHJlZignYXBwLm92ZXJsYXktY2FzdCcpO1xuXG4vLyBSZXNldCB0byBkZWZhdWx0IHRoZW1lIGlmIHRoZW1lIG5vdCBmb3VuZFxuY29uc3QgY3VycmVudFRoZW1lID0gdGhlbWVzLmZpbmQodGhlbWUgPT4gdGhlbWUua2V5ID09PSBzdG9yZS5nZXRVc2VyUHJlZignYXBwLnRoZW1lJykpO1xuaWYgKGN1cnJlbnRUaGVtZSA9PT0gdW5kZWZpbmVkKSB7XG4gIHN0b3JlLnNldFVzZXJQcmVmKCdhcHAudGhlbWUnLCB0aGVtZXNbMF0ua2V5KTtcbn1cblxuc3RvcmUuc2V0VXNlclByZWYoJ3Rvb2xiYXIubGFuZ3VhZ2Utc2V0dGluZ3MnLCBudWxsKTtcblxubGV0IG1haW5XaW5kb3c7XG5sZXQgdmlld2VyV2luZG93ID0gZmFsc2U7XG5sZXQgc3RhcnRDaGFuZ2Vsb2dPcGVuVGltZXI7XG5sZXQgZW5kQ2hhbmdlbG9nT3BlblRpbWVyO1xuY29uc3Qgc2Vjb25kYXJ5V2luZG93cyA9IHtcbiAgY2hhbmdlbG9nV2luZG93OiB7XG4gICAgb2JqOiBmYWxzZSxcbiAgICB1cmw6IGBmaWxlOi8vJHtfX2Rpcm5hbWV9L3d3dy9jaGFuZ2Vsb2cuaHRtbGAsXG4gICAgb25DbG9zZTogKCkgPT4ge1xuICAgICAgY29uc3QgY291bnQgPSBzdG9yZS5nZXQoJ2NoYW5nZWxvZy1zZWVuLWNvdW50Jyk7XG4gICAgICBlbmRDaGFuZ2Vsb2dPcGVuVGltZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHN0b3JlLnNldCgnY2hhbmdlbG9nLXNlZW4nLCBhcHBWZXJzaW9uKTtcbiAgICAgIHN0b3JlLnNldCgnY2hhbmdlbG9nLXNlZW4tY291bnQnLCBjb3VudCArIDEpO1xuICAgICAgZ2xvYmFsLmFuYWx5dGljcy50cmFja0V2ZW50KFxuICAgICAgICAnY2hhbmdlbG9nJyxcbiAgICAgICAgJ2Nsb3NlZCcsXG4gICAgICAgIChlbmRDaGFuZ2Vsb2dPcGVuVGltZXIgLSBzdGFydENoYW5nZWxvZ09wZW5UaW1lcikgLyAxMDAwLjAsXG4gICAgICApO1xuICAgIH0sXG4gICAgc2hvdzogKCkgPT4ge1xuICAgICAgc3RhcnRDaGFuZ2Vsb2dPcGVuVGltZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9LFxuICB9LFxuICBoZWxwV2luZG93OiB7XG4gICAgb2JqOiBmYWxzZSxcbiAgICB1cmw6IGBmaWxlOi8vJHtfX2Rpcm5hbWV9L3d3dy9oZWxwLmh0bWxgLFxuICB9LFxuICBvdmVybGF5V2luZG93OiB7XG4gICAgb2JqOiBmYWxzZSxcbiAgICB1cmw6IGBmaWxlOi8vJHtfX2Rpcm5hbWV9L3d3dy9vdmVybGF5Lmh0bWxgLFxuICB9LFxuICBzaG9ydGN1dExlZ2VuZDoge1xuICAgIG9iajogZmFsc2UsXG4gICAgdXJsOiBgZmlsZTovLyR7X19kaXJuYW1lfS93d3cvbGVnZW5kLmh0bWxgLFxuICB9LFxufTtcbmxldCBtYW51YWxVcGRhdGUgPSBmYWxzZTtcbmNvbnN0IHZpZXdlcldpbmRvd1BvcyA9IHt9O1xuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbic7XG5cbmZ1bmN0aW9uIG9wZW5TZWNvbmRhcnlXaW5kb3cod2luZG93TmFtZSkge1xuICBjb25zdCB3aW5kb3cgPSBzZWNvbmRhcnlXaW5kb3dzW3dpbmRvd05hbWVdO1xuICBjb25zdCBvcGVuV2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmlsdGVyKGl0ZW0gPT4gaXRlbS5nZXRVUkwoKSA9PT0gd2luZG93LnVybCk7XG5cbiAgaWYgKG9wZW5XaW5kb3cubGVuZ3RoID4gMCkge1xuICAgIG9wZW5XaW5kb3dbMF0uc2hvdygpO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5vYmogPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgICB3aWR0aDogMTM2NixcbiAgICAgIGhlaWdodDogNzY4LFxuICAgICAgc2hvdzogZmFsc2UsXG4gICAgfSk7XG4gICAgd2luZG93Lm9iai53ZWJDb250ZW50cy5vbignZGlkLWZpbmlzaC1sb2FkJywgKCkgPT4ge1xuICAgICAgd2luZG93Lm9iai5zaG93KCk7XG4gICAgICB3aW5kb3cub2JqLmZvY3VzKCk7XG4gICAgICBpZiAod2luZG93LnNob3cpIHtcbiAgICAgICAgd2luZG93LnNob3coKTtcbiAgICAgIH1cbiAgICAgIGlmICh3aW5kb3cuZm9jdXMpIHtcbiAgICAgICAgd2luZG93LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgd2luZG93Lm9iai5sb2FkVVJMKHdpbmRvdy51cmwpO1xuXG4gICAgd2luZG93Lm9iai5vbignY2xvc2UnLCAoKSA9PiB7XG4gICAgICB3aW5kb3cub2JqID0gZmFsc2U7XG4gICAgICBpZiAod2luZG93Lm9uQ2xvc2UpIHtcbiAgICAgICAgd2luZG93Lm9uQ2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5hdXRvVXBkYXRlci5sb2dnZXIgPSBsb2c7XG5hdXRvVXBkYXRlci5sb2dnZXIudHJhbnNwb3J0cy5maWxlLmxldmVsID0gJ2luZm8nO1xuXG4vLyBhdXRvVXBkYXRlciBldmVudHNcbmF1dG9VcGRhdGVyLm9uKCdjaGVja2luZy1mb3ItdXBkYXRlJywgKCkgPT4ge1xuICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2NoZWNraW5nLWZvci11cGRhdGUnKTtcbn0pO1xuYXV0b1VwZGF0ZXIub24oJ3VwZGF0ZS1hdmFpbGFibGUnLCAoKSA9PiB7XG4gIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgndXBkYXRlLWF2YWlsYWJsZScpO1xufSk7XG5hdXRvVXBkYXRlci5vbigndXBkYXRlLW5vdC1hdmFpbGFibGUnLCAoKSA9PiB7XG4gIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgndXBkYXRlLW5vdC1hdmFpbGFibGUnKTtcbiAgaWYgKG1hbnVhbFVwZGF0ZSkge1xuICAgIGRpYWxvZy5zaG93TWVzc2FnZUJveCh7XG4gICAgICB0eXBlOiAnaW5mbycsXG4gICAgICBidXR0b25zOiBbJ09LJ10sXG4gICAgICBkZWZhdWx0SWQ6IDAsXG4gICAgICB0aXRsZTogJ05vIHVwZGF0ZSBhdmFpbGFibGUuJyxcbiAgICAgIG1lc3NhZ2U6ICdObyB1cGRhdGUgYXZhaWxhYmxlLicsXG4gICAgICBkZXRhaWw6IGBWZXJzaW9uICR7YXBwVmVyc2lvbn0gaXMgdGhlIGxhdGVzdCB2ZXJzaW9uLmAsXG4gICAgfSk7XG4gIH1cbn0pO1xuYXV0b1VwZGF0ZXIub24oJ3VwZGF0ZS1kb3dubG9hZGVkJywgKCkgPT4ge1xuICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3VwZGF0ZS1kb3dubG9hZGVkJyk7XG4gIGRpYWxvZy5zaG93TWVzc2FnZUJveChcbiAgICB7XG4gICAgICB0eXBlOiAnaW5mbycsXG4gICAgICBidXR0b25zOiBbJ0Rpc21pc3MnLCAnSW5zdGFsbCBhbmQgUmVzdGFydCddLFxuICAgICAgZGVmYXVsdElkOiAxLFxuICAgICAgdGl0bGU6ICdVcGRhdGUgYXZhaWxhYmxlLicsXG4gICAgICBtZXNzYWdlOiAnVXBkYXRlIGF2YWlsYWJsZS4nLFxuICAgICAgZGV0YWlsOiAnVXBkYXRlIGRvd25sb2FkZWQgYW5kIHJlYWR5IHRvIGluc3RhbGwnLFxuICAgICAgY2FuY2VsSWQ6IDAsXG4gICAgfSxcbiAgICByZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgPT09IDEpIHtcbiAgICAgICAgYXV0b1VwZGF0ZXIucXVpdEFuZEluc3RhbGwoKTtcbiAgICAgIH1cbiAgICB9LFxuICApO1xufSk7XG5hdXRvVXBkYXRlci5vbignZXJyb3InLCAoKSA9PiB7XG4gIGlmIChtYW51YWxVcGRhdGUpIHtcbiAgICAvLyBzaG93VXBkYXRlKCd1cGRhdGUtZXJyb3InKTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlcyhtYW51YWwgPSBmYWxzZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBpZiAobWFudWFsKSB7XG4gICAgICBtYW51YWxVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgICBhdXRvVXBkYXRlci5jaGVja0ZvclVwZGF0ZXMoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0ZvckV4dGVybmFsRGlzcGxheSgpIHtcbiAgY29uc3QgZWxlY3Ryb25TY3JlZW4gPSBlbGVjdHJvbi5zY3JlZW47XG4gIGNvbnN0IGRpc3BsYXlzID0gZWxlY3Ryb25TY3JlZW4uZ2V0QWxsRGlzcGxheXMoKTtcbiAgbGV0IGV4dGVybmFsRGlzcGxheSA9IG51bGw7XG4gIE9iamVjdC5rZXlzKGRpc3BsYXlzKS5mb3JFYWNoKGkgPT4ge1xuICAgIGlmIChkaXNwbGF5c1tpXS5ib3VuZHMueCAhPT0gMCB8fCBkaXNwbGF5c1tpXS5ib3VuZHMueSAhPT0gMCkge1xuICAgICAgZXh0ZXJuYWxEaXNwbGF5ID0gZGlzcGxheXNbaV07XG4gICAgfVxuICB9KTtcblxuICBpZiAoZXh0ZXJuYWxEaXNwbGF5KSB7XG4gICAgdmlld2VyV2luZG93UG9zLnggPSBleHRlcm5hbERpc3BsYXkuYm91bmRzLnggKyA1MDtcbiAgICB2aWV3ZXJXaW5kb3dQb3MueSA9IGV4dGVybmFsRGlzcGxheS5ib3VuZHMueSArIDUwO1xuICAgIHZpZXdlcldpbmRvd1Bvcy53ID0gZXh0ZXJuYWxEaXNwbGF5LnNpemUud2lkdGg7XG4gICAgdmlld2VyV2luZG93UG9zLmggPSBleHRlcm5hbERpc3BsYXkuc2l6ZS5oZWlnaHQ7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzaG93Q2hhbmdlbG9nKCkge1xuICBjb25zdCBsYXN0U2VlbiA9IHN0b3JlLmdldCgnY2hhbmdlbG9nLXNlZW4nKTtcbiAgY29uc3QgbGFzdFNlZW5Db3VudCA9IHN0b3JlLmdldCgnY2hhbmdlbG9nLXNlZW4tY291bnQnKTtcbiAgY29uc3QgbGltaXRDaGFuZ2VMb2cgPSBzdG9yZS5nZXQoJ3VzZXJQcmVmcy5hcHAuYW5hbHl0aWNzLmxpbWl0LWNoYW5nZWxvZycpO1xuXG4gIHJldHVybiBsYXN0U2VlbiAhPT0gYXBwVmVyc2lvbiB8fCAobGFzdFNlZW5Db3VudCA8IG1heENoYW5nZUxvZ1NlZW5Db3VudCAmJiAhbGltaXRDaGFuZ2VMb2cpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVWaWV3ZXIoaXBjRGF0YSkge1xuICBjb25zdCBpc0V4dGVybmFsID0gY2hlY2tGb3JFeHRlcm5hbERpc3BsYXkoKTtcblxuICBpZiAoaXNFeHRlcm5hbCkge1xuICAgIHZpZXdlcldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgIHdpZHRoOiA4MDAsXG4gICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgIHg6IHZpZXdlcldpbmRvd1Bvcy54LFxuICAgICAgeTogdmlld2VyV2luZG93UG9zLnksXG4gICAgICBhdXRvSGlkZU1lbnVCYXI6IHRydWUsXG4gICAgICBzaG93OiBmYWxzZSxcbiAgICAgIHRpdGxlQmFyU3R5bGU6ICdoaWRkZW4nLFxuICAgICAgZnJhbWU6IHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwMDAwJyxcbiAgICB9KTtcbiAgICB2aWV3ZXJXaW5kb3cubG9hZFVSTChgZmlsZTovLyR7X19kaXJuYW1lfS93d3cvdmlld2VyLmh0bWxgKTtcbiAgICB2aWV3ZXJXaW5kb3cud2ViQ29udGVudHMub24oJ2RpZC1maW5pc2gtbG9hZCcsICgpID0+IHtcbiAgICAgIHZpZXdlcldpbmRvdy5zaG93KCk7XG4gICAgICBjb25zdCBbd2lkdGgsIGhlaWdodF0gPSB2aWV3ZXJXaW5kb3cuZ2V0U2l6ZSgpO1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdleHRlcm5hbC1kaXNwbGF5Jywge1xuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgfSk7XG4gICAgICBtYWluV2luZG93LmZvY3VzKCk7XG4gICAgICBpZiAoc2hvd0NoYW5nZWxvZygpICYmIHNlY29uZGFyeVdpbmRvd3MuY2hhbmdlbG9nV2luZG93Lm9iaikge1xuICAgICAgICBzZWNvbmRhcnlXaW5kb3dzLmNoYW5nZWxvZ1dpbmRvdy5vYmouZm9jdXMoKTtcbiAgICAgIH1cbiAgICAgIHZpZXdlcldpbmRvdy5zZXRGdWxsU2NyZWVuKHRydWUpO1xuICAgICAgaWYgKHR5cGVvZiBpcGNEYXRhICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2aWV3ZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZChpcGNEYXRhLnNlbmQsIGlwY0RhdGEuZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmlld2VyV2luZG93Lm9uKCdlbnRlci1mdWxsLXNjcmVlbicsICgpID0+IHtcbiAgICAgIG1haW5XaW5kb3cuZm9jdXMoKTtcbiAgICAgIGlmIChzaG93Q2hhbmdlbG9nKCkgJiYgc2Vjb25kYXJ5V2luZG93cy5jaGFuZ2Vsb2dXaW5kb3cub2JqKSB7XG4gICAgICAgIHNlY29uZGFyeVdpbmRvd3MuY2hhbmdlbG9nV2luZG93Lm9iai5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHZpZXdlcldpbmRvdy5vbignZm9jdXMnLCAoKSA9PiB7XG4gICAgICAvLyBtYWluV2luZG93LmZvY3VzKCk7XG4gICAgfSk7XG4gICAgdmlld2VyV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgICB2aWV3ZXJXaW5kb3cgPSBmYWxzZTtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgncmVtb3ZlLWV4dGVybmFsLWRpc3BsYXknKTtcbiAgICB9KTtcbiAgICB2aWV3ZXJXaW5kb3cub24oJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IFt3aWR0aCwgaGVpZ2h0XSA9IHZpZXdlcldpbmRvdy5nZXRTaXplKCk7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2V4dGVybmFsLWRpc3BsYXknLCB7XG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3ByZXNlbnRlci12aWV3Jyk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlRmlsZUNhbGxiYWNrKGVycikge1xuICBpZiAoZXJyKSB7XG4gICAgdGhyb3cgZXJyO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJyb2FkY2FzdEZpbGVzKGFyZykge1xuICBjb25zdCBsaXZlRmVlZExvY2F0aW9uID0gc3RvcmUuZ2V0KCd1c2VyUHJlZnMuYXBwLmxpdmUtZmVlZC1sb2NhdGlvbicpO1xuICBjb25zdCB1c2VyRGF0YVBhdGggPVxuICAgIGxpdmVGZWVkTG9jYXRpb24gPT09ICdkZWZhdWx0JyB8fCAhbGl2ZUZlZWRMb2NhdGlvblxuICAgICAgPyBlbGVjdHJvbi5hcHAuZ2V0UGF0aCgnZGVza3RvcCcpXG4gICAgICA6IGxpdmVGZWVkTG9jYXRpb247XG4gIGNvbnN0IGd1cmJhbmlGaWxlID0gYCR7dXNlckRhdGFQYXRofS9zdHRtLUd1cmJhbmkudHh0YDtcbiAgY29uc3QgZW5nbGlzaEZpbGUgPSBgJHt1c2VyRGF0YVBhdGh9L3N0dG0tRW5nbGlzaC50eHRgO1xuXG4gIHRyeSB7XG4gICAgZnMud3JpdGVGaWxlKGd1cmJhbmlGaWxlLCBhcmcuTGluZS5HdXJtdWtoaS50cmltKCksIHdyaXRlRmlsZUNhbGxiYWNrKTtcbiAgICBmcy5hcHBlbmRGaWxlKGd1cmJhbmlGaWxlLCAnXFxuJywgd3JpdGVGaWxlQ2FsbGJhY2spO1xuICAgIGZzLndyaXRlRmlsZShlbmdsaXNoRmlsZSwgYXJnLkxpbmUuRW5nbGlzaC50cmltKCksIHdyaXRlRmlsZUNhbGxiYWNrKTtcbiAgICBmcy5hcHBlbmRGaWxlKGVuZ2xpc2hGaWxlLCAnXFxuJywgd3JpdGVGaWxlQ2FsbGJhY2spO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH1cbn1cblxuY29uc3Qgc2hvd0xpbmUgPSAobGluZSwgc29ja2V0ID0gaW8pID0+IHtcbiAgY29uc3Qgb3ZlcmxheVByZWZzID0gc3RvcmUuZ2V0KCdvYnMnKTtcbiAgY29uc3QgbGluZVdpdGhTZXR0aW5ncyA9IGxpbmU7XG4gIGxpbmVXaXRoU2V0dGluZ3MubGFuZ3VhZ2VTZXR0aW5ncyA9IHtcbiAgICB0cmFuc2xhdGlvbjogc3RvcmUuZ2V0VXNlclByZWYoJ3NsaWRlLWxheW91dC5sYW5ndWFnZS1zZXR0aW5ncy50cmFuc2xhdGlvbi1sYW5ndWFnZScpLFxuICAgIHRyYW5zbGl0ZXJhdGlvbjogc3RvcmUuZ2V0VXNlclByZWYoJ3NsaWRlLWxheW91dC5sYW5ndWFnZS1zZXR0aW5ncy50cmFuc2xpdGVyYXRpb24tbGFuZ3VhZ2UnKSxcbiAgfTtcblxuICBjb25zdCBwYXlsb2FkID0gT2JqZWN0LmFzc2lnbihsaW5lV2l0aFNldHRpbmdzLCBvdmVybGF5UHJlZnMpO1xuICBpZiAoIWxpbmVXaXRoU2V0dGluZ3MuZnJvbVNjcm9sbCkge1xuICAgIHNvY2tldC5lbWl0KCdzaG93LWxpbmUnLCBwYXlsb2FkKTtcbiAgfVxufTtcblxuY29uc3QgdXBkYXRlT3ZlcmxheVZhcnMgPSAoKSA9PiB7XG4gIGNvbnN0IG92ZXJsYXlQcmVmcyA9IHN0b3JlLmdldCgnb2JzJyk7XG4gIGlvLmVtaXQoJ3VwZGF0ZS1wcmVmcycsIG92ZXJsYXlQcmVmcyk7XG59O1xuXG5jb25zdCBlbXB0eU92ZXJsYXkgPSAoKSA9PiB7XG4gIGNvbnN0IGVtcHR5TGluZSA9IHtcbiAgICBMaW5lOiB7XG4gICAgICBHdXJtdWtoaTogJycsXG4gICAgICBFbmdsaXNoOiAnJyxcbiAgICAgIFB1bmphYmk6ICcnLFxuICAgICAgVHJhbnNsaXRlcmF0aW9uOiAnJyxcbiAgICB9LFxuICB9O1xuICBzaG93TGluZShlbXB0eUxpbmUpO1xuICBjb25zdCBvdmVybGF5UHJlZnMgPSBzdG9yZS5nZXQoJ29icycpO1xuICBpZiAob3ZlcmxheVByZWZzLmxpdmUpIHtcbiAgICBjcmVhdGVCcm9hZGNhc3RGaWxlcyhlbXB0eUxpbmUpO1xuICB9XG59O1xuXG5jb25zdCBzaW5nbGVJbnN0YW5jZUxvY2sgPSBhcHAucmVxdWVzdFNpbmdsZUluc3RhbmNlTG9jaygpO1xuXG5jb25zdCBzZWFyY2hQb3J0cyA9ICgpID0+IHtcbiAgb3AuZmluZChcbiAgICB7XG4gICAgICAvLyBSZTogaHR0cDovL3d3dy5zaWtoaXdpa2kub3JnL2luZGV4LnBocC9HdXJnYWRpXG4gICAgICBwb3J0czogWzEzOTcsIDE0NjksIDE1MzksIDE1NTIsIDE1NzQsIDE1ODEsIDE2MDYsIDE2NDQsIDE2NjEsIDE2NjUsIDE2NzUsIDE3MDhdLFxuICAgICAgY291bnQ6IDEsXG4gICAgfSxcbiAgICAoZXJyLCBwb3J0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGRpYWxvZy5zaG93RXJyb3JCb3goXG4gICAgICAgICAgJ092ZXJsYXkgRXJyb3InLFxuICAgICAgICAgICdObyBmcmVlIHBvcnRzIGF2YWlsYWJsZS4gQ2xvc2Ugb3RoZXIgYXBwbGljYXRpb25zIGFuZCBSZWJvb3QgdGhlIG1hY2hpbmUnLFxuICAgICAgICApO1xuICAgICAgICBhcHAuZXhpdCgtMSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGdsb2JhbC5vdmVybGF5UG9ydCA9IHBvcnQ7XG4gICAgICAvLyBjb25zb2xlLmxvZyhgT3ZlcmxheSBQb3J0IE5vICR7cG9ydH1gKTtcbiAgICAgIGh0dHAubGlzdGVuKHBvcnQpO1xuICAgIH0sXG4gICk7XG59O1xuXG5pcGNNYWluLm9uKCd0b2dnbGUtb2JzLWNhc3QnLCAoZXZlbnQsIGFyZykgPT4ge1xuICBpZiAoYXJnKSB7XG4gICAgc2VhcmNoUG9ydHMoKTtcbiAgfSBlbHNlIHtcbiAgICBodHRwLnNodXRkb3duKCk7XG4gIH1cbn0pO1xuXG5pZiAob3ZlcmxheUNhc3QpIHtcbiAgc2VhcmNoUG9ydHMoKTtcbn1cblxuaWYgKCFzaW5nbGVJbnN0YW5jZUxvY2spIHtcbiAgYXBwLnF1aXQoKTtcbn0gZWxzZSB7XG4gIGFwcC5vbignc2Vjb25kLWluc3RhbmNlJywgKCkgPT4ge1xuICAgIC8vIFNvbWVvbmUgdHJpZWQgdG8gcnVuIGEgc2Vjb25kIGluc3RhbmNlLCB3ZSBzaG91bGQgZm9jdXMgb3VyIHdpbmRvdy5cbiAgICBpZiAobWFpbldpbmRvdykge1xuICAgICAgaWYgKG1haW5XaW5kb3cuaXNNaW5pbWl6ZWQoKSkge1xuICAgICAgICBtYWluV2luZG93LnJlc3RvcmUoKTtcbiAgICAgIH1cbiAgICAgIG1haW5XaW5kb3cuZm9jdXMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5hcHAub24oJ3JlYWR5JywgKCkgPT4ge1xuICAvLyBSZXRyaWV2ZSB0aGUgdXNlcmlkIHZhbHVlLCBhbmQgaWYgaXQncyBub3QgdGhlcmUsIGFzc2lnbiBpdCBhIG5ldyB1dWlkLlxuICBsZXQgdXNlcklkID0gc3RvcmUuZ2V0KCd1c2VySWQnKTtcblxuICBpZiAoIXVzZXJJZCkge1xuICAgIHVzZXJJZCA9IHV1aWQoKTtcbiAgICBzdG9yZS5zZXQoJ3VzZXJJZCcsIHVzZXJJZCk7XG4gIH1cbiAgY29uc3QgYW5hbHl0aWNzID0gbmV3IEFuYWx5dGljcyh1c2VySWQsIHN0b3JlKTtcbiAgZ2xvYmFsLmFuYWx5dGljcyA9IGFuYWx5dGljcztcblxuICBjb25zdCBzY3JlZW5zID0gZWxlY3Ryb24uc2NyZWVuO1xuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHNjcmVlbnMuZ2V0UHJpbWFyeURpc3BsYXkoKS53b3JrQXJlYVNpemU7XG4gIG1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgbWluV2lkdGg6IDgwMCxcbiAgICBtaW5IZWlnaHQ6IDYwMCxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgZnJhbWU6IHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicsXG4gICAgc2hvdzogZmFsc2UsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnIzAwMDAwMCcsXG4gICAgdGl0bGVCYXJTdHlsZTogJ2hpZGRlbicsXG4gIH0pO1xuICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9uKCdkb20tcmVhZHknLCAoKSA9PiB7XG4gICAgaWYgKGNoZWNrRm9yRXh0ZXJuYWxEaXNwbGF5KCkpIHtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnZXh0ZXJuYWwtZGlzcGxheScsIHtcbiAgICAgICAgd2lkdGg6IHZpZXdlcldpbmRvd1Bvcy53LFxuICAgICAgICBoZWlnaHQ6IHZpZXdlcldpbmRvd1Bvcy5oLFxuICAgICAgfSk7XG4gICAgfVxuICAgIG1haW5XaW5kb3cuc2hvdygpO1xuICAgIC8vIC8vIFBsYXRmb3JtLXNwZWNpZmljIGFwcCBzdG9yZXMgaGF2ZSB0aGVpciBvd24gdXBkYXRlIG1lY2hhbmlzbVxuICAgIC8vIC8vIHNvIG9ubHkgY2hlY2sgaWYgd2UncmUgbm90IGluIG9uZVxuICAgIC8vIGlmICghYXBwc3RvcmUpIHtcbiAgICAvLyAgIGNoZWNrRm9yVXBkYXRlcygpO1xuICAgIC8vIH1cbiAgICAvLyAvLyBTaG93IGNoYW5nZWxvZyBpZiBsYXN0IHZlcnNpb24gd2Fzbid0IHNlZW5cbiAgICAvLyBjb25zdCBsYXN0U2VlbiA9IHN0b3JlLmdldCgnY2hhbmdlbG9nLXNlZW4nKTtcbiAgICAvL1xuICAgIC8vIGlmIChzaG93Q2hhbmdlbG9nKCkpIHtcbiAgICAvLyAgIG9wZW5TZWNvbmRhcnlXaW5kb3coJ2NoYW5nZWxvZ1dpbmRvdycpO1xuICAgIC8vICAgaWYgKGxhc3RTZWVuICE9PSBhcHBWZXJzaW9uKSB7XG4gICAgLy8gICAgIHN0b3JlLnNldCgnY2hhbmdlbG9nLXNlZW4tY291bnQnLCAxKTtcbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gICAgLy8gaWYgKCF2aWV3ZXJXaW5kb3cpIHtcbiAgICAvLyAgIGNyZWF0ZVZpZXdlcigpO1xuICAgIC8vIH1cbiAgfSk7XG4gIGlmIChpc0RldmVsb3BtZW50KSB7XG4gICAgbWFpbldpbmRvdy5sb2FkVVJMKGBodHRwOi8vbG9jYWxob3N0OiR7cHJvY2Vzcy5lbnYuRUxFQ1RST05fV0VCUEFDS19XRFNfUE9SVH0/cGF0aD1jaGFuZ2Vsb2dgKTtcbiAgfSBlbHNlIHtcbiAgICBtYWluV2luZG93LmxvYWRVUkwoXG4gICAgICBmb3JtYXRVcmwoe1xuICAgICAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4LmpzJyksXG4gICAgICAgIHByb3RvY29sOiAnZmlsZScsXG4gICAgICAgIHNsYXNoZXM6IHRydWUsXG4gICAgICB9KSxcbiAgICApO1xuICB9XG4gIC8vIG1haW5XaW5kb3cubG9hZFVSTChgZmlsZTovLyR7X19kaXJuYW1lfS9gKTtcblxuICBpZiAoIXN0b3JlLmdldCgndXNlci1hZ2VudCcpKSB7XG4gICAgc3RvcmUuc2V0KCd1c2VyLWFnZW50JywgbWFpbldpbmRvdy53ZWJDb250ZW50cy5nZXRVc2VyQWdlbnQoKSk7XG4gIH1cblxuICAvLyBDbG9zZSBhbGwgb3RoZXIgd2luZG93cyBpZiBjbG9zaW5nIHRoZSBtYWluXG4gIG1haW5XaW5kb3cub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgIGVtcHR5T3ZlcmxheSgpO1xuICAgIGlmICh2aWV3ZXJXaW5kb3cgJiYgIXZpZXdlcldpbmRvdy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICB2aWV3ZXJXaW5kb3cuY2xvc2UoKTtcbiAgICB9XG4gICAgY29uc3QgY2hhbmdlbG9nV2luZG93ID0gc2Vjb25kYXJ5V2luZG93cy5jaGFuZ2Vsb2dXaW5kb3cub2JqO1xuICAgIGlmIChjaGFuZ2Vsb2dXaW5kb3cgJiYgIWNoYW5nZWxvZ1dpbmRvdy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICBjaGFuZ2Vsb2dXaW5kb3cuY2xvc2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFdoZW4gYSBkaXNwbGF5IGlzIGNvbm5lY3RlZCwgYWRkIGEgdmlld2VyIHdpbmRvdyBpZiBpdCBkb2VzIG5vdCBhbHJlYWR5IGV4aXRcbiAgc2NyZWVucy5vbignZGlzcGxheS1hZGRlZCcsICgpID0+IHtcbiAgICBpZiAoIXZpZXdlcldpbmRvdykge1xuICAgICAgY3JlYXRlVmlld2VyKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG4vLyBRdWl0IHdoZW4gYWxsIHdpbmRvd3MgYXJlIGNsb3NlZC5cbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XG4gIC8vIE9uIE9TIFggaXQgaXMgY29tbW9uIGZvciBhcHBsaWNhdGlvbnMgYW5kIHRoZWlyIG1lbnUgYmFyXG4gIC8vIHRvIHN0YXkgYWN0aXZlIHVudGlsIHRoZSB1c2VyIHF1aXRzIGV4cGxpY2l0bHkgd2l0aCBDbWQgKyBRXG4gIC8vIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuICBhcHAucXVpdCgpO1xuICAvLyB9XG59KTtcblxuaXBjTWFpbi5vbignY2FzdC1zZXNzaW9uLWFjdGl2ZScsICgpID0+IHtcbiAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdjYXN0LXNlc3Npb24tYWN0aXZlJyk7XG59KTtcblxuaXBjTWFpbi5vbignY2FzdC1zZXNzaW9uLXN0b3BwZWQnLCAoKSA9PiB7XG4gIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnY2FzdC1zZXNzaW9uLXN0b3BwZWQnKTtcbn0pO1xuXG5pcGNNYWluLm9uKCdjaGVja0ZvclVwZGF0ZXMnLCBjaGVja0ZvclVwZGF0ZXMpO1xuaXBjTWFpbi5vbigncXVpdEFuZEluc3RhbGwnLCAoKSA9PiBhdXRvVXBkYXRlci5xdWl0QW5kSW5zdGFsbCgpKTtcblxuaXBjTWFpbi5vbignY2xlYXItYXB2JywgKCkgPT4ge1xuICBpZiAodmlld2VyV2luZG93KSB7XG4gICAgdmlld2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2NsZWFyLWFwdicpO1xuICB9XG59KTtcblxubGV0IGxhc3RMaW5lO1xuXG5pcGNNYWluLm9uKCd1cGRhdGUtb3ZlcmxheS12YXJzJywgdXBkYXRlT3ZlcmxheVZhcnMpO1xuXG5pby5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB7XG4gIHVwZGF0ZU92ZXJsYXlWYXJzKCk7XG4gIGlmIChsYXN0TGluZSkge1xuICAgIHNob3dMaW5lKGxhc3RMaW5lLCBzb2NrZXQpO1xuICB9XG59KTtcblxuaXBjTWFpbi5vbignc2hvdy1saW5lJywgKGV2ZW50LCBhcmcpID0+IHtcbiAgbGFzdExpbmUgPSBhcmc7XG4gIHNob3dMaW5lKGFyZyk7XG4gIGlmICh2aWV3ZXJXaW5kb3cpIHtcbiAgICB2aWV3ZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZCgnc2hvdy1saW5lJywgYXJnKTtcbiAgfSBlbHNlIHtcbiAgICBjcmVhdGVWaWV3ZXIoe1xuICAgICAgc2VuZDogJ3Nob3ctbGluZScsXG4gICAgICBkYXRhOiBhcmcsXG4gICAgfSk7XG4gIH1cbiAgaWYgKGFyZy5saXZlKSB7XG4gICAgY3JlYXRlQnJvYWRjYXN0RmlsZXMoYXJnKTtcbiAgfVxufSk7XG5cbmlwY01haW4ub24oJ3Nob3ctZW1wdHktc2xpZGUnLCAoKSA9PiB7XG4gIGVtcHR5T3ZlcmxheSgpO1xufSk7XG5cbmlwY01haW4ub24oJ3Nob3ctdGV4dCcsIChldmVudCwgYXJnKSA9PiB7XG4gIGNvbnN0IHRleHRMaW5lID0ge1xuICAgIExpbmU6IHtcbiAgICAgIEd1cm11a2hpOiBhcmcuaXNHdXJtdWtoaSA/IGFyZy50ZXh0IDogJycsXG4gICAgICBFbmdsaXNoOiAhYXJnLmlzR3VybXVraGkgPyBhcmcudGV4dCA6ICcnLFxuICAgICAgUHVuamFiaTogJycsXG4gICAgICBUcmFuc2xpdGVyYXRpb246IHtcbiAgICAgICAgZGV2YW5hZ2FyaTogJycsXG4gICAgICAgIEVuZ2xpc2g6ICcnLFxuICAgICAgfSxcbiAgICAgIFRyYW5zbGF0aW9uOiB7XG4gICAgICAgIFNwYW5pc2g6ICcnLFxuICAgICAgICBFbmdsaXNoOiAnJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBlbXB0eUxpbmUgPSB7XG4gICAgTGluZToge1xuICAgICAgR3VybXVraGk6ICcnLFxuICAgICAgRW5nbGlzaDogJycsXG4gICAgICBQdW5qYWJpOiAnJyxcbiAgICAgIFRyYW5zbGl0ZXJhdGlvbjoge1xuICAgICAgICBkZXZhbmFnYXJpOiAnJyxcbiAgICAgICAgRW5nbGlzaDogJycsXG4gICAgICB9LFxuICAgICAgVHJhbnNsYXRpb246IHtcbiAgICAgICAgU3BhbmlzaDogJycsXG4gICAgICAgIEVuZ2xpc2g6ICcnLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IGFubm91bmNlbWVudE92ZXJsYXkgPSBzdG9yZS5nZXRVc2VyUHJlZignYXBwLmFubm91bmNlbWVudC1vdmVybGF5Jyk7XG4gIGlmIChhcmcuaXNBbm5vdW5jZW1lbnQgJiYgIWFubm91bmNlbWVudE92ZXJsYXkpIHtcbiAgICBzaG93TGluZShlbXB0eUxpbmUpO1xuICB9IGVsc2Uge1xuICAgIHNob3dMaW5lKHRleHRMaW5lKTtcbiAgfVxuXG4gIGlmICh2aWV3ZXJXaW5kb3cpIHtcbiAgICB2aWV3ZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZCgnc2hvdy10ZXh0JywgYXJnKTtcbiAgfSBlbHNlIHtcbiAgICBjcmVhdGVWaWV3ZXIoe1xuICAgICAgc2VuZDogJ3Nob3ctdGV4dCcsXG4gICAgICBkYXRhOiBhcmcsXG4gICAgfSk7XG4gIH1cbiAgaWYgKGFyZy5saXZlKSB7XG4gICAgY3JlYXRlQnJvYWRjYXN0RmlsZXMoYXJnKTtcbiAgfVxufSk7XG5cbmlwY01haW4ub24oJ3ByZXNlbnRlci12aWV3JywgKGV2ZW50LCBhcmcpID0+IHtcbiAgaWYgKHZpZXdlcldpbmRvdykge1xuICAgIGlmICghYXJnKSB7XG4gICAgICB2aWV3ZXJXaW5kb3cuaGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aWV3ZXJXaW5kb3cuc2hvdygpO1xuICAgICAgdmlld2VyV2luZG93LnNldEZ1bGxTY3JlZW4odHJ1ZSk7XG4gICAgfVxuICB9XG59KTtcblxuaXBjTWFpbi5vbignc2hvcnRjdXRzJywgKGV2ZW50LCBhcmcpID0+IHtcbiAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdzaG9ydGN1dHMnLCBhcmcpO1xufSk7XG5cbmlwY01haW4ub24oJ3Njcm9sbC1mcm9tLW1haW4nLCAoZXZlbnQsIGFyZykgPT4ge1xuICBpZiAodmlld2VyV2luZG93KSB7XG4gICAgdmlld2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3NlbmQtc2Nyb2xsJywgYXJnKTtcbiAgfVxufSk7XG5cbmlwY01haW4ub24oJ25leHQtYW5nJywgKGV2ZW50LCBhcmcpID0+IHtcbiAgaWYgKHZpZXdlcldpbmRvdykge1xuICAgIHZpZXdlcldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdzaG93LWFuZycsIGFyZyk7XG4gIH1cbiAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCduZXh0LWFuZycsIGFyZyk7XG59KTtcblxuaXBjTWFpbi5vbignc2Nyb2xsLXBvcycsIChldmVudCwgYXJnKSA9PiB7XG4gIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnc2VuZC1zY3JvbGwnLCBhcmcpO1xufSk7XG5cbmlwY01haW4ub24oJ3VwZGF0ZS1zZXR0aW5ncycsICgpID0+IHtcbiAgaWYgKHZpZXdlcldpbmRvdykge1xuICAgIHZpZXdlcldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCd1cGRhdGUtc2V0dGluZ3MnKTtcbiAgfVxuICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3N5bmMtc2V0dGluZ3MnKTtcbn0pO1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcbi8vICAgb3BlblNlY29uZGFyeVdpbmRvdyxcbi8vICAgYXBwVmVyc2lvbixcbi8vICAgY2hlY2tGb3JVcGRhdGVzLFxuLy8gICBhdXRvVXBkYXRlcixcbi8vICAgc3RvcmUsXG4vLyAgIHRoZW1lcyxcbi8vICAgYXBwc3RvcmUsXG4vLyB9O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/main.js\n",
        );

        /***/
      },

    /***/ 0:
      /*!***********************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./src/main/main.js ***!
  \***********************************************************************************************/
      /*! no static exports found */
      /***/ function(module, exports, __webpack_require__) {
        __webpack_require__(
          /*! /Users/tsingh7/development/sttm-desktop/node_modules/electron-webpack/out/electron-main-hmr/main-hmr */ './node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js',
        );
        module.exports = __webpack_require__(
          /*! /Users/tsingh7/development/sttm-desktop/src/main/main.js */ './src/main/main.js',
        );

        /***/
      },

    /***/ crypto:
      /*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("crypto");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjcnlwdG9cIj80Yzc2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImNyeXB0by5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///crypto\n',
        );

        /***/
      },

    /***/ electron:
      /*!***************************!*\
  !*** external "electron" ***!
  \***************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("electron");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n',
        );

        /***/
      },

    /***/ 'electron-log':
      /*!*******************************!*\
  !*** external "electron-log" ***!
  \*******************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("electron-log");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1sb2dcIj9jOGM0Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLWxvZ1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-log\n',
        );

        /***/
      },

    /***/ 'electron-updater':
      /*!***********************************!*\
  !*** external "electron-updater" ***!
  \***********************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("electron-updater");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi11cGRhdGVyXCI/OWJmNCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJlbGVjdHJvbi11cGRhdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb24tdXBkYXRlclwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-updater\n',
        );

        /***/
      },

    /***/ 'electron-webpack/out/electron-main-hmr/HmrClient':
      /*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("electron-webpack/out/electron-main-hmr/HmrClient");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n',
        );

        /***/
      },

    /***/ express:
      /*!**************************!*\
  !*** external "express" ***!
  \**************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("express");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCI/MjJmZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJleHByZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///express\n',
        );

        /***/
      },

    /***/ fs:
      /*!*********************!*\
  !*** external "fs" ***!
  \*********************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("fs");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiP2E0MGQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///fs\n',
        );

        /***/
      },

    /***/ http:
      /*!***********************!*\
  !*** external "http" ***!
  \***********************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("http");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCI/OGQxOSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJodHRwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///http\n',
        );

        /***/
      },

    /***/ 'http-shutdown':
      /*!********************************!*\
  !*** external "http-shutdown" ***!
  \********************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("http-shutdown");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwLXNodXRkb3duXCI/MjYwMCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJodHRwLXNodXRkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cC1zaHV0ZG93blwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///http-shutdown\n',
        );

        /***/
      },

    /***/ 'is-online':
      /*!****************************!*\
  !*** external "is-online" ***!
  \****************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("is-online");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJpcy1vbmxpbmVcIj81YTZlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImlzLW9ubGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImlzLW9ubGluZVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///is-online\n',
        );

        /***/
      },

    /***/ 'lodash.defaultsdeep':
      /*!**************************************!*\
  !*** external "lodash.defaultsdeep" ***!
  \**************************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("lodash.defaultsdeep");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2guZGVmYXVsdHNkZWVwXCI/MWVhMiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJsb2Rhc2guZGVmYXVsdHNkZWVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoLmRlZmF1bHRzZGVlcFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///lodash.defaultsdeep\n',
        );

        /***/
      },

    /***/ 'lodash.get':
      /*!*****************************!*\
  !*** external "lodash.get" ***!
  \*****************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("lodash.get");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2guZ2V0XCI/M2MyNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJsb2Rhc2guZ2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoLmdldFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///lodash.get\n',
        );

        /***/
      },

    /***/ 'lodash.set':
      /*!*****************************!*\
  !*** external "lodash.set" ***!
  \*****************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("lodash.set");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2guc2V0XCI/ZWFkNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJsb2Rhc2guc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoLnNldFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///lodash.set\n',
        );

        /***/
      },

    /***/ openport:
      /*!***************************!*\
  !*** external "openport" ***!
  \***************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("openport");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJvcGVucG9ydFwiPzg4M2YiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoib3BlbnBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvcGVucG9ydFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///openport\n',
        );

        /***/
      },

    /***/ path:
      /*!***********************!*\
  !*** external "path" ***!
  \***********************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("path");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n',
        );

        /***/
      },

    /***/ 'socket.io':
      /*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("socket.io");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb2NrZXQuaW9cIj9jYjM0Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InNvY2tldC5pby5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///socket.io\n',
        );

        /***/
      },

    /***/ 'source-map-support/source-map-support.js':
      /*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("source-map-support/source-map-support.js");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n',
        );

        /***/
      },

    /***/ 'universal-analytics':
      /*!**************************************!*\
  !*** external "universal-analytics" ***!
  \**************************************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("universal-analytics");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1bml2ZXJzYWwtYW5hbHl0aWNzXCI/ZGFlNCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJ1bml2ZXJzYWwtYW5hbHl0aWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidW5pdmVyc2FsLWFuYWx5dGljc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///universal-analytics\n',
        );

        /***/
      },

    /***/ url:
      /*!**********************!*\
  !*** external "url" ***!
  \**********************/
      /*! no static exports found */
      /***/ function(module, exports) {
        eval(
          'module.exports = require("url");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIj82MWU4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///url\n',
        );

        /***/
      },

    /******/
  },
);
