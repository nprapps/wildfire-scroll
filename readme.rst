United States Of Wildfire
======================================================

This news app is built on our `interactive template <https://github.com/nprapps/interactive-template>`_. Check the readme for that template for more details about the structure and mechanics of the app, as well as how to start your own project.

Getting started
---------------

To run this project you will need:

* Node installed (preferably with NVM or another version manager)
* The Grunt CLI (install globally with ``npm i -g grunt-cli``)
* Git

With those installed, you can then set the project up using your terminal:

#. Pull the code - ``git clone git@github.com:nprapps/wildfire-scroll``
#. Enter the project folder - ``cd wildfire-scroll``
#. Install dependencies from NPM - ``npm install``
#. Grab the initial document data - ``grunt docs``
#. Sync static assets - ``grunt sync``
#. Start the server - ``grunt``

Running tasks
-------------

Like all interactive-template projects, this application uses the Grunt task runner to handle various build steps and deployment processes. To see all tasks available, run ``grunt --help``. ``grunt`` by itself will run the "default" task, which processes data and starts the development server. However, you can also specify a list of steps as arguments to Grunt, and it will run those in sequence. For example, you can just update the JavaScript and CSS assets in the build folder by using ``grunt bundle less``.

Common tasks that you may want to run include:

* ``sheets`` - updates local data from Google Sheets
* ``docs`` - updates local data from Google Docs
* ``google-auth`` - authenticates your account against Google for private files
* ``static`` - rebuilds files but doesn't start the dev server
* ``cron`` - runs builds and deploys on a timer (see ``tasks/cron.js`` for details)
* ``publish`` - uploads files to the staging S3 bucket

  * ``publish:live`` uploads to production
  * ``publish:simulated`` does a dry run of uploaded files and their compressed sizes

Troubleshooting
---------------

**Fatal error: Port 35729 is already in use by another process.**

The live reload port is shared between this and other applications. If you're running another interactive-template project or Dailygraphics Next, they may collide. If that's the case, use ``--reload-port=XXXXX`` to set a different port for the live reload server. You can also specify a port for the webserver with ``--port=XXXX``, although the app will automatically find the first available port after 8000 for you.


Pre-processing videos and photos
--------------------------------

1. Install the following dependencies:
	- ffmpeg: `brew install ffmpeg` (this can take a little while)
	- imagemagick: `brew install imagemagick`
1. Inside your `assets` folder, create an `originals` folder.
1. Inside `originals` , create a `videos` folder and `images` folder.
1. Place assets into respective folders
1. In your `assets` folder, run the `process_assets.sh` file from the command line.

* Make sure `originals/` is added to your `.gitignore`
* After pre-processing your images and videos, you will need to restart your server to incorporate them into your project. Control-C then grunt.
