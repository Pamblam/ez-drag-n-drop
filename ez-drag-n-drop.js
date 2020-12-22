/**
 * ez-drag-n-drop - v1.0.19
 * Simple plugin to allow users to drag and drop to rearrange elements in the DOM.
 * @author Pamblam
 * @website 
 * @license MIT
 */



/**
 * Class to enable dragging and dropping of DOM elements.
 * @see https://pamblam.github.io/ez-drag-n-drop/examples/
 */
class EZDnD_Draggable{
	
	/**
	 * Create new interface for making DOM elements draggable.
	 * @param {HTMLElement} [options.element] - The element that should be draggable.
	 * @param {HTMLElement} [options.anchor] - An Element inside the draggable element that is the handle to drag the draggable element. If not provided, the entire elemenet is the anchor.
	 * @param {HTMLElement[]} [options.containers] - Array of HTMLElements which draggables may be dropped into, as top level children of these elements. If not provided, the element is draggable only within it's immediate ancestor.
	 * @param {HTMLElement|null} [options.placeholder] - If provided, serves as a placeholder to show where a dropped element will land.
	 * @param {String} [options.dragging_class] - If provided this class will be added to any elements as they are being dragged.
	 * @param {String} [options.hovering_class] - If provided this class will be added to any containers as they are being hovered over with a dragged element.
	 * @returns {EZDnD_Draggable}
	 */
	constructor(options){
		
		// handle options/parameters
		this.element = options.element;
		this.anchor = options.anchor || options.element;
		if(!options.containers) options.containers = options.element.parentElement;
		this.containers = Array.isArray(options.containers) ? options.containers : [options.containers];
		this.placeholder = this.normalizePlaceholderInput(options.placeholder);
		this.dragging_class = options.dragging_class || undefined;
		this.hovering_class = options.hovering_class || undefined;
		this.validateClassParameters();
		
		// private helper properties
		this.isDragging = false;
		this.elementClone = false;
		this.mouseOffset = {x:0, y:0};
		this.cssDisplayValue = this.element.style.display || null;
		this.anchorCursor = this.anchor.style.cursor || null;
		this.bodyCursor = document.body.style.cursor || null;
		this.currentAbsPos = {x:0, y:0};
		this.newElementPosition = null;
		
		// Bound events
		this.boundOnAnchorMousedown = this.onAnchorMousedown.bind(this);
		this.boundOnMouseReleasethis = this.onMouseRelease.bind(this);
		this.boundOnMouseMove = this.onMouseMove.bind(this);
		this.boundOnMouseOverAnchor = this.onMouseOverAnchor.bind(this);
		this.boundOnMouseOutAnchor = this.onMouseOutAnchor.bind(this);
		
		// Attach listeners
		this.bind();
	}
	
	/**
	 * Unbinds all events and resets the DOM so that the instance can be garbage collected. Synonym for unbind();
	 * @returns {undefined}
	 */
	destroy(){
		this.unbind();
	}
	
	/**
	 * Unbinds all events and resets the DOM so that the instance can be garbage collected. Synonym for destroy();
	 * @returns {undefined}
	 */
	unbind(){
		this.anchor.removeEventListener('mousedown', this.boundOnAnchorMousedown);
		document.removeEventListener('mouseup', this.boundOnMouseReleasethis);
		document.removeEventListener('mousemove', this.boundOnMouseMove);
		this.anchor.removeEventListener('mouseover', this.boundOnMouseOverAnchor);
		this.anchor.removeEventListener('mouseout', this.boundOnMouseOutAnchor);
		this.onMouseRelease();
	}
	
	/**
	 * Binds events to the elements. This is called on construct, but if you unbind() or destroy(), you can re-bind with this method.
	 * @returns {undefined}
	 */
	bind(){
		this.anchor.addEventListener('mousedown', this.boundOnAnchorMousedown);
		document.addEventListener('mouseup', this.boundOnMouseReleasethis);
		document.addEventListener('mousemove', this.boundOnMouseMove);
		this.anchor.addEventListener('mouseover', this.boundOnMouseOverAnchor);
		this.anchor.addEventListener('mouseout', this.boundOnMouseOutAnchor);
	}
	
