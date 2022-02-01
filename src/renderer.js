const contentScriptId = "joplin-plugin-tag-links"
const containerId = "joplinTagLinksFooter"

async function joplinTagLinksRequestUpdate() {
    webviewApi.postMessage(contentScriptId, {type:'renderTags'}).then(function(response) {
        document.getElementById(containerId).innerHTML=response;
    });
}

document.addEventListener('joplin-noteDidUpdate', () => {
    joplinTagLinksRequestUpdate();
});
