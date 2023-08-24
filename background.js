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

    async function parseTestCase() {
        return chrome.storage.sync.get(
            "testcase"
        );
    }

    function getExpressionWithElementIdentifier(tokens) {
        const start = tokens.findIndex((token) => token.includes('{'));
        const end = tokens.findIndex((token) => token.includes('}'));
        const element_identifier = tokens[start];
        const element_identifier_split = element_identifier.slice(1).split(':');
        let properties = '';
        for (let i = start + 1; i <= end; i++) {
            if (i < end) {
                properties += tokens[i] + ' ';
            } else {
                properties += tokens[i];
            }
        }
        properties = properties.substring(0, properties.length-1);

        return `//${element_identifier_split[0]}[@${element_identifier_split[1]}='${properties}']`;
    }

    function getParametersWithElementIdentifier(tokens) {
        const start = tokens.findIndex((token) => token.includes('}'));
        let parameters = '';
        for (let i = start + 1; i < tokens.length; i++) {
            if (i < tokens.length - 1) {
                parameters += tokens[i] + ' ';
            } else {
                parameters += tokens[i];
            }
        }

        return parameters;
    }

    function getWaitLength(tokens) {
        return tokens[1];
    }

    // EXECUTION
    const state = await parseTestCase();
    const testcase = state.testcase;

    for (const line of byLine(testcase)) {
        const tokens = bySpaces(line);

        switch (tokens[0]) {
            case 'click':
                const click_expr = getExpressionWithElementIdentifier(tokens);
                console.log('Click on', click_expr);
                clickElement(click_expr);
                break;
            case 'enter':
                const enter_expr = getExpressionWithElementIdentifier(tokens);
                console.log('Enter on', enter_expr);
                pressEnterOnElement(enter_expr);
                break;
            case 'input':
                const input_expr = getExpressionWithElementIdentifier(tokens);
                const input_params = getParametersWithElementIdentifier(tokens);
                console.log('Input on', input_expr, 'with', input_params);
                inputTextOnElement(input_expr, input_params);
                break;
            case 'wait':
                const wait_length = getWaitLength(tokens);
                console.log('Wait for', wait_length, 'ms.');
                await waitFor(parseInt(wait_length));
                break;
        }
    }
}

// On Extension click
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: performTest,
    });
});