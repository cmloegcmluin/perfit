# perfit

"Perfit the Frog here, reporting live..."

A tool for maintaining, as your code changes and grows, an ongoing record of the performance of a repeatedly-called function in a web app e.g the `animate` or `update` game loop function of a game.

## usage

### setup

First **install** the package into the web app repository with a function you want to performance test.

`$ npm i perfit`

Now **import** the client into your app's code,

`import perfit from 'perfit'`

**replace** the original function,

`var newAnimate = perfit.getInjectedFunction(oldAnimate)`

and **turn on** performance reporting wherever/whenever appropriate.

`perfit.turnOn()`

### measure

**Start the perfit server** from the command line,

`$ ./node_modules/.bin/perfit`

and also **start your app**.

**Open your app** in a browser.

Once your app is open and the client's method to turn on has been called, the **client starts looking** for the server.

If the server is already, then within a second you should see on the console that the **server has received the connection** request from the client.

Next, the **server sends configuration** you've passed on the command line up to the client (if any), and then the client will give you a short delay before beginning recording to ensure you have the browser tab which is running your app is active for most accurate results.

Next, the **client pings** the server to let it know recording has begun with the sent configuration.

Finally, after the configured number of measurements have been taken, the **client posts the results** back to the server to be parsed.

In addition to the results files, a handy summary will be presented on the console.

## results

Results are saved in two tab-separated-values spreadsheet files:

```
./performance/results.tsv
./performance/report.tsv
```

A new row will always added to the `results` sheet.

The `report` aggregates all of the `results`, so a new row may not always be necessary.

If the files do not exist they will be created. The path to them will also be created if necessary.

### results

Results has nine columns:

1. **commit number**: the index of the current commit in the entire history (e.g. first commit is `0`).
2. **sha**: the SHA-1 hash of the commit.
3. **message**: the commit message.
4. **os**: the operating system the measurement was taken on, with full semver.
5. **browser**: the browser the measurement was taken on, with full semver.
6. **gpu**: the graphics processing unit of the machine the measurement was taken on, with full semver.
7. **percentage of dropped frames**: generally, the measurements will be in multiples of the fps, e.g. at 60 fps most measurements will be multiples of 1000/60. A measurement that was double that length would represent one dropped frame, and one that was triple would be two dropped frames. The more dropped frames on your system, the longer it will take the session to reach the desired total number of recorded calls of your function.
8. **fps**: which FPS this session was accounted to. The FPS should correspond with the average measurement for accurate results.
9. **raw measurements of duration of each frame in ms**: just a data dump, for your further fiddling and records.

You can make more than one recording of a given combination of system and commit, but only the last one in the results will be considered for the report and for the console output.

### report

Each row is a commit, and each column is a "system", where a system is defined as a combination of an OS, browser, and GPU, grouped by major versions.

The `report.tsv` file is designed to be imported into spreadsheet software with advanced features like charts and graphs, so that you can quickly understand across all systems how your performance has changed from your first commit to your most recent.

Base performance is treated as commit number zero for purposes of the report.

## tips

You may want to avoid injecting the performance reporting client when in production mode, since it may slow down your code and create a ton of noise with all its failed requests to connect to a perfit server which will never come.

Since reports are associated with the current commit, run performance reporting after making a commit, then amend in the updated results and report before pushing.

Either you can start the app first or the perfit server first; whichever works better for you.

In your app code, it is unnecessary to turn on reporting immediately. You can wait for certain conditions to be satisfied before calling `turnOn`. You can even schedule backup triggers if those conditions never get met.

You can start up the perfit server and have more than one recording session, e.g. one for each browser on your machine. You can even have more than one running at once.

Use the links to the report files from the console. They are in yellow text.

Caveat: this tool assumes you are using `git` as a VCS tool and will break otherwise.

## options

Most options can be configured either on the server or the client, depending on which is convenient or necessary for you.

### port

`$ perfit --port=8888`
and
`perfit.setConfig('serverPort', 8888)`

This changes which port the perfit server runs on.
The port your app runs on is irrelevant.

*Note: Change both together, or change neither. Otherwise they won't find each other.*

**Default: 8081**

### base mode

`$ perfit --base`
or
`perfit.setConfig('baseMode', true)`

When in base mode, the original function on the test will not actually be called. This will test the base performance on the system before the function is even added to the mix.

The three VCS-related fields in the `results` spreadsheet will no longer reflect the current commit; it is recommended to take base performance measurements ASAP.

**Default: false**

### fps

`$ perfit --fps=90`
or
`perfit.setConfig('fps', 90)`

How many frames per second to hope for your function to achieve.

**Default: 60**

### measurement count

`$ perfit --count=100`
or
`perfit.setConfig('measurementCount', 100)`

How many measurements for the client to make before sending the results to the server.

Even if set to `0`, one measurement will be taken.

**Default: 8192**

### measurement shave count

`$ perfit --shave=32`
or
`perfit.setConfig('measurementShaveCount', 32`

For whatever reason things are usually a bit janky right at the beginning. If you notice that you're still getting some weird measurements right at the beginning of your results, because the default count of measurements to shave is not quite enough for your situation, you can configure this value.

**Default: 16**

### recording delay

`$ perfit --delay=0`
or
`perfit.setConfig('recordingDelay', 0)`

In the case where you have not only started the application first but also already opened it in your browser before starting your perfit server, this delay is here to give you time to switch focus back to the browser tab.

**Default: 3000**

### output path

`$ perfit --output=../../performance/my-app`

Where to save the `results.tsv` and `report.tsv` spreadsheet files, relative to your app's directory.

**Default: ./performance**
