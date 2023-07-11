var canvas;
var canvasWidth;
var ctx;
var x;
var y;
var scaletext;

var imagepostext
var download;
var xscale;
var yscale;
var fileInput;
var img;
var villagerimage;


var format;
var namePositionX;
var namePositionY;
var nameScale;

var imagePositionX;
var imagePositionY;
var villagerImageScale;

var bgOrientation;

// THIS FUNCTION FROM https://fjolt.com/article/html-canvas-how-to-wrap-text
// @description: wrapText wraps HTML canvas text onto a canvas of fixed width
// @param ctx - the context for the canvas we want to wrap text on
// @param text - the text we want to wrap.
// @param x - the X starting point of the text on the canvas.
// @param y - the Y starting point of the text on the canvas.
// @param maxWidth - the width at which we want line breaks to begin - i.e. the maximum width of the canvas.
// @param lineHeight - the height of each line, so we can space them below each other.
// @returns an array of [ lineText, x, y ] for all lines
const wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words = text.split(' ');
    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for(var n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]} `;
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
            // Then the line is finished, push the current line into "lineArray"
            lineArray.push([line, x, y]);
            // Increase the line height, so a new line is started
            y += lineHeight;
            // Update line and test line to use this word as the first word on the next line
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        }
        else {
            // If the test line is still less than the max width, then add the word to the current line
            line += `${words[n]} `;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if(n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    // Return the line array
    return lineArray;
}


window.onload = function() {
    var deviceWidth = window.innerWidth;

    canvas = document.getElementById('vccanvas');
    ctx = canvas.getContext('2d');

    canvas.width = 1200;
    canvas.height = 600;

    format = "horizontal";
    nameScale = 100;
    namePositionX = 0;
    namePositionY = 0;
    villagerImageScale = 80;
    imagePositionX = 0;
    imagePositionY = 0;

    document.querySelector('#imgposx').value = 0.30;
    document.querySelector('#imgposy').value = 0.62;

    document.querySelector('#nameposx').value = 1;
    document.querySelector('#nameposy').value = 0.19;

    /** EVENT HANDLERS */

    // Close info box button handler
    document.querySelector('.flash-action').onclick = (e) => {
        e.preventDefault();
        document.querySelector('.flash-warn').style.display = 'none';
    }

    // Horizontal selector button
    document.querySelector('.horizontal-button').onclick = (e) => {
        e.preventDefault();
        format = "horizontal";
        document.querySelector('.horizontal-button').setAttribute('aria-selected', 'true');
        document.querySelector('.vertical-button').removeAttribute('aria-selected');
        document.querySelectorAll('.vertical').forEach((match) => {
            match.style.display = 'none';
        });
        document.querySelectorAll('.horizontal').forEach((match) => {
            match.style.display = 'block';
        });

        canvas.width = 1200;
        canvas.height = 600;

        document.querySelector('#imgposx').value = 0.30;
        document.querySelector('#imgposy').value = 0.62;

        document.querySelector('#nameposx').value = 1;
        document.querySelector('#nameposy').value = 0.19;

        villagerImageScale = 80;
        document.querySelector('.scaletext-image').value = 80;

        updateCanvas();
    }

    // Vertical selector button
    document.querySelector('.vertical-button').onclick = (e) => {
        e.preventDefault();
        format = "vertical";
        document.querySelector('.vertical-button').setAttribute('aria-selected', 'true');
        document.querySelector('.horizontal-button').removeAttribute('aria-selected');
        document.querySelectorAll('.vertical').forEach((match) => {
            match.style.display = 'block';
        });
        document.querySelectorAll('.horizontal').forEach((match) => {
            match.style.display = 'none';
        });

        canvas.width = 864;
        canvas.height = 1080;

        bgOrientation = "left"

        document.querySelector('#imgposx').value = 0.30;
        document.querySelector('#imgposy').value = 0.24;

        document.querySelector('#nameposx').value = 0.75;
        document.querySelector('#nameposy').value = 0.75;

        villagerImageScale = 100;
        document.querySelector('.scaletext-image').value = 100;

        updateCanvas();
    }

    // BG image selector
    document.querySelector('.bgselect').onchange = (e) => {
        updateCanvas();
    }

    // BG left/right buttons
    document.querySelector('.bgorientation-left').onclick = (e) => {
        e.preventDefault();
        bgOrientation = "left";
        document.querySelector('#imgposx').value = 0.30;
        document.querySelector('#imgposy').value = 0.24;
        document.querySelector('#nameposx').value = 0.75;
        document.querySelector('#nameposy').value = 0.75;
        updateCanvas();
    }

    document.querySelector('.bgorientation-right').onclick = (e) => {
        e.preventDefault();
        bgOrientation = "right";
        document.querySelector('#imgposx').value = 0.70;
        document.querySelector('#imgposy').value = 0.24;
        document.querySelector('#nameposx').value = 0.25;
        document.querySelector('#nameposy').value = 0.75;
        updateCanvas();
    }

    // File input
    document.querySelector('#fileInput').onchange = (e) => {
        var reader = new FileReader();
        reader.onload = function(event){
            img = document.getElementById('villagerimage');
            img2 = document.getElementById('villagerimage2');
            img.onload = function(){
                updateCanvas();
            }
            img.src = reader.result;
            img2.src = reader.result;
            }
        reader.readAsDataURL(e.target.files[0]);     
    };

    // Name Text Update
    document.querySelector('#villagername').onchange = (e) => {
        updateCanvas();
    }

    // Name Size Adjust
    document.querySelector('.name-plus').onclick = (e) => {
        nameScale = parseInt(nameScale) + 1;
        document.querySelector('.scaletext-name').value = nameScale;
        updateCanvas();
    }

    document.querySelector('.name-minus').onclick = (e) => {
        nameScale = parseInt(nameScale) - 1;
        document.querySelector('.scaletext-name').value = nameScale;
        updateCanvas();
    }

    document.querySelector('.scaletext-name').onchange= (e) => {
        nameScale = document.querySelector('.scaletext-name').value;
        updateCanvas();
    }

    // Name Position Adjust
    document.querySelector('#nameposx').onchange = (e) => {
        console.log(document.querySelector('#nameposx').value);
        updateCanvas();
    }
    document.querySelector('#nameposy').onchange = (e) => {
        console.log(document.querySelector('#nameposy').value);
        updateCanvas();
    }
    document.querySelector('.name-down').onclick = (e) => {
        namePositionY += 4;
        updateCanvas();
    }

    document.querySelector('.name-up').onclick = (e) => {
        namePositionY -= 4;
        updateCanvas();
    }
    
    document.querySelector('.name-right').onclick = (e) => {
        namePositionX += 4;
        updateCanvas();
    }

    document.querySelector('.name-left').onclick = (e) => {
        namePositionX -= 4;
        updateCanvas();
    }

    // Image Size Adjust
    document.querySelector('.image-plus').onclick = (e) => {
        villagerImageScale = parseInt(villagerImageScale) + 1;
        document.querySelector('.scaletext-image').value = villagerImageScale;
        updateCanvas();
    }

    document.querySelector('.image-minus').onclick = (e) => {
        villagerImageScale = parseInt(villagerImageScale) - 1;
        document.querySelector('.scaletext-image').value = villagerImageScale;
        updateCanvas();
    }
    document.querySelector('.scaletext-image').onchange= (e) => {
        villagerImageScale = document.querySelector('.scaletext-image').value;
        updateCanvas();
    }

    // Image Position Adjust
    document.querySelector('#imgposx').onchange = (e) => {
        updateCanvas();
    }
    document.querySelector('#imgposy').onchange = (e) => {
        updateCanvas();
    }
    document.querySelector('.image-down').onclick = (e) => {
        imagePositionY += 4;
        updateCanvas();
    }

    document.querySelector('.image-up').onclick = (e) => {
        imagePositionY -= 4;
        updateCanvas();
    }
    
    document.querySelector('.image-right').onclick = (e) => {
        imagePositionX += 4;
        updateCanvas();
    }

    document.querySelector('.image-left').onclick = (e) => {
        imagePositionX -= 4;
        updateCanvas();
    }

    // Villager Info Text Update
    document.querySelector('#subtitle').onchange = (e) => {
        updateCanvas();
    }
    document.querySelector('#villagerage').onchange = (e) => {
        updateCanvas();
    }   
    document.querySelector('#line1').onchange = (e) => {
        updateCanvas();
    }   
    document.querySelector('#line2').onchange = (e) => {
        updateCanvas();
    }   
    document.querySelector('#line3').onchange = (e) => {
        updateCanvas();
    }   
    document.querySelector('#line4').onchange = (e) => {
        updateCanvas();
    }   
    document.querySelector('#quote').onchange = (e) => {
        updateCanvas();
    }  

    download = document.getElementById('img-download');
    download.addEventListener('click', prepareDownload, false);

    updateCanvas();
}

function prepareDownload() {
    var link = document.getElementById('downloadlink');
    link.setAttribute('download', 'VillagerCard.png');
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
}

function drawBackground() {
    if(format == "horizontal") {
        img = document.getElementById('vcbackground');
    } else {
        if (bgOrientation == "left") {
            img = document.getElementById('vcbackground-left');
        } else {
            img = document.getElementById('vcbackground-right');
        }
        bgoption = document.querySelector('.bgselect').selectedIndex + 1;
        bgimg = document.getElementById('bg' + bgoption);
    }

    x = canvas.width/2 - img.width/2;
    y = canvas.height/2 - img.height/2;

    if(format == "vertical") {
        ctx.drawImage(bgimg, x, y);
    }
    
    ctx.drawImage(img, x, y);
}

function drawVillager() {
    if(format == "horizontal") {
        img = document.getElementById('villagerimage');
    } else {
        img = document.getElementById('villagerimage2');
    }
    if (img.height > img.width) {
        yscale = Math.min((canvas.height), img.height);
        xscale = (yscale/img.height) * img.width;
    } else {
        xscale = Math.min((canvas.width), img.width);
        yscale = (xscale/img.width) * img.height;
    }
    xscale *= (villagerImageScale/100);
    yscale *= (villagerImageScale/100);

    x = (canvas.width * document.querySelector('#imgposx').value) - (xscale / 2) + imagePositionX;
    y = (canvas.height * document.querySelector('#imgposy').value) - (xscale /2) + imagePositionY;
    ctx.drawImage(img, x, y, xscale, yscale);
}

function updateCanvas() {
    // CLEAR CANVAS
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // VILLAGER NAME
    text = document.getElementById('villagername').value;


    if(format == "horizontal") {
        ctx.scale(1 * (nameScale/100), 1.4 * (nameScale/100));
        ctx.textAlign = 'right';
        text = text.toUpperCase();
        ctx.font = 'normal 110pt Algiers';
        ctx.fillStyle = '#00a6d3';

        x = (canvas.width * document.querySelector('#nameposx').value);
        x += namePositionX;
        y = (canvas.height * document.querySelector('#nameposy').value);
        y += namePositionY;
        
        ctx.fillText(text, x, y);
       
    } else {
        ctx.fillStyle = '#594f42';
        fontSize = 38 * (nameScale/100);
        ctx.font = 'bold '+ fontSize + 'pt Merriweather';
        ctx.textAlign = 'center';
        x = (canvas.width * document.querySelector('#nameposx').value);
        x += namePositionX;
        y = (canvas.height * document.querySelector('#nameposy').value);
        y += namePositionY;

        ctx.fillText(text, x, y);

        // line under name
        textLength = ctx.measureText(text).actualBoundingBoxLeft;
        textHeight = ctx.measureText(text).actualBoundingBoxDescent + 10;
        lineStartX = x - textLength;
        lineStartY = y + textHeight;
        console.log(ctx.measureText(text));
        ctx.beginPath();
        ctx.moveTo(lineStartX,  lineStartY);
        ctx.lineTo(x + textLength,  lineStartY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#594f42';
        ctx.stroke();

        subFontSize = fontSize * 0.66;
        ctx.font = 'bold ' + subFontSize + 'pt Merriweather';
        subtitle = document.getElementById('subtitle').value;
        y = lineStartY + (ctx.measureText(subtitle).actualBoundingBoxDescent) + 33;
        ctx.fillText(subtitle, x, y);
    }

    // AGE
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.textAlign = 'left';
    ctx.lineWidth  = 1;
    
    ctx.strokeStyle = '#594f42';
    ctx.fillStyle = '#594f42';

    text = document.getElementById('villagerage').value;

    if(format == "horizontal") {
        ctx.font = '35pt arial';
        x = canvas.width/1.52;
        y = canvas.height - canvas.height/1.798;
    } else {
        ctx.font = 'normal 18pt Merriweather';
        text = "\u2022 Age: " + text;
        x = bgOrientation == "left" ? 460 : 60;
        y = canvas.height - canvas.height/1.96;
    }

    
    ctx.strokeText(text, x, y)
    ctx.fillText(text, x, y);

    // LINES
    bullet = document.getElementById('bulletimage');
    ctx.textAlign = 'left';
    ctx.font = 'normal 18pt Merriweather';
    ctx.strokeStyle = '#594f42';
    ctx.fillStyle = '#594f42';

    text = document.getElementById('line1').value;
    if(text != '') {
        if(format == "horizontal") {
            x = canvas.width/1.64;
            y = canvas.height - canvas.height/2.63;
            ctx.drawImage(bullet, x - 22, y - 18);
        } else {
            x = bgOrientation == "left" ? 460 : 60;
            y = canvas.height - canvas.height/2.1;
            text = "\u2022 " + text;
        }
        
        ctx.fillText(text, x, y);
    }
    text = document.getElementById('line2').value;
    if(text != '') {        
        if(format == "horizontal") {
            x = canvas.width/1.64;
            y = canvas.height - canvas.height/3.1;
            ctx.drawImage(bullet, x - 22, y - 18);
        } else {
            x = bgOrientation == "left" ? 460 : 60;
            y = canvas.height - canvas.height/2.26;
            text = "\u2022 " + text;
        }

        ctx.fillText(text, x, y);
    }
    text = document.getElementById('line3').value;
    if(text != '') {
        if(format == "horizontal") {
            x = canvas.width/1.64;
            y = canvas.height - canvas.height/3.78;
            ctx.drawImage(bullet, x - 22, y - 18);
        } else {
            x = bgOrientation == "left" ? 460 : 60;
            y = canvas.height - canvas.height/2.44;
            text = "\u2022 " + text;
        }

        ctx.fillText(text, x, y);
    }
    if(format == "horizontal") {
        text = document.getElementById('line4').value;
        if(text != '') {
            x = canvas.width/1.64;
            y = canvas.height - canvas.height/4.81;
            
            ctx.drawImage(bullet, x - 22, y - 18);
    
            ctx.fillText(text, x, y);
        }
    }

    if(format == "vertical") {
        ctx.font = 'bold 22pt Merriweather'
        text = document.getElementById('quote').value;
        if(text != '') {
            x = bgOrientation == "left" ? 500 : 100;
            y = 200;
            lines = wrapText(ctx, text, x, y, 344, 40)
            lines.forEach((line, index) => {
                if(index == 0) {
                    line[0] = '"' + line[0];
                }
                if(index == lines.length - 1) {
                    line[0] = line[0].trim() + '"';
                }
                ctx.fillText(line[0], line[1], line[2]);
            });
            
        }
    }

    drawVillager();

    if(format == "vertical") {
        // Add border too
        img = document.getElementById('vborder');
        ctx.drawImage(img, 0, 0, 864, 1080);
    }
}