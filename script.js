document.getElementById("algo").addEventListener("change", function () {
    const algo = this.value;
    document.getElementById("directionDiv").style.display =
        ["scan", "look", "cscan", "clook"].includes(algo) ? "block" : "none";
});

let globalOrder = []; 
let animationIndex = 0;
let animationInterval = null;

function compute() {
    const requests = document.getElementById("requests").value.trim().split(" ").map(Number);
    let head = parseInt(document.getElementById("head").value);
    const tracks = parseInt(document.getElementById("tracks").value);
    const algo = document.getElementById("algo").value;
    const direction = document.getElementById("direction").value;

    if (!requests.length || isNaN(head) || isNaN(tracks)) {
        alert("Please fill all fields correctly.");
        return;
    }

    for (let r of requests) {
        if (r < 0 || r >= tracks) {
            alert("Request " + r + " is out of range!");
            return;
        }
    }

    let order = [];
    let seekTime = 0;

    switch (algo) {
        case "fcfs":
            order = [head, ...requests];
            for (let i = 0; i < order.length - 1; i++) {
                seekTime += Math.abs(order[i] - order[i + 1]);
            }
            break;

        case "sstf":
            let tempReq = [...requests];
            let current = head;
            order.push(current);
            while (tempReq.length > 0) {
                let nearest = tempReq.reduce((a, b) =>
                    Math.abs(b - current) < Math.abs(a - current) ? b : a
                );
                seekTime += Math.abs(current - nearest);
                current = nearest;
                order.push(current);
                tempReq.splice(tempReq.indexOf(nearest), 1);
            }
            break;

        case "scan":
        case "cscan":
        case "look":
        case "clook":
            order = computeScanLook(head, requests, tracks, algo, direction);
            for (let i = 0; i < order.length - 1; i++) {
                seekTime += Math.abs(order[i] - order[i + 1]);
            }
            break;
    }

    document.getElementById("order").innerText = order.join(" → ");
    document.getElementById("seekTime").innerText = seekTime;

    const avgSeek = seekTime / (order.length - 1);
    document.getElementById("avgSeekTime").innerText = avgSeek.toFixed(2);

    drawGraph(order);

    globalOrder = order;
    resetAnimation();
}

function computeScanLook(head, requests, tracks, algo, direction) {
    let up = direction === "up";
    let left = requests.filter(r => r < head).sort((a, b) => b - a);
    let right = requests.filter(r => r >= head).sort((a, b) => a - b);
    let order = [head];

    if (algo === "scan") {
        if (up) order.push(...right, tracks - 1, ...left);
        else order.push(...left, 0, ...right);
    }
    else if (algo === "cscan") {
        if (up) order.push(...right, tracks - 1, 0, ...left);
        else order.push(...left, 0, tracks - 1, ...right);
    }
    else if (algo === "look") {
        if (up) order.push(...right, ...left);
        else order.push(...left, ...right);
    }
    else if (algo === "clook") {
        if (up) order.push(...right, ...left);
        else order.push(...left, ...right);
    }

    return order;
}

function drawGraph(order) {
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxTrack = Math.max(...order);
    const minTrack = Math.min(...order);
    const padding = 50;
    const scaleX = (canvas.width - 2 * padding) / (order.length - 1);
    const scaleY = (canvas.height - 2 * padding) / (maxTrack - minTrack || 1);

    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding - (order[0] - minTrack) * scaleY);

    for (let i = 1; i < order.length; i++) {
        ctx.lineTo(padding + i * scaleX, canvas.height - padding - (order[i] - minTrack) * scaleY);
    }
    ctx.strokeStyle = "#0984e3";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#d63031";
    for (let i = 0; i < order.length; i++) {
        ctx.beginPath();
        ctx.arc(padding + i * scaleX,
                canvas.height - padding - (order[i] - minTrack) * scaleY,
                5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function startAnimation() {
    if (!globalOrder.length) return;

    const canvas = document.getElementById("animationCanvas");
    const ctx = canvas.getContext("2d");

    const maxTrack = Math.max(...globalOrder);
    const minTrack = Math.min(...globalOrder);
    const padding = 50;
    const scaleX = (canvas.width - 2 * padding) / (globalOrder.length - 1);
    const scaleY = (canvas.height - 2 * padding) / (maxTrack - minTrack || 1);

    clearInterval(animationInterval);

    animationInterval = setInterval(() => {
        if (animationIndex >= globalOrder.length - 1) {
            clearInterval(animationInterval);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let x1 = padding + animationIndex * scaleX;
        let y1 = canvas.height - padding - (globalOrder[animationIndex] - minTrack) * scaleY;

        let x2 = padding + (animationIndex + 1) * scaleX;
        let y2 = canvas.height - padding - (globalOrder[animationIndex + 1] - minTrack) * scaleY;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#6c5ce7";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x2, y2, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#ff4757";
        ctx.fill();

        animationIndex++;

    }, document.getElementById("speedSlider").value);
}

function pauseAnimation() {
    clearInterval(animationInterval);
}

function resetAnimation() {
    clearInterval(animationInterval);
    animationIndex = 0;

    const canvas = document.getElementById("animationCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
