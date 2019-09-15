// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"FIR.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Performs a frequency filtration across a provided streamed in signal.
 * This filter can be adjusted via the seed values provided.
 */

let FIRFilter = class FIRFilter {
  /**
   * The seed values work in tuples [FIR filter coefficient, starting bias];
   * When normalize is activated, the seed values are normalized to the provided value.
   * When normalize is a value of 1, this behaves like a low pass FIR filter.
   */
  constructor(seedValues, normalize) {
    this.coefficients = seedValues.map(seed => seed[0]);
    this.filter = seedValues.map(seed => seed[1]);

    if (normalize !== undefined) {
      let total = 0;
      this.coefficients.forEach(c => total += c);
      this.coefficients = this.coefficients.map(value => value / total * normalize);
    }
  }
  /**
   * Reset the filter to have all of it's filter values set to the provided value
   */


  reset(value) {
    this.filter = this.filter.map(() => value);
  }
  /**
   * This streams in a value into the filter and outputs the next computed value
   */


  stream(value) {
    let out = 0;
    this.filter.pop();
    this.filter.unshift(value);

    for (let i = 0, end = this.coefficients.length; i < end; ++i) {
      out += this.coefficients[i] * this.filter[i];
    }

    this.filter.shift();
    this.filter.unshift(out);
    return out;
  }
  /**
   * Runs a list of values through the filter and returns an array of each step
   */


  run(start, values) {
    const current = this.filter.slice(0);
    const toProcess = values.slice(0);
    this.reset(start);
    const out = [];

    while (toProcess.length > 0) {
      out.push(this.stream(toProcess.shift() || 0));
    } // Reset the filter back to where it was


    this.filter = current;
    return out;
  }

};
exports.FIRFilter = FIRFilter;
},{}],"pascal-triangle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
let PascalTriangle = class PascalTriangle {
  constructor(levels) {
    if (levels === 0) return;
    const elements = [[1]];

    const _levels = levels - 1; // i will be the index pointing to the previous row


    for (let i = 0; i < _levels; ++i) {
      const previous = elements[i];
      const row = [1];

      for (let k = 0, endk = previous.length - 1; k < endk; ++k) {
        row.push(previous[k] + previous[k + 1]);
      }

      row.push(1);
      elements.push(row);
    }

    this.elements = elements;
  }
  /**
   * Tries to generate a gaussian kernal based on the pascal triangle where the kernal has so many elements
   * To get a higher quality kernal trim off the ends of the triangle's row but keep the kernal number.
   * This causes a deeper triangle to be calculated.
   */


  gaussianKernal(size, trim) {
    const toTrim = trim * 2;
    let row = []; // Loop until we hit a row with enough elements to make the kernal

    for (let i = 0, end = this.elements.length; i < end && this.elements[i].length - toTrim <= size; ++i) {
      row = this.elements[i];
    } // Make sure the elements matches the requested elements size exactly


    if (row.length - toTrim !== size) {
      console.warn('Error in pascal triangle gaussian kernal', 'Requested size', size, 'Row', row, 'Trim amount', trim, 'Elements', this.elements);
    } // Copy and remove trimed elements


    let kernal = row.slice(trim, row.length - trim); // Get the new total of the row

    const total = kernal.reduce((prev, next) => next + prev, 0); // Normalize the kernal

    kernal = kernal.map(value => value / total);
    return {
      kernal,
      total
    };
  }

};
exports.PascalTriangle = PascalTriangle;
},{}],"gaussian-blur.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const pascal_triangle_1 = require("./pascal-triangle");

const {
  min,
  max
} = Math;

function clamp(val, minVal, maxVal) {
  return max(min(val, maxVal), minVal);
}
/**
 * Performs a gaussian blur on a set of numerical data.
 */


