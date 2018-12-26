var currentfiles =  new Array();
var timeoutID;
var image_number = 0; // default image number to 0
var LOADING_TIMEOUT = 1000; // default timeout
var IMAGE_EXTENSION = /\.(gif|jpg|jpeg|tiff|png)$/i; // all the image extensions 
var DOWNLOAD_FILE_EXTENSION = /\.(doc|docx|ppt|pptx|xls|xlsx|txt|gif|jpg|jpeg|tiff|png|pdf|zip|rar)$/i; // all files extension
var FILE_UPLOAD_VALIDATION = FILE_UPLOAD_VALIDATION;

$(document).ready(function() 
{  
    // get the object of the popup alert box
    if($('.alert-box').length > 0){
        var className = $('.alert-box').attr('class').split('alert-box')[1]; 
    }
    // initialize fileupload default file
    var url =  ASSET_URL+'plugins/jquery-file-upload/server/php/index.php';
     //SITE_URL+"public/fileupload/server/php/index.php";
   
    // initialize all the input file to fileupload
    $('#multi_upload_file').bind('added', function (e, data) {
        var currentfiles = [];
        var nm;
        $('.hide-span-upload').hide();
        $.each(data.files, function (index, x) {
        	var nm = x.name;
        });
        if ($.inArray(nm,currentfiles) >= 0) { if($("#create-competition").is(":visible"))
                {
                    $('.hide-span-upload').show();
                    $('.hide-span-upload').html(IMAGE_EXIST);
                    return false;
                }else{openFancyBox(className,IMAGE_EXIST); return false;}}
        var filenames = $("#images_name").val();
        imgarray = filenames.split(';');
       
        if(imgarray.isArray)
        {
        	$.each(imgarray, function (index, file) 
        	{
        		var arryname = file.name.split('@');
        		currentfiles.push(arryname[1]);
        	});	
        }
    });

    // initialize multiple file upload
    $('#multi_upload_file').fileupload({
        url: url,
        dataType: 'json',
        sequentialUploads: true, // sequnetial upload
        formData : {object:'multi_upload_file',path:'',button_name:'multi_upload_file','accept_file_types':IMAGE_EXTENSION, 'SITE_URL': SITE_URL},
        send : function (e, data) 
        {
            
            totalSize = 0; // count total number of size uploaded
            var uploadFile = data.files[0];
            $('#loading_img').addClass('active_img');
            $('#loading_img').removeClass('inactive_img');
            $('#save').prop('disabled','disabled');
           /* var arrFileTable = $("#all_files_status").val().split('-_-_-');
            // convert size into MB
            tempSizeInMB = (uploadFile.size / (1024*1024)).toFixed(2);
            if(arrFileTable.length > 0)
            {
                for(var i=0;i<arrFileTable.length;i++)
                {
                    $arrSize = arrFileTable[i].split(';;;');
                    if($arrSize[1] != "" && $arrSize[1] != undefined)
                    {
                        totalSize = parseFloat(totalSize) + parseFloat($arrSize[1]);
                    }
                }   
            }
            totalSize = parseFloat(totalSize) + parseFloat(tempSizeInMB);
            // check whether uploaded file size is less than 20 MB
            if(totalSize > 20)
            {
                // open fancybox with upload limit error
                //openFancyBox(className,MAX_UPLOAD_LIMIT);
                return false; 
            }
            
            if ($.inArray(uploadFile.name,currentfiles) >= 0) 
            {
                // open fancybox with alredy exist file
                //openFancyBox(className,uploadFile.name+" is already uploaded");
                return false; 
            }
            // if uploaded file has invalid extension
            if (!(DOWNLOAD_FILE_EXTENSION).test(uploadFile.name)) 
            {
                // open fancybox for invalid file extension
                //openFancyBox(className,FILE_UPLOAD_VALIDATION);
                return false;
            }*/
              
                  
		},
        done: function (e, data) 
        {
            
            var my_obj = "#v_download_files";
            var current_div = "#file_table";
            all_files_status = "";
            $('#loading_img').removeClass('active_img');
            $('#loading_img').addClass('inactive_img');
            $('#save').prop('disabled',false);
            $.each(data.result.multi_upload_file, function (index, file) 
            {
                // check uploaded file size after file upload
                var totalSize = $('#total_size').val();
                if(totalSize == ''){ totalSize = 0; }
                var newSize =  parseInt(totalSize) + parseInt(file.size);
                $('#total_size').val(newSize);     
                
                
                sizeInMB = (file.size / (1024*1024)).toFixed(2);
                //original_name = file.name.slice(11);
                original_name = file.name;
                // get extension of uploaded file
                fileExt = file.name.split('.').pop();
                
                intFileCounter = $("#intFileCounter").val();
                file_table = $("#file_table");
                var col = 7;
                var btn_val = 'Remove';
               
                setTimeout(function(){
                    // append all the uploaded file with their extension and file size
                    file_table.append('<label for="inputWarning" class="control-label col-md-3" id="label_'+intFileCounter+'"></label><div id="file_'+intFileCounter+'" class="file-attachment col-md-'+col+'"><img src="'+SITE_URL+'files/temp/thumbnail/'+file.name+'" /><a target="_blank" href="'+file.url+'">'+original_name+'</a><button type="button" id1="'+intFileCounter+'" href="javascript:void(0);" id2="'+file.name+'" id3="'+WWW_ROOT+TEMP_IMG_PATH+file.name+'" class="btn red cancel remove_file" rel="'+file.size+'"><i class="fa fa-ban cancle_btn"></i><span>'+btn_val+'</span></button></div>');    
                },100);
                // store string into database 
                all_files_status = $("#all_files_status").val();
                console.log(all_files_status);
                if(all_files_status != "" && all_files_status != undefined)
                {
                    all_files_status = all_files_status+"-_-_-"+file.name; //+";;;"+sizeInMB+";;;"+fileExt+";;;"+original_name
                }
                else
                {
                    all_files_status = file.name; //+";;;"+sizeInMB+";;;"+fileExt+";;;"+original_name
                }
                intFileCounter++;
                $("#intFileCounter").val(intFileCounter);
                $("#all_files_status").val(all_files_status);
            });
        }
    });
    
    // remove uploaded file from page
    $(document).on('click',".remove_file", function()
    {
        row_id = $(this).attr('id1');
        remove_data = $(this).attr('id2');
        remove_all_data = $(this).attr('id3');
        case_id = $(this).attr('id4');
        file_name_val = $(this).attr('id5');
        // remove data from hidden variable
        all_files_status = $("#all_files_status").val();
        all_files_status = all_files_status.replace(remove_data,'');
        all_files_status = all_files_status.replace(/^-_-_-|-_-_-$/g,'');
        $("#all_files_status").val(all_files_status);
		$("#file_"+row_id).remove(); // remove row
        $("#label_"+row_id).remove(); // remove row
        $.post($('#remove_url').val(),{'file_name':remove_all_data,'case_id':case_id,'file_name_val':file_name_val},function(responce){
            
        });
        
        var fileSize = $(this).attr('rel');
        var totalSize = $('#total_size').val();
        
        var newSize =  parseInt(totalSize) - parseInt(fileSize);
        $('#total_size').val(newSize);    
                
                
        $("#intFileCounter").val($('#file_table').find(".remove_file").size());
    });
    
    // initialize single file upload
    $('#single_upload_img').fileupload({
        url: url,
        dataType: 'json',
        sequentialUploads: true,
        formData : {object:'single_upload_img',path:'',button_name:'single_upload_img',super_image:'thumb' },
        send : function (e, data) 
        {
           var uploadFile = data.files[0]; 
           // hide validation for image
           $('.hide-span-upload').hide();
           if(IS_MOBILE == 0)
           {
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(uploadFile.name)) 
                {
                    if($(".popup-sale-team").is(":visible"))
                    {
                        // show validation for image
                        $('.hide-span-upload').show();
                        $('.hide-span-upload').html(INVALID_EXTENSION);
                        return false; 
                    }
                    else
                    {   
                        openFancyBox(className,INVALID_EXTENSION);
                        return false;
                    }
                }
           }
           // check whether image size greater than 8MB
           if (uploadFile.size > 8*1024*1024) 
            {
                if($(".popup-sale-team").is(":visible"))
                {
                    // show validation for image
                    $('.hide-span-upload').show();
                    $('.hide-span-upload').html(SMALL_IMG_MAX_SIZE);
                    return false; 
                }
                else
                {
                    openFancyBox(className,SMALL_IMG_MAX_SIZE);
                    return false;
                }
            }
            if ($.inArray(uploadFile.name,currentfiles) >= 0) 
            { 
                if($(".popup-sale-team").is(":visible"))
                {
                    $('.hide-span-upload').show();
                    $('.hide-span-upload').html(uploadFile.name+" is already uploaded");
                    return false; 
                }
                else
                {
                    openFancyBox(className,uploadFile.name+" is already uploaded");
                    return false;
                }
            }
            // show default loader for uploading image
            $.blockUI({
            	message: '<img width="100%" src="' + ASSET_URL + 'public/images/jzac-images/loading.gif' + '" />'
            });
		},
        done : function (e, data) 
        {   
            // if mobile phone 
            if(IS_MOBILE)
            {
                // validate image file extension
                var uploadFile = data.files[0];
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(uploadFile.name)) 
                {    
                    // remove loader
                    $.unblockUI(); 
                    if($(".popup-sale-team").is(":visible"))
                    {
                        $('.hide-span-upload').show();
                        $('.hide-span-upload').html(INVALID_EXTENSION);
                        return false; 
                    }
                    else
                    {
                        openFancyBox(className,INVALID_EXTENSION);
                        return false;
                    }
                }
            } 
            // remove error message
             if(typeof data.result.single_upload_img[0]['error'] != 'undefined' && typeof data.result.single_upload_img[0]['error'] != '')
             {
                $.unblockUI(); 
                if($(".popup-sale-team").is(":visible"))
                {
                    $('.hide-span-upload').show();
                    $('.hide-span-upload').html(MIN_IMG_SIZE);
                    return false; 
                }
                else
                {
                    openFancyBox(className,MIN_IMG_SIZE);
                    return false; 
                }  
             } 
             else 
             {
                // upload single uploaded image success result
             $.each(data.result.single_upload_img, function (index, file) 
             {
                // get image detail into variables
                var obj1= data.result.single_upload_img;
                var obj_width  = obj1[0].width;
                var obj_height = obj1[0].height;
                var image_size = obj1[0].size;
                var image_name = obj1[0].name;
                
                // check whether image is square or not, also we are allowing small rectangle image whose image difference is less then 10 px
                if(obj_width != obj_height && (Math.abs(obj_width-obj_height) > 10))
                {           
                    $.unblockUI();
                    if($(".popup-sale-team").is(":visible"))
                    {
                        $('.hide-span-upload').show();
                        $('.hide-span-upload').html(SQUARE_IMG);
                        return false; 
                    }
                    else
                    {
                        openFancyBox(className,SQUARE_IMG);
                        return false;
                    }
                }
                else if(obj_width < 100 || obj_height < 100)
                {
                    // image must be greater than 100 px and 100px
                    $.unblockUI(); 
                    if($(".popup-sale-team").is(":visible"))
                    {
                        $('.hide-span-upload').show();
                        $('.hide-span-upload').html(MIN_IMG_SIZE);
                        return false; 
                    }
                    else
                    {
                        openFancyBox(className,MIN_IMG_SIZE);
                        return false;   
                    }
                }
                
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(image_name)) {
                    //alert('Please upload jpg,jpeg,gif or png image.');
                    $("#single_upload_img").val('');
                    $.unblockUI();
                    return false;
               }
                if(obj1[0].error!=undefined &&  obj1[0].error !=" ")
                {
                    $.unblockUI();
                    return false;
                }
                
                $.unblockUI();
                var filename = image_name;
                var newfilename = filename.replace(/ /g,'_');
                var prev_id = ".image_table";
                $(".v_image").val(filename);
                // show image accordingly which is uploaded
                $(prev_id).attr('src',ASSET_URL+TEMP_IMAGE_THUMB_PATH+newfilename);
                $(prev_id).addClass('img_preview');
             }); 
           }  
        },
        progressall: function (e, data) {
            $(".progress").html("");
            $(".progress").show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            $(".progress").hide();
        }       
    });
    
    // single upload image and validation remains same as above
    $('#single_upload_img_edit').fileupload({
        url: url,
        dataType: 'json',
        sequentialUploads: true,
        formData : {object:'single_upload_img_edit',path:'',button_name:'single_upload_img_edit',super_image:'thumb' },
        send : function (e, data) 
        {
           var uploadFile = data.files[0]; 
           $('.hide-span-upload').hide();
           if(IS_MOBILE == 0)
           {
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(uploadFile.name)) 
                {
                    if($(".popup-sale-team").is(":visible"))
                    {
                        $('.hide-span-upload').show();
                        $('.hide-span-upload').html(INVALID_EXTENSION);
                        return false; 
                    }
                    else
                    {
                        
                        openFancyBox(className,INVALID_EXTENSION);
                        return false;
                    }
                }
           }
           if (uploadFile.size > 8*1024*1024) 
            {
                if($(".popup-sale-team").is(":visible"))
                {
                    $('.hide-span-upload').show();
                    $('.hide-span-upload').html(SMALL_IMG_MAX_SIZE);
                    return false; 
                }
                else
                {
                    openFancyBox(className,SMALL_IMG_MAX_SIZE);
                    return false;
                }
            }
            if ($.inArray(uploadFile.name,currentfiles) >= 0) 
            { 
                if($(".popup-sale-team").is(":visible"))
                {
                    $('.hide-span-upload').show();
                    $('.hide-span-upload').html(uploadFile.name+" is already uploaded");
                    return false; 
                }
                else
                {
                    openFancyBox(className,uploadFile.name+" is already uploaded");
                    return false;
                }
            }
            
            $.blockUI({
            	message: '<img width="100%" src="' + ASSET_URL + 'public/images/jzac-images/loading.gif' + '" />'
            });
		},
        done : function (e, data) 
        {   
            if(IS_MOBILE)
            {
                var uploadFile = data.files[0];
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(uploadFile.name)) 
                {    
                    $.unblockUI(); 
                    if($(".popup-sale-team").is(":visible"))
                    {
                        $('.hide-span-upload').show();
                        $('.hide-span-upload').html(INVALID_EXTENSION);
                        return false; 
                    }
                    else
                    {
                        openFancyBox(className,INVALID_EXTENSION);
                        return false;
                    }
                }
            } 
             if(typeof data.result.single_upload_img_edit[0]['error'] != 'undefined' && typeof data.result.single_upload_img_edit[0]['error'] != ''){
                
                    $.unblockUI(); 
                    if($(".popup-sale-team").is(":visible"))
                    {
                        $('.hide-span-upload').show();
                        $('.hide-span-upload').html(MIN_IMG_SIZE);
                        return false; 
                    }
                    else
                    {
                        openFancyBox(className,MIN_IMG_SIZE);
                        return false; 
                    }  
             } 
             else {
             $.each(data.result.single_upload_img_edit, function (index, file) 
             {
                var obj1= data.result.single_upload_img_edit;
                var obj_width  = obj1[0].width;
                var obj_height = obj1[0].height;
                var image_size = obj1[0].size;
                var image_name = obj1[0].name;
                
                if(obj_width != obj_height && (Math.abs(obj_width-obj_height) > 10))
                {           
                    $.unblockUI();
                    if($(".popup-sale-team").is(":visible"))
                    {
                        $('.hide-span-upload').show();
                        $('.hide-span-upload').html(SQUARE_IMG);
                        return false; 
                    }
                    else
                    {
                        openFancyBox(className,SQUARE_IMG);
                        return false;
                    }
                }
                else if(obj_width < 100 || obj_height < 100)
                {
                    $.unblockUI(); 
                    if($(".popup-sale-team").is(":visible"))
                    {
                        $('.hide-span-upload').show();
                        $('.hide-span-upload').html(MIN_IMG_SIZE);
                        return false; 
                    }
                    else
                    {
                        openFancyBox(className,MIN_IMG_SIZE);
                        return false;   
                    }
                }
                
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(image_name)) {
                    //alert('Please upload jpg,jpeg,gif or png image.');
                    $("#single_upload_img_edit").val('');
                    $.unblockUI();
                    return false;
               }
                if(obj1[0].error!=undefined &&  obj1[0].error !=" ")
                {
                    $.unblockUI();
                    return false;
                }
                
                $.unblockUI();
                var filename = image_name;
                var newfilename = filename.replace(/ /g,'_');
                var prev_id = ".image_table";
                $(".v_image").val(filename);
                $(prev_id).attr('src',ASSET_URL+TEMP_IMAGE_THUMB_PATH+newfilename);
                $(prev_id).addClass('img_preview');
             }); 
           }  
        },
        progressall: function (e, data) {
            $(".progress").html("");
            $(".progress").show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            $(".progress").hide();
        }       
    });
    
    // combine image upload with all the extension and validation remains same as above
    $('#combine_upload_image, .combine_upload_image').fileupload({
        url: url,
        dataType: 'json',
        sequentialUploads: true,
        
        formData : {object:'combine_upload_image',path:'',button_name:'combine_upload_image',thumb_image:'thumb' },
        send : function (e, data) 
        {
            var classes = $(this).attr('class').split(/\s/);
            $(".wall_post_img_close").show();
            var uploadFile = data.files[0]; 
            $('.hide-span-upload').hide();
            if(IS_MOBILE == 0)
            {
                if($('#div-wall-post').is(':visible'))
                {
                 if (!(/\.(gif|jpg|jpeg|png)$/i).test(uploadFile.name)) 
                    {
                     
                        openFancyBox(className,INVALID_EXTENSION);
                        return false;
                    
                    }   
                }else
                {
                  if (!(/\.(jpg|jpeg|png|gif|pdf|txt|doc|docx|xls|xlsx|xlsm|rtf|ppt)$/i).test(uploadFile.name)) 
                {
                    openFancyBox(className,INVALID_ALL_FILE_EXTENSION);
                    return false;
                }  
                }
                
            }
            if (uploadFile.size > 8*1024*1024) 
            {
                openFancyBox(className,SMALL_IMG_MAX_SIZE);
                return false;
            }
            
            $.blockUI({
            	message: '<img width="100%" src=' + ASSET_URL + 'public/images/jzac-images/loading.gif' + ' />'
            });
            $(".comment_post_img_close").show();
		},
        done : function (e, data) 
        {   
            var classes = $(this).attr('class').split(/\s/);
            if(IS_MOBILE== 1)
            {
                
                var uploadFile = data.files[0];
                if($('#div-wall-post').is(':visible'))
                {
                 if (!(/\.(gif|jpg|jpeg|png)$/i).test(uploadFile.name)) 
                    {
                     
                        openFancyBox(className,INVALID_EXTENSION);
                        return false;
                    
                    }   
                }else
                {
                 if (!(/\.(jpg|jpeg|png|gif|pdf|txt|doc|docx|xls|xlsx|xlsm|rtf|ppt)$/i).test(uploadFile.name)) 
                {
                    
                    $.unblockUI(); 
                    openFancyBox(className,INVALID_ALL_FILE_EXTENSION);
                    return false;
                }   
                }
                
            } 
            if($('#div-wall-post').is(':visible') && typeof(classes[1]) == "undefined" )
            {
                
                if(typeof data.result.combine_upload_image[0]['error'] != 'undefined' && typeof data.result.combine_upload_image[0]['error'] != '' )
             {
                $.unblockUI(); 
                openFancyBox(className,MIN_IMG_SIZE);
                return false;
             }
             else 
             {
               
             $.each(data.result.combine_upload_image, function (index, file) 
             {
                var obj1= data.result.combine_upload_image;
                var obj_width  = obj1[0].width;
                var obj_height = obj1[0].height;
                var image_size = obj1[0].size;
                var image_name = obj1[0].name;
                
                var filename = image_name;
                var newfilename = filename.replace(/ /g,'_');  
                var prev_id = ".image_table";
                if(typeof(classes) != "undefined" && classes[1]=== 'combine_upload_image')
                {
                  var prev_id = ".image_table1";  
                }
                if((obj_width < 100 || obj_height < 100))
                {
                    $.unblockUI(); 
                    openFancyBox(className,MIN_IMG_SIZE);
                    return false;
                }
                else
                {
                    
                    if(!(/\.(pdf|txt|doc|docx|xls|xlsx|xlsm|rtf|ppt)$/i).test(image_name))
                    {
                        $(prev_id).attr('style','');
                        $(prev_id).parent().hide();
                        $(".default_loader").show();
                        $('.loader_comment').show();
                        $('.wall_post_img_div').show();
                        $(prev_id).attr('src',ASSET_URL+TEMP_IMG_PATH+newfilename);
                        $(prev_id).addClass('img_preview');
                        setTimeout(function()
                        {
                            set_size('.preview_image','.default_loader');
                        },2000);
                    }
                    else
                    {
                        $(prev_id).attr('src',ASSET_URL+'public/images/pdf.jpg');
                        $(prev_id).addClass('img_preview');
                        $(prev_id).attr('style','');
                        $(prev_id).parent().hide();
                        $(".default_loader").show();
                        $('.loader_comment').show();
                        $('.comment_post_img_div').show();
                        setTimeout(function()
                        {
                           set_size('.preview_image','.default_loader');
                        },2000);
                        
                    }
                }
                
                if(obj1[0].error!=undefined &&  obj1[0].error !=" ")
                {
                    $.unblockUI();
                    return false;
                }
                
                $.unblockUI();
                $(".v_image").val(filename);
             }); 
           }   
            }
        else
            {
                 if(typeof data.result.combine_upload_image[0]['error'] != 'undefined' && typeof data.result.combine_upload_image[0]['error'] != '' && !(/\.(pdf|txt|doc|docx|xls|xlsx|xlsm|rtf|ppt)$/i).test(image_name))
             {
                $.unblockUI(); 
                openFancyBox(className,MIN_IMG_SIZE);
                return false;
             } 
             else 
             {
               
             $.each(data.result.combine_upload_image, function (index, file) 
             {
                var obj1= data.result.combine_upload_image;
                var obj_width  = obj1[0].width;
                var obj_height = obj1[0].height;
                var image_size = obj1[0].size;
                var image_name = obj1[0].name;
                
                var filename = image_name;
                var newfilename = filename.replace(/ /g,'_');  
                var prev_id = ".image_table";
                if(typeof(classes) != "undefined" && classes[1]=== 'combine_upload_image')
                {
                  var prev_id = ".image_table1";  
                }
                if((obj_width < 100 || obj_height < 100) && !(/\.(pdf|txt|doc|docx|xls|xlsx|xlsm|rtf|ppt)$/i).test(image_name))
                {
                    $.unblockUI(); 
                    openFancyBox(className,MIN_IMG_SIZE);
                    return false;
                }
                else
                {
                    $('#v_video_url').val('');
                    if(!(/\.(pdf|txt|doc|docx|xls|xlsx|xlsm|rtf|ppt)$/i).test(image_name))
                    {
                        $(prev_id).attr('style','');
                        $(prev_id).parent().hide();
                        $('.loader_comment').show();
                        $('.comment_post_img_div').show();
                        $(prev_id).attr('src',ASSET_URL+TEMP_IMG_PATH+newfilename);
                        $(prev_id).addClass('img_preview');
                        setTimeout(function()
                        {
                            if(typeof(classes) != "undefined" && classes[1]=== 'combine_upload_image')
                            {
                                set_size('.preview_image1','.default_loader');
                            }else
                            {
                                set_size('.preview_image','.default_loader');
                            }
                        },2000);
                    }
                    else
                    {
                        $(prev_id).attr('src',ASSET_URL+'public/images/pdf.jpg');
                        $(prev_id).addClass('img_preview');
                        $(prev_id).attr('style','');
                        $(prev_id).parent().hide();
                        $('.loader_comment').show();
                        $('.comment_post_img_div').show();
                        setTimeout(function()
                        {
                            if(typeof(classes) != "undefined" && classes[1]=== 'combine_upload_image')
                            {
                                set_size('.preview_image1','.default_loader');
                            }else
                            {
                                set_size('.preview_image','.default_loader');
                            }
                        },2000);
                        
                    }
                }
                
                if(obj1[0].error!=undefined &&  obj1[0].error !=" ")
                {
                    $.unblockUI();
                    return false;
                }
                
                $.unblockUI();
                if(typeof(classes) != "undefined" && classes[1] === 'combine_upload_image')
                {
                    
                  $(".v_image1").val(filename);
                }else
                {
                  $(".v_image").val(filename);  
                }
                
             }); 
           }   
                }
               
        },
        progressall: function (e, data) {
            $(".progress").html("");
            $(".progress").show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
            $(".progress").hide();
        }       
    });
    
    
        $('#single_upload_img1').fileupload({
            url: url,
            dataType: 'json',
            sequentialUploads: true,
            formData : {object:'single_upload_img1',path:'',button_name:'single_upload_img1',super_image:'thumb' },
            send : function (e, data) 
            {
               var uploadFile = data.files[0];
               $('.hide-span-upload1').hide(); 
               if(IS_MOBILE == 0)
               {
                    if (!(/\.(gif|jpg|jpeg|png)$/i).test(uploadFile.name)) 
                    {
                     
                        openFancyBox(className,INVALID_EXTENSION);
                        return false;
                    
                    }
               }
               if (uploadFile.size > 8*1024*1024) 
                {
                    
                    openFancyBox(className,SMALL_IMG_MAX_SIZE);
                    return false;
                    
                }
                if ($.inArray(uploadFile.name,currentfiles) >= 0) { 
                    openFancyBox(className,uploadFile.name+" is already uploaded");
                    return false;
                    }
                
                $.blockUI({
                	message: '<img width="100%" src=' + ASSET_URL + 'public/images/jzac-images/loading.gif' + ' />'
                });
    		},
            done : function (e, data) 
            {  
                if(IS_MOBILE)
                {
                    var uploadFile = data.files[0];
                    if (!(/\.(gif|jpg|jpeg|png)$/i).test(uploadFile.name)) 
                    {
                    
                        $.unblockUI(); 
                        openFancyBox(className,INVALID_EXTENSION);
                        return false;
                    
                    }
                } 
                 if(typeof data.result.single_upload_img1[0]['error'] != 'undefined' && typeof data.result.single_upload_img1[0]['error'] != ''){
                    
                        $.unblockUI(); 
                        openFancyBox(className,MIN_IMG_SIZE);
                        return false;   
                    
                    
                 } 
                 else {
                 $.each(data.result.single_upload_img1, function (index, file) 
                 {
                    var obj1= data.result.single_upload_img1;
                    var obj_width  = obj1[0].width;
                    var obj_height = obj1[0].height;
                    var image_size = obj1[0].size;
                    var image_name = obj1[0].name;
                                    
                    
                    if(obj_width != obj_height && (Math.abs(obj_width-obj_height) > 10))
                    {
                                         
                        $.unblockUI();
                        openFancyBox(className,SQUARE_IMG);
                        return false;
                    
                    }
                    else if(obj_width < 100 || obj_height < 100)
                    {
                        
                        $.unblockUI(); 
                        openFancyBox(className,MIN_IMG_SIZE);
                        return false;   
                        
                    
                    }
                    
                    if (!(/\.(gif|jpg|jpeg|png)$/i).test(image_name)) {
                        //alert('Please upload jpg,jpeg,gif or png image.');
                        $("#single_upload_img1").val('');
                        $.unblockUI();
                        return false;
                   }
                    if(obj1[0].error!=undefined &&  obj1[0].error !=" ")
                    {
                        $.unblockUI();
                        return false;
                    }
                    
                    $.unblockUI();
                    var filename = image_name;
                    var newfilename = filename.replace(/ /g,'_');
                    var prev_id = ".image_table1";
                    $(".v_image1").val(filename);
                    $(prev_id).attr('src',ASSET_URL+TEMP_IMAGE_THUMB_PATH+newfilename);
                    $(prev_id).addClass('img_preview');
                 }); 
               }  
            },
            progressall: function (e, data) {
                $(".progress").html("");
                $(".progress").show();
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
                $(".progress").hide();
            }       
        });
});