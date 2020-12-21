
/**
 * Convenience class for handling groups of draggables
 * @see https://pamblam.github.io/ez-drag-n-drop/examples/
 * @version {{ VERSION }}
 */
class EZDnD_Group{
	
	/**
	 * Greate a group of draggable elements
	 * @param {String} element_selectors - CSS Selector representing all draggable elements
	 * @param {String} anchor_selectors - CSS Selector representing handles in each of the draggable elements
	 * @param {String} container_selectors - CSS Selector representing all areas in which elements may be dropped
	 * @param {HTM String|HTMLElement|null} placeholder - If provided, serves as a placeholder to show where a dropped element will land.
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

