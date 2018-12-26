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
									<th class="no-sort sorting_disabled">
										Order #
									</th>
									<th class="no-sort">
										Line Item
									</th>
									<th class="no-sort">
										Images
									</th>
									<th class="no-sort">
										Text
									</th>
									<th class="no-sort">
										Color
									</th>
									<th style="padding-right: 0px; background-image: none ! important align:right;" class="actions no-sort">
										Actions
									</th>
								</tr>
								<tr role="row" class="filter">									
									<td rowspan="1" colspan="1">
										<input type="text" name="v_order_id" class="form-control form-filter input-sm" placeholder="Search by Order Id"/>
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="v_line_item" class="form-control form-filter input-sm" placeholder="Search by line item name"/>
									</td>
									<td rowspan="1" colspan="1">
										
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="v_text" class="form-control form-filter input-sm" placeholder="Search by text"/>
									</td>
									<td rowspan="1" colspan="1">
										<input type="text" name="v_color" class="form-control form-filter input-sm" placeholder="Search by color"/>
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
		var url = SITE_URL + 'orders/list-ajax';
		
        TableAjax.init(url);
	});
</script>
@stop