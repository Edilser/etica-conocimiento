var gulp = require('gulp');


var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );

gulp.task( 'deploy-dev', function () {
  console.log('test');
  var conn = ftp.create( {
      host:     'lumation.services',
      user:     'sergio.molina@lumation.services',
      password: 'k1d#1@~%yc&j',
      parallel: 5,
      log:      gutil.log
  } );

  const globs = [
      //----Deploy a todo el proyecto
      'dist/**',
      '!dist/assets/vendor/**'
      //----Fin deploy a todo el proyecto
  ];

  return gulp.src(globs, { base: './dist', buffer: false } )
      .pipe( conn.dest( '/lumation.services/public_html/cmi-panel/' ) );
} );