@extends('layouts.default')
@section('content')
<div class="page-content-wrapper">
    <div class="page-content" style="min-height:1100px">
        <div class="portlet box blue-madison">
    		<div class="portlet-title">
    			<div class="caption">
    				<i class="fa fa-edit"></i> {{ $title }}
    			</div>
    		</div>
            <div class="portlet-body form">
                <form  action="{{action('UsersController@anyEdit', array('id'=>$records->id))}}" class="form-horizontal" id="frmEdit" method="POST" onsubmit="return false;">
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
    										<input type="text" class="form-control input-icon required alpha" name="v_firstname" placeholder="First Name" id="v_firstname" value="{{ $records->v_firstname }}"/>
    									</div>
    								</div>
                                    <div class="form-group">
										<label class="control-label col-md-2">
											Last Name
											<span class="redLabel">*</span>
										</label>
										<div class="col-md-4">
											<input type="text" class="form-control input-icon required alpha" name="v_lastname" placeholder="Last Name" id="v_lastname" value="{{ $records->v_lastname }}"/>
										</div>
									</div>
                                    <div class="form-group">
										<label class="control-label col-md-2">
											Email
											<span class="redLabel">*</span>
										</label>
										<div class="col-md-4">
											<input type="text" class="form-control input-icon required email" name="v_email" placeholder="email" id="v_email" value="{{ $records->v_email }}"/>
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
                                                <option value="Admin" @if($records->e_user_type == 'Admin') selected="selected" @endif>Admin</option>
                                                <option value="Manager" @if($records->e_user_type == 'Manager') selected="selected" @endif>Manager</option>
                                                <option value="Designer" @if($records->e_user_type == 'Designer') selected="selected" @endif>Designer</option>
                                                <option value="Customer Support" @if($records->e_user_type == 'Customer Support') selected="selected" @endif>Customer Support</option>
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
                                                <option value="1" @if($records->status == ACTIVE_STATUS) selected="selected" @endif>{{ ACTIVE_STATUS }}</option>
                                                <option value="0" @if($records->status == INACTIVE_STATUS) selected="selected" @endif>{{ INACTIVE_STATUS }}</option>
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
                                    <a href="{{ SITE_URL }}users" class="btn default button-previous">Cancel </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@stop