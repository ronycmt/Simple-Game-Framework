/** section: Components API
 * class SGF.Component
 *
 * An abstract base class for game components. It cannot be instantiated
 * directly, but its subclasses are the building blocks for SGF games.
 **/
var Component = Class.create({
    initialize: function(options) {
        if (options) {
            Object.extend(this, options);
        }
        this.element = this.getElement();
    },
    /*
     * SGF.Component#getElement() -> Element
     * Internal method. Game developers need not be aware.
     **/
    getElement: (function() {
        var e = document.createElement("div");
        Element['setStyleI'](e, "position", "absolute");
        Element['setStyleI'](e, "overflow", "hidden");
        return function() {
            return e.cloneNode(false);
        }
    })(),
    toElement: function() {
        return this.element;
    },
    /**
     * SGF.Component#left() -> Number
     * 
     * Returns the number of pixels from left side of the screen to the left
     * side of the [[SGF.Component]].
     **/
    left: function() {
        return this.x;
    },
    /**
     * SGF.Component#top() -> Number
     *
     * Returns the number of pixels from the top of the screen to the top
     * of the [[SGF.Component]].
     **/
    top: function() {
        return this.y;
    },
    /**
     * SGF.Component#right() -> Number
     *
     * Returns the number of pixels from left side of the screen to the right
     * side of the [[SGF.Component]].
     **/
    right: function() {
        return this.x + this.width - 1;
    },
    /**
     * SGF.Component#bottom() -> Number
     * 
     * Returns the number of pixels from the top side of the screen to the
     * bottom of the [[SGF.Component]].
     **/
    bottom: function() {
        return this.y + this.height - 1;
    },
    /**
     * SGF.Component#render(interpolation, renderCount) -> undefined
     * - interpolation (Number): The percentage (value between 0.0 and 1.0)
     *                           between the last call to update and the next
     *                           call to update this call to render is taking place.
     *                           This number is used to "predict" the location of
     *                           this [[SGF.Component]] if the FPS are higher than
     *                           UPS, and the [[SGF.Component#dx]]/[[SGF.Component#dy]]
     *                           values are being used.
     * - renderCount (Number): The total number of times that [[SGF.Game#render]]
     *                         has been called for this game. This value has nothing
     *                         to do with the number of times this [[SGF.Component]]
     *                         has been rendered.
     * 
     * Renders the individual [[SGF.Component]]. This is called automatically in
     * the game loop once this component has been added through [[SGF.Game#addComponent]].
     *
     * Subclasses of [[SGF.Component]] override this method, and render how it
     * should be rendered. This default implementation does nothing, since
     * a [[SGF.Component]] itself cannot be rendered/instantiated.
     **/
    render: function(renderCount) {
        if (this.__rotation != this.rotation) {
            Element['setRotation'](this.element, this.rotation); // Radians
            this.__rotation = this.rotation;
        }

        if (this.__opacity != this.opacity) {
            Element['setOpacity'](this.element, this.opacity);
            this.__opacity = this.opacity;
        }

        if (this.__zIndex != this.zIndex) {
            this.__fixZIndex();
            this.__zIndex = this.zIndex;
        }

        if (this.__width != this.width) {
            Element['setStyleI'](this.element, "width", (this.width) + "px");
            this.__width = this.width;
        }
        if (this.__height != this.height) {
            Element['setStyleI'](this.element, "height", (this.height) + "px");
            this.__height = this.height;
        }

        if (this.__x != this.x) {
            this.__x = this.x;
            Element['setStyleI'](this.element, "left", (this.x) + "px");
        }

        if (this.__y != this.y) {
            this.__y = this.y;
            Element['setStyleI'](this.element, "top", (this.y) + "px");
        }
    },
    /**
     * SGF.Component#update(updateCount) -> undefined
     * - updateCount (Number): The total number of times that [[SGF.Game#update]]
     *                         has been called for this game. This value has nothing
     *                         to do with the number of times this [[SGF.Component]]
     *                         has been updated.
     *
     * Updates the state of the individual [[SGF.Component]]. This is called in
     * the game loop once this component has been added through
     * [[SGF.Game#addComponent]].
     *
     * This function should be thought of as the "logic" function for the [[SGF.Component]].
     **/
    update: function() {
    },
    __fixZIndex: function() {
        var z = this.parent && this.parent.__computeChildZIndex ?
            this.parent.__computeChildZIndex(this.zIndex) :
            this.zIndex;
        Element['setStyleI'](this.element, "z-index", z);
    }
});

/**
 * SGF.Component#width -> Number
 *
 * The width of the [[SGF.Component]]. This is a readable and writable
 * property. That is, if you would like to reize the [[SGF.Component]],
 * you could try something like:
 *
 *     this.width = this.width * 2;
 *
 * To double the current width of the [[SGF.Component]].
 **/
Component.prototype.width = 10;

/**
 * SGF.Component#height -> Number
 *
 * The height of the [[SGF.Component]]. This is a readable and writable
 * property. That is, if you would like to reize the [[SGF.Component]],
 * you could try something like:
 *
 *     this.height = SGF.Screen.height;
 *
 * To set the height of this [[SGF.Component]] to the current height of the
 * game screen.
 **/
Component.prototype.height = 10;

/**
 * SGF.Component#x -> Number
 *
 * The X coordinate of the top-left point of the [[SGF.Component]] from the
 * top-left of the game screen.
 *
 *     update: function($super) {
 *         this.x++;
 *         $super();
 *     }
 *
 * This is an example of overwritting the [[SGF.Component#update]] method,
 * and incrementing the X coordinate every step through the game loop.
 * This will smoothly pan the [[SGF.Component]] across the game screen at
 * the [[SGF.Game]]'s set game speed.
 **/
Component.prototype.x = 0;

/**
 * SGF.Component#y -> Number
 *
 * The Y coordinate of the top-left point of the [[SGF.Component]] from the
 * top-left of the game screen.
 **/
Component.prototype.y = 0;
/**
 * SGF.Component#opacity -> Number
 *
 * A percentage value (between 0.0 and 1.0, inclusive) that describes the
 * [[SGF.Component]]'s opacity. Setting this value to 1.0 (default) will
 * make the [[SGF.Component]] fully opaque. Setting to 0.0 will make it
 * fully transparent, or invisible. Setting to 0.5 will make it 50%
 * transparent. You get the idea...
 **/
Component.prototype.opacity = 1.0;
/**
 * SGF.Component#rotation -> Number
 *
 * The rotation value of the [[SGF.Component]] in degrees. Note that the
 * [[SGF.Component#x]], [[SGF.Component#y]] properties, and values returned
 * from [[SGF.Component#left]], [[SGF.Component#right]], [[SGF.Component#top]],
 * and [[SGF.Component#bottom]] are not affected by this value. Therefore,
 * any calculations that require the rotation to be a factor, your game code
 * must calculate itself.
 **/
Component.prototype.rotation = 0;

/**
 * SGF.Component#zIndex -> Number
 *
 * The Z index of this [[SGF.Component]]. Setting this value higher than
 * other [[SGF.Component]]s will render this [[SGF.Component]] above ones
 * with a lower **zIndex**.
 **/
Component.prototype.zIndex = 0;

/**
 * SGF.Component#parent -> SGF.Container | SGF.Game 
 *  
 * A reference to the current parent component of this component, or `null`
 * if the component is not currently placed inside any containing component.
 *
 * If the component is a top-level component (added through
 * [[SGF.Game#addComponent]]) then [[SGF.Component#parent]] will be
 * [[SGF.Game.current]] (your game instance).
 **/
Component.prototype.parent = null;

modules['component'] = Component;