	/**
	 * Ensure placeholder is a HTMLElement or null.
	 * @ignore
	 */
	normalizePlaceholderInput(placeholder){
		if(placeholder instanceof HTMLElement) return placeholder;
		if(typeof placeholder === 'string'){
			var d = document.createElement('div');
			d.innerHTML = placeholder;
			var children = [...d.children];
			if(children.length) return children[0];
			return null;
		}
		return null;
	}
	
	/**
	 * Change the cursor on mouseover of the anchor.
	 * @ignore
	 */
	onMouseOverAnchor(){
		this.anchor.style.cursor = 'grab';
	}
	
	/**
	 * Reset the cursor on mouseout of the anchor.
	 * @ignore
	 */
	onMouseOutAnchor(){
		this.anchor.style.cursor = this.anchorCursor;
	}
	
	/**
	 * Validate the constructor parameters.
	 * @ignore
	 */
	validateClassParameters(){
		// Ensure anchor, element are HTMLElements
		['element', 'anchor'].forEach(node=>{
			if(!(this[node] instanceof HTMLElement)){
				throw new Error(node+" must be instance of HTMLElement");
			}
		});
		// Ensure all containers are HTMLElements
		this.containers.forEach(container=>{
			if(!(container instanceof HTMLElement)){
				throw new Error("containers must be instances of HTMLElement");
			}
		});
		// Ensure Element is in a continaer
		if(!this.isInContainer(this.element)){
			throw new Error("element must be contained within container.");
		}
		// Ensure anchor is within element
		if(!this.element.contains(this.anchor) && this.element !== this.anchor){
			throw new Error("anchor must be contained within element.");
		}
	}
	
	/**
	 * Is the element in a container.
	 * @ignore
	 */
	isInContainer(element){
		var isElementInContainer = false;
		this.containers.forEach(container=>{
			if(container.contains(element)){
				isElementInContainer = true;
			}
		});
		return isElementInContainer;
	}
	
	/**
	 * Handle mouseup event.
	 * @ignore
	 */
	onMouseRelease(){
		var wasDragging = !!this.isDragging;
		var wasMoved = !!this.newElementPosition;
		
		this.isDragging = false;
		if(this.elementClone) this.elementClone.remove();
		this.mouseOffset = {x:0, y:0};
		this.currentAbsPos = {x:0, y:0};
		
		if(this.newElementPosition){
			this.newElementPosition.ele.insertAdjacentElement(this.newElementPosition.pos, this.element);
			if(this.placeholder) this.placeholder.remove();
			if(this.hovering_class){
				this.newElementPosition.container.classList.remove(this.hovering_class);
			}
		}
		
		document.body.style.cursor = this.bodyCursor;
		this.anchor.style.cursor = this.anchorCursor;
		this.newElementPosition = null;
		this.element.style.display = this.cssDisplayValue;
		
		if(wasDragging){ 
			if(wasMoved){
				var event = new CustomEvent('dnd-completed', {detail: this, bubbles: true});
				this.element.dispatchEvent(event);
			}else{
				var event = new CustomEvent('dnd-canceled', {detail: this, bubbles: true});
				this.element.dispatchEvent(event);
			}
		}
	}
	
	/**
	 * Handle mouse down event.
	 * @ignore
	 */
	onAnchorMousedown(e){
		e.preventDefault();
		this.isDragging = true;
		this.calculateMouseOffset(e);
		this.elementClone = this.cloneElement();
		this.cssDisplayValue = this.element.style.display || null;
		this.element.style.display = 'none';
		document.body.style.cursor = 'grabbing';
		var event = new CustomEvent('dnd-started', {detail: this, bubbles: true});
		this.element.dispatchEvent(event);
	}
	
