
function render_tag_links_block() {
    return `<div id="joplinTagLinksFooter"></div>`
}

function plugin(md) {
    md.renderer.rules.tag_links_block   = render_tag_links_block;

    function tag_link_footnote(state) {            
        let token = new state.Token('tag_links_block', '', 0);    
        state.tokens.push(token);
    }
    md.core.ruler.after('inline', 'tag_link_footnote', tag_link_footnote);
}

function assets() {
    return [
        {
            name: "style.css"
        },
        { 
            name: 'renderer.js' 
        },
    ]
}

module.exports = {
    default: function() {
        return {
            plugin,
            assets
        }
    }
}