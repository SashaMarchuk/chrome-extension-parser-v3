const arrSum = arr => arr.reduce((a, b) => a + b, 0);

(() => {
    chrome.runtime.onMessage.addListener(({tabId, tabUrl}, sender, response) => {
        const products = document.getElementsByClassName('card');
        const priceArr = Array.from(products).map((product) => (parseInt(product.children[1].children[0].children[1].children[0].children[0].innerText.replaceAll('$', ''))))

        const productsSum = arrSum(priceArr);
        const productsLength = products.length;
        const productsMax = Math.max(...priceArr);
        const productsMin = Math.min(...priceArr);
        const productsAverage = (productsSum / productsLength).toFixed(2);

        return response({
            productsLength, productsMax, productsMin, productsAverage,
        });
    });
})();