	/**
	 * Get the new position of the dragging element.
	 * @ignore
	 */
	getNewElementPosition(e){
		var container = null;
		var mousePos = {x: e.pageX, y: e.pageY};
		
		this.containers.forEach(c=>{
			var {top, left, right, bottom} = c.getBoundingClientRect();
			top += scrollY;
			bottom += scrollY;
			left += scrollX;
			right += scrollX;
			
			const isVerticallyIncontainer = mousePos.x >= left && mousePos.x <= right;
			const isHorizontallyInContainer = mousePos.y >= top && mousePos.y <= bottom;
			if(isVerticallyIncontainer && isHorizontallyInContainer){
				container = c;
			}
		});
		
		if(!container) return null;
		var children = [...container.children];
		
		// if there are no children
		if(!children.length){
			return {pos: 'afterbegin', ele: container, container};
		}
		
		// Get the closest element, it's distance, and the position
		var position, element, distance;
		
		children.forEach(child=>{
			var posit = null;
			var pos = this.calculateElementCenterPos(child);
			var d = Math.hypot(pos.x-mousePos.x, pos.y-mousePos.y);
			if(mousePos.y < pos.y){
				// it's above
				posit = 'beforebegin';
			}else if(mousePos.y > pos.y){
				// it's below
				posit = 'afterend';
			}else if(mousePos.x > pos.x){
				// it's to the right
				posit = 'afterend';
			}else{
				// it's to the left
				posit = 'beforebegin';
			}
			if(!distance || d < distance){
				distance = d;
				element = child;
				position = posit;
			}
		});
		
		return {pos: position, ele: element, container};
	}
	
	/**
	 * Calculate the center of a DOM element.
	 * @ignore
	 */
	calculateElementCenterPos(element){
		var {top, left, width, height} = element.getBoundingClientRect();
		top += scrollY;
		left += scrollX;
		return {
			x: left + (width / 2),
			y: top + (height / 2)
		};
	}
	
	/**
	 * Handle mouse move event.
	 * @ignore
	 */
	onMouseMove(e){
		if(this.isDragging === false) return;
		var event = new CustomEvent('dnd-dragging', {detail: this, bubbles: true});
		this.element.dispatchEvent(event);
		this.currentAbsPos = {
			x: e.pageX-this.mouseOffset.x, 
			y: e.pageY-this.mouseOffset.y
		};
		this.elementClone.style.top = this.currentAbsPos.y+"px";
		this.elementClone.style.left = this.currentAbsPos.x+"px";
		
		var prev_container = this.newElementPosition ? this.newElementPosition.container : undefined;
		
		this.newElementPosition = this.getNewElementPosition(e);
		
		if(prev_container){
			if(this.newElementPosition){
				if(this.newElementPosition.container !== prev_container){
					prev_container.classList.remove(this.hovering_class);
				}
			}else{
				prev_container.classList.remove(this.hovering_class);
			}
		}
		
		if(this.newElementPosition && this.hovering_class){
			this.newElementPosition.container.classList.add(this.hovering_class);
		}
		if(this.placeholder){
			if(this.newElementPosition){
				this.newElementPosition.ele.insertAdjacentElement(this.newElementPosition.pos, this.placeholder);
			}else{
				this.placeholder.remove();
			}
		}
	}
	
	/**
	 * Calculate mouse offset.
	 * @ignore
	 */
	calculateMouseOffset(e){
		var rect = this.element.getBoundingClientRect();
		var x = e.pageX - (rect.left + scrollX); //x position within the element.
		var y = e.pageY - (rect.top + scrollY);
		this.mouseOffset = {x, y};
	}
	
