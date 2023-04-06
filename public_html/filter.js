
let canvas = null;
let ctx = null;
let width = 100;
let height = 100;
let originalImage = null;
let offscreenCanvas;
let offscreenCanvasCtx;
let newRotationDegrees = null;
let imageData = null;
let data = null;
//let currentImageIndex = 0;
//let imageWidth = 100
//let imageHeight = 100
let originalimageX = 250
let originalimageY = 250
let brightnessFactor = 3; /* A higher brightnessFactor value will make the image brighter */
let embossConvolutionMatrix = [0, 0, 0,
    0, 2, -1,
    0, -1, 0];

let blurConvolutionMatrix = [1, 2, 1,
    2, 4, 2,
    1, 2, 1];

let sharpenConvolutionMatrix = [0, -2, 0,
    -2, 11, -2,
    0, -2, 0];

let edgeDetectionConvolutionMatrix = [1, 1, 1,
    1, -7, 1,
    1, 1, 1];

let noConvolutionMatrix = [0, 0, 0,
    0, 1, 0,
    0, 0, 0];

let doubleBuffer = null;
let doubleBufferG = null;
let alphaImage = new Image();
alphaImage.src = 'images/overlay.png';
let pictureFrame = new Image();
pictureFrame.src = 'images/frame.png';

//let imageToConvolve = null;
//let imageData = null;

//let originalImageData = null;
//let originalData = null;
let convolvedPixel = null;
let convolutionMatrix = null;

window.onload = onAllAssetsLoaded;
document.write("<div id='loadingMessage'>Loading...</div>");
function onAllAssetsLoaded()
{
    // hide the webpage loading message
    document.getElementById('loadingMessage').style.visibility = "hidden";
    originalImage = document.getElementById('originalImage');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    width = originalImage.clientWidth;
    height = originalImage.clientHeight;
    canvas.width = width;
    canvas.height = height;
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvasCtx = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    //image convolutions
// imageToConvolve = document.getElementById('imageToConvolve');
    doubleBuffer = document.createElement('canvas');
    doubleBufferG = doubleBuffer.getContext('2d');
    width = originalImage.clientWidth;
    height = originalImage.clientHeight;
      doubleBuffer.width = width;
    doubleBuffer.height = height;
    convolutionMatrix = embossConvolutionMatrix; /* select which convolution to use */

    renderCanvas();
    renderCanvas1();
    renderCanvas2();
    renderCanvas3();
    renderCanvas4();
   //    rotate();
}
function renderCanvas()
{
    // draw onto the offscreen canvas
    offscreenCanvasCtx.beginPath();
    offscreenCanvasCtx.fillStyle = "white"; // any colour can be used
    offscreenCanvasCtx.fillRect(70, 100, 260, 200);
    offscreenCanvasCtx.closePath();

    offscreenCanvasCtx.beginPath();
    offscreenCanvasCtx.fillStyle = "pink";
    offscreenCanvasCtx.font = "50px Times Roman";
    offscreenCanvasCtx.fillText("Offscreen", 100, 180);
    offscreenCanvasCtx.fillText("Canvas", 125, 230);
    offscreenCanvasCtx.closePath();

    // draw an image directly onto the screen's canvas
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    // draw the offscreen buffer onto the screen's canvas
    ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
}

function renderCanvas1()
{
    // set the alpha
    ctx.globalAlpha = 0.25;

    // draw an image using the alpha
    ctx.drawImage(originalImage, 0, 0, width, height);

    // reset the alpha
    ctx.globalAlpha = 1.0;

    // draw an image using the reset alpha
    ctx.drawImage(originalImage, width - 100, height - 100, 100, 100);
}

function renderCanvas2()
{
    // draw the original image into the double buffer
    doubleBufferG.drawImage(originalImage, 0, 0, width, height);

    // get the image data (i.e. the pixels) from the double buffer
    imageData = doubleBufferG.getImageData(0, 0, width, height);
    data = imageData.data;

    convolutionAmount = 0;
    for (let j = 0; j < 9; j++)
    {
        convolutionAmount += convolutionMatrix[j];
    }

    imageData = doubleBufferG.getImageData(0, 0, width, height);
    data = imageData.data;


    for (let i = 0; i < data.length; i += 4)
    {
        data[ i + 3] = 255; // alpha

        // apply the convolution for each of red, green and blue
        for (let rgbOffset = 0; rgbOffset < 3; rgbOffset++)
        {
            // get the pixel and its eight sourrounding pixel values from the original image 
            let convolutionPixels = [ data[i + rgbOffset - width * 4 - 4],
                data[i + rgbOffset - width * 4],
                 data[i + rgbOffset - width * 4 + 4],
                 data[i + rgbOffset - 4],
                 data[i + rgbOffset],
                 data[i + rgbOffset + 4],
                 data[i + rgbOffset + width * 4 - 4],
                 data[i + rgbOffset + width * 4],
                 data[i + rgbOffset + width * 4 + 4]];

            // do the convolution
            convolvedPixel = 0;
            for (let j = 0; j < 9; j++)
            {
                convolvedPixel += convolutionPixels[j] * convolutionMatrix[j];
            }

            // place the convolved pixel in the double buffer		 
            if (convolutionMatrix === embossConvolutionMatrix) // embossed is treated differently
            {
                data[i + rgbOffset] = convolvedPixel + 127;
            }
            else
            {
                convolvedPixel /= convolutionAmount;
                data[i + rgbOffset] = convolvedPixel;
            }
        }
    }

    // Draw the imageData onto the canvas
    ctx.putImageData(imageData, 0, 0);
}
function renderCanvas3()
            {
                // 1) define the alpha area   
                ctx.drawImage(alphaImage, 0, 0, width, height);

                // 2) select the alpha composite
                ctx.globalCompositeOperation = 'source-in';

                // 3) draw the original image
                // only the part that overlaps the alpha area will be visible
                ctx.drawImage(originalImage, 0, 0, width, height);

                // draw the picture frame on top of the picture
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(pictureFrame, 0, 0, width, height);
            }
            
            function renderCanvas4()
            {
                // 1) define the alpha area   
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.font = "170px Times Roman";
    ctx.fillText("ASK", 25, 200);
    ctx.closePath();

    // 2) select the alpha composite
    ctx.globalCompositeOperation = 'source-in';

    // 3) draw the original image
    // only the part that overlaps the alpha area will be visible
    ctx.drawImage(originalImage, 0, 0, width, height);
}
       function renderCanvas5()
       {
           ctx.translate((originalImage.x + originalImage.width / 2), (originalImage.y + originalImage.height / 2))
        ctx.rotate(Math.radians(originalImage.rotation))
        ctx.translate(-(originalImage.x+ originalImage.width / 2), -(originalImage.y+ originalImage.height/ 2))
       }

