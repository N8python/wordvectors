const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const points = [];
//const vecs = Object.values(wordVecs);
/*let mads = [];
for (let i = 0; i < 300; i++) {
    const mean = vecs.map(vec => vec[i]).reduce((t, v) => t + v) / vecs.length;
    const dists = vecs.map(vec => Math.abs(vec[i] - mean));
    mads.push([i, dists.reduce((t, v) => t + v) / dists.length]);
}
const bestIndex = mads.reduce((t, v) => (v[1] > t[1]) ? v : t)[0];
const secondBestIndex = mads.reduce((t, v) => (v[1] > t[1] && v[0] !== bestIndex) ? v : t)[0];
Object.entries(wordVecs).forEach(([word, vec]) => {
    points.push({ x: vec[bestIndex], y: vec[secondBestIndex], tip: word });
})*/
/*var tsne = new tsnejs.tSNE({
    epsilon: 10,
    perplexity: 30,
    dim: 2
}); // create a tSNE instance
tsne.initDataRaw(vecs);
for (var k = 0; k < 500; k++) {
    tsne.step(); // every time you call this, solution gets better
}
const Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot*/
async function main() {
    const vecJson = await fetch("vecs.json");
    const vecs = await vecJson.json();
    vecs.forEach(([x, y], i) => {
        points.push({ x, y, tip: Object.keys(wordVecs)[i] })
    })
    const getLabel = (tooltipItem, datasets) => {
        return datasets[tooltipItem.datasetIndex].data.find(datum => {
            return datum.x === tooltipItem.xLabel && datum.y === tooltipItem.yLabel;
        }).tip;
    }
    var scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Words',
                data: points
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            },
            tooltips: {
                callbacks: {
                    label(tooltipItem, data) {
                        return getLabel(tooltipItem, data.datasets)
                    }
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
                    zoom: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            },
        },
    });
}
main();
const wordInput = document.getElementById("searchWord");
const wordOutput = document.getElementById("nearestWordRes");
document.getElementById("nearestWords").onclick = () => {
    const word = wordInput.value;
    let html = "";
    if (wordVecs[word]) {
        const nearestWords = w2v.getNClosestMatches(6, wordVecs[word]);
        nearestWords.slice(1).forEach(([word], i) => {

            html += `<p>${i+1}. ${word}</p>`;
        });
    } else {
        html = "That word is not in the loaded 1000 words."
    }
    wordOutput.innerHTML = `
    <div class="w3-animate-left">
        ${html}
    </div>
    `
}