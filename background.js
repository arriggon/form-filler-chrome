let active = false;

function reddenPage(color) {
    document.body.style.backgroundColor = color;
}

chrome.action.onClicked.addListener((tab) => {
    active = !active;

    let color = active ? 'red' : 'white';

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: reddenPage,
        args: [ color ]
    });
});