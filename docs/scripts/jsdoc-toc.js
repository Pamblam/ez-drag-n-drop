(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        closedIcon: '&#x21e2;',
        data: [{"label":"<a href=\"EZDnD_Draggable.html\">EZDnD_Draggable</a>","id":"EZDnD_Draggable","children":[]},{"label":"<a href=\"EZDnD_Group.html\">EZDnD_Group</a>","id":"EZDnD_Group","children":[]}],
        openedIcon: ' &#x21e3;',
        saveState: true,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
