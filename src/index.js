
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
    form.action = `https://script.google.com/macros/s/${config.scriptId}/exec`;
    form.method = "GET";

    form.appendChild(makeinput("method", "sendDOM"));
    form.appendChild(makeinput("from", window.location.href));
    form.appendChild(makeinput("domData", data));

    document.body.appendChild(form);
    form.submit();
}

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

function collectData() {

    let selector = prompt("Enter CSS selector of Element to scrape");
    let infoBanner = document.querySelector(selector);

    let html = "";
    if(infoBanner) {
        console.log("Reading", infoBanner);
        html = infoBanner.innerHTML;
    } else {
        html = getSelectionHTML();
    }
    
    if(html) {
        console.log("Sending to gsheets...");
        crossDomainPost(html);
    } else {
        console.error("Couldn't find element, and nothing selected to send");
        alert("Couldn't find element, and nothing selected to send");
    }

}

collectData();
