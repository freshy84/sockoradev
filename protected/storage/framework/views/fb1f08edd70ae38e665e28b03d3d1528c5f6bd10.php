<?php $__env->startSection('content'); ?>
<div class="page-content-wrapper">
    <div class="page-content" style="min-height:1100px">
        <div class="portlet box blue-madison">
    		<div class="portlet-title">
    			<div class="caption">
    				<i class="fa fa-plus"></i> <?php echo e($title); ?>

    			</div>
    		</div>
            <div class="portlet-body form">
                <form role="form" method="post" class="form-horizontal" id="frmAdd" name="frmAdd" onsubmit="return false;" action="<?php echo e(action('Admin\AdminUserController@anyAdd')); ?>">
                    <div class="form-wizard">
                        <div class="form-body">
                            <div class="tab-content">
							    <div class="tab-pane active" id="tab1">
									<div class="form-group">
										<label class="control-label col-md-2">
											First Name:
											<span class="redLabel">
												*
											</span>
										</label>
										<div class="col-md-4">
											<input type="text" class="form-control input-icon required alpha" name="v_firstname" placeholder="First Name" id="v_firstname"/>
                                            
										</div>
									</div>
                                    <div class="form-group">
										<label class="control-label col-md-2">
											Last Name:
											<span class="redLabel">
												*
											</span>
										</label>
										<div class="col-md-4">
											<input type="text" class="form-control input-icon required alpha" name="v_lastname" placeholder="Last Name" id="v_lastname"/>
										</div>
									</div>
                                    <div class="form-group">
										<label class="control-label col-md-2">
											Email:
											<span class="redLabel">
												*
											</span>
										</label>
										<div class="col-md-4">
											<input type="text" class="form-control input-icon required email" name="v_email" placeholder="Email Address" id="v_email"/>
                                             <div id="error_v_email" class="duplicate-error " style="display: none;">Email Id already exits.</div>
										</div>
									</div>
                                    <div class="form-group">
										<label class="control-label col-md-2">
											Create Password:
											<span class="redLabel">
												*
											</span>
										</label>
										<div class="col-md-4">
											<input type="password" class="form-control input-icon required validate_password" name="password" id="password" placeholder="Password" />
										</div>
                                    </div>
                                    <div class="form-group">
										<label class="control-label col-md-2">
											Re-Enter Password:
											<span class="redLabel">
												*
											</span>
										</label>
										<div class="col-md-4">
											<input type="password" class="form-control input-icon required"  name="cpassword" placeholder="Confirm password" equalTo="password"/>
										</div>
									</div>
                                     <div class="form-group">
										<label class="control-label col-md-2">
											 Status:
                                             
										</label>
										<div class="col-md-4">
											<select class="form-control input-icon" id="e_status" name="e_status">
                                                <option value="<?php echo e(ACTIVE_STATUS); ?>" ><?php echo e(ACTIVE_STATUS); ?></option>
                                                <option value="<?php echo e(INACTIVE_STATUS); ?>" ><?php echo e(INACTIVE_STATUS); ?></option>
                                            </select>
										</div>
		                             </div>
                                </div>
						     </div>
                        </div>
                        <div class="form-actions">
                            <div class="row">
                                <div class="col-md-offset-2 col-md-9">
                                 <button type="submit" class="btn blue-madison button-next">Save  <i class="fa fa-check-square-o "></i></button>
                                    <a href="<?php echo e(ADMIN_URL); ?>users" class=" btn default button-previous">Cancel </a>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.default', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>