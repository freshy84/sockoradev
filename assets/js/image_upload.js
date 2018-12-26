$(document).ready(function(){
    var move_flag = 0;
    var jcrop_api,
    boundx,
    boundy;
    // Grab some information about the preview pane
    if($('.user_pic_class').is(':visible'))
    {
       var $preview = $('#preview-image1'),
        $pcnt = $('#preview-image1 .profile-userpic1'),
        $pimg = $('#preview-image1 .profile-userpic1 img');
    }
    else
    {
      var $preview = $('#preview-image'),
       $pcnt = $('#preview-image .profile-userpic'),
       $pimg = $('#preview-image .profile-userpic img');
    }
    
    var jcrop_flag = 1,
    xsize = $pcnt.width(),
    ysize = $pcnt.height();
    if( $('#default_img').val() != undefined &&  $('#default_img').val() == 0)
    {
        $('#imgbase64').val('');
        $('#imgbase64').val($('#user_profile_iamge').val());
        convertImgToBase64URL($('#imgbase64').val(), function(base64Img){
            $('#imgbase64').val(base64Img);
            setTimeout(function(){
                j_crop();
                jcrop_api.setImage($('#user_profile_iamge').val()); 
                jcrop_api.setSelect([0,160, 160,0]);
                jcrop_api.setOptions({allowSelect:false,minSize: [ 100,100 ]});
            }, 10);            
        });
    }
    $('#file_trriger').on('click',function(){
        $('#image_change').trigger('click');
    })
    $('#image_change').on('change',function(evt){
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        var image  = new Image();
        reader.onload = function (evt)
        {
            if((file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif') )
            {
                if(~~(file.size/1024) <4000)
                {
                    image.src = evt.target.result;
                    image.onload = function() 
                    {
                        
                        var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024);
                        if(w >= 150 && h >= 150)
                        {
                            j_crop();
                            boundx = w;
                            boundy = h;
                            $('#profile_pic').attr('src',image.src);
                            jcrop_api.setImage(image.src); 
                            $('#imgbase64').val(image.src);
                            $('#sideprofileimage').attr('src',image.src);
                            if(window.location.href.indexOf('profile') > -1)
                            {
                                $('#profilepicimg').attr('src',image.src);
                            }
                            $('#con_img').attr('src',image.src);
                            $('#default_img').val('0');
                            jcrop_api.setSelect([0,160, 160,0]);
                            jcrop_api.setOptions({allowSelect:false,minSize: [ 100,100 ]});
                            
                            $('#file_trriger').text('Change');
                            $('#remove_image').show();
                        } else {
                            bootbox.alert("Image must be greater than 150 X 150px", function(answer) {
                              $('#image_change').val('');
                            }); 
                            move_flag = 1;
                            set_one = 0; 
                            return false;
                        }
                        
                    }  
                } else {
                    bootbox.alert("The maximum size for file upload is 4Mb.", function(answer) {
                      $('#image_change').val('');
                    });
                    move_flag = 1;
                    set_one = 0;
                    return false;
                }
                
            } else {
                bootbox.alert("Please upload image only.", function(answer) {
                  $('#image_change').val('');
                });
                move_flag = 1;
                set_one = 0;
                return false;
            }
        };
        reader.readAsDataURL(file);
    });
    
    $('#remove_image').click(function(){
        $('#image_change').val('');
        move_flag = 1;
        $('#imgbase64').val('');
        $('#file_trriger').text('Select Image');
        $('#remove_image').hide();
        $('#profile_pic').hide();
        $('#default_img').val('1');
        $('.jcrop_data').hide();
        $('#defailt_profile_pic').fadeIn(100);
    });
    
    function j_crop()
    {
        $('#defailt_profile_pic').hide();
        $('.jcrop_data').show();
        var thumbnail;
        if(jcrop_flag == 1 )
        {
            jcrop_flag = 0;
            $('#profile_pic').Jcrop(
            {
                boxWidth: 300,
                boxHeight: 300,
                allowSelect:false,      
                setSelect: [0,160, 160,  0],
                aspectRatio: 1,
                onSelect: function(c){
                    updatePreview(c);
                }                
            },function(){
              // Use the API to get the real image size
              var bounds = this.getBounds();
              boundx = bounds[0];
              boundy = bounds[1];
              $('.jcrop-holder').addClass('jcrop_data');
              // Store the API in the jcrop_api variable
              jcrop_api = this;
              //thumbnail = this.initComponent('Thumbnailer', { width: 130, height: 130 });
              jcrop_api.setOptions({ minSize:[150, 150],onChange: release}); 
              // Move the preview into the jcrop container for css positioning
            });
        }
    }
    var move_cursor = 0;
    function release(c)
    {
        
        if($(".jcrop-keymgr").length > 0)
        {
           $.uniform.restore(".jcrop-keymgr");
        }
        //console.log($('.tab_2_visible').is(':visible'));
        if( $('.tab_2_visible').is(':visible'))
        {
           // remove radio button unifom
            
            $('#tab_1_2').removeClass('tab_2_visible');
            $('#sideprofileimage').prop('src',$('#profile_pic').prop('src'));
            $('#con_img').prop('src',$('#profile_pic').prop('src'));   
            $('#imgbase64').val($('#profile_pic').attr('src'));
            convertImgToBase64URL($('#imgbase64').val(), function(base64Img){
            $('#imgbase64').val(base64Img);
            });
        }
        
    }
    var set_one = 0;
    function updatePreview(c)
    {
        
      if(parseInt(c.w) > 0)
      {
       
        /*if(move_flag == 1 && set_one == 0)
        {
            set_one = 1;
            $('#sideprofileimage').prop('src',$('#profile_pic').prop('src'));   
            $('#imgbase64').val($('#profile_pic').attr('src'));
            convertImgToBase64URL($('#imgbase64').val(), function(base64Img){
            $('#imgbase64').val(base64Img);
        });
        }*/
        $('#x').val(c.x);
        $('#y').val(c.y);
        $('#x2').val(c.x2);
        $('#y2').val(c.y2);
        $('#w').val(c.w);
        $('#h').val(c.h);
        var rx = xsize / c.w;
        var ry = ysize / c.h;
        $pimg.css({
          width: Math.round(rx * boundx) + 'px',
          height: Math.round(ry * boundy) + 'px',
          marginLeft: '-' + Math.round(rx * c.x) + 'px',
          marginTop: '-' + Math.round(ry * c.y) + 'px'
        });
        $('#con_img').css({
          width: Math.round(rx * boundx) + 'px',
          height: Math.round(ry * boundy) + 'px',
          marginLeft: '-' + Math.round(rx * c.x) + 'px',
          marginTop: '-' + Math.round(ry * c.y) + 'px'
        });
      }
    };
});
function convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}