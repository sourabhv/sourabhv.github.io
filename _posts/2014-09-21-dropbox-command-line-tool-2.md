---
layout: post
title: Dropbox Command Line Tool - 2
description: Make a Dropbox command line tool using Click and Dropbox SDK
---

In this part, we will complete the drp tool by writing the command line interface using click and writing setup.py.
If you didn't read the [first part](/posts/dropbox-command-line-tool-1/), I suggest you read that first to understand this one better.

Writing setup.py
----------------

The `setup.py` file is used by the packaging system (`pip` in our case) to package the project, install any dependencies and and setup commmands, if any. It also includes details about the project like `author-name`, `version`, `email`, etc. We won't try to be too fancy here and add all of those and just enough to get things moving. You can always add more later. Open the `setup.py` file and enter the following into it.

{% highlight python %}
from setuptools import setup

setup(
    name='Drp',
    version='0.1',

    packages=['drp'],

    install_requires=['dropbox', 'click'],

    entry_points='''
        [console_scripts]
        drp=drp.drp:cli
    ''',
)
{% endhighlight %}

We're using setuptools to package our project. The `setup` function takes in a whole lot of arguments than shown here, but these are sufficient to make everything work. We'll talk about some other arguments at the end of the post.

- `name` and `version` are the name and current versionof your project.

- `packages` is a list of packages that you want to include in your final package. These could be any `*.py` files or directories with `__init__.py` inside it. We just have to include the `drp` module for this package.

- `install_requires` is a list of packages required by our package. These will be installed before ours, if not present already.

- `entry_points` is where we define ways to enter out project. This is a multi-line string with contents similar to a configuration (.ini) file. Here we define `console_scripts` `drp` which is equal to `drp.drp:cli`. `drp.drp:cli` means the `cli` function of `drp` module of `drp` library. We will add this one in a second.

Writing CLI
-----------

Open up the `drp.py` file and enter the following in it:

{% highlight python %}
import click

@click.command()
def cli():
    print "Hello, Dropbox"
{% endhighlight %}

<!-- EXPLAIN decorators -->
<!-- EXPLAIN decorators -->
<!-- EXPLAIN decorators -->
<!-- EXPLAIN decorators -->
<!-- EXPLAIN decorators -->
<!-- EXPLAIN decorators -->

Now cd into root of your project and type this in the terminal/command prompt/powershell:

<pre class="terminal">
<span class="d">$</span> pip install --editable .
</pre>

This will install your project into pip. You can do `$ pip freeze` to see it in the list of installed packages. Now you have access to `drp` command.

<pre class="terminal">
<span class="d">$</span> drp
Hello, Dropbox
</pre>

###Sub-commands

Sub-commands are like commands under a command. The root command works like a namespace for them. For example, if you're ever used git, then you must've used its subcommands like `$ git push`, `$ git pull`, etc. We will make some similar subcommands for drp, namely `$ drp up`, `$ drp down` and `$ drp share`. Let's create those...

{% highlight python %}
import click

@click.group()
def cli():
    '''Command line tool for Dropbox'''
    pass

@cli.command()
def up():
    '''Upload file to Dropbox'''
    pass

@cli.command()
def down():
    '''Download file from Dropbox'''
    pass

@cli.command()
def share():
    '''Share a Dropbox file'''
    pass

{% endhighlight %}

So here we change `cli()` into `@click.group()` and to make  subcommand we use `@cli.command()`. Try the `drp` command now, you'll get something like this:

<pre class="terminal">
<span class="d">$</span> drp
Usage: drp [OPTIONS] COMMAND [ARGS]...

  Command line tool for Dropbox

Options:
  --help  Show this message and exit.

Commands:
  down   Download file from Dropbox
  share  Share a Dropbox file
  up     Upload file to Dropbox
</pre>

If you want to see help on a particular subcommand type `$ drp <subcommand> --help`, for example,

<pre class="terminal">
<span class="d">$</span> drp up --help
Usage: drp up [OPTIONS]

  Upload file to Dropbox

Options:
  --help  Show this message and exit.
</pre>

###Options and Arguments