function brightness()
{
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    // Loop through the pixels, turning them grayscale
    for (let i = 0; i < data.length; i += 4)
    {



        grayScale = ((data[i] * brightnessFactor) + (data[i + 1] * brightnessFactor) + (data[i + 2] * brightnessFactor)) / 4;
        // assign the same value to red, green and blue to create grayScale
        data[i] = grayScale;
        data[i + 1] = grayScale;
        data[i + 2] = grayScale;
        data[i + 3] = grayScale;
    }
    ctx.putImageData(imageData, 0, 0);

}
function greyscale()
{
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    // convert to greyscale
    let brightnessFactor = 1;  // we can add a brightness factor to the greyscale
    // Loop through the pixels, turning them into grayscale
    for (let i = 0; i < data.length; i += 4)
    {
        // get the average value
        grayScale = ((data[i] * brightnessFactor) + (data[i + 1] * brightnessFactor) + (data[i + 2] * brightnessFactor)) / 3;
        // assign the same value to red, green and blue to create grayScale
        data[i] = grayScale;
        data[i + 1] = grayScale;
        data[i + 2] = grayScale;
    }

    ctx.putImageData(imageData, 0, 0);
}
function sepia()
{
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    // Loop through the pixels, turning them into sepia
    for (let i = 0; i < data.length; i += 4)
    {
        red = data[i];
        green = data[i + 1];
        blue = data[i + 2];

        data[i] = (red * 0.393) + (green * 0.769) + (blue * 0.189);
        data[i + 1] = (red * 0.349) + (green * 0.686) + (blue * 0.168);
        data[i + 2] = (red * 0.272) + (green * 0.534) + (blue * 0.131);
    }

    ctx.putImageData(imageData, 0, 0);
}
function invert()
{
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    // Loop through the pixels, inverting them
    for (let i = 0; i < data.length; i += 4)
    {
        data[i + 0] = 255 - data[i + 0];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
        data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
}
function posterise()
{
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    // Loop through the pixels, posterising them 
    for (let i = 0; i < data.length; i += 4)
    {
        data[i + 0] = data[i + 0] - data[i + 0] % 64;
        data[i + 1] = data[i + 1] - data[i + 1] % 64;
        data[i + 2] = data[i + 2] - data[i + 2] % 64;
        data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
}
function threshold()
{

    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;


    // Loop through the pixels, performing a threshold on them
    for (let i = 0; i < data.length; i += 4)
    {
        for (let rgb = 0; rgb < 3; rgb++)
        {
            if (data[i + rgb] < 128)
            {
                data[i + rgb] = 0;
            } else
            {
                data[i + rgb] = 255;
            }
        }
        data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
}

function makeDark()
{
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    // Loop through the pixels, posterising them 
    for (let i = 0; i < data.length; i += 4)
    {
        data[i] -= 10;
        data[i + 1] -= 10;
        data[i + 2] -= 10;
        data[i + 3] -= 10;
    }

    ctx.putImageData(imageData, 0, 0);
}
function negative() {

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; //vermell
        data[i + 1] = 255 - data[i + 1]; //verd
        data[i + 2] = 255 - data[i + 2]; //blau
    }
    ctx.putImageData(imageData, 0, 0);
}
function crop()
{
    data.cropSelected();
}



function download()
{
    data.export();
}

function setRotationDegrees(newRotationDegrees)
            {
                originalImage[data].rotation =parseInt(newRotationDegrees)
                renderCanvas5();
            }


//
// function updateBrightnessLevel()
//            {
//                brightnessFactor = document.getElementById("brightness").value
//                renderCanvas();
//                renderCanvas1();
//                renderCanvas2();
//                renderCanvas3();
//                renderCanvas4();
//            }