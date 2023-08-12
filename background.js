async function performTest() {
    // CONSTANTS
    const clickEvent = new Event('click');
    const pressEnter = new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Enter'
    });

    // ELEMENT INTERACTION DEFINITIONS
    // get an element-node and dispatch a click-event
    function clickElement(element) {
        getElementByXpath(element).dispatchEvent(clickEvent);
    }

    // get an element-node and input text as value
    function inputTextOnElement(element, text) {
        getElementByXpath(element).value = text;
    }

    // get an element-node and press enter
    function pressEnterOnElement(element) {
        getElementByXpath(element).dispatchEvent(pressEnter);
    }

    function waitFor(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    // FUNCTION DEFINITIONS
    // get text split by lines
    function byLine(text) {
        return text.split('\n');
    }

    // get text split by spaces
    function bySpaces(text) {
        return text.split(' ');
    }

    // get element-node on page by xpath
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function parseTestCase() {
        chrome.storage.sync.get(
            "testcase",
            (items) => {
                const testcase = items.testcase;

                byLine(testcase).forEach(line => {
                    const tokens = bySpaces(line);
        
                    switch (tokens[0]) {
                        case 'click':
                            const element = tokens[1].split(':');
                            const expr = '//' + element[0] + '[@' + element[1] + '="' + tokens[2] + '"]';
                            console.log('Click on', expr);
                            break;
                    }
                });
            }
        );
    }

    // EXECUTION
    // inputTextOnElement("//textarea[@aria-label='Search']", "Hello world!");
    // await waitFor(1500);
    // clickElement("//input[@value='Google Search']");
    parseTestCase();
}

// On Extension click
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: performTest,
    });
});