	/**
	 * Clone the main element.
	 * @ignore
	 */
	cloneElement(){
		const getRealStyle = (element, style) => {
			var computedStyle = typeof element.currentStyle === 'undefined' ? 
				document.defaultView.getComputedStyle(element, null) :
				element.currentStyle ;
			return style ? computedStyle[style] : computedStyle;
		};
		
		const copyComputedStyle = (src, dest) => {
			var s = getRealStyle(src);
			for (var i in s) {
				if (typeof i === "string" && i !== "cssText" && !/\d/.test(i)) {
					try {
						dest.style[i] = s[i];
						// `fontSize` comes before `font` If `font` is empty, `fontSize` gets
						// overwritten.  So make sure to reset this property. (hackyhackhack)
						// Other properties may need similar treatment
						if (i == "font") {
							dest.style.fontSize = s.fontSize;
						}
					} catch (e) {}
				}
			}
		};
		
		var clone = this.element.cloneNode(true);
		document.body.append(clone);
		
		copyComputedStyle(this.element, clone);
		
		const srcElements = this.element.getElementsByTagName('*');
		const dstElements = clone.getElementsByTagName('*');
		
		for (let i = srcElements.length; i--;) {
			const srcElement = srcElements[i];
			const dstElement = dstElements[i];
			copyComputedStyle(srcElement, dstElement);
		}
		
		var pos = this.element.getBoundingClientRect();
		this.currentAbsPos = {
			x:pos.left + scrollX, 
			y:pos.top + scrollY
		};
		
		clone.style.position = 'absolute';
		clone.style.top = this.currentAbsPos.y+"px";
		clone.style.left = this.currentAbsPos.x+"px";
		
		var bb = this.element.getBoundingClientRect();
		clone.style.width = bb.width+'px';
		
		if(this.dragging_class){
			clone.classList.add(this.dragging_class);
		}
		
		return clone;
	}
	
}

/**
 * Convenience class for handling groups of draggables
 * @see https://pamblam.github.io/ez-drag-n-drop/examples/
 */
class EZDnD_Group{
	
	/**
	 * Greate a group of draggable elements
	 * @param {String} [options.element_selectors] - CSS Selector representing all draggable elements.
	 * @param {String} [options.anchor_selectors] - CSS Selector representing handles in each of the draggable elements. If none provided the entire element becomes a handle.
	 * @param {String} [options.container_selectors] - CSS Selector representing all areas in which elements may be dropped. If not provided, each element is movable only within their immediate ancestor.
	 * @param {HTMLElement} [options.placeholder] - If provided, serves as a placeholder to show where a dropped element will land.
	 * @param {String} [options.dragging_class] - If provided this class will be added to any elements as they are being dragged.
	 * @param {String} [options.hovering_class] - If provided this class will be added to any containers as they are being hovered over with a dragged element.
	 * @returns {EZDnD_Group}
	 */
	constructor(options){	
		this.draggables = [];
		const containers = options.container_selectors ? [...document.querySelectorAll(options.container_selectors)] : undefined;
		var dragging_class = options.dragging_class || undefined;
		var hovering_class = options.hovering_class || undefined;
		[...document.querySelectorAll(options.element_selectors)].forEach(element=>{
			const anchor = options.anchor_selectors ? element.querySelector(options.anchor_selectors) : undefined;
			const placeholder = options.placeholder || undefined;
			this.draggables.push(new EZDnD_Draggable({
				element, anchor, containers, placeholder, dragging_class, hovering_class
			}));
		});
	}
	
	/**
	 * Unbinds all events and resets the DOM so that the instance can be garbage collected. Synonym for unbind();
	 * @returns {undefined}
	 */
	destroy(){
		this.unbind();
	}
	
	/**
	 * Unbinds all events and resets the DOM so that the instance can be garbage collected. Synonym for destroy();
	 * @returns {undefined}
	 */
	unbind(){
		this.draggables.forEach(draggable=>draggable.unbind());
	}
	
	/**
	 * Re-binds all events after an instance has been unbound.
	 * @returns {undefined}
	 */
	bind(){
		this.draggables.forEach(draggable=>draggable.bind());
	}
	
}

