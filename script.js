const urlStr = 'https://poshmark.com/category/Women-Accessories-Gloves_&_Mittens';

async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true, active: true
    });

    return tabs[0];
}

const sanitizeUrl = (url) => url.split('?')[0];

const setIcon = async (state = true) => {
    chrome.action.setIcon({path: `assets/${state ? 'green' : 'red'}-32.png`, tabId: await getActiveTabURL().id});
}

const createDataInfoElemFunc = ({parentElem, innerText}) => {
    const elem = document.createElement("div");
    elem.innerText = innerText;
    elem.className = 'data_elem';

    parentElem.appendChild(elem);
};

const getEmptyDataElem = () => {
    const dataElem = document.getElementById('data');
    dataElem.innerHTML = '';
    return dataElem
};

const displayAnalyze = async ({productsLength, productsMax, productsMin, productsAverage}) => {
    const isValid = productsLength ?? productsMax ?? productsMin ?? productsAverage;
    if (!isValid) return displayErr({innerText: 'Something went wrong with data. Refresh the page and try again later.'})
    const analyzeBtn = document.getElementById("analyze");
    analyzeBtn.innerText = 'Analyze again';

    const dataElem = getEmptyDataElem();

    createDataInfoElemFunc({parentElem: dataElem, innerText: `${productsLength} items on page`})
    createDataInfoElemFunc({parentElem: dataElem, innerText: `$${productsAverage} average price`})
    createDataInfoElemFunc({parentElem: dataElem, innerText: `${productsMax} max price`})
    createDataInfoElemFunc({parentElem: dataElem, innerText: `${productsMin} min price`})

    setIcon();
};

const displayErr = ({innerText = 'Wrong url address'}) => {
    const dataElem = getEmptyDataElem();
    createDataInfoElemFunc({parentElem: dataElem, innerText})
}

const messageCallback = (res) => res?.err ? displayErr() : displayAnalyze(res)


const analyzeBtn = document.getElementById("analyze");
analyzeBtn.addEventListener("click", async (e) => {
    const activeTab = await getActiveTabURL();

    const currentUrl = sanitizeUrl(activeTab?.url);
    if (currentUrl !== urlStr) return displayErr({})

    chrome.tabs.sendMessage(activeTab.id, {tabId: activeTab.id, tabUrl: activeTab.url}, messageCallback);
});

document.addEventListener("DOMContentLoaded", () => {
    setIcon(false);
});