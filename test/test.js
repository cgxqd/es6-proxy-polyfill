describe('Call `Proxy` as a constructor', function () {
    new Proxy({}, {});
});


describe('Throw when calling `Proxy` as a function', function () {
    expect(function () {
        Proxy({}, {});
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('Throw when target is not an object', function () {
    expect(function () {
        new Proxy('non-object', {});
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('Throw when handler is not an object', function () {
    expect(function () {
        new Proxy({}, 'non-object');
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[get] trap is undefined or null', function () {
    var proxy = new Proxy({a: 1}, {
        get: undefined
    });
    expect(proxy.a).to.be(1);

    var proxy = new Proxy({a: 1}, {
        get: null
    });
    expect(proxy.a).to.be(1);
});


describe('[get] trap is a function', function () {
    var obj = {a: 1};
    var proxy = new Proxy(obj, {
        get: function (target, property, receiver) {
            if (target === obj && property === 'a' && receiver === proxy) {
                return 2;
            }
        }
    });
    expect(proxy.a).to.be(2);
});


describe('[get] throw when trap is not a function', function () {
    expect(function () {
        var proxy = new Proxy({a: 1}, {
            get: 2
        });
        proxy.a;
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[get] proxy must report the same value for the non-writable, non-configurable property', function () {
    expect(function () {
        var obj = Object.defineProperty && Object.defineProperty({}, 'a', {
            value: 1
        }) || {};
        var proxy = new Proxy(obj, {
            get: function () {
                return 2;
            }
        });
        proxy.a;
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[get] proxy must report undefined for a non-configurable accessor property without a getter', function () {
    expect(function () {
        var obj = Object.defineProperty && Object.defineProperty({}, 'a', {
            set: function () {}
        }) || {};
        var proxy = new Proxy(obj, {
            get: function () {
                return 2;
            }
        });
        proxy.a;
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[set] trap is undefined or null', function () {
    var proxy = new Proxy({a: 1}, {
        set: undefined
    });
    proxy.a = 2;
    expect(proxy.a).to.be(2);
    
    var proxy = new Proxy({a: 1}, {
        set: undefined
    });
    proxy.a = 2;
    expect(proxy.a).to.be(2);
});


describe('[set] trap is a function', function () {
    var obj = {a: 1};
    var proxy = new Proxy(obj, {
        set: function (target, property, value, receiver) {
            if (target === obj && property === 'a' && value === 2 && receiver === proxy) {
                target.a = 3;
                return true;
            }
        }
    });
    proxy.a = 2;
    expect(proxy.a).to.be(3);
});


describe('[set] throw when trap is not a function', function () {
    expect(function () {
        var proxy = new Proxy({a: 1}, {
            set: 2
        });
        proxy.a = 3;
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe("[set] proxy can't successfully set a non-writable, non-configurable property", function () {
    expect(function () {
        var obj = Object.defineProperty && Object.defineProperty({}, 'a', {
            value: 1
        }) || {};
        var proxy = new Proxy(obj, {
            set: function () {
                return true;
            }
        });
        proxy.a = 2;
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe("[set] proxy can't successfully set an accessor property without a setter", function () {
    expect(function () {
        var obj = Object.defineProperty && Object.defineProperty({}, 'a', {
            get: function () {}
        }) || {};
        var proxy = new Proxy(obj, {
            set: function () {
                return true;
            }
        });
        proxy.a = 2;
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


// describe('[set] throw when trap return false in strict mode', function () {
//     expect(function () {
//         'use strict'
//         var proxy = new Proxy({a: 1}, {
//             set: function () {
//                 return false;
//             }
//         });
//         proxy.a = 2;
//     }).to.throwException(function (ex) {
//         expect(ex).to.be.a(TypeError);
//     });
// });



describe('[apply] trap is undefined or null', function () {
    function fn() {
        return 1;
    }

    var proxy = new Proxy(fn, {
        apply: undefined
    });
    expect(proxy()).to.be(1);

    var proxy = new Proxy(fn, {
        apply: null
    });
    expect(proxy()).to.be(1);
});


describe('[apply] trap is a function', function () {
    function fn() {
        return 1;
    }
    var ctx = {};
    var proxy = new Proxy(fn, {
        apply: function (target, thisArg, argList) {
            if (target === fn && thisArg === ctx && argList.length === 1 && argList[0] === 2) {
                return 3;
            }
        }
    });
    expect(proxy.call(ctx, 2)).to.be(3);
});


describe('[apply] throw when trap is not a function', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            apply: 1
        });
        proxy();
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[apply] throw when calling trap with non-function target', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            apply: function () {}
        });
        proxy();
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});



describe('[construct] trap is undefined or null', function () {
    function Test(a) {
        this.a = a;
    }

    var proxy = new Proxy(Test, {
        construct: undefined
    });
    expect(new proxy(1).a).to.be(1);
    
    var proxy = new Proxy(Test, {
        construct: null
    });
    expect(new proxy(1).a).to.be(1);
});


describe('[construct] trap is a function', function () {
    function Test(a) {
        this.a = a;
    }
    var proxy = new Proxy(Test, {
        construct: function (target, argList, newTarget) {
            if (target === Test && argList.length === 1 && argList[0] === 2 && newTarget === proxy) {
                return new target(3);
            }
        }
    });
    expect(new proxy(2).a).to.be(3);
});


describe('[construct] throw when trap is not a function', function () {
    expect(function () {
        function Test(a) {
            this.a = a;
        }
        var proxy = new Proxy(Test, {
            construct: 1
        });
        new proxy();
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[construct] trap returned non-object', function () {
    expect(function () {
        function Test(a) {
            this.a = a;
        }
        var proxy = new Proxy(Test, {
            construct: function () {
                return 1;
            }
        });
        new proxy();
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[construct] throw when calling trap with non-constructor target', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            construct: function () {
                return {};
            }
        });
        new proxy();
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});



describe('[isExtensible] trap is undefined or null', function () {
    var proxy = new Proxy({}, {
        isExtensible: undefined
    });
    var result = Object.isExtensible && Object.isExtensible(proxy);
    expect(result).to.be(true);

    var proxy = new Proxy({}, {
        isExtensible: null
    });
    var result = Object.isExtensible && Object.isExtensible(proxy);
    expect(result).to.be(true);
});

describe('[isExtensible] trap is a function', function () {
    var obj = {};
    var proxy = new Proxy(obj, {
        isExtensible: function (target) {
            return target === obj ? true : false;
        }
    });
    var result = Object.isExtensible && Object.isExtensible(proxy);
    expect(result).to.be(true);
});


describe('[isExtensible] throw when trap is not a function', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            isExtensible: 1
        });
        Object.isExtensible && Object.isExtensible(proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[isExtensible] proxy must report same extensiblitity as target', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            isExtensible: function () {
                return false;
            }
        });
        Object.isExtensible && Object.isExtensible(proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});



describe('[preventExtensions] trap is undefined or null', function () {
    var proxy = new Proxy({}, {
        preventExtensions: undefined
    });
    var result = Object.preventExtensions && Object.preventExtensions(proxy);
    expect(result).to.be(proxy);
    
    var proxy = new Proxy({}, {
        preventExtensions: null
    });
    var result = Object.preventExtensions && Object.preventExtensions(proxy);
    expect(result).to.be(proxy);
});


describe('[preventExtensions] trap is a function', function () {
    var obj = {};
    var proxy = new Proxy(obj, {
        preventExtensions: function (target) {
            if (target === obj) {
                Object.preventExtensions && Object.preventExtensions(target);
                return true;
            }
        }
    });
    var result = Object.preventExtensions && Object.preventExtensions(proxy);
    expect(result).to.be(proxy);
});


describe('[preventExtensions] throw when trap is not a function', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            preventExtensions: 1
        });
        Object.preventExtensions && Object.preventExtensions(proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe("[preventExtensions] proxy can't report an extensible object as non-extensible", function () {
    expect(function () {
        var proxy = new Proxy({}, {
            preventExtensions: function () {
                return true;
            }
        });
        Object.preventExtensions && Object.preventExtensions(proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[preventExtensions] trap returned false', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            preventExtensions: function () {
                return false;
            }
        });
        Object.preventExtensions && Object.preventExtensions(proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});



describe('[getPrototypeOf] trap is undefined or null', function () {
    var proxy = new Proxy({}, {
        getPrototypeOf: undefined
    });
    var proto = Object.getPrototypeOf && Object.getPrototypeOf(proxy) || {};
    expect(proto).to.be(Object.prototype);

    var proxy = new Proxy({}, {
        getPrototypeOf: null
    });
    var proto = Object.getPrototypeOf && Object.getPrototypeOf(proxy) || {};
    expect(proto).to.be(Object.prototype);
});


describe('[getPrototypeOf] trap is a function', function () {
    var obj = {};
    var proxy = new Proxy(obj, {
        getPrototypeOf: function (target) {
            return target === obj ? {a: 1} : null;
        }
    });
    var proto = Object.getPrototypeOf && Object.getPrototypeOf(proxy) || {};
    expect(proto.a).to.be(1);
});


describe('[getPrototypeOf] throw when trap is not a function', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            getPrototypeOf: 1
        });
        Object.getPrototypeOf && Object.getPrototypeOf(proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[getPrototypeOf] throw when returning neither object nor null', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            getPrototypeOf: function () {
                return undefined;
            }
        });
        Object.getPrototypeOf && Object.getPrototypeOf(proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[getPrototypeOf] proxy target is non-extensible but the trap did not return its actual prototype', function () {
    expect(function () {
        var obj = {};
        Object.preventExtensions && Object.preventExtensions(obj);
        var proxy = new Proxy(obj, {
            getPrototypeOf: function () {
                return {};
            }
        });
        Object.getPrototypeOf && Object.getPrototypeOf(proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});



describe('[setPrototypeOf] trap is undefined or null', function () {
    var obj = {};
    var proxy = new Proxy(obj, {
        setPrototypeOf: undefined
    });
    Object.setPrototypeOf && Object.setPrototypeOf(proxy, {a: 1});
    expect(obj.a).to.be(1);

    var obj = {};
    var proxy = new Proxy(obj, {
        setPrototypeOf: null
    });
    Object.setPrototypeOf && Object.setPrototypeOf(proxy, {a: 1});
    expect(obj.a).to.be(1);
});


describe('[setPrototypeOf] trap is a function', function () {
    var obj = {};
    var proxy = new Proxy(obj, {
        setPrototypeOf: function (target, prototype) {
            if (target === obj) {
                prototype.a = 2;
                Object.setPrototypeOf && Object.setPrototypeOf(target, prototype);
                return true;
            }
            return false;
        }
    });
    Object.setPrototypeOf && Object.setPrototypeOf(proxy, {a: 1});
    expect(obj.a).to.be(2);
});


describe('[setPrototypeOf] throw when trap is not a function', function () {
    expect(function () {
        var proxy = new Proxy({}, {
            setPrototypeOf: 1
        });
        Object.setPrototypeOf && Object.setPrototypeOf(proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[setPrototypeOf] trap returned true for setting a new prototype on the non-extensible', function () {
    expect(function () {
        var obj = {};
        Object.preventExtensions && Object.preventExtensions(obj);
        var proxy = new Proxy(obj, {
            setPrototypeOf: function () {
                return true;
            }
        });
        Object.setPrototypeOf && Object.setPrototypeOf(proxy, {});
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});



describe('[revocable] call `Proxy.revocable` as a function', function () {
    var revocable = Proxy.revocable({}, {});
    expect(revocable.revoke).to.be.a(Function);
});


describe('[revocable] throw when calling `Proxy.revocable` as a constructor', function () {
    expect(function () {
        new Proxy.revocable({}, {});
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[revocable] cannot create proxy with a revoked proxy as target', function () {
    expect(function () {
        var revocable = Proxy.revocable({}, {});
        revocable.revoke();
        new Proxy(revocable.proxy, {});
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[revocable] cannot create proxy with a revoked proxy as handler', function () {
    expect(function () {
        var revocable = Proxy.revocable({}, {});
        revocable.revoke();
        new Proxy({}, revocable.proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[revocable] throw when performing `get` on a revoked proxy', function () {
    expect(function () {
        var revocable = Proxy.revocable({a: 1}, {});
        revocable.revoke();
        revocable.proxy.a;
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[revocable] throw when performing `set` on a revoked proxy', function () {
    expect(function () {
        var revocable = Proxy.revocable({a: 1}, {});
        revocable.revoke();
        revocable.proxy.a = 2;
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[revocable] throw when performing `apply` on a revoked proxy', function () {
    expect(function () {
        var revocable = Proxy.revocable(function () {}, {});
        revocable.revoke();
        revocable.proxy();
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[revocable] throw when performing `construct` on a revoked proxy', function () {
    expect(function () {
        var revocable = Proxy.revocable(function () {}, {});
        revocable.revoke();
        new revocable.proxy();
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[revocable] throw when creating proxy with a revoked proxy as target', function () {
    expect(function () {
        var revocable = Proxy.revocable({}, {});
        revocable.revoke();
        new Proxy(revocable.proxy, {});
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[revocable] throw when creating proxy with a revoked proxy as handler', function () {
    expect(function () {
        var revocable = Proxy.revocable({}, {});
        revocable.revoke();
        new Proxy({}, revocable.proxy);
    }).to.throwException(function (ex) {
        expect(ex).to.be.a(TypeError);
    });
});


describe('[Array] basic function', function () {
    var proxy = new Proxy([1, 2, 3], {
        get: function (target, property, receiver) {
            return property == 0 && receiver === proxy
                ? 9
                : target[property];
        },
        set: function (target, property, value, receiver) {
            if (property == 1 && receiver === proxy) {
                target[1] = value + 1;
            } else {
                target[property] = value;
            }
            return true;
        }
    });
    proxy[0] = 4;
    proxy[1] = 5;
    expect(proxy).to.eql([9, 6, 3]);
    expect(proxy.length).to.be(3);
    expect(proxy instanceof Array).to.be(true);
});


describe('[Array] method `push`', function () {
    var proxy = new Proxy([], {});
    proxy.push(1, 2, 3);
    proxy[2] = 8;
    expect(proxy).to.eql([1, 2, 8]);
});


describe('[Array] method `pop`', function () {
    var proxy = new Proxy([1, 2, 3], {});
    var val = proxy.pop();
    expect(val).to.be(3);
    expect(proxy).to.eql([1, 2]);
});


describe('[Array] method `unshift`', function () {
    var proxy = new Proxy([1, 2, 3], {});
    proxy.unshift(8);
    expect(proxy).to.eql([8, 1, 2, 3]);
});


describe('[Array] method `shift`', function () {
    var proxy = new Proxy([1, 2, 3], {});
    var val = proxy.shift();
    expect(val).to.be(1);
    expect(proxy).to.eql([2, 3]);
});


describe('[Array] method `join`', function () {
    var proxy = new Proxy([1, 2, 3], {});
    expect(proxy.join('-')).to.be('1-2-3');
});


describe('[Array] method `reverse`', function () {
    var proxy = new Proxy([1, 2, 3], {});
    proxy.reverse();
    expect(proxy).to.eql([3, 2, 1]);
});


describe('[Array] method `sort`', function () {
    var proxy = new Proxy([3, 2, 1], {});
    proxy.sort();
    expect(proxy).to.eql([1, 2, 3]);
});


describe('[Array] method `concat`', function () {
    var proxy = new Proxy([1, 2], {});
    expect(proxy.concat([3, 4])).to.eql([1, 2, 3, 4]);
});


describe('[Array] method `slice`', function () {
    var proxy = new Proxy([1, 2, 3, 4, 5], {});
    expect(proxy.slice(1, 3)).to.eql([2, 3]);
});


describe('[Array] method `splice`', function () {
    var proxy = new Proxy([1, 2, 3, 4, 5], {});
    var arr = proxy.splice(1, 2, 8, 9, 0);
    expect(arr).to.eql([2, 3]);
    expect(proxy).to.eql([1, 8, 9, 0, 4, 5]);
});


describe('[Array] method `toString`', function () {
    var proxy = new Proxy([1, 2, 3], {});
    expect(proxy.toString()).to.be("1,2,3");
});


describe('[Array] method `toLocaleString`', function () {
    var arr = [1, 2, 3];
    var proxy = new Proxy(arr, {});
    expect(proxy.toLocaleString()).to.be(arr.toLocaleString());
});
