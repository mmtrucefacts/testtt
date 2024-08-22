function getPixelXY(imgData, x, y) {
    var i = (y * imgData.width + x) * 4,
        d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]];
}
function darkness(r, g, b) {
    return Math.round((parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000);
}
function avg(arr) {
    return arr.reduce((a, b) => a + b) / arr.length;
}
var input = document.querySelector('#input'),
    resinput = document.querySelector('#resolution'),
    output = document.querySelector('#output'),
    canvas = document.createElement('canvas'),
    c = canvas.getContext('2d'),
    RESOLUTION;
input.onchange = () => {
    change();
};
resinput.onchange = () => {
    change();
};
function change() {
    RESOLUTION = +resinput.value;
    var image = new Image(),
        t = window.URL.createObjectURL(input.files[0]);
    image.onload = (e) => {
        (canvas.width = image.width), (canvas.height = image.height);
        c.drawImage(image, 0, 0, image.width, image.height);
        window.URL.revokeObjectURL(t);
        var data = c.getImageData(0, 0, canvas.width, canvas.height),
            newpixels = [];
        for (var y = 0; y < canvas.height; y += RESOLUTION) {
            var pixelrow = [];
            for (var x = 0; x < canvas.width; x += RESOLUTION) {
                var darknesses = [];
                for (var i = 0, l = RESOLUTION * RESOLUTION; i < l; i++) {
                    var t = getPixelXY(data, x + (i % RESOLUTION), y + Math.floor(i / RESOLUTION));
                    if (t[0] !== undefined) darknesses.push(darkness(...t));
                }
                pixelrow.push(Math.round(avg(darknesses)));
            }
            newpixels.push(pixelrow);
        }
        output.innerHTML = newpixels
            .map((a) =>
                a
                    .map((a) => {
                        if (a < 25) return '@';
                        else if (a < 50) return '%';
                        else if (a < 75) return '#';
                        else if (a < 100) return '*';
                        else if (a < 125) return '+';
                        else if (a < 150) return '=';
                        else if (a < 175) return '-';
                        else if (a < 200) return ':';
                        else if (a < 225) return '.';
                        else return ' ';
                    })
                    .join('')
            )
            .join('\n');
    };
    image.src = t;
}
function copyText() {
    var txt = document.getElementById('output');
    txt.select();
    txt.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(txt.value);
    alert('Text Copied: ' + txt);
}