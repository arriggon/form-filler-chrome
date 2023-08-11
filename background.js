function performTest() {
    // CONSTANTS
    const clickEvent = new Event('click');

    // FUNCTION DEFINITIONS
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // EXECUTION
    getElementByXpath("//input[@value='Google Search']").dispatchEvent(clickEvent);
}

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: performTest,
    });
});