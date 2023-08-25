(function () {
    const ul = document.querySelector("ul");
    const btn = document.querySelector("button");
    let count = 0;
    btn.onclick = function () {
        count++;
        setTimeout(() => {
            console.log("添加li标签： ", count);
        })
        const li = document.createElement("li");
        li.innerHTML = count;
        ul.appendChild(li);
    };

    // 观察器
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            console.log("ul 发生了改变", mutation);
        });
    });

    observer.observe(ul, {
        attributes: true,
        childList: true,
        subtree: true,
    });
})();
