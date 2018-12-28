<?php $__env->startSection('content'); ?>
<style>
	.error-inner{color:red;}
</style>
<div class="page-content-wrapper">
	<div class="page-content" style="min-height:1100px">
		<div class="row">
			<div class="col-md-12">
				<div class="portlet">
					<div class="portlet-title">
						<div class="page-title caption"><strong><i class="icon-users"></i> <?php echo e($title); ?></strong></div>
						<div class="actions">
							<a class="btn blue-madison btn-circle" href="<?php echo e(ADMIN_URL); ?>users/add">
								<i class="fa fa-plus"></i>
								<span class="hidden-480">Add User</span>
							</a>
						</div>
					</div>
				</div>                     
                <div class="portlet-body">
                    <div class="table-container ">
                        <?php if(Session::has('success-message')): ?>                    
						<div class="Metronic-alerts alert alert-success fade in">
							<button aria-hidden="true" data-dismiss="alert" class="close" type="button"></button>
							<i class="fa-lg fa fa-check "></i> 
							<span class="message"><?php echo Session::get('success-message'); ?></span>
						</div>
                        <?php endif; ?>

						<div class="table-actions-wrapper">
							<span></span>
							<select class="table-group-action-input form-control input-inline input-small input-sm">
								<option value="">Select...</option>
								<option value="<?php echo e(ACTIVE_STATUS); ?>"><?php echo e(ACTIVE_STATUS); ?></option>
								<option value="<?php echo e(INACTIVE_STATUS); ?>"><?php echo e(INACTIVE_STATUS); ?></option>
								<option value="Delete">Delete</option>
							</select>
							<button class="btn btn-sm blue-madison table-group-action-submit btn-circle" id="bulk_action"><i class="fa fa-check"></i> Submit</button>
							<input type="hidden"  class="table-group-action-url" value="<?php echo
							ADMIN_URL.'users/bulk-action'; ?>"/>
						</div>
						<table class="table table-striped table-hover table-bordered" id="datatable_ajax">
							<thead>                
								<tr role="row" class="heading">
									<th style="padding-right: 0px; background-image: none ! important;" class="actions no-sort"><input type="checkbox" class="group-checkable" /></th>
									<th>
										First Name
									</th>
									<th>
										Last Name
									</th>
									<th>
										Email ID
									</th>
									<th>
										Status
									</th>
									<th style="padding-right: 0px; background-image: none ! important align:right;" class="actions no-sort">
										Actions
									</th>
								</tr>
								<tr role="row" class="filter">
									<td rowspan="1" colspan="1">
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="v_firstname" class="form-control form-filter input-sm"/>
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="v_lastname" class="form-control form-filter input-sm"/>
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="v_email" class="form-control form-filter input-sm"/>
									</td>
									<td rowspan="1" colspan="1">
										<select class="form-control form-filter input-sm filter" id="e_status" name="e_status">
											<option value="">Select</option>
											<option value="1">Active</option>
											<option value="0">Inactive</option>
										</select>
									</td>
									<td rowspan="1" class="actions" colspan="1">
										<div class="margin-bottom-5">
											<button class="btn btn-sm blue-madison filter-submit margin-bottom btn-circle"><i class="fa fa-search"></i> Search</button>
											<button class="btn btn-sm default filter-cancel btn-circle"><i class="fa fa-times"></i> Reset</button>
										</div>
									</td>
								</tr>                                
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div> 
			</div>
		</div>
	</div>
</div>
<script>
    $(document).ready(function(){
        var url = ADMIN_URL+'users/list-ajax';
        TableAjax.init(url);
	});
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.default', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>