let GaussianBlur = class GaussianBlur {
  constructor(options) {
    this.options = options;
    this.update(options);
  }
  /**
   * Applies the blur to the input data, returns a blurred version without affecting the source.
   */


  generate(data) {
    let offsetLeft = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    let offsetTop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    let offsetRight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    let offsetBottom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    if (!data || !data[0] || !data[0].length) return data;
    const {
      passes
    } = this.options;
    const kernal = this.kernal;
    const outPass = data.map(col => col.slice(0));
    const width = data.length;
    const height = data[0].length;
    const offsets = {
      1: [0],
      3: [-1, 0, 1],
      5: [-2, -1, 0, 1, 2],
      7: [-3, -2, -1, 0, 1, 2, 3],
      9: [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    };
    const offset = offsets[kernal.length];

    if (!offset) {
      console.warn('No offset suitable for kernal size');
      return data;
    } // Instantiate our vertical pass so we don't recreate every pass


    const verticalPass = [];

    for (let x = 0; x < width; ++x) {
      verticalPass.push([]);
    }

    for (let blurCount = 0; blurCount < passes; ++blurCount) {
      // After the octaves have been loaded in, we can blur filter the result
      let value;
      let sample; // Vertical Gaussian blur pass

      for (let x = offsetLeft, endx = width - offsetRight; x < endx; ++x) {
        const outCol = verticalPass[x];
        const inCol = outPass[x];

        for (let y = offsetTop, endy = height - offsetBottom; y < endy; ++y) {
          value = 0;

          for (let k = 0, endk = kernal.length; k < endk; ++k) {
            sample = clamp(y + offset[k], 0, endy - 1);
            value += (inCol[sample] || 0) * kernal[k];
          }

          outCol[y] = value;
        }
      } // Horizontal Gaussian blur into our perlin data


      for (let x = offsetLeft, endx = width - offsetRight; x < endx; ++x) {
        const outCol = outPass[x];

        for (let y = offsetTop, endy = height - offsetBottom; y < endy; ++y) {
          value = 0;

          for (let k = 0, endk = kernal.length; k < endk; ++k) {
            sample = clamp(x + offset[k], 0, endx - 1);
            value += ((verticalPass[sample] || [])[y] || 0) * kernal[k];
          }

          outCol[y] = value;
        }
      }
    }

    return outPass;
  }

  update(options) {
    Object.assign(this.options, options);

    if (options.kernalSize) {
      // This is a blur kernal that will be used for sampling the zoomed in octaves
      this.kernal = new pascal_triangle_1.PascalTriangle(15).gaussianKernal(options.kernalSize, 2).kernal;
    }
  }

};
exports.GaussianBlur = GaussianBlur;
},{"./pascal-triangle":"pascal-triangle.ts"}],"scale-linear.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function scaleLinear(domain, range) {
  return function (x) {
    return (x - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0] + range[0]);
  };
}

