import joplin from 'api';
import { ContentScriptType } from 'api/types';

const contentScriptId = "joplin-plugin-tag-links"

const escape = document.createElement('textarea');

function escapeHtml(html) {
    escape.textContent = html;
    return escape.innerHTML;
}

async function onMessage(message:any ) {
    if (message.type === "renderTags") {
        const activeNote = await joplin.workspace.selectedNote();
        const tags = await joplin.data.get(["notes", activeNote.id, "tags"])
        const links = tags.items.map( (item) => {
            const js = `onclick="webviewApi.postMessage('${contentScriptId}', {type:'openTag', tagId:'${item.id}'});return false;"`
            const title = escapeHtml(item.title)
            return `<a class="joplinTagLinksLink" href="#" ${js}>${title}</a>`
        })
        return `<div>${links.join("\n")}</div>`
    } else if (message.type == "openTag") {			
        joplin.commands.execute("openTag", message.tagId)
    }
}

joplin.plugins.register({
    onStart: async function() {

        await joplin.contentScripts.register(
            ContentScriptType.MarkdownItPlugin,
            contentScriptId,
            './markdownplugin.js'
        );

        await joplin.contentScripts.onMessage(contentScriptId, onMessage)
    },
});
