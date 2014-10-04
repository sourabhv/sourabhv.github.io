---
layout: post
title: Dropbox Command Line Tool - 1
description: Make a Dropbox command line tool using Click and Dropbox SDK
---

Making a dropbox CLI tool is actually very simple once you have understanding of some basic python features, particularly _classes_, _decorators_ and also have a general idea of what an API is. We'll go over classes and we are not going to use decorators too much, so relax! (You can read about them [here](/posts/decorators-in-python/) if you want) So [read a little bit about what is an api](http://lmgtfy.com/?q=what+is+an+api) and then come back here. I'll be waiting...

Making a Dropbox App
--------------------

- Head over to [dropbox.com/developers/apps](https://www.dropbox.com/developers/apps) and click `Create app`
- Select `Dropbox API app`
- Select `Files and Datastores`
- Select `Yes` in `Can your app be limited to its own folder?`
- Decide on a name (the hardest part in the whole tutorial) and click `Create app`

On the next page copy the `App Key` and `App Secret` and keep them somewhere safe.

Getting Access Token
--------------------

Create a new file and copy-paste the code below into it:

{% highlight python %}
import socket

app_key = raw_input('Enter your app key: ')
app_secret = raw_input('Enter your app secret: ')
try:
    flow = dropbox.client.DropboxOAuth2FlowNoRedirect(app_key, app_secret)
    authorize_url = flow.start()
    print('1. Go to: %s' % authorize_url)
    print('2. Click "Allow"')
    print('3. Copy the authorization code.')
    code = raw_input("Enter the authorization code: ").strip()

    access_token, user_id = flow.finish(code)
    print('Recieved access_token: %s\nUser_id: %s\n'
         % (access_token, user_id))
    print('Add access_token value to your environment variables')
except dropbox.rest.ErrorResponse as e:
    print('Error: %s' % str(e))
except socket.timeout as e:
    print('Socket Timeout. Check your internet connection and try again')
{% endhighlight %}

*Note: If you are on Python 3.X, replace `raw_input` with `input`*

`raw_input` / `input` is used to take input from the user and unlike C, everything you get from user is a string. You have to parse it to get anything you need. But in our case we need string, so there's no need of any parsing.

Next we make a `try` block which is used to handle any exceptions. What's an exception? It's something thats generated when something goes wrong at runtime. It is almost always something that your program cannot control, like reading a file that doesn't exist or trying to connect to internet when there is no connection available. For there type of dangerous things we use exception handling. Anything that can go wrong goes in the `try` block and then if something actually goes wrong, it _throws an exception_ which is caught by one of the `except` blocks. Here, the first one will catch exceptions of type `dropbox.rest.ErrorResponse` which means that something went wrong while trying to connect to dropbox or at dropbox's end. The second one is `socket.timeout` exception which is thrown when a socket doesn't respond. In our case, when there's a connection timeout.

Inside `try` we try to connect to Dropbox's using the OAUTH2 protocol, which is really simple. This code is given in dropbox's tutorial and you can use it as it is. In simple words, it connects to dropbox's server using OAUTH2 protocol and get a authorization URL using the app key and pp secret. Then on the page you click Allow which validates that the user is actually allowing the app to access dropbox. Its pretty much like when you connect to a website using your facebook account and click allow.

Get the access token and add it to your environment variables. On linux its as simple as adding `export ACCESS_TOKEN="..."` to your `~/.bashrc` file. For windows, [read this.](http://www.computerhope.com/issues/ch000549.htm)

Making the Dropbox Handler
--------------------------

Before we start with making the command line interface, lets make the handler for dropbox, or the so called `DrpHandler`. Lets start by making a `drp` directory for our project. Inside this directory make a file called `setup.py` and a directory named `drp`. Inside the inner `drp` directory create 3 files called `handler.py`, `drp.py` and `__init__.py`. Now your project structure should look something like this:

{% highlight text %}
drp
|-- drp
|   |-- __init__.py
|   |-- drp.py
|   `-- handler.py
`-- setup.py
{% endhighlight %}

- `__init__.py` tells python that the inner `drp` directory is a python library
- `drp.py` handles command line interface using click
- `handler.py` handles dropbox interface and uses Dropbox API
- `setup.py` is the `pip` configuration file.

Open up the `handler.py` file and start typing.

{% highlight python %}
import os
import dropbox

class DrpHandler(object):
    def __init__(self):
        pass
{% endhighlight %}

First we import 2 libraries, `os` and `dropbox`. Next we create a class called `DrpHandler`. The names inside `()` after class name is a comma separated list of parent classes for this class. The `object` here is implicit in python 3.x and thus can be removed, but we will keep it so that `DrpHandler` also inherits from `object` in python 2.x. The `__init__` method is like a constructor in Java. Every class methods accepts a `self` argument which is like this in other OO languages but is not a keyword. You can use me, myself or anything else but its recommended that you stick with the standards. Next we will add the 3 methods we want, namely `up`, `down` and share to upload, download and share a file respectively.

{% highlight python %}
class DrpHandler(object):

    access_token = os.environ.get('ACCESS_TOKEN') # 1

    def __init__(self):
        self.client = dropbox.client.DropboxClient(self.access_token) # 2

    def up(self, path, file):
        try:
            filename = os.path.basename(file) # 3
            uppath = os.path.join(path, filename) # 4
            with open(file, 'rb') as f: # 5
                self.client.put_file(uppath, f) # 6
        except dropbox.rest.ErrorResponse as err:
            return str(err)

    def down(self, path, file): # 7
        try:
            filename = os.path.basename(file)
            with open(os.path.join(path, filename), 'wb') as out: # 8
                with self.client.get_file(file) as in:
                    out.write(in.read()) # 9
        except dropbox.rest.ErrorResponse as err:
            return(str(err))

    def share(self, path):
        try:
            return self.client.share(path, short_url=True) # 10
        except dropox.rest.ErrorResponse as err:
            echo(str(err))
{% endhighlight %}

Lets understand this one line at a time. I will skip over anything already discussed above. I will link to the documentation for any new functions used here. Go over their docs if you don't know what they do.

- **#1**: We create a class variable to get the `ACCESS_TOKEN` from environment variables. The `get` method returns the value if it finds the variable, or `None` otherwise.

- **#2**: We use the `dropbox.client.DropboxClient` from the dropbox API to create the OAUTH2 client to access Dropbox. We will pass the `self.ACCESS_TOKEN` to it to validate our access.

- **#3**: The absolute path of the file will be passed to us in `file` variable. We get the name of the file using [basename](https://docs.python.org/2/library/os.path.html#os.path.abspath) function of `os.path` module.

- **#4**: Next we join the `path` to upload to and the file name to get absolute path for file on dropbox. We use `os.path`'s [join](https://docs.python.org/2/library/os.path.html#os.path.join) for this.

- **#5**: Next we use `with` statement to handle and close the file. `with` has its own context manager which closes the file in case anything goes wrong and then throws back the exception. This means that if `dropbox.rest.ErrorResponse` exception occurs then the being read file will be closed safely and will not cause any inconsistencies. `open` function takes path to the file, relative or absolute, and mode which can be any one of `rb`, `wb`, `ab`, `r`, `w` and `a`. Here r, w, a, b means read, write, append and binary respectively. We open the file in `rb` mode to read it bit wise. Next we assign this file object to f using `as f`.

- **#6**: self.client.[put_file](https://www.dropbox.com/developers/core/docs/python) is a  is a Dropbox API method to upload a file. It takes the file path and file object.

- **#7**: In `down` method, we get the `filename` from `file`, open the outfile in `wb` mode and infile from dropbox and write contents of in into out.

- **#8**: We use a `with` statement to open the out file and then inside this with use use another `with` to open the in file of dropbox.

- **#9**: Next we use `in.read()` which returns all the contents of the file and then pass it to `out.write()` which writes anything passed to it into the file.

- **#10**: `share` method is really simple. We simply `self.client.share` with `path` of file and an optional `short_url=True` argument which returns the public URL of the file.

That's it for this part of Dropbox Command Line Tool. We've written then dropbox handler and and next time we will write the command line handler and the setup.py file. Until then, bye!
