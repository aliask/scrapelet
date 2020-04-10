/**
 * Submits data to an HTTP endpoint. 
 * 
 * Creates an IFRAME, which bypasses some CSRF protections (rather than an XHR).
 * 
 * @param {string} data Scraped data to send the configured endpoint
 */
function crossDomainPost(data) {

    if(!data) {
        return;
    }

    function makeinput(name, data) {
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = data;
        return input;
    }

    function killifexists(id) {
        let elem = document.querySelector("#" + id);
        if(elem) {
            elem.parentNode.removeChild(elem);
        }
    }

    let uniqueString = "postToMe";

    killifexists(uniqueString);
    let iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.style.position = "fixed";
    iframe.style.top = "10px";
    iframe.style.left = "10px";
    iframe.style.background = "#fff";
    iframe.style.border = 0;
    iframe.style.opacity = 1;
    iframe.style.borderRadius = "10px";
    iframe.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";
    iframe.style.transition = "opacity 1s";
    iframe.style.zIndex = 1000;
    iframe.contentWindow.name = uniqueString;
    iframe.id = uniqueString;
    window.setTimeout(function() {
        iframe.style.opacity = 0;
    }, 15000);

    let formID = uniqueString + "_form";
    killifexists(formID);
    let form = document.createElement("form");
    form.target = uniqueString;
    form.id = formID;
    form.action = config.action;
    form.method = config.method;

    form.appendChild(makeinput("from", window.location.href));
    form.appendChild(makeinput("scrapeData", data));

    for (const [key, value] of Object.entries(config.extraParams)) {
        form.appendChild(makeinput(key, value));
    }

    document.body.appendChild(form);
    form.submit();
}

/**
 * Returns the currently selected page elements as HTML markup
 * 
 * @return {string}    HTML of selected elements
 */
function getSelectionHTML() {
    let html = "";
    if (typeof window.getSelection != "undefined") {
        let sel = window.getSelection();
        if (sel.rangeCount) {
            let container = document.createElement("div");
            for (let i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

/**
 * Finds data to send and calls crossDomainPost on the found data.
 * 
 * Data to send is selected in the following order:
 *   1. Page selection
 *   2. Configured CSS selector
 *   3. Manually input CSS selector
 */
function collectData() {

    let html = getSelectionHTML();
    if(html) {
        console.log("Sending selection");
        crossDomainPost(html);
    } else {
        let selector = config.defaultSelector || prompt("Enter the CSS selector of the item to scrape", "body");
        let infoBanner = document.querySelector(selector);
        if(infoBanner) {
            console.log("Sending element:", infoBanner);
            html = infoBanner.innerHTML;
            crossDomainPost(html);
        } else {
            let message = `Couldn't find '${selector}' element, and nothing selected to send`;
            console.error(message);
            alert(message);
        }
    }

}

collectData();
