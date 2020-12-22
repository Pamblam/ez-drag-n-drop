
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

