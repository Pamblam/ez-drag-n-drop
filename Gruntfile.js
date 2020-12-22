module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		concat: {
			options: {
				banner: '/**\n * <%= pkg.name %> - v<%= pkg.version %>' +
						'\n * <%= pkg.description %>' +
						'\n * @author <%= pkg.author %>' +
						'\n * @website <%= pkg.homepage %>' +
						'\n * @license <%= pkg.license %>' +
						'\n */\n\n'
			},
			dist: {
				src: [
					'src/EZDnD_Draggable.js',
					'src/EZDnD_Group.js'
				],
				dest: 'ez-drag-n-drop.js',
			},
		},
		'string-replace': {
			source: {
				files: {
					"ez-drag-n-drop.js": "ez-drag-n-drop.js"
				},
				options: {
					replacements: [{
						pattern: /{{ VERSION }}/g,
						replacement: '<%= pkg.version %>'
					}]
				}
			},
			readme: {
				files: {
					"README.md": "README.md"
				},
				options: {
					replacements: [{
						pattern: /\d*\.\d*\.\d*/g,
						replacement: '<%= pkg.version %>'
					}]
				}
			},
			docs: {
				files: {
					"docs/index.html": "docs/index.html"
				},
				options: {
					replacements: [{
						pattern: `<div id="jsdoc-banner" role="banner">
        </div>`,
						replacement: '<img src=../logo.png>'
					}]
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */'
			},
			build: {
				src: 'ez-drag-n-drop.js',
				dest: 'ez-drag-n-drop.min.js'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	
	grunt.registerTask('update-version', 'Generate docs', function () {
		var pkg = grunt.file.readJSON('package.json');
		pkg.version = pkg.version.split(".");
		var subversion = pkg.version.pop();
		subversion++;
		pkg.version.push(subversion);
		pkg.version = pkg.version.join(".");
		grunt.file.write('package.json', JSON.stringify(pkg, null, 2));
	});
	
	grunt.registerTask('jsdoc', 'Generate docs', function () {
		const {exec} = require('child_process');
		var done = this.async();
		exec('./node_modules/.bin/jsdoc --template ./node_modules/\@sugarcrm/jsdoc-baseline/  --destination ./docs ez-drag-n-drop.js', (err, stdout, stderr) => {
			if (err) {
				console.log('Unable to generate docs.');
				console.error(err);
				return;
			}
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			done();
		});
	});
	
	grunt.registerTask('default', [
		'update-version',
		'concat',
		'string-replace:source',
		'string-replace:readme',
		'uglify',
		'jsdoc',
		'string-replace:docs'
	]);
	
};