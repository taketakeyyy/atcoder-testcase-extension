$(function () {
    const url = location.href;
    const isBeta = url.search("beta") >= 0;
    const contestName = getContestName();
    const cacheDataKey = "atcoder-testcase-" + contestName;
    const cacheFetchedAtKey = "atcoder-test-case-last-fetched-at-" + contestName;
    const cacheMin = 10;

    function onSuccess(data) {
        if (data.status != "success") return;
        localStorage.setItem(cacheDataKey, JSON.stringify(data));

        var problemId = getProbremId();
        var content = JSON.parse(data.content);
        draw(content[problemId].in, content[problemId].out);
    }

    function draw(inUrl, outUrl) {
        if (!inUrl || !outUrl) return;

        $("table:eq(2) tr:gt(0) td:nth-child(1)").each(function () {
            var fileName = $(this).text();
            var inFile = fileName;
            var outFile = fileName;
            if (fileName.indexOf(".txt") == -1) {
                inFile += ".in";
                outFile += ".out";
            }
            $(this).append(" [ <a href='" + inUrl + "?preview=" + inFile + "'>in</a> / <a href='" + outUrl + "?preview=" + outFile + "'>out</a> ]");
        });
    }

    function getContestName() {
        return isBeta ? url.split("/")[4] : url.split("/")[2].split(".")[0];
    }

    function getProbremId() {
        return $("td a").first().text().slice(0, 1).toUpperCase();
    }

    function main() {
        if (contestName.indexOf("abc") == -1 && contestName.indexOf("arc") == -1 && contestName.indexOf("agc") == -1) return;

        const data = localStorage.getItem(cacheDataKey);
        const lastFetchedAt = localStorage.getItem(cacheFetchedAtKey);
        if (data && lastFetchedAt && new Date().getTime() < Number(lastFetchedAt) + cacheMin * 60 * 1000) {
            onSuccess(JSON.parse(data));
            return;
        }

        $.ajax({
            url: "https://script.google.com/macros/s/AKfycbyUlYoF05ux7M1jBRnXwYkV9SjJIL9MNlHbWiB_eFiE93_91Hs/exec?contest=" + contestName,
            dataType: "json",
            type: "get",
            success: onSuccess
        });
        localStorage.setItem(cacheFetchedAtKey, new Date().getTime().toString());
    }

    main();
});