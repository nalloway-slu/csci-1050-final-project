# csci-1050-final-project
Final Project for CSCI 1050-01: Intro to Computer Science - Multimedia

## Brief Reflection
In this project, I built a system for writing virtual novels using p5.js, and then I wrote such
a novel. To do so, I've recontextualized some photographs I've taken previously by combining them
with some sketches done on a drawing tablet. I've come to quite like this sort of artstyle, although
I think some work could be done in improving the visual clarity/contrast of the sketches
against the photograph backgrounds.

The biggest thing I learned while doing this project is that I ought to set harder, smaller limits
on what I want to do with my project in order to avoid overscope. In particular, I have come to learn
that while developing a system with abstraction may pay off for long term projects, sometimes having a
concrete, simple solution  pays off more in the short term.

## Project Plan
As mentioned above, this project has suffered from some overscope. The original idea was to develop
a virtual novel system that would let me have dialogues between two or more characters, whose poses
I could change. (Some functionality for this can be seen in the `overscope` branch.) As for what virtual
novel I would actually write, originally I had been thinking of doing a tetrad of short stories based
off of Heidegger's "dwelling" fourfold. For this reason, I had designed the system so that different
VNs could correspond to different objects. In the end, I had to cut back my ambitions in both the
code and the writing, so we've ended up with what we have right now.

Here is a diagram of my original VN system plan:
![Chalkboard diagram describing potential structure for virtual novel system in p5.js. A scene is constructed via two characters who face one another and dialogue text along the bottom. Elements of the scene are controllable by a text file read by a parser, which then executes commands that modify the scene. Both the parser and the scene display are managed by some interaction handler.](diagram.png)

The objectives of the current project are twofold:
- Develop a system for writing virtual novels in p5.js.
- Write a short story involving said system, incorporating at least one theme.

On the latter part, I have chosen to write a fictitious conversation between myself and another
person centered on my personal struggles with self-discovery and self-acceptance. The setting is
a park in Madrid that I took an afternoon walk through, so the conversation I've written is
something I could imagine having taken place were I to go revisit and re-walk through that park.

For the art direction, I really liked the idea of putting hand-drawn drawings on photographs that
I did for the multimedia card, so I've elected to do that again for this project. Choosing suitable
photographs for the project was a bit difficult as when I took them I had no idea I would be reusing
them for a short story. That said, I think the composition for each of the photographs is at least
passable.

For details on the VN novel system itself, refer to the source code for documentation.

## Credits
Images and dialogue are wholly my own, excepting the quotation "ever-living forces",
which is due to my intro philosophy professor Carlos Segovia. The discussion on Guattari's
subjectivity diagram is also due to Carlos Segovia. The discussion on Heidegger's "dwelling"
fourfold is (yet again) in part due to Carlos Segovia, but some of it also draws from a thread on
the 'ma pona pi toki pona' Discord server created by @aardvark0825. The thread may be found at
the given link:\
  https://discord.com/channels/301377942062366741/1174566951553613834/1174570004079976468 \
The code for centering the p5 canvas was taken from this link:\
  https://github.com/processing/p5.js/wiki/Positioning-your-canvas#centering-the-sketch-on-the-page-with-css