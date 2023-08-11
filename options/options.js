const saveOptions = () => {
    const testcase = document.getElementById('testcaseArea').value;

    chrome.storage.sync.set(
        {testcase},
        () => {
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        }
    );
};

const restoreOptions = () => {
    chrome.storage.sync.get(
        { testcase: '!! Enter your testcase here' },
        (items) => {
            document.getElementById('testcaseArea').value = items.testcase;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);