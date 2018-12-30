@extends('layouts.default')
@section('content')
<style>
	.error-inner{color:red;}
</style>
<div class="page-content-wrapper">
	<div class="page-content" style="min-height:1100px">
		<div class="row">
			<div class="col-md-12">
				<div class="portlet">
					<div class="portlet-title">
						<div class="page-title caption"><strong><i class="icon-users"></i> {{ $title }}</strong></div>						
					</div>
				</div>                     
                <div class="portlet-body">
                    <div class="table-container ">
                        @if(Session::has('success-message'))                    
						<div class="Metronic-alerts alert alert-success fade in">
							<button aria-hidden="true" data-dismiss="alert" class="close" type="button"></button>
							<i class="fa-lg fa fa-check "></i> 
							<span class="message">{!!Session::get('success-message')!!}</span>
						</div>
                        @endif
						<table class="table table-striped table-hover table-bordered orders-listing" id="datatable_ajax">
							<thead>                
								<tr role="row" class="heading">									
									<th width="60px;">
										Order #
									</th>
									<th width="20%">
										Line Item
									</th width="20%">
									<th class="no-sort" width="30%">
										Images
									</th width="10%">
									<th class="no-sort">
										Text
									</th width="10%">
									<th class="no-sort">
										Color
									</th width="10%">
									<th class="no-sort">
										Number of Faces
									</th>
									<th width="10%">
										Number of Line Items
									</th>
									<th style="padding-right: 0px; background-image: none ! important align:right;" class="actions no-sort" width="10%">
										Actions
									</th>
								</tr>
								<tr role="row" class="filter">									
									<td rowspan="1" colspan="1">
										<input type="text" name="v_order_id" class="form-control form-filter input-sm" placeholder="Order Id"/>
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="v_line_item" class="form-control form-filter input-sm" placeholder="Line Item"/>
									</td>
									<td rowspan="1" colspan="1">
										
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="v_text" class="form-control form-filter input-sm" placeholder="Text"/>
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="v_color" class="form-control form-filter input-sm" placeholder="Color"/>
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="i_no_of_faces" class="form-control form-filter input-sm" placeholder="Number Of Faces"/>
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="i_quantity_min" class="form-control form-filter input-sm" placeholder="Min"/>
										<input type="text" name="i_quantity_max" class="form-control form-filter input-sm" placeholder="MAx"  style="margin-top: 5px;"/>
									</td>
									<td rowspan="1" class="actions" colspan="1">
										<div class="margin-bottom-5">
											<button class="btn btn-sm blue-madison filter-submit margin-bottom"><i class="fa fa-search"></i> Search</button>
											<button class="btn btn-sm default filter-cancel"><i class="fa fa-times"></i> Reset</button>
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
		var url = SITE_URL + 'orders/list-ajax';
		var order = [[0, "desc"]];
        TableAjax.init(url, order);
	});
</script>
@stop