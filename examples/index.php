<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link rel="stylesheet" href="https://rockwell.ourtownamerica.com/intra/common/bootstrap-4.5/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://rockwell.ourtownamerica.com/intra/common/css/ot-bs4-styles.css">
		<title>Our Town, Inc. IntraNet</title>
	</head>
	<body style="width: 110vw; height: 110vh;">
		<div class="container">
			<br><br>
			
			<div class="card">
				<div class="card-header d-flex justify-content-between align-items-center">
					Graphics Job
					<span class="job-action-buttons float-right"><a class="btn btn-sm btn-primary status-progress-button" href="#">Mark as Ready for Review</a></span>
				</div>
				<div class="card-body">
					<div class="row" id="drag_container">
						<div class="col col1">
							<div class="job-display-item"><b>Job ID: </b><span id="job-id-display">000022</span></div>
							<div class="job-display-item"><b>Status: </b><span id="job-status-display"><b>In Progress</b></span></div>
							<div class="job-display-item"><b>Assets: </b><span id="job-ntoes-overview-display"><a data-open-tab="ga-job-assets-details" href="#"><i>No files attached to this job</i></a></span></div>
							<div class="job-display-item"><b>Old Tagline: </b><small style="font-family: monospace;"><span id="job-old-tagline-display">COFL/050857/0905/12/SFDU/0120/SP-1/1/M/</span></small></div>
							<div class="job-display-item"><b>New Tagline: </b><small style="font-family: monospace;"><span id="job-new-tagline-display">COFL/050857/0905/12/SFDU/0121/GC-1/0/0/</span></small></div>
						</div>
						<div class="col col2">
							<div class="job-display-item"><b>Source: </b><span id="job-source-display">GA</span></div>
							<div class="job-display-item"><b>Created By: </b><span id="job-creator-display">Jason Strickland</span></div>
							<div class="job-display-item"><b>Version: </b><span id="job-version-display">Unversioned</span></div>
							<div class="job-display-item"><b>Assigned To: </b><span id="job-notes-assigned-to-display">Robert Parham</span></div>
							<div class="job-display-item"><b>Sponsor: </b><span id="job-sponsor-overview-display"><a data-open-tab="ga-job-sponsor-details" href="#">Cristys Pizza Inc</a></span></div>
						</div>
						<div class="col col3">
							<div class="job-display-item"><b>Type: </b><span id="job-type-display">CERT</span></div>
							<div class="job-display-item"><b>Layout: </b><span id="job-layout-display"><a href="#" id="trigger-layout-edit-modal">GC-1/0</a></span></div>
							<div class="job-display-item"><b>Mail Month: </b><span id="job-mailmonth-display"><a href="#" id="trigger-mailmonth-edit-modal">Jan. '21</a></span></div>
							<div class="job-display-item"><b>Notes: </b><span id="job-notes-overview-display"><a data-open-tab="ga-job-notes-details" href="#"><i>2 notes on this job</i></a></span></div>
							<div class="job-display-item"><b>Danger Zone: </b><span id="job-delete-job-admin-container"><a id="job-delete-job-admin-btn" href="#"><i>Permanently delete this job</i></a></span></div>
						</div>
					</div>
				</div>
			</div>
			
		</div>
		<script src="https://rockwell.ourtownamerica.com/intra/common/js/jquery-3.5.1.min.js"></script>
		<script src="https://rockwell.ourtownamerica.com/intra/common/js/popper-1.12.5.min.js"></script>
		<script src="https://rockwell.ourtownamerica.com/intra/common/bootstrap-4.5/js/bootstrap.min.js"></script>
		<script src="DragNDrop.js"></script>
		
		<script>		
		
			var dnd = new DND_Group('.job-display-item', 'b', '#drag_container .col', '<div>&rarr;</div>');
		
		</script>
	</body>
</html>

