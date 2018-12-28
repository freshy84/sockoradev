<?php $__env->startSection('content'); ?>
<div class="page-content-wrapper">
    <div class="page-content" style="min-height:1100px">
        <div class="portlet box blue-madison">
    		<div class="portlet-title">
    			<div class="caption">
    				<i class="fa fa-edit"></i> <?php echo e($title); ?>

    			</div>
    		</div>
            <div class="portlet-body form">
                <form  action="<?php echo e(action('UsersController@anyEdit', array('id'=>$records->id))); ?>" class="form-horizontal" id="frmEdit" method="POST" onsubmit="return false;">
                    <div class="form-wizard">
                        <div class="form-body">
                            <div class="tab-content">
                                <div class="tab-pane active" id="tab1">
    								<div class="form-group">
    									<label class="control-label col-md-2">
    										First Name
    										<span class="redLabel">*</span>
    									</label>
    									<div class="col-md-4">
    										<input type="text" class="form-control input-icon required alpha" name="v_firstname" placeholder="First Name" id="v_firstname" value="<?php echo e($records->v_firstname); ?>"/>
    									</div>
    								</div>
                                    <div class="form-group">
										<label class="control-label col-md-2">
											Last Name
											<span class="redLabel">*</span>
										</label>
										<div class="col-md-4">
											<input type="text" class="form-control input-icon required alpha" name="v_lastname" placeholder="Last Name" id="v_lastname" value="<?php echo e($records->v_lastname); ?>"/>
										</div>
									</div>
                                    <div class="form-group">
										<label class="control-label col-md-2">
											Email
											<span class="redLabel">*</span>
										</label>
										<div class="col-md-4">
											<input type="text" class="form-control input-icon required email" name="v_email" placeholder="email" id="v_email" value="<?php echo e($records->v_email); ?>"/>
                                            <div id="error_v_email" class="duplicate-error " style="display: none;">Email already exits.</div>
										</div>
									</div>
                                    <div class="form-group">
                                        <label class="control-label col-md-2">Change Password </label>
                                        <div class="col-md-4"><input type="password" class="form-control input-icon validate_password" name="password" id="password" placeholder="Password"/></div>
                                     </div>
                                     <div class="form-group">
                                        <label class="control-label col-md-2">Re-Enter Password</label>
                                        <div class="col-md-4"><input type="password" class="form-control input-icon" name="cpassword" equalTo="password" placeholder="Confirm Password"/></div>
                                    </div>

									<div class="form-group">
										<label class="control-label col-md-2">
											 User Role:                                             
										</label>
										<div class="col-md-4">
											<select class="form-control input-icon required" id="e_user_type" name="e_user_type">
                                                <option value="" >-- Select --</option>
                                                <option value="Admin" <?php if($records->e_user_type == 'Admin'): ?> selected="selected" <?php endif; ?>>Admin</option>
                                                <option value="Manager" <?php if($records->e_user_type == 'Manager'): ?> selected="selected" <?php endif; ?>>Manager</option>
                                                <option value="Designer" <?php if($records->e_user_type == 'Designer'): ?> selected="selected" <?php endif; ?>>Designer</option>
                                                <option value="Customer Support" <?php if($records->e_user_type == 'Customer Support'): ?> selected="selected" <?php endif; ?>>Customer Support</option>
                                            </select>
										</div>
		                            </div>


									<div class="form-group">
										<label class="control-label col-md-2">
											Status
											<span class="redLabel">*</span>
										</label>
										<div class="col-md-4">
											<select class="form-control input-icon" id="e_status" name="e_status">
                                                <option value="1" <?php if($records->status == ACTIVE_STATUS): ?> selected="selected" <?php endif; ?>><?php echo e(ACTIVE_STATUS); ?></option>
                                                <option value="0" <?php if($records->status == INACTIVE_STATUS): ?> selected="selected" <?php endif; ?>><?php echo e(INACTIVE_STATUS); ?></option>
                                            </select>
										</div>
		                             </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-actions">
                            <div class="row">
                                <div class="col-md-offset-2 col-md-9">
                                <button type="submit" class="btn blue-madison button-next">Update <i class="fa fa-check-square-o "></i></button>
                                    <a href="<?php echo e(SITE_URL); ?>users" class="btn default button-previous">Cancel </a>
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
<?php echo $__env->make('layouts.default', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>