Now let's add some options and arguments to our command. The path to upload and download a file will be an option as there are default values for it. The file itself would be an argument. An option is much like a flag in *nix commands (maybe in windows too? I don't know). Argument are necessary things (Arguments could be set to optional and options can be set to required, but not here, not for us. Don't bug me now!). A great example would be the `ls` command.

<pre class="terminal">
<span class="d">$</span> ls
foo    bar    baz
<span class="d">$</span> ls -l     # -l this is a flag
...
<span class="d">$</span> ls -l foo # foo is an argument
</pre>

Let's add these for our three functions

{% highlight python %}
import click
from click import echo

@click.group()
def cli():
    '''Command line tool for Dropbox'''
    pass

@cli.command()
@click.option('--path', '-p', default='/', type=click.Path(),
              help='path to upload file to')
@click.argument('file', nargs=1, type=click.Path(exists=True,
                resolve_path=True))
def up(path, file):
    '''Upload file to Dropbox'''
    echo('Uploading %s to %s' % (file, path))

@cli.command()
@click.option('--path', '-p', default='.', type=click.Path(exists=True,
              resolve_path=True))
@click.argument('file', nargs=1, type=click.Path())
def down(path, file):
    '''Download file from Dropbox'''
    echo('Downloading %s to %s' % (file, path))

@cli.command()
@click.argument('file', nargs=1, type=click.Path())
def share(file):
    '''Share a Dropbox file'''
    echo('Sharing %s' % file)
{% endhighlight %}

An option is created using `@click.option()` decorator which takes in name of the option, preceeded by a **--** (`--path` here), an optional short flag (`-p` here), default value for path is `/` (root) for upload and `.` (current dir) for download.

The `type` argument takes in type of input. It can be as simple as `str` or `int` or you can use click's inbuilt types which provide some extra functionality. We've used `click.Path()` which checks if path is a valid path ot not. You can pass `exists` which checks if the path actually exists or not and `resolve_path` which resolves any relative paths into absolute paths. The `help` argument is just a help string, nothing fancy there.

An `argument` is created by `@click.argument()` decorator and it takes in name of the option, `nargs` number of arguments it will accept and `type`. `nargs` is the only new thing here and it can be 1, 2, 3 ... etc to accept 1 2 or 3 arguments, etc. `nargs=-1` means that it can accept any number of arguments, including 0. You can se it to minimum 1
by setting `required=True` along with `nargs=1`.

Let's try it out:

<pre class="terminal">
<span class="d">$</span> drp up --path /foo bar
Usage: drp up [OPTIONS] FILE

Error: Invalid value for "file": Path "bar" does not exist.
<span class="d">$</span> drp up --path /foo setup.py
Uploading /home/sourabh/code/python/drp/setup.py to /foo
<span class="d">$</span> drp down random_file
Downloading random_file to /home/sourabh/code/python/drp
<span class="d">$</span> drp share drp
Sharing drp
</pre>

Great! Now all we have to do is use the handler we created in our `drp.py` file. Add `from .handler import DrpHandler`
 which is an import with relative path. `.handler` here means handler module in the same directory as the `drp.py` file. I'm just adding new code and not the decorators from before so don't remove them.

{% highlight python %}
from .handler import DrpHandler

#... some code here

def up(path, file):
    # ...
    handler = DrpHandler()
    handler.up(path, file)

#... some code here
def down(path, file):
    # ...
    handler = DrpHandler()
    handler.down(path, file)

#... some code here
def share(file):
    # ...
    handler = DrpHandler()
    url = handler.share(file)
    print('Publci URL is %s' % url['url'])
{% endhighlight %}

Here we're just creating the handler object and using its methods. A test run would look like this:

<pre class="terminal">
<span class="d">$</span> ls ~/Dropbox/Apps/DDropper_base
<span class="d">$</span> drp up setup.py
<span class="d">$</span> ls ~/Dropbox/Apps/DDropper_base
setup.py
<span class="d">$</span> mkdir test
<span class="d">$</span> drp down --path ./test setup.py
<span class="d">$</span> ls test
setup.py
<span class="d">$</span> drp share setup.py
Publci URL is https://db.tt/keRsSRyU
</pre>

Cool! So everything works!

Where to go from here
---------------------

If you liked this 2 part tutorial, why don't you go and check out the official source code [here](http://github.com/sourabhv/drp) and go through the production code. We also left out a simple Issue for readers to fix. Hopefully someone fixes it soon :) So, thanks for reading. Leave a comment or mail me if you have any question/suggestion. Cya!
