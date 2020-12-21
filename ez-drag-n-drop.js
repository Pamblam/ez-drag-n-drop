/**
 * ez-drag-n-drop - v0.0.5
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
	 * @param {HTMLElement} element - The element that should be draggable.
	 * @param {HTMLElement} anchor - An Element inside the draggable element that is the handle to drag the draggable element.
	 * @param {HTMLElement[]} containers - Array of HTMLElements which draggables may be dropped into, as top level children of these elements. 
	 * @param {HTMLElement|null} placeholder - If provided, serves as a placeholder to show where a dropped element will land.
	 * @returns {EZDnD_Draggable}
	 */
	constructor(element, anchor, containers, placeholder=null){
		this.element = element;
		this.anchor = anchor;
		this.containers = Array.isArray(containers) ? containers : [containers];
		this.placeholder = this.normalizePlaceholderInput(placeholder);
		this.validateClassParameters();
		
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
		if(!this.element.contains(this.anchor)){
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
	getNewElementPosition(){
		var container = null;
		var eleCenter = this.calculateElementCenterPos(this.elementClone);
		
		this.containers.forEach(c=>{
			var {top, left, right, bottom} = c.getBoundingClientRect();
			top += scrollY;
			bottom += scrollY;
			left += scrollX;
			right += scrollX;
			
			const isVerticallyIncontainer = eleCenter.x >= left && eleCenter.x <= right;
			const isHorizontallyInContainer = eleCenter.y >= top && eleCenter.y <= bottom;
			if(isVerticallyIncontainer && isHorizontallyInContainer){
				container = c;
			}
		});
		
		if(!container) return null;
		var children = [...container.children];
		
		// if there are no children
		if(!children.length){
			return {pos: 'afterbegin', ele: container};
		}
		
		// Get the closest element, it's distance, and the position
		var position, element, distance;
		
		children.forEach(child=>{
			var posit = null;
			var pos = this.calculateElementCenterPos(child);
			var d = Math.hypot(pos.x-eleCenter.x, pos.y-eleCenter.y);
			if(eleCenter.y < pos.y){
				// it's above
				posit = 'beforebegin';
			}else if(eleCenter.y > pos.y){
				// it's below
				posit = 'afterend';
			}else if(eleCenter.x > pos.x){
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
		
		return {pos: position, ele: element};
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
		
		this.newElementPosition = this.getNewElementPosition(e);
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
	 * @param {String} element_selectors - CSS Selector representing all draggable elements
	 * @param {String} anchor_selectors - CSS Selector representing handles in each of the draggable elements
	 * @param {String} container_selectors - CSS Selector representing all areas in which elements may be dropped
	 * @param {HTMLElement|null} placeholder - If provided, serves as a placeholder to show where a dropped element will land.
	 * @returns {EZDnD_Group}
	 */
	constructor(element_selectors, anchor_selectors, container_selectors, placeholder=null){
		this.draggables = [];
		const containers = [...document.querySelectorAll(container_selectors)];
		[...document.querySelectorAll(element_selectors)].forEach(element=>{
			const anchor = element.querySelector(anchor_selectors);
			this.draggables.push(new EZDnD_Draggable(element, anchor, containers, placeholder));
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
	
}

