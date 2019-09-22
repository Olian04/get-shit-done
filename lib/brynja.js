var brynja = (function (exports) {
    'use strict';

    function buildNode(tagType, builder, customOperations) {
        const ctx = {
            tag: tagType,
            value: null,
            text: '',
            events: {},
            props: {},
            children: [],
        };
        const builderCtx = Object.assign({ on(eventName, handler) {
                if (eventName in ctx.events) {
                    ctx.events[eventName].push(handler);
                }
                else {
                    ctx.events[eventName] = [handler];
                }
                return this;
            },
            child(tagType, builder) {
                ctx.children.push(buildNode(tagType, builder, customOperations));
                return this;
            },
            children(tagType, count, builder) {
                for (let __i = 0; __i < count; __i++) {
                    ctx.children.push(buildNode(tagType, (_) => builder(_, __i), customOperations));
                }
                return this;
            },
            when(booleanExpression, then_builder, else_builder) {
                if (booleanExpression) {
                    then_builder(this);
                }
                else if (else_builder) {
                    else_builder(this);
                }
                return this;
            },
            while(predicate, builder) {
                for (let i = 0; predicate(i); i++) {
                    builder(this, i);
                }
                return this;
            },
            do(...builders) {
                builders.forEach((builder) => builder(this));
                return this;
            },
            value(value) {
                ctx.value = value;
                return this;
            },
            text(value) {
                ctx.text = value;
                return this;
            },
            prop(key, value) {
                ctx.props[key] = value;
                return this;
            },
            id(value) {
                ctx.props.id = value;
                return this;
            },
            class(valuesArr) {
                if (!('class' in ctx.props)) {
                    ctx.props.class = valuesArr.join(' ');
                }
                else {
                    ctx.props.class = [...ctx.props.class.split(' '), ...valuesArr].join(' ');
                }
                return this;
            },
            name(value) {
                ctx.props.name = value;
                return this;
            },
            peek(callback) {
                function ctxProxy(ctx) {
                    return {
                        tag: ctx.tag,
                        text: ctx.text,
                        value: ctx.value,
                        props: ctx.props,
                        events: ctx.events,
                        children: new Proxy([], {
                            get: (arr, key) => {
                                if (key === 'length') {
                                    return ctx.children.length;
                                }
                                else if (!isNaN(parseFloat(key.toString()))) {
                                    return ctxProxy(ctx.children[key]);
                                }
                                else {
                                    return arr[key];
                                }
                            },
                        }),
                    };
                }
                callback(ctxProxy(ctx));
                return this;
            } }, Object.keys(customOperations).reduce((res, k) => (Object.assign({}, res, { [k]: (...args) => {
                customOperations[k](...args)(builderCtx);
                return builderCtx;
            } })), {}));
        builder(builderCtx);
        return ctx;
    }

    function renderNode(node) {
        const elem = document.createElement(node.tag);
        if (node.value) {
            // @ts-ignore
            elem.value = node.value;
            elem.setAttribute('value', '' + node.value);
        }
        if (node.text !== '') {
            const $text = document.createTextNode(node.text);
            elem.appendChild($text);
        }
        Object.keys(node.props).forEach((prop) => {
            elem.setAttribute(prop, node.props[prop]);
        });
        Object.keys(node.events).forEach((event) => {
            elem.addEventListener(event, (e) => {
                node.events[event].forEach((cb) => {
                    cb(e);
                });
            });
        });
        node.children.forEach((node) => {
            elem.appendChild(renderNode(node));
        });
        return elem;
    }

    const TEXT_NODE = 3; // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    function updateNode(newNode, oldNode, elem) {
        if (newNode.tag.toLowerCase() !== oldNode.tag.toLowerCase()) {
            // Different tags requires a re-render
            const newElem = renderNode(newNode);
            elem.parentNode.replaceChild(newElem, elem);
        }
        // #region Update value
        if (newNode.value && newNode.value !== oldNode.value) {
            // @ts-ignore
            elem.value = newNode.value;
            elem.setAttribute('value', '' + newNode.value);
        }
        else if (newNode.value !== oldNode.value) {
            // @ts-ignore
            elem.value = undefined;
            elem.removeAttribute('value');
        }
        // #endregion
        // #region Update text node
        if (oldNode.text === newNode.text) ;
        else if (oldNode.text === '' && newNode.text !== '') {
            // Add text
            const $text = document.createTextNode(newNode.text);
            elem.appendChild($text);
        }
        else if (oldNode.text !== '') {
            if (elem.firstChild.nodeType !== TEXT_NODE) {
                throw new Error('Unexpected "none text node" as first child of element: ' + elem);
            }
            if (newNode.text === '') {
                // Remove text
                elem.firstChild.remove();
            }
            else if (newNode.text !== '') {
                // Update text
                elem.firstChild.textContent = newNode.text;
            }
        }
        // #endregion
        // #region Update props
        new Set([
            ...Object.keys(oldNode.props),
            ...Object.keys(newNode.props),
        ]).forEach((prop) => {
            if (prop in oldNode.props && !(prop in newNode.props)) {
                // Remove prop
                elem.removeAttribute(prop);
            }
            else if (prop in newNode.props && !(prop in oldNode.props)) {
                // Add prop
                elem.setAttribute(prop, newNode.props[prop]);
            }
            else if (prop in newNode.props && prop in oldNode.props && newNode.props[prop] !== oldNode.props[prop]) {
                // Update prop
                elem.setAttribute(prop, newNode.props[prop]);
            }
        });
        // #endregion
        // #region Update events
        new Set([
            ...Object.keys(oldNode.events),
            ...Object.keys(newNode.events),
        ]).forEach((event) => {
            if (event in oldNode.events && !(event in newNode.events)) {
                // Remove all listeners
                oldNode.events[event].forEach((cb) => {
                    elem.removeEventListener(event, cb);
                });
            }
            else if (event in newNode.events && !(event in oldNode.events)) {
                // Add new listeners
                newNode.events[event].forEach((cb) => {
                    elem.addEventListener(event, cb);
                });
            }
            else if (event in newNode.events && event in oldNode.events) {
                // Some listeners might have changed
                for (let i = 0; i < Math.max(oldNode.events[event].length, newNode.events[event].length); i++) {
                    const oldHandler = oldNode.events[event][i];
                    const newHandler = newNode.events[event][i];
                    // Naively compare function signatures between oldNode and newNode to limit nr of assignments each render
                    if (oldHandler.toString() !== newHandler.toString()) {
                        elem.removeEventListener(event, oldHandler);
                        elem.addEventListener(event, newHandler);
                    }
                }
            }
        });
        // #endregion
        // #region Update children
        for (let i = 0; i < newNode.children.length; i++) {
            if (i < oldNode.children.length) {
                // Updated elements compared to previous nodeTree
                updateNode(newNode.children[i], oldNode.children[i], elem.children.item(i));
            }
            else {
                // Create new elements
                elem.appendChild(renderNode(newNode.children[i]));
            }
        }
        const firstInvalidIndex = newNode.children.length;
        const elementsToRemove = elem.children.length - firstInvalidIndex;
        for (let i = 0; i < elementsToRemove; i++) {
            // Remove extra elements
            elem.children.item(firstInvalidIndex).remove();
        }
        // #endregion
    }

    function Renderer(config) {
        let initialRender = true;
        let oldRootNode = null;
        const customOperations = {};
        return {
            render(rootBuilder) {
                const rootNode = buildNode(config.rootElement.tagName.toLowerCase(), rootBuilder, customOperations);
                if (initialRender) {
                    initialRender = false;
                    const newRoot = renderNode(rootNode);
                    config.rootElement.replaceWith(newRoot);
                    config.rootElement = newRoot;
                }
                else {
                    updateNode(rootNode, oldRootNode, config.rootElement);
                }
                oldRootNode = rootNode;
            },
            extend(operationName, constructor) {
                customOperations[operationName] = constructor;
            },
        };
    }

    // Events: https://www.w3schools.com/tags/ref_eventattributes.asp
    (function (Events) {
        let Mouse;
        (function (Mouse) {
            Mouse["Click"] = "click";
            Mouse["DoubleClick"] = "dblclick";
            Mouse["Down"] = "mousedown";
            Mouse["Up"] = "mouseup";
            Mouse["Move"] = "mousemove";
            Mouse["Out"] = "mouseout";
            Mouse["Over"] = "mouseover";
            Mouse["Wheel"] = "wheel";
        })(Mouse = Events.Mouse || (Events.Mouse = {}));
        let Keyboard;
        (function (Keyboard) {
            Keyboard["Down"] = "keydown";
            Keyboard["Up"] = "keyup";
            Keyboard["Press"] = "keypress";
        })(Keyboard = Events.Keyboard || (Events.Keyboard = {}));
        let Drag;
        (function (Drag) {
            Drag["Drag"] = "drag";
            Drag["End"] = "dragend";
            Drag["Enter"] = "dragenter";
            Drag["Leave"] = "dragleave";
            Drag["Over"] = "dragover";
            Drag["Start"] = "dragstart";
            Drag["Drop"] = "drop";
            Drag["Scroll"] = "scroll";
        })(Drag = Events.Drag || (Events.Drag = {}));
        let Clipboard;
        (function (Clipboard) {
            Clipboard["Copy"] = "copy";
            Clipboard["Cut"] = "cut";
            Clipboard["Paste"] = "paste";
        })(Clipboard = Events.Clipboard || (Events.Clipboard = {}));
    })(exports.Events || (exports.Events = {}));

    const defaultRenderer = (() => {
        let default_renderer = null;
        return () => {
            if (default_renderer === null) {
                // This makes sure the dom is ready when the Renderer is constructed.
                default_renderer = Renderer({
                    rootElement: document.getElementById('root'),
                });
            }
            return default_renderer;
        };
    })();
    const extend = (operationName, constructor) => defaultRenderer().extend(operationName, constructor);
    const render = (rootBuilder) => defaultRenderer().render(rootBuilder);

    exports.Renderer = Renderer;
    exports.extend = extend;
    exports.render = render;

    return exports;

}({}));
