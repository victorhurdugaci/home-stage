# Home Stage [![dev branch build status](https://travis-ci.org/victorhurdugaci/home-stage.svg?branch=dev)](https://travis-ci.org/victorhurdugaci/home-stage)

Home Stage is a screensaver-like application for Raspberry Pi. It's inspired by Chromecast's home screen.

Even though it's designed for Raspberry Pi (Raspbian), it runs on any operating system (Linux, OSX, Windows).

Here's how it looks:

![Demo](https://cloud.githubusercontent.com/assets/5921642/15447009/04a2cc86-1ee6-11e6-863f-085748f4e496.gif)

# Build instructions

Prerequisites:

- Install [Node.js 4](https://nodejs.org/)

Build and run (Linux/OSX):

- Clone the repository
- Run `./build.sh run`

Build and run (Windows):

- Coming soon...

# FAQ

1. Can I build it on Raspberry Pi?

    Yes. It works on Raspbian. Clone the source code and follow the build instructions. The first build can take a few minutes but later builds with be fast.

1. Where are the default images coming from?

    For now, only from [NASA Image of the Day](https://www.nasa.gov/multimedia/imagegallery/iotd.html).

1. Can I use this application without Internet?

    You need Internet connection to build it. Afterwards you don't need Internet if you use your own images (see next question).

1. Can I use my own images?

    Yes. Create a directory called `background` in the `bin` directory (created after build) and drop your images there. The images must be jpeg.

1. What shortcut keys are available?

    - `F`: toggle full screen
    - `Ctrl + R`: reload
    - `Ctrl + Shift + I`: toggle dev tools

1. Can I contribute/help?

    Of course! If you have find bugs or have feature requests, please [open a new issue](https://github.com/victorhurdugaci/home-stage/issues). If you want to contribute code, first open a bug describing what you want to contribute, then send a pull request. If you want to help but you're not sure how, just ping me and we'll find something :)

# License

Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.