exports.scaleLinear = scaleLinear;
},{}],"perlin-noise.ts":[function(require,module,exports) {
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

const gaussian_blur_1 = require("./gaussian-blur");

const scale_linear_1 = require("./scale-linear");

const {
  abs,
  floor,
  max,
  min,
  random
} = Math;
/**
 * This generates a 2d plane of perlin noise that is gray scale with values
 * that are 0 - 1.
 */

let PerlinNoise = class PerlinNoise {
  get width() {
    return this.options.width;
  }

  get height() {
    return this.options.height;
  }
  /**
   * Provide the output size, and the size of the octaves generated.
   */


  constructor(options) {
    this.options = options;
    this.blur = new gaussian_blur_1.GaussianBlur({
      passes: options.blendPasses,
      kernalSize: 9
    });
    this.update(options);
  }
  /**
   * Generates a new perlin dataset
   */


  generate() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const {
        width,
        height,
        octaves,
        valueRange
      } = _this.options; // This will contain the end perlin result

      let perlin = []; // Loop through each octave and multiply it into the perlin output

      octaves.forEach(function (octave) {
        // Start with a smaller sized map of pure gray scale noise
        const small = [];
        const smallWidth = octave[0];
        const smallHeight = octave[1];
        const scaleX = scale_linear_1.scaleLinear([0, width], [0, smallWidth]);
        const scaleY = scale_linear_1.scaleLinear([0, height], [0, smallHeight]); // Make the octave base

        for (let x = 0; x < smallWidth; ++x) {
          const col = [];
          small.push(col);

          for (let y = 0; y < smallHeight; ++y) {
            col.push(random());
          }
        } // Sample the octave into the size of the output perlin image


        for (let x = 0; x < width; ++x) {
          const col = perlin[x] = perlin[x] || [];

          for (let y = 0; y < height; ++y) {
            col[y] = (col[y] || 1) * small[floor(scaleX(x))][floor(scaleY(y))];
          }
        }
      }); // Run through the perlin noise data with our blur filter

      perlin = _this.blur.generate(perlin); // We now normalize the ranges to keep details brighter
      // We also make the data within each cell reflect the data range
      // that is specified

      let maxVal = -1;
      const range = valueRange[1] - valueRange[0];
      const base = valueRange[0];

      for (let x = 0; x < width; ++x) {
        const col = perlin[x];

        for (let y = 0; y < height; ++y) {
          // First brigten up darkened areas
          // perlin[x][y] *= 1 / (perlin[x][y] + 1);
          // Now get the max value
          maxVal = max(col[y], maxVal);
        }
      }

      for (let x = 0; x < width; ++x) {
        const col = perlin[x];

        for (let y = 0; y < height; ++y) {
          col[y] /= maxVal;
          col[y] = col[y] * range + base;
        }
      }

      _this.data = perlin;
    })();
  }
  /**
   * Will just ensure the data object is populated with a generation.
   */


  generateOnce() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.data) {
        yield _this2.generate();
      }
    })();
  }
  /**
   * Retrieves a rectangular sample from the perlin data.
   * If a threshold is included, absolute values below it will be zero'ed out.
   */


  sample(x, y, width, height, threshold) {
    const out = [];

    if (threshold) {
      for (let i = x, end = min(this.data.length, x + width); i < end; ++i) {
        out.push(this.data[i].slice(y, y + height).map(value => abs(value) > threshold ? value : 0));
      }
    } else {
      for (let i = x, end = min(this.data.length, x + width); i < end; ++i) {
        out.push(this.data[i].slice(y, y + height));
      }
    }

    return out;
  }
  /**
   * Update the options for the noise generation.
   */


  update(options) {
    Object.assign(this.options, options);

    if (options.blendPasses) {
      this.blur.update({
        passes: options.blendPasses
      });
    }
  }
  /**
   * Renders a canvas on the screen showing the generated output.
   */


  debug() {
    let threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let clear = arguments.length > 1 ? arguments[1] : undefined;

    if (clear) {
      if (this.debugContext) {
        this.debugContext.remove();
      }

      return;
    }

    const canvas = document.createElement('canvas').getContext('2d');

    if (canvas) {
      const {
        valueRange
      } = this.options;
      const element = canvas.canvas;
      document.getElementsByTagName('body')[0].appendChild(canvas.canvas);
      const width = element.width = this.data.length;
      const height = element.height = this.data[0].length;
      const data = canvas.getImageData(0, 0, width, height);
      let index = 0;
      const range = valueRange[1] - valueRange[0];
      const base = valueRange[0];

      if (threshold) {
        for (let x = 0, end = this.data.length; x < end; ++x) {
          const col = this.data[x];

          for (let y = 0, endy = col.length; y < endy; ++y) {
            const val = 255 * (abs(col[y]) > threshold ? 1 : 0);
            data.data[index * 4] = val;
            data.data[index * 4 + 1] = val;
            data.data[index * 4 + 2] = val;
            data.data[index * 4 + 3] = 255;
            index++;
          }
        }
      } else {
        for (let x = 0, end = this.data.length; x < end; ++x) {
          const col = this.data[x];

          for (let y = 0, endy = col.length; y < endy; ++y) {
            const val = 255 * ((col[y] - base) / range);
            data.data[index * 4] = val;
            data.data[index * 4 + 1] = val;
            data.data[index * 4 + 2] = val;
            data.data[index * 4 + 3] = 255;
            index++;
          }
        }
      }

      canvas.putImageData(data, 0, 0);
      element.style.position = 'fixed';
      element.style.top = '0px';
      element.style.left = '0px';
      element.style.zIndex = '9999';
      this.debugContext = element;
    }
  }

};
exports.PerlinNoise = PerlinNoise;
},{"./gaussian-blur":"gaussian-blur.ts","./scale-linear":"scale-linear.ts"}],"types.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"index.ts":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./FIR"));

__export(require("./gaussian-blur"));

__export(require("./pascal-triangle"));

__export(require("./perlin-noise"));

__export(require("./types"));
},{"./FIR":"FIR.ts","./gaussian-blur":"gaussian-blur.ts","./pascal-triangle":"pascal-triangle.ts","./perlin-noise":"perlin-noise.ts","./types":"types.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52651" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/lib.map