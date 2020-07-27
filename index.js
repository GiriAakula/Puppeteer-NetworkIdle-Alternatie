const waitForNetworkIdle = (page, timeToIdle, urlToMatch) => {
    page.on('request', (res) => onRequestStarted(res.url()));
    page.on('requestfinished', (res) => onRequestFinished(res.url()));
    page.on('requestfailed', (res) => onRequestFinished(res.url()));

    let inflight = 0;
    let fulfill;
    let promise = new Promise(x => fulfill = x);
    let timeoutId = setTimeout(onTimeoutDone, timeToIdle);
    return promise;

    function onTimeoutDone() {
        page.removeListener('request', onRequestStarted);
        page.removeListener('requestfinished', onRequestFinished);
        page.removeListener('requestfailed', onRequestFinished);
        fulfill();
    }

    function onRequestStarted(request) {
        if(request.includes(`${urlToMatch}`)) {
            ++inflight;
            if(timeoutId){
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        }
                                        
    }

    function onRequestFinished(request) {
        if(request.includes(`${urlToMatch}`)) {
            if(inflight === 0){
                return;
            }
            --inflight;
            if(inflight === 0) {
            timeoutId = setTimeout(onTimeoutDone, timeToIdle);
            }
        }                 
            
      }
}

module.exports = waitForNetworkIdle;