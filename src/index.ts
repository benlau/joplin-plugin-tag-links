import joplin from 'api';
import { ContentScriptType } from 'api/types';

const contentScriptId = "joplin-plugin-tag-links"

async function onMessage(message:any ) {
    if (message.type === "renderTags") {
        const activeNote = await joplin.workspace.selectedNote();
        const tags = await joplin.data.get(["notes", activeNote.id, "tags"])
        const links = tags.items.map( (item) => {
            const js = `onclick="webviewApi.postMessage('${contentScriptId}', {type:'openTag', tagId:'${item.id}'});return false;"`
            return `<a class="joplinTagLinksLink" href="#" ${js}>${item.title}</a>`
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
