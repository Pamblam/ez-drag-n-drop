<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link rel="stylesheet" href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css'>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
		<title>Drag n' Drop Example</title>
		
		<style>
			.draggable{
				margin: .2em;
			}
			
			.dnd-container{
				border: 2px dashed black;
				min-height: 1em;
			}
		</style>
		
	</head>
	<body>
		<div class="container">
			<br><br>
			
			<h1>Drag n' Drop Demo</h1>
			
			<p>Use the <i class="fas fa-dot-circle"></i> icon to grab artists and drag them to the different categories.</p>
			
			<div class="card">
				<div class="card-header d-flex justify-content-between align-items-center">
					Artists
				</div>
				<div class="card-body">
					<div class="row dnd-container" data-label='Unlabeled'>
						<span class="badge badge-primary draggable"><i class="fas fa-dot-circle"></i> Elvis</span>
						<span class="badge badge-primary draggable"><i class="fas fa-dot-circle"></i> Bob Dylan</span>
						<span class="badge badge-primary draggable"><i class="fas fa-dot-circle"></i> Eminem</span>
						<span class="badge badge-primary draggable"><i class="fas fa-dot-circle"></i> Elton John</span>
						<span class="badge badge-primary draggable"><i class="fas fa-dot-circle"></i> Modanna</span>
					</div>
				</div>
			</div>
			<br><Br>
			<div class='row'>
				<div class='col'>
					<div class="card">
						<div class="card-header d-flex justify-content-between align-items-center">
							Good Music
						</div>
						<div class="card-body">
							<div class="row container dnd-container" data-label='Good Music'>
								
							</div>
						</div>
					</div>
				</div>
				<div class='col'>
					<div class="card">
						<div class="card-header d-flex justify-content-between align-items-center">
							Bad Music
						</div>
						<div class="card-body">
							<div class="row container dnd-container" data-label='Bad Music'>
								
							</div>
						</div>
					</div>
				</div>
				<div class='col'>
					<div class="card">
						<div class="card-header d-flex justify-content-between align-items-center">
							Terrible Music
						</div>
						<div class="card-body">
							<div class="row container dnd-container" data-label='Terrible Music'>
								
							</div>
						</div>
					</div>
				</div>
			</div>
			
			
		</div>
		<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
		<script src="../ez-drag-n-drop.js"></script>
		
		<script>		
		
			var dnd = new EZDnD_Group('.draggable', '.fas', '.dnd-container', '<div>&rarr;</div>');
		
			document.addEventListener('dnd-completed', function(e){
				console.log(e.target);
			});
		
		</script>
	</body>
</html>

