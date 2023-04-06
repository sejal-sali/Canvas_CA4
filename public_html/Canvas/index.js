window.onload = function() {

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    $("#file").change(function(e){      // it draws the file in the canvas
        img = new Image;  // para ficar acessível
        img.onload = function() {
            context.drawImage(img, 0, 0);     // cria um novo image object e desenha no  canvas
        }
        img.src = URL.createObjectURL(e.target.files[0]);    // set the new image object source in the canvas
    })

    $(".image-container img").click(function(e){

        let id = $(this).attr("id");  // mesmo da imagem
        $("#hidden").attr("src", "images/" + id + ".png");

        //clipping code
        img1 = document.getElementById("hidden");

        //resetting canvas
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //clip
        context.globalCompositeOperation = 'source-in';
        context.drawImage(img1, 0, 0);
        context.drawImage(img, 0, 0);
        context.globalCompositeOperation='source-over';
    })
}